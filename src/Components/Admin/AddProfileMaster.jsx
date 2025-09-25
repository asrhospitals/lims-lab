import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const profileOptions = [
  { id: 1, label: "Liver Function Test", value: "lft" },
  { id: 2, label: "Kidney Function Test", value: "kft" },
  { id: 3, label: "Thyroid Profile", value: "thyroid" },
  { id: 4, label: "Lipid Profile", value: "lipid" },
];

// Map profile value to test category (as per your API)
const profileToCategory = {
  lft: "Laboratory",
  kft: "Laboratory",
  thyroid: "Laboratory",
  lipid: "Laboratory",
};

const AddProfileMaster = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState("");
  const [tests, setTests] = useState([]);
  const [selectedInvestigations, setSelectedInvestigations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
  } = useForm({ mode: "onBlur" });

  // Fetch all tests once
  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No token found");

        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-test",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTests(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch tests.");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);


  // When profile changes, reset selected investigations
  const handleProfileChange = (e) => {
    const selected = e.target.value;
    setSelectedProfile(selected);
    setSelectedInvestigations([]);
    trigger("profileName");
  };

  const toggleInvestigation = (value) => {
    setSelectedInvestigations((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };
  

  const onSubmit = async () => {
    if (!selectedProfile) return toast.error("Please select a profile");
    if (selectedInvestigations.length === 0)
      return toast.error("Please select at least one investigation");

    setIsSubmitting(true);

    const selectedProfileObj = profileOptions.find(
      (p) => p.value === selectedProfile
    );
    const investigationIds = selectedInvestigations.map((inv) => inv.id);

    const payload = {
      profileid: selectedProfileObj.id,
      investigationids: selectedInvestigations,
    };

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-profile",
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("Profile added successfully!");
      reset();
      setSelectedProfile("");
      setSelectedInvestigations([]);
      setTimeout(() => navigate("/view-profile-master"), 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "❌ Failed to add profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter tests based on selected profile category
  const filteredTests = selectedProfile
    ? tests.filter(
        (test) => test.testcategory === profileToCategory[selectedProfile]
      )
    : [];

  return (
    <>
      <ToastContainer />
      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl border border-gray-200"
        >
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
                {...register("profileName", {
                  required: "Profile is required",
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.profileName ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-teal-500 transition`}
                value={selectedProfile}
                onChange={handleProfileChange}
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

            {/* Investigations */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Investigations <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map((test) => {
  const checked = selectedInvestigations.includes(test.id);
  return (
    <div
      key={test.id}
      className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer select-none ${
        checked ? "bg-teal-50 border-teal-400" : "border-gray-300 hover:bg-gray-50"
      }`}
      onClick={() => toggleInvestigation(test.id)}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => toggleInvestigation(test.id)}
        className="h-5 w-5 text-teal-600"
      />
      <label className="flex-1 cursor-pointer select-none text-gray-700 font-medium">
        {test.testname}
      </label>
    </div>
  );
})}

</div>

            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSelectedProfile("");
                  setSelectedInvestigations([]);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg text-white shadow-md transition ${
                  isSubmitting
                    ? "bg-teal-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600"
                }`}
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
