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
  } = useForm({
    mode: "onChange",
    defaultValues: { isactive: "true" },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        isactive: data.isactive === "true",
      };

      const authToken = localStorage.getItem("authToken");

      const response = await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-hsptltype",
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      console.log("API Response:", response.data);
      toast.success("New hospital type created successfully!");
      reset({ isactive: "true" });
      setTimeout(() => navigate("/view-hospitaltype"), 1500);
    } catch (error) {
      console.error("Error creating hospital type:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
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
        value: /^[A-Za-z\s]+$/,
        message: "Only letters and spaces are allowed",
      },
      maxLength: {
        value: 20,
        message: "Max length is 20 characters",
      },
      onBlur: (e) => {
        if (errors?.hsptltype) {
          e.target.focus(); // cursor-preserving
        }
      },
    })}
    placeholder="Enter code (e.g., DH)"
    className={`w-full px-4 py-2 rounded-lg border ${
      errors.hsptltype
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-teal-500"
    } focus:ring-2 focus:border-transparent transition`}
  />
  {errors.hsptltype && (
    <p className="text-red-500 text-xs mt-1 flex items-center">
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
        value: /^[A-Za-z\s]+$/,
        message:
          "Only letters and spaces are allowed (no numbers or special characters)",
      },
      onBlur: (e) => {
        if (errors?.hsptldsc) {
          e.target.focus(); // cursor-preserving
        }
      },
    })}
    placeholder="Enter full description"
    className={`w-full px-4 py-2 rounded-lg border ${
      errors.hsptldsc
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-teal-500"
    } focus:ring-2 focus:border-transparent transition`}
  />
  {errors.hsptldsc && (
    <p className="text-red-500 text-xs mt-1 flex items-center">
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
                      value="false"
                      defaultChecked
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
                      value="true"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">False</span>
                  </label>
                </div>
                {errors.isactive && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
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
