import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateTechnician = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nodalCenters, setNodalCenters] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch technician details and dropdown options
  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        // Fetch technician details
        const technicianRes = await axios.get(
          `https://asrlab-production.up.railway.app/lims/master/get-tech/${id}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const tech = technicianRes.data;

        // Set form values
        reset({
          technicianName: tech.technicianName,
          nodal: tech.nodal,
          roleType: tech.roleType,
          instrument: tech.instrument,
          addressLine: tech.addressLine,
          city: tech.city,
          state: tech.state,
          pinCode: tech.pinCode,
          dob: tech.dob,
          gender: tech.gender,
          contactNo: tech.contactNo,
          isactive: tech.isactive?.toString(),
        });

        // Fetch dropdowns
        const [nodalRes, roleRes, instRes] = await Promise.all([
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-nodal", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-role", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-instrument", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        setNodalCenters(nodalRes.data || []);
        setRoleTypes(roleRes.data.filter((r) => r.isactive));
        setInstruments(instRes.data.filter((r) => r.isactive));
      } catch (err) {
        toast.error("❌ Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    const payload = {
      technicianName: data.technicianName,
      nodal: data.nodal,
      roleType: data.roleType,
      instrument: data.instrument,
      addressLine: data.addressLine,
      city: data.city,
      state: data.state,
      pinCode: Number(data.pinCode),
      dob: data.dob,
      gender: data.gender,
      contactNo: data.contactNo,
      isactive: data.isactive === "true" || data.isactive === true,
    };

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.put(
        `https://asrlab-production.up.railway.app/lims/master/update-tech/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("✅ Technician updated successfully!", { autoClose: 2000 });
      setTimeout(() => navigate("/view-technician"), 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to update technician."
      );
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
      <ToastContainer />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
          <h4 className="font-semibold text-white">Update Technician</h4>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Technician Name */}
            <div>
              <label className="font-medium">Technician Name *</label>
              <input
                {...register("technicianName", { required: "Required" })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              />
              {errors.technicianName && (
                <p className="text-red-500 text-xs">{errors.technicianName.message}</p>
              )}
            </div>

            {/* Nodal */}
            <div>
              <label className="font-medium">Nodal Center *</label>
              <select
                {...register("nodal", { required: "Required" })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              >
                <option value="">Select Nodal</option>
                {nodalCenters.map((n) => (
                  <option key={n.nodalname} value={n.nodalname}>
                    {n.nodalname}
                  </option>
                ))}
              </select>
              {errors.nodal && (
                <p className="text-red-500 text-xs">{errors.nodal.message}</p>
              )}
            </div>

            {/* Role Type */}
            <div>
              <label className="font-medium">Role Type *</label>
              <select
                {...register("roleType", { required: "Required" })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              >
                <option value="">Select Role</option>
                {roleTypes.map((r) => (
                  <option key={r.roleType} value={r.roleType}>
                    {r.roleDescription}
                  </option>
                ))}
              </select>
              {errors.roleType && (
                <p className="text-red-500 text-xs">{errors.roleType.message}</p>
              )}
            </div>

            {/* Instrument */}
            <div>
              <label className="font-medium">Instrument *</label>
              <select
                {...register("instrument", { required: "Required" })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              >
                <option value="">Select Instrument</option>
                {instruments.map((i) => (
                  <option key={i.instrumentname} value={i.instrumentname}>
                    {i.instrumentname}
                  </option>
                ))}
              </select>
              {errors.instrument && (
                <p className="text-red-500 text-xs">{errors.instrument.message}</p>
              )}
            </div>

            {/* Remaining fields (address, city, etc.) */}
            {[
              { name: "addressLine", label: "Address" },
              { name: "city", label: "City" },
              { name: "state", label: "State" },
              { name: "pinCode", label: "PIN Code", type: "number" },
              { name: "dob", label: "Date of Birth", type: "date" },
              { name: "contactNo", label: "Contact No", type: "number" },
            ].map(({ name, label, type = "text" }) => (
              <div key={name}>
                <label className="font-medium">{label} *</label>
                <input
                  type={type}
                  {...register(name, { required: "Required" })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
                {errors[name] && (
                  <p className="text-red-500 text-xs">{errors[name].message}</p>
                )}
              </div>
            ))}

            {/* Gender */}
            <div>
              <label className="font-medium">Gender *</label>
              <div className="flex space-x-4 mt-2">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g} className="inline-flex items-center">
                    <input
                      type="radio"
                      value={g}
                      {...register("gender", { required: "Required" })}
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">{g}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs">{errors.gender.message}</p>
              )}
            </div>

            {/* Is Active */}
            <div>
              <label className="font-medium">Is Active? *</label>
              <div className="flex space-x-4 mt-2">
                {[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ].map((opt) => (
                  <label key={opt.value} className="inline-flex items-center">
                    <input
                      type="radio"
                      value={opt.value}
                      {...register("isactive", { required: "Required" })}
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">{opt.label}</span>
                  </label>
                ))}
              </div>
              {errors.isactive && (
                <p className="text-red-500 text-xs">{errors.isactive.message}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg hover:from-teal-700 hover:to-teal-600"
            >
              Update Technician
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateTechnician;
