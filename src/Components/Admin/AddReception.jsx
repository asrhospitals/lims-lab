import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { addReception, viewNodals } from "../../services/apiService";

const AddReceptionist = () => {
  const [nodalCenters, setNodalCenters] = useState([]);
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

  // Fetch nodal centers
  useEffect(() => {
    const fetchNodalCenters = async () => {
      try {
        const response = await viewNodals();
        setNodalCenters(response?.data || []);
      } catch (error) {
        setFetchError(
          error.response?.data?.message || "Failed to fetch nodal centers."
        );
      }
    };
    fetchNodalCenters();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      receptionistname: data.receptionistname, // Fixed field name to match API
      addressline: data.addressline,
      city: data.city,
      state: data.state,
      pincode: Number(data.pincode),
      dob: data.dob,
      contactno: Number(data.contactno), // Convert to number to match your payload
      gender: data.gender,
      nodal: data.nodal,
      isactive: data.isactive === "true",
    };

    try {
      await addReception(payload);

      toast.success("Receptionist added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      reset();
      setTimeout(() => {
        navigate("/view-reception");
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error?.response?.data);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to add receptionist. Please try again.",
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
      name: "receptionistname", // Fixed field name to match API
      label: "Receptionist Name",
      placeholder: "Enter Receptionist Name",
      validation: { required: "Receptionist name is required" },
    },
    {
      name: "addressline",
      label: "Address",
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
      name: "pincode",
      label: "PIN Code",
      type: "number",
      placeholder: "Enter 6-digit PIN Code",
      validation: {
        required: "PIN code is required",
        pattern: {
          value: /^\d{6}$/,
          message: "PIN code must be exactly 6 digits",
        },
      },
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      placeholder: "Select DOB",
      validation: { required: "Date of birth is required" },
    },
    {
      name: "contactno",
      label: "Contact Number",
      type: "text",
      placeholder: "Enter Contact Number",
      validation: {
        required: "Contact number is required",
        pattern: {
          value: /^\d{10}$/,
          message: "Contact number must be 10 digits",
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
      name: "nodal",
      label: "Nodal Center",
      type: "select",
      options: nodalCenters.map((n) => ({
        value: n.nodalname,
        label: n.nodalname,
      })),
      validation: { required: "Nodal center is required" },
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
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
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
                to="/view-reception"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Receptionist
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Add Receptionist
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
            <h4 className="font-semibold text-white">Add Receptionist</h4>
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
                      {label}
                      {validation?.required && (
                        <span className="text-red-500"> *</span>
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
                    ) : (
                      <input
                        type={type}
                        {...register(name, validation)}
                        onBlur={() => trigger(name)}
                        placeholder={placeholder}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        } focus:ring-2 transition`}
                      />
                    )}
                    {errors[name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[name].message}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => reset()}
                className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 ${
                  isSubmitting && "opacity-50 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Add Receptionist"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReceptionist;
