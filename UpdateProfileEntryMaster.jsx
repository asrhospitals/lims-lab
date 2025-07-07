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
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      profileName: "",
      profilecode: "",
      alternativebarcode: true,
      isactive: true,
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("profileEntryMasterToUpdate");

    const initializeForm = (data) => {
      reset({
        profileName: data.profileName || "",
        profilecode: data.profilecode || "",
        alternativebarcode: data.alternativebarcode ? "true" : "false",
        isactive: data.isactive ? "true" : "false",
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

    const payload = {
      profileName: data.profileName,
      profilecode: data.profilecode,
      alternativebarcode: data.alternativebarcode === "true",
      isactive: data.isactive === "true",
    };

    try {
      const authToken = localStorage.getItem("authToken");

      await axios.put(
        `https://asrlab-production.up.railway.app/lims/master/update-profileentry/${profileEntryMasterToUpdate.id}`,
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

  const fields = [
    {
      name: "profileName",
      label: "Profile Name",
      placeholder: "Enter Profile Name",
      validation: { required: "Profile name is required" },
    },
    {
      name: "profilecode",
      label: "Profile Code",
      placeholder: "Enter Profile Code",
      validation: { required: "Profile code is required" },
    },
    {
      name: "alternativebarcode",
      label: "Alternative Barcode",
      type: "radio",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      validation: { required: "Please choose an option" },
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      validation: { required: "Please choose an option" },
    },
  ];

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
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600 transition-colors">
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-profile-entry-master"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Profile Entry Master
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Profile Entry</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Update Profile Entry</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options, validation }, index) => (
                <div key={index} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {validation?.required && (
                      <span className="text-red-500"> *</span>
                    )}
                  </label>

                  {type === "radio" ? (
                    <div className="flex space-x-4 pt-2">
                      {options.map((opt) => (
                        <label key={opt.value} className="inline-flex items-center">
                          <input
                            type="radio"
                            {...register(name, validation)}
                            value={opt.value}
                            className="h-4 w-4 text-teal-600"
                          />
                          <span className="ml-2">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={type}
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      placeholder={placeholder}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:ring-2 transition`}
                    />
                  )}

                  {errors[name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[name].message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => reset()}
                className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-70"
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProfileEntryMaster;
