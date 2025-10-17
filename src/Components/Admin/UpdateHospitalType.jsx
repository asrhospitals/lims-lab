import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import { viewHospitalType, updateHospitalType } from "../../services/apiService";

const UpdateHospitalType = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hospitalTypeToUpdate, setHospitalTypeToUpdate] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

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
      isactive: "true", // ✅ default value True
    },
  });

  useEffect(() => {
    const fetchHospitalTypeData = async () => {
      if (!id) {
        toast.error("No hospital type ID provided");
        navigate("/view-hospitaltype");
        return;
      }

      setIsLoading(true);
      try {
        const hospitalTypeData = await viewHospitalType(id);
        setHospitalTypeToUpdate(hospitalTypeData);
        reset({
          hsptltype: hospitalTypeData.hsptltype || "",
          hsptldsc: hospitalTypeData.hsptldsc || "",
          isactive: hospitalTypeData.isactive ? "true" : "false", // ✅ convert to string
        });
      } catch (error) {
        console.error("Failed to fetch hospital type data:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to fetch hospital type data. Please try again."
        );
        navigate("/view-hospitaltype");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitalTypeData();
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateHospitalType(id, {
        hsptltype: data.hsptltype,
        hsptldsc: data.hsptldsc,
        isactive: data.isactive === "true",
      });

      // ✅ Show toast first, then navigate after 1 second
      toast.success("Hospital type updated successfully!");
      setTimeout(() => {
        setHospitalTypeToUpdate(null);
        navigate("/view-hospitaltype");
      }, 1000);

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
          value: /^[A-Za-z\s]+$/, // ✅ only letters and spaces
          message: "Only letters and spaces are allowed (no numbers or special characters)",
        },
        validate: {
          noDuplicate: (value) => {
            const existing = ["DH", "CH", "RH"]; // replace with real list from API or state
            return !existing.includes(value) || "Duplicate hospital type code is not allowed";
          },
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
          value: /^[A-Za-z\s]+$/,
          message: "Only letters and spaces are allowed (no numbers or special characters)",
        },
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
      validation: {
        required: "This field is required.",
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Loading hospital type data...</p>
      </div>
    );
  }

  if (!hospitalTypeToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Hospital type not found.</p>
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
                            key={option.value}
                            className="inline-flex items-center"
                          >
                            <input
                              type="radio"
                              {...register(name, validation)}
                              value={option.value}
                              className="h-4 w-4 text-teal-600"
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
                  navigate("/view-hospitaltype");
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
