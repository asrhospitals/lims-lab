import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const AddReportDoctor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-department",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        // Filter active departments, assuming field isActive or isactive
        setDepartments(response.data.filter((d) => d.isActive || d.isactive));
      } catch (error) {
        setFetchError(error.response?.data?.message || "Failed to fetch departments.");
        toast.error("❌ Failed to fetch departments.");
      }
    };
    fetchDepartments();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      doctorName: data.doctorName,
      gender: data.gender,
      dob: data.dob,
      phoneNo: data.phoneNo,
      addressLine1: data.addressLine1,
      city: data.city,
      state: data.state,
      pin: Number(data.pin),
      email: data.email,
      aptNo: data.aptNo,
      department: data.department,
      medicalRegNo: data.medicalRegNo,
      isactive: data.isactive === "true" || data.isactive === true,
      digitalSignature: data.digitalSignature,
    };

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-reportdoctor",
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("Report Doctor added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      reset();

      setTimeout(() => {
        navigate("/view-report-doctor");
      }, 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to add Report Doctor. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "doctorName",
      label: "Doctor Name",
      placeholder: "Enter Doctor Name",
      validation: { required: "Doctor name is required" },
    },    
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      validation: { required: "Date of Birth is required" },
    },
    {
      name: "department",
      label: "Department",
      type: "select",
      options: departments.map((d) => ({
        value: d.dptName || d.id,
        label: d.dptName || d.id,
      })),
      validation: { required: "Department is required" },
    },
    {
      name: "phoneNo",
      label: "Phone Number",
      type: "number",
      placeholder: "Enter Phone Number",
      validation: {
        required: "Phone number is required",
        pattern: {
          value: /^\d{10}$/,
          message: "Phone number must be 10 digits",
        },
      },
    },
    {
      name: "addressLine1",
      label: "Address Line 1",
      placeholder: "Enter Address",
      validation: { required: "Address is required" },
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter City",
      validation: { required: "City is required" },
    },
    {
      name: "state",
      label: "State",
      placeholder: "Enter State",
      validation: { required: "State is required" },
    },
    {
      name: "pin",
      label: "PIN Code",
      type: "number",
      placeholder: "Enter PIN Code",
      validation: {
        required: "PIN code is required",
        pattern: {
          value: /^\d{6}$/,
          message: "PIN code must be exactly 6 digits",
        },
      },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter Email",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^\S+@\S+\.\S+$/,
          message: "Enter a valid email",
        },
      },
    },
    {
      name: "aptNo",
      label: "Apartment Number",
      placeholder: "Enter Apartment Number",
      validation: { required: "Apartment number is required" },
    },
    {
      name: "medicalRegNo",
      label: "Medical Registration Number",
      placeholder: "Enter Medical Registration Number",
      validation: { required: "Medical Registration Number is required" },
    },
    {
      name: "digitalSignature",
      label: "Digital Signature URL",
      placeholder: "Enter URL for Digital Signature",
      validation: {
        required: "Digital Signature URL is required",
        pattern: {
          value:
            /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg|webp|pdf))$/i,
          message: "Enter a valid image URL",
        },
      },
    },
    {
      name: "gender",
      label: "Gender",
      type: "radio",
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
      validation: { required: "Status is required" },
    },
  ];

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-sm font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-report-doctor" className="text-gray-700 hover:text-teal-600">
                Report Doctor
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Add Report Doctor</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-2 space-y-4 text-sm">
        <ToastContainer />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow rounded-xl border border-gray-200"
        >
          <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Add Report Doctor</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options, validation }) => (
                <div key={name}>
                  <label className="block mb-1 font-medium text-gray-700">{label}</label>

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
                    <div className="flex space-x-4">
                      {options.map(({ value, label: optLabel }) => (
                        <label key={value} className="inline-flex items-center space-x-2">
                          <input
                            type="radio"
                            value={value}
                            {...register(name, validation)}
                            onBlur={() => trigger(name)}
                            className="form-radio text-teal-600"
                          />
                          <span>{optLabel}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:ring-2 transition`}
                    />
                  )}

                  {errors[name] && (
                    <p className="text-red-600 mt-1 text-xs font-semibold">
                      {errors[name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end space-x-4">
              <button
                type="reset"
                onClick={() => reset()}
                className="py-2 px-4 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-2 px-6 rounded-lg text-white ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReportDoctor;
