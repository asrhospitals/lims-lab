import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import AdminContext from "../../context/adminContext";
import { addRole, viewRoles } from "../../services/apiService";

const AddRole = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const { setRoleToUpdate } = useContext(AdminContext);

  const { register, handleSubmit, formState: { errors }, reset, setError, trigger } = useForm({
    mode: "onBlur",
  });

  // Fetch existing roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await viewRoles();
        setRoles(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        toast.error("Failed to fetch roles.");
      }
    };
    fetchRoles();
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Check for duplicate role type
    const duplicate = roles.find(
      (r) => r.roletype.toLowerCase() === data.roletype.toLowerCase()
    );
    if (duplicate) {
      setError("roletype", { type: "manual", message: "Role type already exists" });
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        roletype: data.roletype,
        roledescription: data.roledescription,
        isactive: data.isactive === "true",
      };

      await addRole(payload);
      toast.success("✅ New Role Created successfully!");

      // Refetch roles to update list
      const updatedRoles = await viewRoles();
      setRoles(updatedRoles.data.data || []);

      reset();
      setTimeout(() => navigate("/view-roles"), 1500);
    } catch (error) {
      console.error(error.response || error.message);
      toast.error(error?.response?.data?.message || "❌ Failed to create role. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fields config
  const fields = [
    {
      name: "roletype",
      label: "Role Type",
      placeholder: "Enter Role Type",
      validation: {
        required: "Role type is required",
        minLength: { value: 2, message: "Minimum 2 characters" },
        maxLength: { value: 30, message: "Maximum 30 characters" },
        pattern: { value: /^[A-Za-z ]+$/, message: "Only letters and spaces are allowed" },
      },
    },
    {
      name: "roledescription",
      label: "Role Description",
      placeholder: "Enter Role Description",
      validation: {
        required: "Role description is required",
        minLength: { value: 5, message: "Minimum 5 characters" },
        maxLength: { value: 100, message: "Maximum 100 characters" },
        pattern: { value: /^[A-Za-z ]+$/, message: "Only letters and spaces are allowed" },
      },
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      validation: { required: "Mandatory field." },
    },
  ];

  return (
    <>
      <ToastContainer />

      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">🏠 Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-roles" className="text-gray-700 hover:text-teal-600">Roles</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">Add Role</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add New Role</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options, validation }) => (
                <div key={name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {label} {validation?.required && <span className="text-red-500">*</span>}
                  </label>

                  {type === "radio" ? (
                    <div className="flex space-x-4 pt-2">
                      {options.map((option) => (
                        <label key={option.value} className="inline-flex items-center">
                          <input
                            type="radio"
                            {...register(name, validation)}
                            value={option.value}
                            onInput={() => trigger(name)}
                            onKeyUp={() => trigger(name)}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={type}
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      onInput={() => trigger(name)}
                      onKeyUp={() => trigger(name)}
                      className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 focus:border-transparent transition`}
                      placeholder={placeholder}
                    />
                  )}

                  {errors[name] && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      {errors[name].message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
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
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Add New Role"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddRole;
