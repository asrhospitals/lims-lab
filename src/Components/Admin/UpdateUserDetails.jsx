import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import api from "../../services/axiosService";

const UpdateUserDetails = () => {
  const [fetchError, setFetchError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sameAsMobile, setSameAsMobile] = useState(false);

  const navigate = useNavigate();
  const { id: userId } = useParams();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (sameAsMobile) {
      setValue("whatsappNumber", watch("mobileNumber"));
    }
  }, [sameAsMobile, watch("mobileNumber"), setValue]);

  const parseBackendDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setFetchError("");
        let userData = null;

        if (location.state?.user) {
          userData = location.state.user;
        } else if (userId && userId !== "undefined") {
          const res = await api.get(`/authentication/get-user/${userId}`);
          userData = res.data.data;
        }

        if (!userData) throw new Error("No user data found");

        reset({
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          mobileNumber: userData.mobile_number || "",
          whatsappNumber: userData.wattsapp_number || "",
          alternateNumber: userData.alternate_number || "",
          email: userData.email || "",
          dob: parseBackendDate(userData.dob),
          gender: userData.gender || "",
          address: userData.address || "",
          city: userData.city || "",
          state: userData.state || "",
          pincode: userData.pincode || "",
          loginId: userData.username || "",
          password: "*******", // ✅ masked password placeholder
          selectedmodule:
            userData.module?.[0]?.toLowerCase() === "reception"
              ? "Reception"
              : userData.module?.[0]?.toLowerCase() === "admin"
              ? "admin"
              : userData.module?.[0]?.toLowerCase() === "user"
              ? "user"
              : userData.module?.[0]?.toLowerCase() === "phlebotomist"
              ? "phlebotomist"
              : "",
          isActive: userData.isactive ? "true" : "false",
          createdDate: parseBackendDate(userData.created_at), // ✅ properly formatted
        });

        setImagePreview(userData.image || "profile.jpg");
      } catch (err) {
        console.error(err);
        setFetchError("Failed to load user data.");
      }
    };

    if (userId || location.state?.user) {
      fetchUser();
    }
  }, [userId, location.state, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        wattsapp_number: data.whatsappNumber,
        mobile_number: data.mobileNumber,
        alternate_number: data.alternateNumber,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        gender: data.gender,
        dob: formatDateForBackend(data.dob),
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        username: data.loginId,
        module: [data.selectedmodule],
        isactive: data.isActive === "true",
      };

      if (data.password && data.password.trim() !== "" && data.password !== "*******") {
        payload.password = data.password;
      }

      const res = await api.put(`/authentication/update-users/${userId}`, payload);

      if (!res.status.toString().startsWith("2")) throw new Error("Failed to update user");

      toast.success("✅ User updated successfully!");

      setTimeout(() => {
        navigate("/view-user-list");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("❌ Update failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setSelectedFile(file);
    } else {
      toast.error("File size exceeds 2MB limit");
    }
  };

  const fields = [
    { name: "firstName", label: "First Name", required: true },
    { name: "lastName", label: "Last Name", required: true },
    { name: "mobileNumber", label: "Mobile Number", required: true, pattern: /^[0-9]{10}$/ },
    { name: "whatsappNumber", label: "WhatsApp Number", required: true, pattern: /^[0-9]{10}$/ },
    { name: "alternateNumber", label: "Alternate Number" },
    { name: "email", label: "Email ID", required: true, pattern: /^\S+@\S+\.\S+$/ },
    { name: "dob", label: "Date of Birth", required: true, type: "date" },
    {
      name: "gender",
      label: "Gender",
      required: true,
      type: "select",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
      ],
    },
    { name: "address", label: "Address", required: true },
    { name: "city", label: "City", required: true },
    { name: "state", label: "State", required: true },
    { name: "pincode", label: "PIN Code", required: true, pattern: /^[0-9]{6}$/ },
    { name: "loginId", label: "Login ID", required: true },
    { name: "password", label: "Password", required: false, type: "password" },
    {
      name: "selectedmodule",
      label: "Module",
      type: "select",
      required: true,
      options: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
        { value: "Reception", label: "Reception" },
        { value: "phlebotomist", label: "Phlebotomist" },
      ],
    },
    {
      name: "createdDate",
      label: "Created Date",
      type: "date",
      disabled: true,
    },
    {
      name: "isActive",
      label: "Is Active?",
      required: true,
      type: "radio",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
    },
  ];

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-user-list" className="text-gray-700 hover:text-teal-600">
                User Details
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Update User
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        {fetchError && <p className="text-red-500 text-sm mb-4">{fetchError}</p>}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Update User</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, type = "text", options, required, pattern, disabled }) => (
                <div key={name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>

                  {type === "select" ? (
                    <select
                      {...register(name, { required: required && `${label} is required` })}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select {label}</option>
                      {options?.map((opt) => (
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
                            value={opt.value}
                            {...register(name, { required: required && `${label} is required` })}
                            className="h-4 w-4 text-teal-600"
                          />
                          <span className="ml-2">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={type}
                      {...register(name, {
                        required: required && `${label} is required`,
                        pattern: pattern && { value: pattern, message: `Invalid ${label}` },
                      })}
                      disabled={disabled}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    />
                  )}

                  {errors[name] && <p className="text-red-500 text-xs">{errors[name].message}</p>}

                  {name === "whatsappNumber" && (
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="checkbox"
                        id="sameAsMobile"
                        checked={sameAsMobile}
                        onChange={() => setSameAsMobile(!sameAsMobile)}
                        className="h-4 w-4 text-teal-600"
                      />
                      <label htmlFor="sameAsMobile" className="text-gray-700 text-sm">
                        Same as Mobile Number?
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Upload Image */}
            <div className="bg-white border rounded-lg p-4 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image (JPG/PNG, max 2MB)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <label className="block">
                  <div className="border border-gray-300 border-dashed rounded-lg px-6 py-4 cursor-pointer hover:bg-gray-50 transition min-w-[300px] flex items-center justify-center">
                    <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
                    <div className="text-gray-500">Click to upload</div>
                  </div>
                </label>

                <div className="flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-w-full max-h-48 object-contain rounded-md border" />
                  ) : (
                    <div className="text-gray-400">No image selected</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  reset();
                  navigate("/view-subDpt");
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-60"
              >
                {isSubmitting ? "Updating..." : "Update User"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateUserDetails;
