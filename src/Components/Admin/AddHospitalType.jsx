import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AddHospitalType = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      isactive: "true", // default radio selection
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Convert isactive to boolean because API expects boolean
    const payload = {
      ...data,
      isactive: data.isactive === "true",
    };
    try {
      const authToken = localStorage.getItem("authToken");

      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-hsptltype",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      toast.success("✅ Hospital type created successfully!", {
        position: "top-right",
        autoClose: 5000,
      });
      reset({ isactive: "true" });
      navigate("/view-hospitaltype");
    } catch (error) {
      console.error(error.response || error.message);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to create hospital type. Please try again."
      );
    } finally {
      setIsSubmitting(false);
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
                to="/view-hospitaltype"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Hospital Type
              </Link>
            </li>

            <li className="text-gray-400">/</li>

            <li aria-current="page" className="text-gray-500">
              Add Hospital Type
            </li>
          </ol>
        </nav>
      </div>


      <div className="w-full mt-14 px-0 sm:px-6 max-w-7xl mx-auto text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Hospital Type</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hospital Type Code */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Hospital Type Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("hsptltype", {
                    required: "Hospital type code is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_,]+$/,
                      message:
                        "Only letters, numbers, underscore (_) and comma (,) allowed",
                    },
                    maxLength: {
                      value: 20,
                      message: "Max length is 20 characters",
                    },
                  })}
                  onBlur={() => trigger("hsptltype")}
                  placeholder="Enter code (e.g., DH)"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.hsptltype
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:ring-2 focus:border-transparent transition`}
                />
                {errors.hsptltype && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.hsptltype.message}
                  </p>
                )}
              </div>

              {/* Hospital Description */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Hospital Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("hsptldsc", {
                    required: "Description is required",
                    minLength: {
                      value: 5,
                      message: "Minimum 5 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Maximum 100 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_, ]+$/,
                      message:
                        "Only letters, numbers, spaces, underscore (_) and comma (,) allowed",
                    },
                  })}
                  onBlur={() => trigger("hsptldsc")}
                  placeholder="Enter full description"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.hsptldsc
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:ring-2 focus:border-transparent transition`}
                />
                {errors.hsptldsc && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.hsptldsc.message}
                  </p>
                )}
              </div>

              {/* Is Active */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Is Active? <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6 pt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("isactive", {
                        required: "Please choose active status",
                      })}
                      value="true"
                      defaultChecked={watch("isactive") === "true"}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">True</span>
                  </label>

                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("isactive", {
                        required: "Please choose active status",
                      })}
                      value="false"
                      defaultChecked={watch("isactive") === "false"}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">False</span>
                  </label>
                </div>
                {errors.isactive && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.isactive.message}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => reset({ isactive: "true" })}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                disabled={isSubmitting}
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Add Hospital Type"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddHospitalType;
