import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import { viewNodal, updateNodal, viewNodals } from "../../services/apiService";

const UpdateNodal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nodalToUpdate, setNodalToUpdate] = useState(null);
  const [existingNodals, setExistingNodals] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors, watch } = useForm({
    mode: "onChange",
    defaultValues: {
      nodalname: "",
      motherlab: "true",
      isactive: "true",
    },
  });

  const nodalNameValue = watch("nodalname");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("No nodal ID provided");
        navigate("/view-nodal");
        return;
      }

      setIsLoading(true);
      try {
        const [nodalRes, allNodals] = await Promise.all([viewNodal(id), viewNodals()]);
        setNodalToUpdate(nodalRes);
        setExistingNodals(allNodals || []);

        reset({
          nodalname: nodalRes.nodalname || "",
          motherlab: nodalRes.motherlab ? "true" : "false",
          isactive: nodalRes.isactive ? "true" : "false",
        });
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to fetch nodal data.");
        navigate("/view-nodal");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, reset, navigate]);

  const validateNodalName = (value) => {
    const lettersOnly = /^[A-Za-z\s]{2,50}$/;
  
    if (!lettersOnly.test(value.trim())) {
      setError("nodalname", {
        type: "manual",
        message: "Only letters and spaces allowed (2-50 chars).",
      });
      return false;
    }
  
    // Ensure existingNodals is an array
    const nodalsArray = Array.isArray(existingNodals) ? existingNodals : [];
  
    const duplicate = nodalsArray.find(
      (n) => n.nodalname.toLowerCase() === value.trim().toLowerCase() && n.id !== nodalToUpdate?.id
    );
  
    if (duplicate) {
      setError("nodalname", { type: "manual", message: "Nodal name already exists." });
      return false;
    }
  
    clearErrors("nodalname");
    return true;
  };
  

  const onSubmit = async (data) => {
    if (!id) return;
    if (!validateNodalName(data.nodalname)) return;

    setIsSubmitting(true);
    try {
      const payload = {
        nodalname: data.nodalname.trim(),
        motherlab: data.motherlab === "true",
        isactive: data.isactive === "true",
      };

      await updateNodal(id, payload);

      toast.success("✅ Nodal updated successfully!");
      navigate("/view-nodal");
      setNodalToUpdate(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "❌ Failed to update nodal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-10 text-gray-500">Loading nodal data...</div>;
  if (!nodalToUpdate) return <div className="text-center py-10 text-gray-500">Nodal lab not found.</div>;

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li><Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">🏠 Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-nodal" className="text-gray-700 hover:text-teal-600">Nodal</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Nodal</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-10 px-2 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Nodal Lab</h4>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Nodal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nodal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("nodalname", { required: "Nodal name is required" })}
                  placeholder="Enter Nodal Name"
                  onChange={(e) => validateNodalName(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.nodalname ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                />
                {errors.nodalname && <p className="text-red-500 text-xs mt-1">{errors.nodalname.message}</p>}
              </div>

              {/* Mother Lab */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Is Mother Lab? <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 pt-2">
                  <label className="inline-flex items-center">
                    <input type="radio" {...register("motherlab", { required: "Please select Mother Lab" })} value="true" className="h-4 w-4 text-teal-600" />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" {...register("motherlab", { required: "Please select Mother Lab" })} value="false" className="h-4 w-4 text-teal-600" />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {errors.motherlab && <p className="text-red-500 text-xs mt-1">{errors.motherlab.message}</p>}
              </div>

              {/* Active Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Is Active? <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 pt-2">
                  <label className="inline-flex items-center">
                    <input type="radio" {...register("isactive", { required: "Please select Active status" })} value="true" className="h-4 w-4 text-teal-600" />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" {...register("isactive", { required: "Please select Active status" })} value="false" className="h-4 w-4 text-teal-600" />
                    <span className="ml-2">No</span>
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

export default UpdateNodal;
