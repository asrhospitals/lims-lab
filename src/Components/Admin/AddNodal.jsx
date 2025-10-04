import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { addNodal } from "../../services/apiService";

const AddNodal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    reset,
  } = useForm({
    mode: "onChange",
     defaultValues: {
      isactive: "true", // ✅ Default selected = Yes
    },
  });
  const watchedFields = watch(); // watch all fields

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        nodalname: data.nodalname,
        motherlab: data.motherlab === "true",
        isactive: data.isactive === "true",
      };

      await addNodal(payload);

      toast.success("New nodal created successfully!");
      reset();
      setTimeout(() => navigate("/view-nodal"), 1500);
    } catch (error) {
      console.error(error.response || error.message);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to create nodal lab. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
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
                to="/view-nodal"
                className="text-gray-700 hover:text-teal-600"
              >
                Nodal
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Add Nodal
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add New Nodal</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Nodal Name Dropdown */}
              <div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">
    Nodal Name <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    {...register("nodalname", {
      required: "Nodal Name is required",
      pattern: {
        value: /^[a-zA-Z_,\s]+$/,
        message:
          "Only letters, underscore (_), comma (,) and spaces allowed",
      },
      maxLength: {
        value: 20,
        message: "Max length is 20 characters",
      },
      validate: (value) =>
        !/^[0-9]+$/.test(value) || "Cannot be numbers only",
    })}
    onBlur={() => {
      trigger("nodalname"); // existing validation trigger
      // --- CURSOR-PRESERVING LOGIC ---
      if (errors?.nodalname) {
        const inputElement = document.querySelector(`[name="nodalname"]`);
        if (inputElement) inputElement.focus(); // keep cursor in the field
      }
    }}
    placeholder="Enter code (e.g., DH)"
    className={`w-full px-4 py-2 rounded-lg border ${
      errors.nodalname
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

  {errors.nodalname && (
    <p className="text-red-500 text-xs mt-1">
      {errors.nodalname.message}
    </p>
  )}
</div>


              {/* Mother Lab */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Mother Lab? <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 pt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("motherlab", {
                        required: "This field is required.",
                      })}
                      value="true"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("motherlab", {
                        required: "This field is required.",
                      })}
                      value="false"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Is Active */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Is Active? <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 pt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("isactive", {
                        required: "This field is required.",
                      })}
                      value="true"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("isactive", {
                        required: "This field is required.",
                      })}
                      value="false"
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>
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
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Add Nodal Lab"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNodal;
