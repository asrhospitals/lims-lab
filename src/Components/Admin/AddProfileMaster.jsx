import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const profileOptions = [
  { label: "Liver Function Test", value: "lft", code: "LFT01" },
  { label: "Kidney Function Test", value: "kft", code: "KFT02" },
  { label: "Thyroid Profile", value: "thyroid", code: "THY03" },
  { label: "Lipid Profile", value: "lipid", code: "LIP04" },
];

const investigationOptions = {
  lft: [
    { label: "Bilirubin", value: "bilirubin" },
    { label: "SGPT", value: "sgpt" },
    { label: "SGOT", value: "sgot" },
    { label: "ALP", value: "alp" },
  ],
  kft: [
    { label: "Urea", value: "urea" },
    { label: "Creatinine", value: "creatinine" },
    { label: "Uric Acid", value: "uric_acid" },
    { label: "Sodium", value: "sodium" },
  ],
  thyroid: [
    { label: "TSH", value: "tsh" },
    { label: "T3", value: "t3" },
    { label: "T4", value: "t4" },
  ],
  lipid: [
    { label: "Total Cholesterol", value: "total_cholesterol" },
    { label: "HDL", value: "hdl" },
    { label: "LDL", value: "ldl" },
    { label: "Triglycerides", value: "triglycerides" },
  ],
};

const AddProfileMaster = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState("");
  const [profileCode, setProfileCode] = useState("");
  const [selectedInvestigations, setSelectedInvestigations] = useState([]);
  const [printOrders, setPrintOrders] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
  } = useForm({ mode: "onBlur" });

  const handleProfileChange = (e) => {
    const selected = e.target.value;
    const profile = profileOptions.find((p) => p.value === selected);
    setSelectedProfile(selected);
    setProfileCode(profile?.code || "");
    setSelectedInvestigations([]);
    setPrintOrders({});
  };

  const toggleInvestigation = (value) => {
    setSelectedInvestigations((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleOrderChange = (value, order) => {
    setPrintOrders((prev) => ({ ...prev, [value]: order }));
  };

  const onSubmit = async () => {
    if (!selectedProfile) {
      toast.error("Please select a profile");
      return;
    }
    if (selectedInvestigations.length === 0) {
      toast.error("Please select at least one investigation");
      return;
    }
    setIsSubmitting(true);

    const payload = {
      profileName: selectedProfile,
      profilecode: profileCode,
      profileEntry: selectedProfile,
      investigations: selectedInvestigations.map((inv) => ({
        name: inv,
        printOrder: parseInt(printOrders[inv] || 0),
      })),
    };

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        "http://srv913743.hstgr.cloud:2000/lims/master/add-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("✅ Profile added successfully!");
      reset();
      setSelectedProfile("");
      setProfileCode("");
      setSelectedInvestigations([]);
      setPrintOrders({});
      setTimeout(() => navigate("/view-profile-master"), 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to add profile."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>

      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors"
              >
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
            <li aria-current="page" className="text-gray-500">
              Add Profile Entry
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />      

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200" >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add New Profile Master</h4>
          </div>

          <div className="p-6">

            {/* Profile Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Profile <span className="text-red-500">*</span>
              </label>
              <select
                {...register("profileName", { required: "Profile is required" })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.profileName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-teal-500"
                } focus:ring-2 transition`}
                value={selectedProfile}
                onChange={(e) => {
                  handleProfileChange(e);
                  trigger("profileName");
                }}
              >
                <option value="">-- Select Profile --</option>
                {profileOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.profileName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.profileName.message}
                </p>
              )}
            </div>

            {/* Profile Code */}
            {profileCode && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Code
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full px-4 py-2 border bg-gray-100 rounded-lg"
                  value={profileCode}
                />
              </div>
            )}

            {/* Investigations */}
            {selectedProfile && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Investigations <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {investigationOptions[selectedProfile].map((inv) => {
                    const checked = selectedInvestigations.includes(inv.value);
                    return (
                      <div
                        key={inv.value}
                        className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer select-none
                        ${
                          checked
                            ? "bg-teal-50 border-teal-400"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => toggleInvestigation(inv.value)}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleInvestigation(inv.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-5 w-5 text-teal-600"
                        />
                        <label className="flex-1 cursor-pointer select-none text-gray-700 font-medium">
                          {inv.label}
                        </label>
                        <input
                          type="number"
                          min={1}
                          placeholder="Order"
                          className="w-20 px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          value={printOrders[inv.value] || ""}
                          onChange={(e) =>
                            handleOrderChange(inv.value, e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSelectedProfile("");
                  setProfileCode("");
                  setSelectedInvestigations([]);
                  setPrintOrders({});
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg text-white shadow-md transition
                  ${
                    isSubmitting
                      ? "bg-teal-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600"
                  }
                  focus:outline-none focus:ring-2 focus:ring-teal-500
                  transform hover:scale-105 duration-300 ease-in-out
                `}
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
