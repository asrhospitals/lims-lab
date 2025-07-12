import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const AddReportTypeMaster = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({ mode: "onBlur" });

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const entryTypeOptions = ["DROPDOWN", "TEXTBOX", "DATE"];

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      reporttype: data.reporttype,
      reportdescription: data.reportdescription,
      entrytype: data.entrytype,
      entryvalues: data.entryvalues.split(",").map((val) => val.trim()),
      isactive: data.isactive || false,
    };

    try {
      const authToken = localStorage.getItem("authToken");

      await axios.post(
        "https://asrlab-production.up.railway.app/lims/master/add-report",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      toast.success("Report Type added successfully!", {
        position: "top-right",
        autoClose: 2500,
      });

      reset();
      setTimeout(() => navigate("/view-report-type-master"), 2500);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to add Report Type.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">🏠 Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-report-type-master" className="text-gray-700 hover:text-teal-600">Report Type Master</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Add Report Type</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-4 space-y-4 text-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl border border-gray-200"
        >
          <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Add Report Type Master</h4>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Report Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Report Type <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. POSITIVE/N"
                {...register("reporttype", { required: "Report Type is required" })}
                onBlur={() => trigger("reporttype")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.reporttype ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-teal-500`}
              />
              {errors.reporttype && (
                <p className="text-red-500 text-xs mt-1">{errors.reporttype.message}</p>
              )}
            </div>

            {/* Report Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Report Description <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. POSITIVE/NEGATIVE"
                {...register("reportdescription", { required: "Report Description is required" })}
                onBlur={() => trigger("reportdescription")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.reportdescription ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-teal-500`}
              />
              {errors.reportdescription && (
                <p className="text-red-500 text-xs mt-1">{errors.reportdescription.message}</p>
              )}
            </div>

            {/* Entry Type Dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Report Entry Type <span className="text-red-500">*</span></label>
              <select
                {...register("entrytype", { required: "Entry Type is required" })}
                onBlur={() => trigger("entrytype")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.entrytype ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-teal-500`}
              >
                <option value="">-- Select Entry Type --</option>
                {entryTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.entrytype && (
                <p className="text-red-500 text-xs mt-1">{errors.entrytype.message}</p>
              )}
            </div>

            {/* Entry Values */}
            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Report Entry Values</label>
              <input
                type="text"
                placeholder="e.g. POSITIVE, NEGATIVE, EQUIVOCAL"
                {...register("entryvalues")}
                onBlur={() => trigger("entryvalues")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.entryvalues ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-teal-500`}
              />
              {errors.entryvalues && (
                <p className="text-red-500 text-xs mt-1">{errors.entryvalues.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Separate values with commas.</p>
            </div>

            {/* Active Status */}
            <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Active Status <span className="text-red-500">*</span></label>
            <div className="flex items-center space-x-6">
                <label className="inline-flex items-center">
                <input
                    type="radio"
                    value="true"
                    {...register("isactive", { required: "Active status is required" })}
                    className="text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="inline-flex items-center">
                <input
                    type="radio"
                    value="false"
                    {...register("isactive", { required: "Active status is required" })}
                    className="text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">Inactive</span>
                </label>
            </div>
            {errors.isactive && (
                <p className="text-red-500 text-xs mt-1">{errors.isactive.message}</p>
            )}
            </div>


          </div>

          <div className="p-6 flex justify-end">
            <button
              type="button"
              onClick={() => reset()}
              className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Add Report Type"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReportTypeMaster;
