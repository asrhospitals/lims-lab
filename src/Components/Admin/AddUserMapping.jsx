import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AddUserMapping = () => {
  const [fetchError, setFetchError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [hospitalsList, setHospitalsList] = useState([]);
  const [nodalsList, setNodalsList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [selectedModule, setSelectedModule] = useState([]);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const { register, handleSubmit, reset, trigger, setValue } = useForm({
    mode: "onBlur",
    defaultValues: { createddate: today, isactive: "true" },
  });

  const fetchData = async (url, setter) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setter(data?.data || data || []);
    } catch {
      setFetchError("Failed to load dropdown data.");
    }
  };

  useEffect(() => {
    fetchData("https://asrlabs.asrhospitalindia.in/lims/master/get-hospital?page=1&limit=1000", (data) =>
      setHospitalsList((data || []).map((h) => ({ value: h.id, label: h.hospitalname || "-" })))
    );
    fetchData("https://asrlabs.asrhospitalindia.in/lims/master/get-nodal?page=1&limit=1000", (data) =>
      setNodalsList((data || []).map((n) => ({ value: n.id, label: n.nodalname || "Unknown Nodal" })))
    );
    fetchData("https://asrlabs.asrhospitalindia.in/lims/master/get-role", (data) =>
      setRolesList((data || []).map((r) => ({ value: r.id, label: r.roletype || "-" })))
    );
  }, []);

  const fetchUsers = async (label) => {
    if (!label) return;
    const firstName = label.split(" ")[0];
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `https://asrlabs.asrhospitalindia.in/lims/authentication/search-users?first_name=${firstName}`,
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      const users = Array.isArray(data) ? data : [];
      const options = users.map((u) => ({
        value: u.user_id,
        label: u.username,
        module: Array.isArray(u.module) ? u.module : u.module ? [u.module] : [],
      }));
      setUserOptions(options);
    } catch { }
  };

  const onSubmit = async (data) => {
    if (!selectedUser) {
      toast.error("Please select a valid user from the list.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        user_id: Number(selectedUser.value),
        hospitalid: data.hospitalselected ? Number(data.hospitalselected) : null,
        nodalid: Number(data.nodalselected),
        role: Number(data.selectedroll),
  module: Array.isArray(data.selectedModule)
    ? data.selectedModule
    : [data.selectedModule || selectedModule],
            doctor_id: null,
        technician_id: null,
        reception_id: null,
        phlebotomist_id: null,
        created_by: data.createdby || createdBy,
        created_date: data.createddate || today,
        is_active: data.isactive === "true",
      };

      const authToken = localStorage.getItem("authToken");




      console.log("payloads ===", payload);

      const res = await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/authentication/assign-role",
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("✅ User mapping added successfully!");
        reset();
        setSearchText("");
        setSelectedUser(null);
        setSelectedModule([]);
        setTimeout(() => navigate("/view-user-mapping?page=last", { state: { refresh: true } }), 800);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("⚠️ This user mapping already exists.");
      } else {
        toast.error(error?.response?.data?.message || "❌ Failed to add user mapping.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const createdBy = localStorage.getItem("roleType");

  const fields = [
    { name: "searchuser", label: "Search User", placeholder: "Enter User Name", validation: { required: true } },
    { name: "hospitalselected", label: "Select Hospital", type: "select", options: hospitalsList, validation: { required: true } },
    { name: "nodalselected", label: "Select Nodal", type: "select", options: nodalsList, validation: { required: true } },
    { name: "selectedroll", label: "Select Role", type: "select", options: rolesList, validation: { required: true } },
    // { name: "selectedmodule", label: "Select Module", type: "text", placeholder: selectedModule.join(", ") },
    { name: "selectedModule", label: "Module", type: "select", options: [{ value: "user", label: "User" }, { value: "phlebotomist", label: "Phlebotomist" }, { value: "reception", label: "Reception" }, { value: "biochemistry", label: "Biochemistry" }, { value: "microbiology", label: "Microbiology" }, { value: "pathology", label: "Pathology" }], validation: { required: "Module is required" } },
    { name: "createdby", label: "Created By", type: "text", placeholder: createdBy },
    { name: "createddate", label: "Created Date", type: "date", max: today, disabled: true, defaultValue: today },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "true", label: "Yes", defaultChecked: true },
        { value: "false", label: "No" },
      ],
    },
  ];

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-user-mapping" className="text-gray-700 hover:text-teal-600">
                User Mapping Details
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Add User Mapping
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        {fetchError && <p className="text-red-500 text-sm mb-4">{fetchError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add User Mapping</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options, validation, max }) => (
                <div key={name} className="space-y-1 relative">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>

                  {name === "searchuser" ? (
                    <>
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSearchText(val);
                          setValue("searchuser", "");
                          setSelectedUser(null);
                          setSelectedModule([]);
                          if (!val) setUserOptions([]);
                          else fetchUsers(val);
                        }}
                        placeholder={placeholder}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 transition"
                        autoComplete="off"
                      />
                      {userOptions.length > 0 && (
                        <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-auto shadow-lg">
                          {userOptions.map((user) => (
                            <li
                              key={user.value}
                              onClick={() => {
                                setSearchText(user.label);
                                setValue("searchuser", user.value);
                                setSelectedUser(user);
                                setUserOptions([]);
                                setSelectedModule(user.module || []);
                              }}
                              className="px-4 py-2 cursor-pointer hover:bg-teal-100"
                            >
                              {user.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : type === "select" ? (
                    <select {...register(name, validation)} onBlur={() => trigger(name)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 transition">
                      <option value="">Select {label}</option>
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : type === "radio" ? (
                    <div className="flex space-x-4 pt-2">
                      {options.map((opt) => (
                        <label key={opt.value} className="inline-flex items-center">
                          <input type="radio" {...register(name, validation)} value={opt.value} defaultChecked={opt.defaultChecked} className="h-4 w-4 text-teal-600" />
                          <span className="ml-2">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={type}
                      {...register(name, validation)}
                      placeholder={placeholder}
                      max={max}
                      disabled={fields.find((f) => f.name === name)?.disabled}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 transition"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSearchText("");
                  setSelectedUser(null);
                  setSelectedModule([]);
                }}
                className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Add User Mapping"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUserMapping;
