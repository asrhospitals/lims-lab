import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { viewHospitalTypes, addHospital } from "../../services/apiService";

const AddHospital = () => {
  const [hospitalTypes, setHospitalTypes] = useState([]);
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

  // Fetch hospital types
  useEffect(() => {
    const fetchHospitalTypes = async () => {
      try {
        const response = await viewHospitalTypes();
        setHospitalTypes(response.data || []);
      } catch (error) {
        setFetchError(
          error.response?.data?.message || "Failed to fetch hospital types."
        );
      }
    };
    fetchHospitalTypes();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      hospitalname: data.hospitalname,
      hospital_type_id: parseInt(data.hsptltype),
      address: data.address,
      city: data.city,
      district: data.district,
      pin: parseInt(data.pin),
      states: data.states,
      email: data.email,
      phoneno: parseInt(data.phoneno),
      cntprsn: data.cntprsn,
      cntprsnmob: parseInt(data.cntprsnmob),
      isactive: data.isactive === "true",
    };

    try {
      await addHospital(payload);

      toast.success("Hospital added successfully!");
      reset();
      navigate("/view-hospital");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to add hospital. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "hospitalname",
      label: "Hospital Name",
      placeholder: "Enter Hospital Name",
      validation: {
        required: "Hospital name is required",
        pattern: {
          value: /^[A-Za-z0-9_,\s-]+$/,
          message:
            "Only letters, numbers, spaces, underscore(_), comma(,), and hyphen(-) are allowed",
        },
      },
    },
    {
      name: "hsptltype",
      label: "Hospital Type",
      type: "select",
      options: hospitalTypes.map((t) => ({
        value: t.id,
        label: t.hsptldsc,
      })),
      validation: { required: "Hospital type is required" },
    },
    {
      name: "address",
      label: "Address",
      placeholder: "Enter Address",
      validation: {
        required: "Address is required",
        pattern: {
          value: /^[A-Za-z0-9_,\s-]+$/,
          message:
            "Only letters, numbers, spaces, underscore(_), comma(,), and hyphen(-) are allowed",
        },
      },
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter City",
      validation: {
        required: "City is required",
        pattern: {
          value: /^[A-Za-z0-9_\s-]+$/,
          message:
            "Only letters, numbers, spaces, underscore(_), and hyphen(-) are allowed",
        },
      },
    },
    {
      name: "district",
      label: "District",
      placeholder: "Enter District",
      validation: {
        required: "District is required",
        pattern: {
          value: /^[A-Za-z0-9_\s-]+$/,
          message:
            "Only letters, numbers, spaces, underscore(_), and hyphen(-) are allowed",
        },
      },
    },
    {
      name: "pin",
      label: "PIN Code",
      type: "text",
      placeholder: "Enter 6-digit PIN Code",
      validation: {
        required: "PIN is required",
        pattern: { value: /^\d{6}$/, message: "PIN must be 6 digits" },
      },
    },
    {
      name: "states",
      label: "State",
      placeholder: "Enter State",
      validation: {
        required: "State is required",
        pattern: {
          value: /^[A-Za-z0-9_\s-]+$/,
          message:
            "Only letters, numbers, spaces, underscore(_), and hyphen(-) are allowed",
        },
      },
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter Email",
      validation: {
        required: "Email is required",
        pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
      },
    },
    {
      name: "phoneno",
      label: "Phone Number",
      type: "text",
      placeholder: "Enter Phone Number",
      validation: {
        required: "Phone number is required",
        pattern: {
          value: /^[0-9]+$/,
          message: "Phone number must be digits only",
        },
      },
    },
    {
      name: "cntprsn",
      label: "Contact Person",
      placeholder: "Enter Contact Person Name",
      validation: {
        required: "Contact person is required",
        pattern: {
          value: /^[A-Za-z0-9_,\s-]+$/,
          message:
            "Only letters, numbers, spaces, underscore(_), comma(,), and hyphen(-) are allowed",
        },
      },
    },
    {
      name: "cntprsnmob",
      label: "Contact Person Mobile",
      type: "text",
      placeholder: "Enter Contact Person Mobile",
      validation: {
        required: "Mobile number is required",
        pattern: {
          value: /^[0-9]{10}$/,
          message: "Mobile number must be exactly 10 digits",
        },
      },
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
                to="/view-hospital"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Hospital
              </Link>
            </li>

            <li className="text-gray-400">/</li>

            <li aria-current="page" className="text-gray-500">
              Add Hospital
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        {fetchError && (
          <p className="text-red-500 text-sm mb-4">{fetchError}</p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Hospital</h4>
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
                            className="inline-flex items-center space-x-1"
                          >
                            <input
                              type="radio"
                              value={opt.value}
                              {...register(name, validation)}
                            />
                            <span>{opt.label}</span>
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
                      <p className="text-xs text-red-600 mt-1">
                        {errors[name]?.message}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/view-hospital")}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-md text-white transition"
            >
              {isSubmitting ? "Saving..." : "Add Hospital"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddHospital;
