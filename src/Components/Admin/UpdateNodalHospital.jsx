import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  viewNodals,
  viewHospitals,
  viewNodalHospital,
  updateNodalHospital,
} from "../../services/apiService";

const UpdateNodalHospital = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nodalList, setNodalList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [nodalHospitalData, setNodalHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
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
      isactive: "Yes",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("❌ No nodal hospital ID provided.");
        navigate("/view-nodal-hospitals");
        return;
      }

      try {
        setLoading(true);

        const [nodalRes, hospitalRes, nodalHospitalRes] = await Promise.all([
          viewNodals(),
          viewHospitals(),
          viewNodalHospital(id),
        ]);

        const nodalData = nodalRes.data || [];
        const hospitalData = hospitalRes.data || [];
        const nodalHospitalData = nodalHospitalRes || null;

        setNodalList(nodalData);
        setHospitalList(hospitalData);
        setNodalHospitalData(nodalHospitalData);

        if (nodalHospitalData && nodalData.length && hospitalData.length) {
          const nodalNameToIdMap = new Map();
          nodalData.forEach((n) => nodalNameToIdMap.set(n.nodalname, n.id));

          const hospitalNameToIdMap = new Map();
          hospitalData.forEach((h) =>
            hospitalNameToIdMap.set(h.hospitalname, h.id)
          );

          const nodalId =
            nodalNameToIdMap.get(nodalHospitalData.nodalName) || "";
          const hospitalId =
            hospitalNameToIdMap.get(nodalHospitalData.hospitalName) || "";

          reset({
            nodalid: nodalId.toString(),
            hospitalid: hospitalId.toString(),
            isactive: nodalHospitalData.isactive ? "Yes" : "No",
          });
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error(err?.response?.data?.message || "❌ Failed to fetch data.");
        navigate("/view-nodal-hospitals");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    if (!id) {
      toast.error("❌ No valid nodal hospital ID to update.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nodalid: parseInt(data.nodalid, 10),
        hospitalid: parseInt(data.hospitalid, 10),
        isactive: data.isactive === "Yes",
      };

      await updateNodalHospital(id, payload);

      toast.success("✅ Nodal Hospital updated successfully!");
      navigate("/view-nodal-hospitals");
    } catch (error) {
      console.error("Error updating nodal hospital:", error);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to update. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">⏳ Loading nodal hospital details...</p>
      </div>
    );
  }

  if (!nodalHospitalData) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Nodal hospital not found.</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-nodal-hospitals"
                className="text-gray-700 hover:text-teal-600"
              >
                Nodal Hospitals
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-10 px-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl border border-gray-200"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Nodal Hospital</h4>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Nodal Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Nodal <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("nodalid", {
                    required: "Please select a nodal",
                  })}
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
                {errors.nodalid && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nodalid.message}
                  </p>
                )}
              </div>

              {/* Hospital Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Hospital <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("hospitalid", {
                    required: "Please select a hospital",
                  })}
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
                {errors.hospitalid && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.hospitalid.message}
                  </p>
                )}
              </div>

              {/* Active Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Is Active? <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 pt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="Yes"
                      {...register("isactive", {
                        required: "Please select status",
                      })}
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="No"
                      {...register("isactive", {
                        required: "Please select status",
                      })}
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {errors.isactive && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.isactive.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  navigate("/view-nodal-hospitals");
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
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
