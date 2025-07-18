import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";

const UpdateReportTypeMaster = () => {
  const { reportTypeToUpdate, setReportTypeToUpdate } = useContext(AdminContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    let data = reportTypeToUpdate;

    // If not available in context, load from localStorage
    if (!data) {
      const stored = localStorage.getItem("reportTypeToUpdate");
      if (stored) {
        try {
          data = JSON.parse(stored);
          setReportTypeToUpdate(data);
        } catch (e) {
          console.error("Failed to parse localStorage data for reportTypeToUpdate");
        }
      }
    }

    // Populate form if data exists
    if (data) {
      setValue("reporttype", data.reporttype || "");
      setValue("reportdescription", data.reportdescription || "");
      setValue("entrytype", data.entrytype || "");
      setValue("entryvalues", Array.isArray(data.entryvalues) ? data.entryvalues.join(", ") : data.entryvalues || "");
      setValue("isactive", data.isactive ? "true" : "false");
    }
  }, [reportTypeToUpdate, setReportTypeToUpdate, setValue]);

const onSubmit = async (data) => {
  setIsSubmitting(true);

  const payload = {
    reporttype: data.reporttype,
    reportdescription: data.reportdescription,
    entrytype: data.entrytype,
    entryvalues: data.entryvalues.trim()
      ? data.entryvalues.split(",").map((val) => val.trim())
      : [],
    isactive: data.isactive === "true",
  };

  try {
    const authToken = localStorage.getItem("authToken");
    const reportId = reportTypeToUpdate?.id;

    console.log("Updating Report Type with ID:", reportId);
    console.log("Payload:", payload);

    const response = await axios.put(
      `http://srv913743.hstgr.cloud:2000/lims/master/update-report/${reportId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    toast.success("✅ Report Type updated successfully!", {
      position: "top-right",
      autoClose: 2000,
    });

    setTimeout(() => {
      localStorage.removeItem("reportTypeToUpdate");
      setReportTypeToUpdate(null);
      navigate("/view-report-type-master");
    }, 2000);
  } catch (error) {
    console.error("Update Error:", error?.response?.data || error.message || error);
    toast.error(
      error?.response?.data?.message || "❌ Failed to update report type.",
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
          <li className="text-gray-500">Update Report Type</li>
        </ol>
      </nav>
    </div>

    <div className="w-full mt-12 px-4 space-y-4 text-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl border border-gray-200"
      >
        <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
          <h4 className="text-white font-semibold">Update Report Type Master</h4>
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
              className={`w-full px-4 py-2 rounded-lg border ${errors.reporttype ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
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
              {...register("reportdescription", { required: "Description is required" })}
              onBlur={() => trigger("reportdescription")}
              className={`w-full px-4 py-2 rounded-lg border ${errors.reportdescription ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
            />
            {errors.reportdescription && (
              <p className="text-red-500 text-xs mt-1">{errors.reportdescription.message}</p>
            )}
          </div>

          {/* Report Entry Type */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Report Entry Type <span className="text-red-500">*</span></label>
            <select
              {...register("entrytype", { required: "Entry type is required" })}
              onBlur={() => trigger("entrytype")}
              className={`w-full px-4 py-2 rounded-lg border ${errors.entrytype ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
            >
              <option value="">-- Select Entry Type --</option>
              <option value="TEXTBOX">TEXTBOX</option>
              <option value="DROPDOWN">DROPDOWN</option>
              <option value="DATE">DATE</option>
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
              className={`w-full px-4 py-2 rounded-lg border ${errors.entryvalues ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
            />
            {errors.entryvalues && (
              <p className="text-red-500 text-xs mt-1">{errors.entryvalues.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Separate values with commas.</p>
          </div>

          {/* Is Active */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Is Active</label>
            <select
              {...register("isactive")}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
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
            {isSubmitting ? "Updating..." : "Update Report Type"}
          </button>
        </div>
      </form>
    </div>
  </>
);

};

export default UpdateReportTypeMaster;
