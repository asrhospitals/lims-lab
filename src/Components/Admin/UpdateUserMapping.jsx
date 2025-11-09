import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";

const UpdateUserMapping = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userMapping, setUserMapping] = useState(null);
  const [hospitalsList, setHospitalsList] = useState([]);
  const [nodalsList, setNodalsList] = useState([]);
  const [rolesList, setRolesList] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const fetchMasterData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };

      const [hRes, nRes, rRes] = await Promise.all([
        fetch("https://asrlabs.asrhospitalindia.in/lims/master/get-hospital?page=1&limit=1000", { headers }),
        fetch("https://asrlabs.asrhospitalindia.in/lims/master/get-nodal?page=1&limit=1000", { headers }),
        fetch("https://asrlabs.asrhospitalindia.in/lims/master/get-role", { headers }),
      ]);

      const [hData, nData, rData] = await Promise.all([hRes.json(), nRes.json(), rRes.json()]);
      setHospitalsList(hData?.data || []);
      setNodalsList(nData?.data || []);
      setRolesList(rData?.data || []);

    } catch (err) {
      toast.error("❌ Failed to load dropdown data.");
    }
  };

  const fetchUserMapping = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");

      const res = await fetch(`https://asrlabs.asrhospitalindia.in/lims/authentication/get-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setUserMapping(data);

      reset({
        user_name: data.username,
        hospital: data.hospitalid,
        nodal: data.nodalid,
        role: data.role,
        module: data.module, 

        created_by: data.created_by_name || "Admin",
        created_date: data.created_date || "",

        update_by: data.update_by || "Admin",
        update_date: data.update_date
          ? new Date(data.update_date).toLocaleDateString("en-GB")
          : data.updatedAt
          ? new Date(data.updatedAt).toLocaleDateString("en-GB")
          : "",
        isactive: data.isactive ? "true" : "false",
      });

    } catch (err) {
      toast.error("❌ Failed to load user mapping data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
    fetchUserMapping();
  }, [id]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      const today = new Date().toISOString().split("T")[0];
      const updatedBy = "Admin";

      const payload = {
        role: Number(data.role),
        hospitalid: Number(data.hospital),
        nodalid: Number(data.nodal),
        module: data.module, 
        isactive: data.isactive === "true",
        update_by: updatedBy,
        update_date: today,
      };

      const response = await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/authentication/update-roles/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success(" User mapping updated successfully!");
        setTimeout(() => {
          navigate("/view-user-mapping", { state: { refresh: true } });
        }, 2000);
      }

    } catch (err) {
      toast.error("❌ Failed to update user mapping.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-10 text-gray-500">Loading User Mapping data...</div>;
  if (!userMapping) return <div className="text-center py-10 text-gray-500">No User Mapping found.</div>;

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li><Link to="/" className="text-gray-700 hover:text-teal-600">🏠 Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-user-mapping" className="text-gray-700 hover:text-teal-600">User Mapping</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update User Mapping</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-2 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update User Mapping</h4>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700">User Name</label>
                <input type="text" {...register("user_name")} disabled className="w-full px-4 py-2 rounded-lg border border-gray-300" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Select Hospital <span className="text-red-500">*</span></label>
                <select {...register("hospital")} className="w-full px-4 py-2 rounded-lg border border-gray-300">
                  <option value="">Select Hospital</option>
                  {hospitalsList.map((h) => <option key={h.id} value={h.id}>{h.hospitalname}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Select Nodal <span className="text-red-500">*</span></label>
                <select {...register("nodal")} className="w-full px-4 py-2 rounded-lg border border-gray-300">
                  <option value="">Select Nodal</option>
                  {nodalsList.map((n) => <option key={n.id} value={n.id}>{n.nodalname}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Select Role <span className="text-red-500">*</span></label>
                <select {...register("role")} className="w-full px-4 py-2 rounded-lg border border-gray-300">
                  <option value="">Select Role</option>
                  {rolesList.map((r) => <option key={r.id} value={r.id}>{r.roletype}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Module <span className="text-red-500">*</span></label>
                <select id="moduleSelect" {...register("module")} className="w-full px-4 py-2 rounded-lg border border-gray-300">
                  <option value="">Select Module</option>
                  <option value="phlebotomist">Phlebotomist</option>
                  <option value="reception">Reception</option>
                  <option value="biochemistry">Biochemistry</option>
                  <option value="microbiology">Microbiology</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Created By</label>
                <input type="text" {...register("created_by")} disabled className="w-full px-4 py-2 rounded-lg border border-gray-300" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Created Date</label>
                <input type="text" {...register("created_date")} disabled className="w-full px-4 py-2 rounded-lg border border-gray-300" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Updated By</label>
                <input type="text" {...register("update_by")} disabled className="w-full px-4 py-2 rounded-lg border border-gray-300" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Updated At</label>
                <input type="text" {...register("update_date")} disabled className="w-full px-4 py-2 rounded-lg border border-gray-300" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Is Active <span className="text-red-500">*</span></label>
                <div className="flex space-x-4 pt-2">
                  <label className="inline-flex items-center">
                    <input type="radio" value="true" {...register("isactive")} className="h-4 w-4 text-teal-600" />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" value="false" {...register("isactive")} className="h-4 w-4 text-teal-600" />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/view-user-mapping")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Updating..." : "Update UserMapping"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateUserMapping;
