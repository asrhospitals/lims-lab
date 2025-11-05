import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { viewNodals, viewHospitals } from "../../services/apiService";

const AddPhlebotomist = () => {
  const [nodalList, setNodalList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({ mode: "onBlur" });

  const today = new Date().toISOString().split("T")[0]; // restrict DOB

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [nodalRes, hospitalRes] = await Promise.all([
          viewNodals(),
          viewHospitals(),
        ]);
        setNodalList(nodalRes?.data || []);
        setHospitalList(hospitalRes?.data || []);
      } catch (error) {
        setFetchError(
          error.response?.data?.message ||
            "Failed to fetch nodal or hospital data."
        );
      }
    };
    fetchDropdowns();
  }, []);

const onSubmit = async (data) => {
  setIsSubmitting(true);

  try {
    // Trim all string fields to remove extra spaces
    const trimmedData = Object.fromEntries(
      Object.entries(data).map(([key, val]) => [
        key,
        typeof val === "string" ? val.trim() : val,
      ])
    );

    // Validate DOB (cannot be in the future)
    const today = new Date();
    const dob = new Date(trimmedData.dob);
    if (dob > today) {
      toast.error("❌ Date of Birth cannot be in the future");
      setIsSubmitting(false);
      return;
    }

    // Prepare payload
    const payload = {
      phleboname: trimmedData.phleboname,
      addressline: trimmedData.addressline,
      city: trimmedData.city,
      state: trimmedData.state,
      pincode: String(trimmedData.pincode).padStart(6, "0"), // ensure string with 6 digits
      dob: trimmedData.dob,
      contactno: String(trimmedData.contactno),
      email: trimmedData.email, // ✅ add this line
      gender: trimmedData.gender,
      isactive: trimmedData.isactive === "true" || trimmedData.isactive === true,
    };

    // Send request using Axios instance with timeout
    const authToken = localStorage.getItem("authToken");
    const response = await axios.post(
      "https://asrlabs.asrhospitalindia.in/lims/master/add-phlebo",
      payload,
      {
        headers: { Authorization: `Bearer ${authToken}` },
        timeout: 120000, // 2 minutes timeout
      }
    );

    if (response.status === 200 || response.status === 201) {
      toast.success("✅ Phlebotomist added successfully!");
      reset();
      setTimeout(() => navigate("/view-phlebotomist"), 1500);
    }
  } catch (error) {
    console.error("Add Phlebotomist API error:", error.response || error);

    // Handle 504 Gateway Timeout specifically
    if (error.code === "ECONNABORTED" || error.response?.status === 504) {
      toast.error("⚠️ Server timeout. Please try again later.");
    } else {
      toast.error(
        error.response?.data?.message ||
          "❌ Failed to add phlebotomist. Please try again."
      );
    }
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

  const fields = [
    {
      name: "phleboname",
      label: "Phlebotomist Name",
      placeholder: "Enter Full Name",
      validation: { required: "Name is required", pattern: lettersOnlyPattern },
    },
    {
      name: "addressline",
      label: "Address",
      placeholder: "Enter Address",
      validation: { required: "Address is required", pattern: alphaNumPattern },
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter City",
      validation: { required: "City is required", pattern: lettersOnlyPattern },
    },
    {
      name: "state",
      label: "State",
      placeholder: "Enter State",
      validation: { required: "State is required", pattern: lettersOnlyPattern },
    },
    {
      name: "pincode",
      label: "PIN Code",
      placeholder: "Enter PIN Code",
      validation: {
        required: "PIN Code is required",
        pattern: { value: /^\d{6}$/, message: "PIN must be exactly 6 digits" },
      },
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      validation: { required: "Date of birth is required" },
      max: today,
    },
    {
      name: "contactno",
      label: "Contact Number",
      placeholder: "Enter Contact Number",
      validation: {
        required: "Contact number is required",
        pattern: { value: /^[6-9]\d{9}$/, message: "Invalid contact number" },
      },
    },
    {
  name: "email",
  label: "Email",
  placeholder: "Enter Email Address",
  type: "email",
  validation: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email address",
    },
  },
},

    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
      ],
      validation: { required: "Gender is required" },
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      validation: { required: "Status is required." },
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
              <Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">🏠 Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-phlebotomist" className="text-gray-700 hover:text-teal-600">Phlebotomists</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">Add Phlebotomist</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        {fetchError && <p className="text-red-500 text-sm mb-4">{fetchError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Phlebotomist</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options, validation, max }) => (
                <div key={name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {label} {validation?.required && <span className="text-red-500">*</span>}
                  </label>

                  {type === "select" ? (
                    <select {...register(name, validation)} onBlur={() => trigger(name)} className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`}>
                      <option value="">Select {label}</option>
                      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  ) : type === "radio" ? (
                    <div className="flex space-x-4 pt-2">
                      {options.map(opt => (
                        <label key={opt.value} className="inline-flex items-center">
                          <input type="radio" {...register(name, validation)} value={opt.value} className="h-4 w-4 text-teal-600" />
                          <span className="ml-2">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input type={type} {...register(name, validation)} onBlur={() => trigger(name)} placeholder={placeholder} max={max} className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`} />
                  )}

                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => reset()} className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Reset</button>
              <button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-60">
                {isSubmitting ? "Submitting..." : "Add Phlebotomist"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPhlebotomist;
