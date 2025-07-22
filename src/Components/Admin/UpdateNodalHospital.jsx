import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";
import { useNavigate, Link } from "react-router-dom";

const UpdateNodalHospital = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nodalList, setNodalList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const { nodalHospitalToUpdate, setNodalHospitalToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      nodalid: "",
      hospitalid: "",
      isactive: "true",
    },
  });

  const [dataInitialized, setDataInitialized] = useState(false);

  // Step 1: Fetch dropdown lists
  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const [nodalRes, hospitalRes] = await Promise.all([
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-nodal", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-hospital", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);
        setNodalList(nodalRes.data || []);
        setHospitalList(hospitalRes.data || []);
      } catch (err) {
        toast.error("❌ Failed to fetch master data.");
      }
    };
    fetchData();
  }, []);

  // Step 2: Once lists and context are available, populate form
  useEffect(() => {
    let parsed = nodalHospitalToUpdate;
    if (!parsed) {
      const stored = localStorage.getItem("nodalHospitalToUpdate");
      if (stored) parsed = JSON.parse(stored);
    }

    if (parsed && nodalList.length && hospitalList.length) {
      setNodalHospitalToUpdate(parsed); // update context if needed
      reset({
        nodalid: parsed.nodalid?.toString() || "",
        hospitalid: parsed.hospitalid?.toString() || "",
        isactive: parsed.isactive ? "true" : "false",
      });
      setDataInitialized(true);
    }
  }, [nodalHospitalToUpdate, nodalList, hospitalList, reset, setNodalHospitalToUpdate]);

  const onSubmit = async (data) => {
    const stored = nodalHospitalToUpdate || JSON.parse(localStorage.getItem("nodalHospitalToUpdate"));

    if (!stored?.id) {
      // toast.error("❌ No valid nodal hospital record to update.");
      toast.error("❌ No valid nodal hospital record to update. Please ensure the primary key 'id' exists. Possible issue: API did not return ID or DB primary key is not auto-increment.");  
      return;
    }

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const payload = {
        nodalid: parseInt(data.nodalid),
        hospitalid: parseInt(data.hospitalid),
        isactive: data.isactive === "true",
      };

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-nodalhospital/${stored.id}`,
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("✅ Nodal Hospital updated successfully!");
      setNodalHospitalToUpdate(null);
      localStorage.removeItem("nodalHospitalToUpdate");
      navigate("/view-nodal-hospitals");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "❌ Failed to update. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!dataInitialized) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">⏳ Loading nodal hospital details...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
            <li><Link to="/" className="text-gray-700 hover:text-teal-600">🏠 Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-nodal-hospitals" className="text-gray-700 hover:text-teal-600">Nodal Hospitals</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-10 px-2">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Nodal Hospital</h4>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nodal Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Nodal <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("nodalid", { required: "Please select a nodal" })}
                  className={`w-full mt-1 px-4 py-2 rounded-lg border ${
                    errors.nodalid ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                >
                  <option value="">-- Select Nodal --</option>
                  {nodalList.map((nodal) => (
                    <option key={nodal.id} value={nodal.id}>
                      {nodal.nodalname}
                    </option>
                  ))}
                </select>
                {errors.nodalid && <p className="text-red-500 text-xs mt-1">{errors.nodalid.message}</p>}
              </div>

              {/* Hospital Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Hospital <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("hospitalid", { required: "Please select a hospital" })}
                  className={`w-full mt-1 px-4 py-2 rounded-lg border ${
                    errors.hospitalid ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                >
                  <option value="">-- Select Hospital --</option>
                  {hospitalList.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.hospitalname}
                    </option>
                  ))}
                </select>
                {errors.hospitalid && <p className="text-red-500 text-xs mt-1">{errors.hospitalid.message}</p>}
              </div>

              {/* Is Active */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Is Active? <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 pt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="true"
                      {...register("isactive", { required: "Please select status" })}
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">True</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="false"
                      {...register("isactive", { required: "Please select status" })}
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">False</span>
                  </label>
                </div>
                {errors.isactive && <p className="text-red-500 text-xs mt-1">{errors.isactive.message}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setNodalHospitalToUpdate(null);
                  localStorage.removeItem("nodalHospitalToUpdate");
                  navigate("/view-nodal-hospitals");
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateNodalHospital;
