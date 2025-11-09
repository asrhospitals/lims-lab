import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";

const AddUser = () => {
  const [nodalList, setNodalList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    watch,
    setValue,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      createddate: today,
      isactive: "true",
    },
  });

  const createdby = localStorage.getItem("roleType");
  const mobileNumberValue = watch("mobileNumber");
  const whatsappSame = watch("whatsappSame");

  useEffect(() => {
    if (whatsappSame) {
      setValue("whatsappNumber", mobileNumberValue);
    }
  }, [whatsappSame, mobileNumberValue, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let uploadedImageName = "profile.jpg";

      if (selectedFile) {
        const formData = new FormData();
        formData.append("profile", selectedFile);

        const authToken = localStorage.getItem("authToken");

        const uploadResponse = await fetch(
          "https://asrphleb.asrhospitalindia.in/profile/upload/upload-profile",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          uploadedImageName = uploadResult.fileUrl || uploadedImageName;
          toast.success("Image uploaded successfully!", { autoClose: 1500 });
        } else {
          const err = await uploadResponse.json();
          toast.error("Image upload failed: " + (err.message || "Unknown error"));
          console.error("Upload error:", err);
        }
      }

      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        mobile_number: data.mobileNumber,
        wattsapp_number: data.whatsappNumber || data.mobileNumber,
        alternate_number: data.alternateNumber || null,
        email: data.email,
        dob: data.dob,
        gender: data.gender,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        username: data.loginId,
        password: data.password,
        created_by: createdby,
       created_date: today,
        // module: [data.selectedmodule],
        module: ["admin"],
        isactive: data.isactive === "true",
        image: uploadedImageName,
      };

      const response = await fetch(
        "https://asrlabs.asrhospitalindia.in/lims/authentication/create-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ User created successfully!", {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        reset();
        setImagePreview(null);
        setSelectedFile(null);

        setTimeout(() => {
          navigate("/view-user-list");
        }, 2700);
      } else {
        toast.error("User creation failed: " + (result.message || "Unknown error"));
        console.error("User creation error:", result);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const alphaNumPattern = {
    value: /^[A-Za-z0-9 _-]+$/,
    message: "Only letters, numbers, spaces, - and _ are allowed",
  };

  const lettersOnlyPattern = {
    value: /^[A-Za-z ]+$/,
    message: "Only letters and spaces are allowed",
  };

  const fields = [
    { name: "firstName", label: "First Name", placeholder: "Enter First Name", validation: { required: "First name is required", pattern: lettersOnlyPattern } },
    { name: "lastName", label: "Last Name", placeholder: "Enter Last Name", validation: { required: "Last name is required", pattern: lettersOnlyPattern } },
    { name: "mobileNumber", label: "Mobile Number", placeholder: "Enter Mobile Number", validation: { required: "Mobile number is required", pattern: /^\d{10}$/ } },
    { name: "whatsappNumber", label: "WhatsApp Number", placeholder: "10-digit number", validation: { required: "WhatsApp number is required", pattern: /^\d{10}$/ } },
    { name: "whatsappSame", label: "Same as Mobile Number?", type: "checkbox" },
    { name: "alternateNumber", label: "Alternative Number", placeholder: "Enter Alternative Number", validation: { pattern: /^\d{10}$/ } },
    { name: "email", label: "Email ID", placeholder: "Enter Email", validation: { required: "Email is required", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } },
    { name: "dob", label: "Date of Birth", type: "date", validation: { required: "Date of birth is required" }, max: today },
    { name: "gender", label: "Gender", type: "radio", options: [{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }], validation: { required: "Gender is required" } },
    { name: "address", label: "Address", placeholder: "Enter Address", type: "textarea", validation: { required: "Address is required", pattern: alphaNumPattern } },
    { name: "city", label: "City", placeholder: "Enter City", validation: { required: "City is required", pattern: lettersOnlyPattern } },
    { name: "state", label: "State", placeholder: "Enter State", validation: { required: "State is required", pattern: lettersOnlyPattern } },
    { name: "pincode", label: "PIN Code", placeholder: "Enter PIN Code", validation: { required: "PIN Code is required", pattern: /^\d{6}$/ } },
    { name: "loginId", label: "Login ID", placeholder: "Enter Login ID", validation: { required: "Login ID is required" } },
    { name: "password", label: "Password", placeholder: "Enter Password", validation: { required: "Password is required" } },
    // { name: "selectedmodule", label: "Module", type: "select", options: [{ value: "admin", label: "Admin" }, { value: "user", label: "User" }, { value: "phelobomist", label: "Phelobomist" },{ value: "reception", label: "Reception" },{ value: "biochemistry", label: "Biochemistry" },{ value: "microbiology", label: "Microbiology" },{ value: "pathology", label: "Pathology" }], validation: { required: "Module is required" } },
    { name: "cratedby", label: "Created By", placeholder: "Admin",disabled: true},
    { name: "created_date", label: "Created Date", placeholder :today,disabled: true},
    { name: "isActive", label: "Is Active?", type: "radio", options: [{ value: "true", label: "Yes" }, { value: "false", label: "No" }], validation: { required: "Status is required." } },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    } else {
      alert("File size exceeds 2MB limit");
      e.target.value = null;
    }
  };

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors">
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-user-list" className="text-gray-700 hover:text-teal-600 transition-colors">
                User Details
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Add User
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        {fetchError && <p className="text-red-500 text-sm mb-4">{fetchError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add User</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options, validation, max }) => (
                <div key={name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}{" "}
                    {validation?.required && <span className="text-red-500">*</span>}
                  </label>

                  {type === "select" ? (
                    <select
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`}
                    >
                      <option value="">Select {label}</option>
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : type === "radio" ? (
                    <div className="flex space-x-4 pt-2">
                      {options.map((opt) => (
                        <label key={opt.value} className="inline-flex items-center">
                          <input
                            type="radio"
                            {...register(name, validation)}
                            value={opt.value}
                            defaultChecked={opt.value === "true"}
                            className="h-4 w-4 text-teal-600"
                          />
                          <span className="ml-2">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : type === "textarea" ? (
                    <textarea
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      placeholder={placeholder}
                      className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`}
                    />
                  ) : type === "checkbox" ? (
                    <input type="checkbox" {...register(name)} className="h-4 w-4 text-teal-600" />
                  ) : type === "date" && name === "createdDate" ? (
                    <input
                      type="date"
                      {...register(name, validation)}
                      value={today}
                      readOnly
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-teal-500 focus:ring-2 transition bg-gray-100"
                    />
                  ) : (
                    <input
                      type={type}
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      placeholder={placeholder}
                      max={max}
                      className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`}
                    />
                  )}

                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
                </div>
              ))}
            </div>

            <div className="bg-white border rounded-lg p-4 mt-4">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image (JPG/PNG, max 2MB)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <label className="block">
                    <div className="border border-gray-300 border-dashed rounded-lg px-6 py-4 cursor-pointer hover:bg-gray-50 transition min-w-[300px] flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <svg
                          className="h-10 w-10 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-600">
                          Click to upload
                        </span>
                      </div>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </label>

                  <div className="flex flex-col items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full max-h-48 object-contain rounded-md border"
                      />
                    ) : (
                      <div className="text-gray-400">No image selected</div>
                    )}
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 mt-4"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedFile(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => reset()}
                className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Add User"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;
