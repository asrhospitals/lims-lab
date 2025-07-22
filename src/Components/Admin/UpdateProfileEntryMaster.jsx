import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";

const UpdateProfileEntryMaster = () => {
  const { profileEntryMasterToUpdate, setProfileEntryMasterToUpdate } = useContext(AdminContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      profileName: "",
      profilecode: "",
      alternativebarcode: "true",
      isactive: "true",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("profileEntryMasterToUpdate");

    const initializeForm = (data) => {
      reset({
        profileName: data.profileName || "",
        profilecode: data.profilecode || "",
        alternativebarcode:
          data.alternativebarcode === true || data.alternativebarcode === "true" || data.alternativebarcode === "Yes"
            ? "true"
            : "false",
        isactive:
          data.isactive === true || data.isactive === "true" || data.isactive === "Active"
            ? "true"
            : "false",
      });
    };

    if (!profileEntryMasterToUpdate && stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfileEntryMasterToUpdate(parsed);
        initializeForm(parsed);
      } catch {
        console.error("Invalid JSON in localStorage for profileEntryMasterToUpdate");
      }
    } else if (profileEntryMasterToUpdate) {
      initializeForm(profileEntryMasterToUpdate);
    }
  }, [profileEntryMasterToUpdate, reset, setProfileEntryMasterToUpdate]);

  const onSubmit = async (data) => {
    if (!profileEntryMasterToUpdate?.id) {
      toast.error("❌ Profile Entry ID not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");

      const payload = {
        profileName: data.profileName,
        profilecode: data.profilecode,
        alternativebarcode: data.alternativebarcode === "true",
        isactive: data.isactive === "true",
      };

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-profileentry/${profileEntryMasterToUpdate.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Profile Entry updated successfully!", { autoClose: 2000 });

      setTimeout(() => {
        setProfileEntryMasterToUpdate(null);
        localStorage.removeItem("profileEntryMasterToUpdate");
        navigate("/view-profile-entry-master");
      }, 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "❌ Failed to update profile entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profileEntryMasterToUpdate) {
    return (
      <div className="text-center py-10 text-gray-500">
        No Profile Entry selected for update.
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li><Link to="/" className="text-gray-700 hover:text-teal-600">🏠︎ Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-profile-entry-master" className="text-gray-700 hover:text-teal-600">Profile Entry</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Profile Entry</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Profile Entry</h4>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Entry Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Entry Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("profileName", { required: "Profile Entry Name is required." })}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.profileName ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                />
                {errors.profileName && <p className="text-red-500 text-xs mt-1">{errors.profileName.message}</p>}
              </div>

              {/* Profile Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Code</label>
                <input
                  type="text"
                  placeholder="Profile Code"
                  {...register("profilecode", { required: "Profile Code is required." })}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.profilecode ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                />
                {errors.profilecode && <p className="text-red-500 text-xs mt-1">{errors.profilecode.message}</p>}
              </div>

              {/* Alternative Barcode */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Is alternative barcode?</label>
                <div className="flex space-x-4 pt-2">
                  {["true", "false"].map((val) => (
                    <label key={val} className="inline-flex items-center">
                      <input
                        type="radio"
                        {...register("alternativebarcode", { required: "Alternative Barcode status is required." })}
                        value={val}
                        className="h-4 w-4 text-teal-600"
                      />
                      <span className="ml-2">{val === "true" ? "Yes" : "No"}</span>
                    </label>
                  ))}
                </div>
                {errors.alternativebarcode && (
                  <p className="text-red-500 text-xs mt-1">{errors.alternativebarcode.message}</p>
                )}
              </div>

              {/* Is Active */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Is Active?</label>
                <div className="flex space-x-4 pt-2">
                  {["true", "false"].map((val) => (
                    <label key={val} className="inline-flex items-center">
                      <input
                        type="radio"
                        {...register("isactive", { required: "Active status is required." })}
                        value={val}
                        className="h-4 w-4 text-teal-600"
                      />
                      <span className="ml-2">{val === "true" ? "Yes" : "No"}</span>
                    </label>
                  ))}
                </div>
                {errors.isactive && (
                  <p className="text-red-500 text-xs mt-1">{errors.isactive.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/view-profile-entry-master")}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Profile Entry"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProfileEntryMaster;
