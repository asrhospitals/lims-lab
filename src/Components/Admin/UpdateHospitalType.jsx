import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";
import { useNavigate, Link } from "react-router-dom";

const UpdateHospitalType = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hospitalTypeToUpdate, setHospitalTypeToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      hsptltype: "",
      hsptldsc: "",
      isactive: true, // match lowercase column name and boolean type
    },
  });

  useEffect(() => {
    if (!hospitalTypeToUpdate) {
      const stored = localStorage.getItem("hospitalTypeToUpdate");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setHospitalTypeToUpdate(parsed);
          reset({
            hsptltype: parsed.hsptltype || "",
            hsptldsc: parsed.hsptldsc || "",
            isactive: parsed.isactive ?? true, // default true if undefined
          });
        } catch (err) {
          console.error("Failed to parse hospitalType from localStorage", err);
        }
      }
    } else {
      reset({
        hsptltype: hospitalTypeToUpdate.hsptltype || "",
        hsptldsc: hospitalTypeToUpdate.hsptldsc || "",
        isactive: hospitalTypeToUpdate.isactive ?? true,
      });
    }
  }, [hospitalTypeToUpdate, reset, setHospitalTypeToUpdate]);

  const onSubmit = async (data) => {
    if (!hospitalTypeToUpdate?.id) return;

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-hsptltype/${hospitalTypeToUpdate.id}`,
        {
          hsptltype: data.hsptltype,
          hsptldsc: data.hsptldsc,
          isactive: data.isactive, // boolean already
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      toast.success("✅ Hospital type updated successfully!");
      setHospitalTypeToUpdate(null);
      localStorage.removeItem("hospitalTypeToUpdate");
      navigate("/view-hospitaltype");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to update hospital type. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "hsptltype",
      label: "Hospital Type Code",
      placeholder: "Enter Hospital Type Code (e.g., DH)",
      validation: {
        required: "Hospital type code is required",
        pattern: {
          value: /^[a-zA-Z0-9_, ]+$/,
          message:
            "Only letters, numbers, underscore, comma and spaces allowed",
        },
      },
    },
    {
      name: "hsptldsc",
      label: "Hospital Type Description",
      placeholder: "Enter Hospital Type Description",
      validation: {
        required: "Description is required",
        minLength: { value: 2, message: "Minimum 2 characters" },
        maxLength: { value: 100, message: "Maximum 100 characters" },
        pattern: {
          value: /^[a-zA-Z0-9_, ]+$/,
          message:
            "Only letters, numbers, underscore, comma and spaces allowed",
        },
      },
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: true, label: "True" },
        { value: false, label: "False" },
      ],
      validation: {
        required: "This field is required.",
      },
    },
  ];

  if (!hospitalTypeToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No hospital type selected for update.</p>
      </div>
    );
  }

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
                to="/view-hospitaltype"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Hospital Types
              </Link>
            </li>

            <li className="text-gray-400">/</li>

            <li aria-current="page" className="text-gray-500">
              Update Hospital Type
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-20 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl border border-gray-200"
        >
          <div className="px-6 py-4 bg-gradient-to-r rounded-tl-xl rounded-tr-xl from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Hospital Type</h4>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(
                ({
                  name,
                  label,
                  placeholder,
                  type = "text",
                  options,
                  validation,
                }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700">
                      {label}{" "}
                      {validation?.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    {type === "radio" ? (
                      <div className="flex space-x-4 pt-2">
                        {options.map((option) => (
                          <label
                            key={option.value.toString()}
                            className="inline-flex items-center"
                          >
                            <input
                              type="radio"
                              {...register(name, validation)}
                              value={option.value.toString()}
                              className="h-4 w-4 text-teal-600"
                              defaultChecked={
                                String(option.value) ===
                                String(
                                  hospitalTypeToUpdate[name] ??
                                    (name === "isactive" ? true : "")
                                )
                              }
                            />
                            <span className="ml-2">{option.label}</span>
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
                          errors[name] ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-teal-500`}
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

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setHospitalTypeToUpdate(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update Hospital Type"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateHospitalType;
