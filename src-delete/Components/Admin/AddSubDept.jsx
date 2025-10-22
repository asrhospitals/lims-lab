import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { addSubDepartments, viewDepartments, viewAllDepartmentDetails } from "../../services/apiService";

const AddSubDpt = () => { 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    clearErrors,
    watch,
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      isactive: "true", // ✅ Default selected = Yes
    },
  });
  const watchedFields = watch(); // watch all fields
  // Fetch all departments on load
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await viewAllDepartmentDetails();
        setDepartments(res || []);
      } catch (error) {
        setFetchError(
          error.response?.message || "Failed to fetch departments."
        );
      }
    };

    fetchDepartments();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = {
        department_id: data.dptname,
        subdptname: data.subdptname,
        isactive: data.isactive === "true",
      };

      const authToken = localStorage.getItem("authToken");

      const response = await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-subdepartment",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("API Response:", response.data);
      toast.success("New Sub Department created successfully!");
      reset({ isactive: "true" }); // ✅ keeps Yes checked after reset
      setTimeout(() => navigate("/view-subDpt"), 1500);
    } catch (error) {
      console.error("Error creating sub-department:", error);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to create sub-department. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form fields structure
  const fields = [
    {
      name: "dptname",
      label: "Department",
      type: "select",
      options: departments.map((dept) => ({
        value: dept.id,
        label: dept.dptname,
      })),
      validation: { required: "Department is required." },
    },
    {
      name: "subdptname",
      label: "Sub-Department Name",
      placeholder: "Enter Sub-Department Name",
      validation: {
        required: "Name is required",
        minLength: { value: 5, message: "Minimum 5 characters" },
        maxLength: { value: 30, message: "Maximum 30 characters" },
        pattern: {
          value: /^(?!\d+$)[A-Za-z\s_-]+$/,
          message:
            "Only letters, spaces, underscores (_) and hyphens (-) are allowed. Numbers alone are not allowed.",
        },
      },
      onBlur: (e, errors) => {
        if (errors?.subdptname) {
          e.target.focus();
        }
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
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600"
              >
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-subdpt"
                className="text-gray-700 hover:text-teal-600"
              >
                Sub Department
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Add Sub Department</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />

        {fetchError && (
          <p className="text-red-500 text-sm mb-4">{fetchError}</p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Sub-Department</h4>
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
                        } focus:ring-2 focus:border-transparent transition`}
                      >
                        <option value="">Select {label}</option>
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : type === "radio" ? (
                      <div className="flex space-x-4 pt-2">
                        {options.map((option) => (
                          <label
                            key={option.value}
                            className="inline-flex items-center"
                          >
                            <input
                              type="radio"
                              {...register(name, validation)}
                              value={option.value}
                              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                            />
                            <span className="ml-2 text-gray-700">
                              {option.label}
                            </span>
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
                        } focus:ring-2 focus:border-transparent transition`}
                        onKeyUp={(e) => {
                          const value = e.target.value;
                          if (["dptname", "city", "state"].includes(name)) {
                            const isValid = /^[a-zA-Z\s]*$/.test(value);
                            if (!isValid) {
                              setError(name, {
                                type: "manual",
                                message: "Only letters are allowed",
                              });
                            } else {
                              clearErrors(name);
                            }
                          }
                        }}
                        onInput={(e) => {
                          const value = e.target.value;
                          if (["dptname", "city", "state"].includes(name)) {
                            const isValid = /^[a-zA-Z\s]*$/.test(value);
                            if (!isValid) {
                              setError(name, {
                                type: "manual",
                                message: "Only letters are allowed",
                              });
                            } else {
                              clearErrors(name);
                            }
                          }
                        }}
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
                onClick={() => reset({ isactive: "true" })}
                className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Add Sub-Department"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSubDpt;
