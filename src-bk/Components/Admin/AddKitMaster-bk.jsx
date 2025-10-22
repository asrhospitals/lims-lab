import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const AddKitMaster = () => {
  const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm({ mode: "onChange" });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-profile",
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setProfiles(response.data.data || []);
      } catch (error) {
        setFetchError(error.response?.data?.message || "Failed to fetch Profile.");
      }
    };
    fetchProfile();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Ensure required interpretation fields are always sent
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
      negetiveinterpret: data.negetiveinterpret || "N/A",
      borderlineinterpret: data.borderlineinterpret || "N/A",
      positiveinterpret: data.positiveinterpret || "N/A",
    };

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        "https://asrlabs.asrhospitalindia.in/api/lims/master/kits",
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("Kit added successfully!", { autoClose: 2000 });
      reset();
      setTimeout(() => navigate("/view-kit-master"), 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to add Kit. Please try again.",
        { autoClose: 3000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-sm font-medium px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-kit-master" className="text-gray-700 hover:text-teal-600">
                Kit Master
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Add Kit</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Add Kit</h4>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Profile Name <span className="text-red-500">*</span>
              </label>
              <select
                {...register("profilename", { required: "Profile name is required" })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.profilename ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                } focus:ring-2 transition`}
              >
                <option value="">-- Select Profile --</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.profilename}>
                    {profile.profilename}
                  </option>
                ))}
              </select>
              {errors.profilename && (
                <p className="text-red-500 text-xs mt-1">{errors.profilename.message}</p>
              )}
            </div>

            {/* Other Fields */}
            {[
              { name: "manufacture", label: "Manufacture" },
              { name: "kitname", label: "Kit Name" },
              { name: "negetiveindex", label: "Negative Index" },
              { name: "boderlineindex", label: "Borderline Index" },
              { name: "positiveindex", label: "Positive Index" },
              { name: "method", label: "Method" },
              { name: "batchno", label: "Batch No", type: "number" },
              { name: "units", label: "Units", type: "number" },
              { name: "negetiveinterpret", label: "Negative Interpretation" },
              { name: "borderlineinterpret", label: "Borderline Interpretation" },
              { name: "positiveinterpret", label: "Positive Interpretation" },
            ].map(({ name, label, type = "text" }) => (
              <div key={name} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={type}
                  {...register(name, { required: `${label} is required` })}
                  placeholder={`Enter ${label}`}
                  onBlur={() => trigger(name)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                  } focus:ring-2 transition`}
                />
                {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
              </div>
            ))}
          </div>

          <div className="p-6 flex justify-end">
            <button type="button" onClick={() => reset()} className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Add Kit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddKitMaster;
