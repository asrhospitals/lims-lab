import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";

const UpdateKitMaster = () => {
  const { kitMasterToUpdate, setKitMasterToUpdate } = useContext(AdminContext);
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // this should be kit_id

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  // Fetch all kits and find the kit by id (kit_id)
  useEffect(() => {
    const fetchKitById = async () => {
      if (!kitMasterToUpdate && id) {
        try {
          const authToken = localStorage.getItem("authToken");
          const response = await axios.get(
            "https://asrlabs.asrhospitalindia.in/lims/master/get-kit",
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          const kit = response.data.data.find((k) => k.kit_id === Number(id));
          if (kit) setKitMasterToUpdate(kit);
          else toast.error("Kit not found", { position: "top-right" });
        } catch (err) {
          toast.error("Failed to load kit data", { position: "top-right" });
        }
      }
    };
    fetchKitById();
  }, [id, kitMasterToUpdate, setKitMasterToUpdate]);

  // Fetch profiles for dropdown
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-profile",
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setProfiles(response.data.data || []);
      } catch (error) {
        toast.error("Failed to load profiles", { position: "top-right" });
      } finally {
        setLoadingProfiles(false);
      }
    };
    fetchProfiles();
  }, []);

  // Prefill form values once kit data and profiles are loaded
  useEffect(() => {
    if (kitMasterToUpdate && profiles.length > 0) {
      setValue("profilename", kitMasterToUpdate.profilename || profiles[0].profilename);
      setValue("manufacture", kitMasterToUpdate.manufacture || "");
      setValue("kitname", kitMasterToUpdate.kitname || "");
      setValue("negetiveindex", kitMasterToUpdate.negetiveindex || "");
      setValue("boderlineindex", kitMasterToUpdate.boderlineindex || "");
      setValue("positiveindex", kitMasterToUpdate.positiveindex || "");
      setValue("method", kitMasterToUpdate.method || "");
      setValue("batchno", kitMasterToUpdate.batchno || "");
      setValue("units", kitMasterToUpdate.units || "");
      setValue("negetiveinterpret", kitMasterToUpdate.negetiveinterpret || "");
      setValue("borderlineinterpret", kitMasterToUpdate.borderlineinterpret || "");
      setValue("positiveinterpret", kitMasterToUpdate.positiveinterpret || "");
    }
  }, [kitMasterToUpdate, profiles, setValue]);

  // Form submit handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      profilename: data.profilename,
      manufacture: data.manufacture,
      kitname: data.kitname,
      negetiveindex: data.negetiveindex,
      boderlineindex: data.boderlineindex,
      positiveindex: data.positiveindex,
      method: data.method,
      batchno: Number(data.batchno),
      units: Number(data.units),
      negetiveinterpret: data.negetiveinterpret,
      borderlineinterpret: data.borderlineinterpret,
      positiveinterpret: data.positiveinterpret,
    };

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-kit/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("Kit updated successfully!", { position: "top-right", autoClose: 2000 });
      reset();
      setKitMasterToUpdate(null);
      setTimeout(() => navigate("/view-kit-master"), 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "❌ Failed to update kit.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form fields configuration
  const fields = [
    { name: "manufacture", label: "Manufacture", placeholder: "Enter Manufacture", validation: { required: "Manufacture is required", pattern: { value: /^[A-Za-z0-9\s]+$/, message: "Only letters, numbers, and spaces are allowed" } } },
    { name: "kitname", label: "Kit Name", placeholder: "Enter Kit Name", validation: { required: "Kit name is required", pattern: { value: /^[A-Za-z0-9\s]+$/, message: "Only letters, numbers, and spaces are allowed" } } },
    { name: "negetiveindex", label: "Negative Index", placeholder: "e.g. <=1", validation: { required: "Negative index is required" } },
    { name: "boderlineindex", label: "Borderline Index", placeholder: "e.g. =>2", validation: { required: "Borderline index is required" } },
    { name: "positiveindex", label: "Positive Index", placeholder: "e.g. 1", validation: { required: "Positive index is required" } },
    { name: "method", label: "Method", placeholder: "Enter Method (e.g. ELISA)", validation: { required: "Method is required" } },
    { name: "batchno", label: "Batch No", placeholder: "Enter Batch Number", type: "number", validation: { required: "Batch number is required" } },
    { name: "units", label: "Units", placeholder: "Enter Units", type: "number", validation: { required: "Units are required" } },
    { name: "negetiveinterpret", label: "Negative Interpretation", placeholder: "e.g. -09", validation: { required: "Negative interpretation is required" } },
    { name: "borderlineinterpret", label: "Borderline Interpretation", placeholder: "e.g. +09", validation: { required: "Borderline interpretation is required" } },
    { name: "positiveinterpret", label: "Positive Interpretation", placeholder: "e.g. 85", validation: { required: "Positive interpretation is required" } },
  ];

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">🏠 Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-kit-master" className="text-gray-700 hover:text-teal-600">Kit Master</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Kit</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Kit</h4>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Profile Name <span className="text-red-500">*</span>
              </label>
              <select
                {...register("profilename", { required: "Profile name is required" })}
                onBlur={() => trigger("profilename")}
                disabled={loadingProfiles}
                className={`w-full px-4 py-2 rounded-lg border ${errors.profilename ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`}
              >
                <option value="">-- Select Profile --</option>
                {profiles.map((option) => (
                  <option key={option.id} value={option.profilename}>
                    {option.profilename}
                  </option>
                ))}
              </select>
              {errors.profilename && <p className="text-red-500 text-xs mt-1">{errors.profilename.message}</p>}
            </div>

            {/* Other fields */}
            {fields.map(({ name, label, placeholder, type = "text", validation }, index) => (
              <div key={index} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">{label} <span className="text-red-500">*</span></label>
                <input
                  type={type}
                  {...register(name, validation)}
                  placeholder={placeholder}
                  onBlur={() => trigger(name)}
                  className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`}
                />
                {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
              </div>
            ))}
          </div>

          <div className="p-6 flex justify-end">
            <button type="button" onClick={() => reset()} disabled={isSubmitting} className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Reset
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-70">
              {isSubmitting ? "Updating..." : "Update Kit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateKitMaster;
