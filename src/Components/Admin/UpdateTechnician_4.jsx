import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";

const UpdateTechnician = () => {
  const { technicianToUpdate, setTechnicianToUpdate } = useContext(AdminContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nodalCenters, setNodalCenters] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      technicianName: "",
      nodal: "",
      roleType: "",
      instrument: "",
      addressLine: "",
      city: "",
      state: "",
      pinCode: "",
      dob: "",
      gender: "",
      contactNo: "",
      isactive: "true",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("technicianToUpdate");

    if (!technicianToUpdate && stored) {
      try {
        const parsed = JSON.parse(stored);
        setTechnicianToUpdate(parsed);
      } catch {
        console.error("Invalid technicianToUpdate in localStorage");
      }
    } else if (technicianToUpdate) {
      reset({
        technicianName: technicianToUpdate.technicianName || "",
        nodal: technicianToUpdate.nodal || "",
        roleType: technicianToUpdate.roleType || "",
        instrument: technicianToUpdate.instrument || "",
        addressLine: technicianToUpdate.addressLine || "",
        city: technicianToUpdate.city || "",
        state: technicianToUpdate.state || "",
        pinCode: technicianToUpdate.pinCode || "",
        dob: technicianToUpdate.dob || "",
        gender: technicianToUpdate.gender || "",
        contactNo: technicianToUpdate.contactNo || "",
        isactive: String(technicianToUpdate.isactive ?? "true"),
      });
    }
  }, [technicianToUpdate, reset, setTechnicianToUpdate]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    const fetchData = async () => {
      try {
        const [nodalRes, roleRes, instrRes] = await Promise.all([
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-nodal", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-role", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-instrument", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        setNodalCenters(nodalRes.data || []);
        setRoleTypes(roleRes.data.filter((r) => r.isactive));
        setInstruments(instrRes.data.filter((i) => i.isactive));
      } catch (error) {
        toast.error("❌ Failed to fetch master data.");
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    if (!technicianToUpdate?.id) {
      toast.error("❌ Technician ID not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const payload = {
        ...data,
        isactive: data.isactive === "true",
        pinCode: Number(data.pinCode),
      };

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-tech/${technicianToUpdate.id}`,
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("✅ Technician updated successfully!");
      setTechnicianToUpdate(null);
      localStorage.removeItem("technicianToUpdate");
      navigate("/view-technician");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to update technician. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { name: "technicianName", label: "Technician Name", placeholder: "Full Name" },
    {
      name: "nodal",
      label: "Nodal Center",
      type: "select",
      options: nodalCenters.map((n) => ({ value: n.nodalname, label: n.nodalname })),
    },
    {
      name: "roleType",
      label: "Role Type",
      type: "select",
      options: roleTypes.map((r) => ({ value: r.roleType, label: r.roleDescription })),
    },
    {
      name: "instrument",
      label: "Instrument",
      type: "select",
      options: instruments.map((i) => ({ value: i.instrumentname, label: i.instrumentname })),
    },
    { name: "addressLine", label: "Address", placeholder: "Address Line" },
    { name: "city", label: "City", placeholder: "City" },
    { name: "state", label: "State", placeholder: "State" },
    { name: "pinCode", label: "Pin Code", type: "number", placeholder: "PIN" },
    { name: "dob", label: "Date of Birth", type: "date" },
    { name: "contactNo", label: "Contact No.", type: "tel", placeholder: "Phone" },
    {
      name: "gender",
      label: "Gender",
      type: "radio",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
      ],
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
    },
  ];

  if (!technicianToUpdate) {
    return <div className="text-center py-10 text-gray-500">No technician selected for update.</div>;
  }

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li><Link to="/" className="text-gray-700 hover:text-teal-600">🏠︎ Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-technician" className="text-gray-700 hover:text-teal-600">Technician</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Technician</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Technician</h4>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options = [] }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  {type === "select" ? (
                    <select
                      {...register(name, { required: `${label} is required.` })}
                      className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    >
                      <option value="">Select {label}</option>
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : type === "radio" ? (
                    <div className="flex space-x-4 pt-2">
                      {options.map((option) => (
                        <label key={option.value} className="inline-flex items-center">
                          <input
                            type="radio"
                            {...register(name, { required: true })}
                            value={option.value}
                            defaultChecked={technicianToUpdate[name] === option.value}
                            className="h-4 w-4 text-teal-600"
                          />
                          <span className="ml-2">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      {...register(name, { required: `${label} is required.` })}
                      className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    />
                  )}
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/view-technician")}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Technician"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateTechnician;
