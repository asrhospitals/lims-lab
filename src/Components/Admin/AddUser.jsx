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
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      createddate: today, // Set default value here
    },
  });

  // Get today's date (to restrict DOB)

  // const onSubmit = async (data) => {
  //   setIsSubmitting(true);
  //   try {

  //     const payload = {
  //       first_name: data.firstName,
  //       last_name: data.lastName,
  //       mobile_number: data.mobileNumber,
  //       wattsapp_number: data.whatsappNumber,
  //       alternate_number: data.alternateNumber,
  //       email: data.email,
  //       dob: data.dob,
  //       gender: data.gender,
  //       address: data.address,
  //       city: data.city,
  //       state: data.state,
  //       pincode: data.pincode,
  //       username: data.loginId,
  //       password: data.password,
  //       created_by: createdby,
  //       module: ["admin"],
  //       isactive: true, // if required
  //       image: "profile.jpg"
  //       // image: data.image
  //     };
  
  //     console.log("payload==", payload);
      
  //     const response = await fetch(
  //       "https://asrlabs.asrhospitalindia.in/lims/authentication/create-user",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );
  
  //     const result = await response.json();
  //     if (response.ok) {
  //       console.log("User created successfully:", result);
  //     } else {
  //       console.error("Error:", result);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let uploadedImageName = "profile.jpg"; // default image
  
      if (selectedFile) {
        const formData = new FormData();
        formData.append("profile", selectedFile); // 'profile' as key
  
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
          uploadedImageName = uploadResult.fileUrl || uploadedImageName; // <-- use fileUrl
          toast.success("Image uploaded successfully!");
        } else {
          const err = await uploadResponse.json();
          toast.error("Image upload failed: " + (err.message || "Unknown error"));
          console.error("Upload error:", err);
        }
        
      }
  
      // User creation payload
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        mobile_number: data.mobileNumber,
        wattsapp_number: data.whatsappNumber,
        alternate_number: data.alternateNumber,
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
        module: [data.selectedmodule],
        isactive: true,
        image: uploadedImageName, // use uploaded image
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
        toast.success("User created successfully!");
        reset();
        setImagePreview(null);
        setSelectedFile(null);
        navigate("/view-user-list");
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
  
  
  
  
  // Validation patterns
  const alphaNumPattern = {
    value: /^[A-Za-z0-9 _-]+$/,
    message: "Only letters, numbers, spaces, - and _ are allowed",
  };

  const lettersOnlyPattern = {
    value: /^[A-Za-z ]+$/,
    message: "Only letters and spaces are allowed",
  };

  const createdby = localStorage.getItem("userid");
 const fields = [
  {
    name: "firstName",
    label: "First Name",
    placeholder: "Enter First Name",
    validation: {
      required: "First name is required",
      pattern: lettersOnlyPattern,
    },
    onBlur: (e, errors) => {
      if (errors?.firstName) {
        const input = document.querySelector(`[name="firstName"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "lastName",
    label: "Last Name",
    placeholder: "Enter Last Name",
    validation: {
      required: "Last name is required",
      pattern: lettersOnlyPattern,
    },
    onBlur: (e, errors) => {
      if (errors?.lastName) {
        const input = document.querySelector(`[name="lastName"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "mobileNumber",
    label: "Mobile Number",
    placeholder: "Enter Mobile Number",
    validation: {
      required: "Mobile number is required",
      pattern: /^\d{10}$/,
    },
    onBlur: (e, errors) => {
      if (errors?.mobileNumber) {
        const input = document.querySelector(`[name="mobileNumber"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "whatsappNumber",
    label: "WhatsApp Number",
    placeholder: "Enter WhatsApp Number",
    validation: {
      required: "WhatsApp number is required",
      pattern: /^\d{10}$/,
    },
    onBlur: (e, errors) => {
      if (errors?.whatsappNumber) {
        const input = document.querySelector(`[name="whatsappNumber"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "alternateNumber",
    label: "Alternative Number",
    placeholder: "Enter Alternative Number",
    validation: {
      pattern: /^\d{10}$/,
    },
    onBlur: (e, errors) => {
      if (errors?.alternateNumber) {
        const input = document.querySelector(`[name="alternateNumber"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "email",
    label: "Email ID",
    placeholder: "Enter Email",
    validation: {
      required: "Email is required",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    onBlur: (e, errors) => {
      if (errors?.email) {
        const input = document.querySelector(`[name="email"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "dob",
    label: "Date of Birth",
    type: "date",
    validation: { required: "Date of birth is required" },
    max: today,
    onBlur: (e, errors) => {
      if (errors?.dob) {
        const input = document.querySelector(`[name="dob"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Enter Address",
    type: "textarea",
    validation: { required: "Address is required", pattern: alphaNumPattern },
    onBlur: (e, errors) => {
      if (errors?.address) {
        const input = document.querySelector(`[name="address"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "city",
    label: "City",
    placeholder: "Enter City",
    validation: { required: "City is required", pattern: lettersOnlyPattern },
    onBlur: (e, errors) => {
      if (errors?.city) {
        const input = document.querySelector(`[name="city"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "state",
    label: "State",
    placeholder: "Enter State",
    validation: { required: "State is required", pattern: lettersOnlyPattern },
    onBlur: (e, errors) => {
      if (errors?.state) {
        const input = document.querySelector(`[name="state"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "pincode",
    label: "PIN Code",
    placeholder: "Enter PIN Code",
    validation: {
      required: "PIN Code is required",
      pattern: /^\d{6}$/,
    },
    onBlur: (e, errors) => {
      if (errors?.pincode) {
        const input = document.querySelector(`[name="pincode"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "loginId",
    label: "Login ID",
    placeholder: "Enter Login ID",
    validation: { required: "Login ID is required" },
    onBlur: (e, errors) => {
      if (errors?.loginId) {
        const input = document.querySelector(`[name="loginId"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter Password",
    validation: { required: "Password is required" },
    onBlur: (e, errors) => {
      if (errors?.password) {
        const input = document.querySelector(`[name="password"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "createdDate",
    label: "Created Date",
    type: "date",
    validation: { required: "" },
    max: today,
    onBlur: (e, errors) => {
      if (errors?.createdDate) {
        const input = document.querySelector(`[name="createdDate"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "isActive",
    label: "Is Active?",
    type: "radio",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
    validation: { required: "Status is required." },
    
  },
  
];

  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      // Max 2MB
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
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors"
              >
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-user-list"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
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
        {fetchError && (
          <p className="text-red-500 text-sm mb-4">{fetchError}</p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add User</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(
                ({
                  name,
                  label,
                  placeholder,
                  type = "text",
                  options,
                  validation,
                  max,
                }) => (
                  <div key={name} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}{" "}
                      {validation?.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>

                    {type === "select" ? (
                      <select
                        {...register(name, validation)}
                        onBlur={() => trigger(name)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        } focus:ring-2 transition`}
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
                          <label
                            key={opt.value}
                            className="inline-flex items-center"
                          >
                            <input
                              type="radio"
                              {...register(name, validation)}
                              value={opt.value}
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
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        } focus:ring-2 transition`}
                      />
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
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        } focus:ring-2 transition`}
                      />
                    )}

                    {errors[name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[name]?.message}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="bg-white border rounded-lg p-4 mt-4">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image (JPG/PNG, max 2MB)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Upload Input */}
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

                  {/* Image Preview + Remove Button */}
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
