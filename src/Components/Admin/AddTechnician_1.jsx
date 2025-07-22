import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTechnician = () => {
  const [nodalCenters, setNodalCenters] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });

  // Fetch Nodal Centers
  useEffect(() => {
    const fetchNodalCenters = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-nodal",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const activeNodals = response.data.filter((n) => n.isactive);
        setNodalCenters(activeNodals);
      } catch (error) {
        toast.error("❌ Failed to load Nodal Centers.");
      }
    };

    const fetchRoleTypes = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-role",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const activeRoles = response.data.filter((r) => r.isactive);
        setRoleTypes(activeRoles);
      } catch (error) {
        toast.error("❌ Failed to load Role Types.");
      }
    };

    fetchNodalCenters();
    fetchRoleTypes();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

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
      isactive: data.isactive === "true",
    };

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-tech",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      toast.success("✅ Technician added successfully!");
      reset();

      setTimeout(() => navigate("/view-technician"), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "❌ Failed to add technician. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Technician</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label>Technician Name</label>
          <input
            {...register("technicianName", { required: "Required" })}
            className="w-full p-2 border rounded"
            placeholder="Enter technician name"
          />
          {errors.technicianName && (
            <p className="text-red-500">{errors.technicianName.message}</p>
          )}
        </div>

        <div>
          <label>Nodal Center</label>
          <select {...register("nodal", { required: "Required" })} className="w-full p-2 border rounded">
            <option value="">Select Nodal Center</option>
            {nodalCenters.map((n) => (
              <option key={n.nodal_id} value={n.nodalname}>{n.nodalname}</option>
            ))}
          </select>
          {errors.nodal && <p className="text-red-500">{errors.nodal.message}</p>}
        </div>

        <div>
          <label>Role Type</label>
          <select {...register("roleType", { required: "Required" })} className="w-full p-2 border rounded">
            <option value="">Select Role</option>
            {roleTypes.map((r) => (
              <option key={r.id} value={r.roleType}>{r.roleType}</option>
            ))}
          </select>
          {errors.roleType && <p className="text-red-500">{errors.roleType.message}</p>}
        </div>

        <div>
          <label>Instrument</label>
          <input
            {...register("instrument", { required: "Required" })}
            className="w-full p-2 border rounded"
            placeholder="Enter instrument name"
          />
          {errors.instrument && <p className="text-red-500">{errors.instrument.message}</p>}
        </div>

        <div>
          <label>Address</label>
          <input
            {...register("addressLine", { required: "Required" })}
            className="w-full p-2 border rounded"
            placeholder="Enter address"
          />
          {errors.addressLine && <p className="text-red-500">{errors.addressLine.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>City</label>
            <input
              {...register("city", { required: "Required" })}
              className="w-full p-2 border rounded"
              placeholder="City"
            />
            {errors.city && <p className="text-red-500">{errors.city.message}</p>}
          </div>
          <div>
            <label>State</label>
            <input
              {...register("state", { required: "Required" })}
              className="w-full p-2 border rounded"
              placeholder="State"
            />
            {errors.state && <p className="text-red-500">{errors.state.message}</p>}
          </div>
        </div>

        <div>
          <label>PIN Code</label>
          <input
            type="number"
            {...register("pinCode", {
              required: "Required",
              pattern: {
                value: /^\d{6}$/,
                message: "PIN Code must be 6 digits",
              },
            })}
            className="w-full p-2 border rounded"
            placeholder="Enter PIN code"
          />
          {errors.pinCode && <p className="text-red-500">{errors.pinCode.message}</p>}
        </div>

        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            {...register("dob", { required: "Required" })}
            className="w-full p-2 border rounded"
          />
          {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
        </div>

        <div>
          <label>Contact Number</label>
          <input
            type="tel"
            {...register("contactNo", {
              required: "Required",
              pattern: {
                value: /^\d{10}$/,
                message: "Must be 10 digits",
              },
            })}
            className="w-full p-2 border rounded"
            placeholder="Contact No"
          />
          {errors.contactNo && <p className="text-red-500">{errors.contactNo.message}</p>}
        </div>

        <div>
          <label>Gender</label>
          <div className="flex gap-4">
            <label><input type="radio" value="Male" {...register("gender", { required: true })} /> Male</label>
            <label><input type="radio" value="Female" {...register("gender", { required: true })} /> Female</label>
            <label><input type="radio" value="Other" {...register("gender", { required: true })} /> Other</label>
          </div>
          {errors.gender && <p className="text-red-500">Gender is required</p>}
        </div>

        <div>
          <label>Status</label>
          <div className="flex gap-4">
            <label><input type="radio" value="true" {...register("isactive", { required: true })} /> Active</label>
            <label><input type="radio" value="false" {...register("isactive", { required: true })} /> Inactive</label>
          </div>
          {errors.isactive && <p className="text-red-500">Status is required</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          {isSubmitting ? "Submitting..." : "Add Technician"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddTechnician;
