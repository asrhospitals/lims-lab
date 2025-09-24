import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { addNodalInstrument, viewNodals, viewInstruments } from "../../services/apiService";

const AddNodalInstrument = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nodalList, setNodalList] = useState([]);
  const [instrumentList, setInstrumentList] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm({ mode: "onChange" });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const nodals = await viewNodals();
        const instruments = await viewInstruments();
        setNodalList(nodals?.data || []);
        setInstrumentList(instruments?.data || []);
      } catch (error) {
        setFetchError(error?.response?.data?.message || "Failed to fetch dropdowns.");
      }
    };
    fetchDropdowns();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        nodalid: data.nodalid,
        instrumentId: data.instrumentid,
        isactive: data.isactive === "true",
      };

      await addNodalInstrument(payload);

      toast.success("Nodal Instrument added successfully!");
      reset();
      setTimeout(() => navigate("/view-nodal-instruments"), 1500);

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to add Nodal Instrument. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li><Link to="/" className="text-gray-700 hover:text-teal-600">🏠 Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-nodal-instruments" className="text-gray-700 hover:text-teal-600">Nodal Instrument</Link></li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">Add Nodal Instrument</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        {fetchError && <p className="text-red-500 text-sm">{fetchError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Nodal Instrument</h4>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nodal dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Nodal Name <span className="text-red-500">*</span>
              </label>
              <select
                {...register("nodalid", { required: "Nodal is required" })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.nodalid ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
              >
                <option value="">Select Nodal</option>
                {nodalList.map(n => (
                  <option key={n.id} value={n.id}>{n.nodalname}</option>
                ))}
              </select>
              {errors.nodalid && <p className="text-red-500 text-xs mt-1">{errors.nodalid.message}</p>}
            </div>

            {/* Instrument dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Instrument Name <span className="text-red-500">*</span>
              </label>
              <select
                {...register("instrumentid", { required: "Instrument is required" })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.instrumentid ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
              >
                <option value="">Select Instrument</option>
                {instrumentList.map(i => (
                  <option key={i.id} value={i.id}>{i.instrumentname}</option>
                ))}
              </select>
              {errors.instrumentid && <p className="text-red-500 text-xs mt-1">{errors.instrumentid.message}</p>}
            </div>

            {/* Is Active */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Is Active? <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4 pt-2">
                {["true", "false"].map(val => (
                  <label key={val} className="inline-flex items-center">
                    <input type="radio" {...register("isactive", { required: "Status is required" })} value={val} className="h-4 w-4 text-teal-600" />
                    <span className="ml-2">{val === "true" ? "Yes" : "No"}</span>
                  </label>
                ))}
              </div>
              {errors.isactive && <p className="text-red-500 text-xs mt-1">{errors.isactive.message}</p>}
            </div>
          </div>

          {/* Buttons aligned to right */}
         <div className="mt-8 px-6 py-4 flex justify-end gap-4">
  <button type="button" onClick={() => reset()} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
    Reset
  </button>
  <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg hover:from-teal-700 hover:to-teal-600">
    {isSubmitting ? "Saving..." : "Add Nodal Instrument"}
  </button>
</div>

        </form>
      </div>
    </>
  );
};

export default AddNodalInstrument;
