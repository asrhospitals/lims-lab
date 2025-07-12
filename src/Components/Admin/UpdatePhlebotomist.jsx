import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";

const UpdatePhlebotomist = () => {
  const { phlebotomistToUpdate, setPhlebotomistToUpdate } = useContext(AdminContext);
const [isSubmitting, setIsSubmitting] = useState(false);
const [nodalCenters, setNodalCenters] = useState([]);
const [hospital, setHospital] = useState([]);

const navigate = useNavigate();

const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm({
  mode: "onBlur",
  defaultValues: {
    phleboName: "",
    nodal: "",
    hospital: "",
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
    dob: "",
    gender: "",
    contactNo: "",
    isActive: "true",
  },
});

useEffect(() => {
  const stored = localStorage.getItem("phlebotomistToUpdate");

  if (!phlebotomistToUpdate && stored) {
    try {
      const parsed = JSON.parse(stored);
      setPhlebotomistToUpdate(parsed);
    } catch {
      console.error("Invalid phlebotomistToUpdate in localStorage");
    }
  } else if (phlebotomistToUpdate) {
    reset({
      phleboName: phlebotomistToUpdate.phleboName || "",
      nodal: phlebotomistToUpdate.nodal || "",
      hospital: phlebotomistToUpdate.hospital || "",
      addressLine: phlebotomistToUpdate.addressLine || "",
      city: phlebotomistToUpdate.city || "",
      state: phlebotomistToUpdate.state || "",
      pinCode: phlebotomistToUpdate.pinCode || "",
      dob: phlebotomistToUpdate.dob || "",
      gender: phlebotomistToUpdate.gender || "",
      contactNo: phlebotomistToUpdate.contactNo || "",
      isActive: String(phlebotomistToUpdate.isActive ?? "true"),
    });
  }
}, [phlebotomistToUpdate, reset, setPhlebotomistToUpdate]);

useEffect(() => {
  const authToken = localStorage.getItem("authToken");

  const fetchData = async () => {
    try {
      const [nodalRes, hospitalRes] = await Promise.all([
        axios.get("https://asrlab-production.up.railway.app/lims/master/get-nodal", {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        axios.get("https://asrlab-production.up.railway.app/lims/master/get-hospital", {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ]);

      setNodalCenters(nodalRes.data || []);
      setHospital(hospitalRes.data.filter((h) => h.isactive));
    } catch (error) {
      toast.error("❌ Failed to fetch master data.");
    }
  };

  fetchData();
}, []);

const onSubmit = async (data) => {
  if (!phlebotomistToUpdate?.id) {
    toast.error("❌ Phlebotomist ID not found.");
    return;
  }

  setIsSubmitting(true);
  try {
    const authToken = localStorage.getItem("authToken");

    const payload = {
      phleboName: data.phleboName,
      addressLine: data.addressLine,
      city: data.city,
      state: data.state,
      pinCode: Number(data.pinCode),
      dob: data.dob,
      contactNo: data.contactNo,
      gender: data.gender,
      nodal: data.nodal,
      hospital: data.hospital,
      isActive: data.isActive === "true",
    };

    await axios.put(
      `https://asrlab-production.up.railway.app/lims/master/update-phlebo/${phlebotomistToUpdate.id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Phlebotomist updated successfully!", { autoClose: 2000 });

    setTimeout(() => {
      setPhlebotomistToUpdate(null);
      localStorage.removeItem("phlebotomistToUpdate");
      navigate("/view-phlebotomist");
    }, 2000);
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "❌ Failed to update phlebotomist. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

if (!phlebotomistToUpdate) {
  return (
    <div className="text-center py-10 text-gray-500">
      No phlebotomist selected for update.
    </div>
  );
}


  return (
  <>
    {/* Breadcrumb Navigation */}
    <div className="fixed top-[61px] w-full z-10">
      <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
        <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
          <li>
            <Link to="/" className="text-gray-700 hover:text-teal-600">🏠︎ Home</Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link to="/view-phlebotomist" className="text-gray-700 hover:text-teal-600">Phlebotomist</Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-500">Update Phlebotomist</li>
        </ol>
      </nav>
    </div>

    {/* Main Form */}
    <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
          <h4 className="text-white font-semibold">Update Phlebotomist</h4>
        </div>

        {/* Form Fields */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Phlebotomist Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phlebotomist Name</label>
              <input
                type="text"
                placeholder="Full Name"
                defaultValue={phlebotomistToUpdate?.phleboName}
                {...register("phleboName", { required: "Phlebotomist Name is required." })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.phleboName ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
              />
              {errors.phleboName && <p className="text-red-500 text-xs mt-1">{errors.phleboName.message}</p>}
            </div>

            {/* Nodal Center */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nodal Center</label>
              <select
                defaultValue={phlebotomistToUpdate?.nodal}
                {...register("nodal", { required: "Nodal Center is required." })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.nodal ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
              >
                <option value="">Select Nodal Center</option>
                {nodalCenters.map(n => (
                  <option key={n.nodalname} value={n.nodalname} selected={phlebotomistToUpdate.nodal === n.nodalname ? true : false}  >{n.nodalname}</option>
                ))}
              </select>
              {errors.nodal && <p className="text-red-500 text-xs mt-1">{errors.nodal.message}</p>}
            </div>

            {/* Hospital */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Hospital Type</label>
              <select
                defaultValue={phlebotomistToUpdate?.hospital}
                {...register("hospital", { required: "Role Type is required." })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.hospital ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
              >
                <option value="">Select Hospital</option>
                {hospital.map(h => (
                  <option key={h.hospital_name} value={h.hospital_name} selected={phlebotomistToUpdate.hospital === h.hospital_name ? true : false}  >{h.hospital_name}</option>
                ))}
              </select>
              {errors.hospital_name && <p className="text-red-500 text-xs mt-1">{errors.hospital_name.message}</p>}
            </div>

            {/* Address Line */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                placeholder="Address Line"
                defaultValue={phlebotomistToUpdate?.addressLine}
                {...register("addressLine", { required: "Address is required." })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.addressLine ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
              />
              {errors.addressLine && <p className="text-red-500 text-xs mt-1">{errors.addressLine.message}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                placeholder="City"
                defaultValue={phlebotomistToUpdate?.city}
                {...register("city", { required: "City is required." })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.city ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                placeholder="State"
                defaultValue={phlebotomistToUpdate?.state}
                {...register("state", { required: "State is required." })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.state ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>

            {/* Pin Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Pin Code</label>
              <input
                type="number"
                placeholder="PIN"
                defaultValue={phlebotomistToUpdate?.pinCode}
                {...register("pinCode", { required: "Pin Code is required." })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.pinCode ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
              />
              {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode.message}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="text"
                defaultValue={phlebotomistToUpdate?.dob}
                {...register("dob", { required: "Date of Birth is required." })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.dob ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
            </div>

            {/* Contact No. */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact No.</label>
              <input
                type="tel"
                placeholder="Phone"
                defaultValue={phlebotomistToUpdate?.contactNo}
                {...register("contactNo", { required: "Contact No. is required." })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.contactNo ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
              />
              {errors.contactNo && <p className="text-red-500 text-xs mt-1">{errors.contactNo.message}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <div className="flex space-x-4 pt-2">
                {["Male", "Female", "Other"].map(gender => (
                  <label key={gender} className="inline-flex items-center">
                    <input
                      type="radio"
                      value={gender}
                      {...register("gender", { required: "Gender is required." })}
                      defaultChecked={phlebotomistToUpdate?.gender === gender}
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">{gender}</span>
                  </label>
                ))}
              </div>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            {/* Is Active */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Is Active?</label>
              <div className="flex space-x-4 pt-2">
                {[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" }
                ].map(opt => (
                  <label key={opt.value} className="inline-flex items-center">
                    <input
                      type="radio"
                      value={opt.value}
                      {...register("isActive", { required: "Status is required." })}
                      defaultChecked={phlebotomistToUpdate?.isActive === opt.value}
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">{opt.label}</span>
                  </label>
                ))}
              </div>
              {errors.isActive && <p className="text-red-500 text-xs mt-1">{errors.isActive.message}</p>}
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/view-phlebotomist")}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Update Phlebotomist"}
          </button>
        </div>
      </form>
    </div>
  </>
);

};

export default UpdatePhlebotomist;
