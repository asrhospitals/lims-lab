import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const profileOptions = [
  { label: "Liver Function Test", value: "lft" },
  { label: "Kidney Function Test", value: "kft" },
];

const investigationOptions = {
  lft: [
    { label: "Bilirubin", value: "bilirubin" },
    { label: "SGPT", value: "sgpt" },
    { label: "SGOT", value: "sgot" },
  ],
  kft: [
    { label: "Urea", value: "urea" },
    { label: "Creatinine", value: "creatinine" },
    { label: "Uric Acid", value: "uric_acid" },
  ],
};

const AddProfileMaster = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedInvestigations, setSelectedInvestigations] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
  } = useForm({ mode: "onBlur" });

  const handleProfileChange = (e) => {
    setSelectedProfile(e.target.value);
    setSelectedInvestigations([]); // reset when profile changes
  };

  const handleInvestigationChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setSelectedInvestigations((prev) =>
      isChecked
        ? [...prev, value]
        : prev.filter((item) => item !== value)
    );
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      profileName: data.profileName,
      profilecode: data.profilecode,
      alternativebarcode: data.alternativebarcode === "true",
      isactive: data.isactive === "true",
      profileEntry: selectedProfile,
      investigations: selectedInvestigations,
    };

    try {
      const authToken = localStorage.getItem("authToken");

      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Profile added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      reset();
      setSelectedProfile("");
      setSelectedInvestigations([]);

      setTimeout(() => {
        navigate("/view-profile-master");
      }, 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to add profile. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
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
              <Link to="/view-profile-master" className="text-gray-700 hover:text-teal-600">Profile Master</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Add Profile</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Profile</h4>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options, validation }, index) => (
                <div key={index} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}{validation?.required && <span className="text-red-500"> *</span>}
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

            {/* Profile Entry Master Dropdown */}
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">
                Profile Entry Master <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedProfile}
                onChange={handleProfileChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              >
                <option value="">-- Select Profile Entry --</option>
                {profileOptions.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Investigation Master Multi-select */}
            {selectedProfile && (
              <div className="space-y-2">
                <label className="block font-medium text-gray-700">
                  Investigation Master <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {investigationOptions[selectedProfile].map((inv) => (
                    <label key={inv.value} className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={inv.value}
                        checked={selectedInvestigations.includes(inv.value)}
                        onChange={handleInvestigationChange}
                        className="text-teal-600"
                      />
                      <span>{inv.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Preview Section */}
            {selectedProfile && selectedInvestigations.length > 0 && (
              <div className="bg-gray-50 p-4 border rounded-md mt-4">
                <h5 className="font-semibold mb-2 text-gray-700">Preview</h5>
                <p><strong>Profile:</strong> {profileOptions.find(p => p.value === selectedProfile)?.label}</p>
                <p><strong>Investigations:</strong> {selectedInvestigations.map(v => (
                  investigationOptions[selectedProfile].find(i => i.value === v)?.label
                )).join(", ")}</p>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSelectedProfile("");
                  setSelectedInvestigations([]);
                }}
                className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600"
              >
                {isSubmitting ? "Saving..." : "Add Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProfileMaster;
