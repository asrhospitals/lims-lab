import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AddUserMapping = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hospitalsList, setHospitalsList] = useState([]);
  const [nodalsList, setNodalsList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const createdBy = localStorage.getItem("roleType") || "Unknown";

  const { register, handleSubmit, setValue, reset, formState: { errors }, trigger } = useForm({
    mode: "onBlur",
    defaultValues: { createddate: today, createdby: createdBy },
  });

  // Generic fetch helper
  const fetchData = async (url, setter) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data;
      setter(list || []);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  useEffect(() => {
    // Fetch Hospitals
    fetchData("https://asrlabs.asrhospitalindia.in/lims/master/get-all-hospital", (data) =>
      setHospitalsList(data.map((h) => ({ value: h.id, label: h.hospitalname || "Unknown Hospital" })))
    );
    // Fetch Nodals
    fetchData("https://asrlabs.asrhospitalindia.in/lims/master/get-all-nodals", (data) =>
      setNodalsList(data.map((n) => ({ value: n.id, label: n.nodalname || "Unknown Nodal" })))
    );
    // Fetch Roles
    fetchData("https://asrlabs.asrhospitalindia.in/lims/master/get-all-roles", (data) =>
      setRolesList(data.map((r) => ({ value: r.id, label: r.roletype || "Unknown Role" })))
    );
  }, []);

  // Search users by first name
  const fetchUsers = async (label) => {
    if (!label) return;
    const firstName = label.split(" ")[0];
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `https://asrlabs.asrhospitalindia.in/lims/authentication/search-users?first_name=${firstName}`,
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setUserOptions(
          data.map((u) => ({ value: u.user_id, label: u.first_name, module: u.module }))
        );
        setSelectedModule(data[0]?.module?.[0] || "");
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (!value) {
      setUserOptions([]);
      return;
    }
    fetchUsers(value);
  };

  // Form submit
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        user_id: data.searchuser,
        hospital_id: Number(data.hospitalselected),
        nodal_id: Number(data.nodalselected),
        role: Number(data.selectedroll),
        doctor_id: data.selectedmodule === "Doctor" ? 1 : null,
        technician_id: data.selectedmodule === "Technician" ? 1 : null,
        reception_id: data.selectedmodule === "Reception" ? 1 : null,
        phlebotomist_id: data.selectedmodule === "Phlebotomist" ? 1 : null,
      };

      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/authentication/assign-role",
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("User mapping added successfully!");
        reset();
        setSearchText("");
        setSelectedModule("");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err?.response?.data?.message || "Failed to add user mapping");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li><Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">🏠 Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-user-list" className="text-gray-700 hover:text-teal-600">User Details</Link></li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">Add User Mapping</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-2 sm:px-4">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-xl border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-teal-600 text-white">
            <h4 className="font-semibold">Add User Mapping</h4>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Search User */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Search User <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register("searchuser", { required: "Name is required" })}
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Enter User Name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
              />
              {userOptions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {userOptions.map((user) => (
                    <li
                      key={user.value}
                      className="px-4 py-2 hover:bg-teal-100 cursor-pointer"
                      onClick={() => {
                        setValue("searchuser", user.value);
                        setSearchText(user.label);
                        setSelectedModule(Array.isArray(user.module) ? user.module.join(", ") : "");
                        setValue("selectedmodule", Array.isArray(user.module) ? user.module.join(", ") : "");
                        setUserOptions([]);
                      }}
                    >
                      {user.label}
                    </li>
                  ))}
                </ul>
              )}
              {errors.searchuser && <p className="text-red-500 text-xs mt-1">{errors.searchuser.message}</p>}
            </div>

            {/* Hospital */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Hospital <span className="text-red-500">*</span></label>
              <select {...register("hospitalselected", { required: "Hospital is required" })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500">
                <option value="">Select Hospital</option>
                {hospitalsList.map((h) => (<option key={h.value} value={h.value}>{h.label}</option>))}
              </select>
              {errors.hospitalselected && <p className="text-red-500 text-xs mt-1">{errors.hospitalselected.message}</p>}
            </div>

            {/* Nodal */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Nodal <span className="text-red-500">*</span></label>
              <select {...register("nodalselected", { required: "Nodal is required" })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500">
                <option value="">Select Nodal</option>
                {nodalsList.map((n) => (<option key={n.value} value={n.value}>{n.label}</option>))}
              </select>
              {errors.nodalselected && <p className="text-red-500 text-xs mt-1">{errors.nodalselected.message}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Role <span className="text-red-500">*</span></label>
              <select {...register("selectedroll", { required: "Role is required" })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500">
                <option value="">Select Role</option>
                {rolesList.map((r) => (<option key={r.value} value={r.value}>{r.label}</option>))}
              </select>
              {errors.selectedroll && <p className="text-red-500 text-xs mt-1">{errors.selectedroll.message}</p>}
            </div>

            {/* Module */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Module</label>
              <input
                type="text"
                {...register("selectedmodule")}
                value={selectedModule}
                readOnly
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 bg-gray-100"
              />
            </div>

            {/* Created By */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Created By</label>
              <input
                type="text"
                {...register("createdby")}
                value={createdBy}
                readOnly
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 bg-gray-100"
              />
            </div>

            {/* Created Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Created Date</label>
              <input
                type="date"
                {...register("createddate")}
                value={today}
                readOnly
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 bg-gray-100"
              />
            </div>

            {/* Is Active */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Is Active? <span className="text-red-500">*</span></label>
              <div className="flex space-x-4 pt-2">
                <label className="inline-flex items-center">
                  <input type="radio" {...register("isactive", { required: "Status is required." })} value="true" className="h-4 w-4 text-teal-600" />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" {...register("isactive", { required: "Status is required." })} value="false" className="h-4 w-4 text-teal-600" />
                  <span className="ml-2">No</span>
                </label>
              </div>
              {errors.isactive && <p className="text-red-500 text-xs mt-1">{errors.isactive.message}</p>}
            </div>

          </div>

          <div className="mt-6 flex justify-end px-6 py-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Add User Mapping"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUserMapping;
