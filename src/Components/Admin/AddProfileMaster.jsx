import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import axios from "axios";
import { viewInvestigations, addProfile } from "../../services/apiService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProfileMaster = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [investigations, setInvestigations] = useState([]);
  const [filteredInvestigations, setFilteredInvestigations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New state for Is Active
  const [isActive, setIsActive] = useState(true); // default yes/true

  const navigate = useNavigate();

  // Fetch Profile Entries
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-profileentry",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 1, limit: 100 },
          }
        );
        setProfiles(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch profiles", err);
      }
    };
    fetchProfiles();
  }, []);

  // Fetch Investigations
  useEffect(() => {
    const fetchInvestigations = async () => {
      try {
        const params = { page: 1, limit: 1000 };
        const response = await viewInvestigations(params);
        const data = (response.data || []).sort(
          (a, b) => Number(a.investigation_id) - Number(b.investigation_id)
        );
        setInvestigations(data);
        setFilteredInvestigations(data);
      } catch (err) {
        console.error("Failed to fetch investigations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvestigations();
  }, []);

  const handleProfileChange = (e) => {
    setSelectedProfile(e.target.value);
    setSelectedTests([]);
  };

  const addTest = (inv) => {
    const id = inv.investigation_id || inv.id;
    if (!selectedTests.some((t) => t.id === id)) {
      setSelectedTests([...selectedTests, { id, name: inv.testname }]);
    }
  };

const removeTest = (test) => {
  const confirmRemove = window.confirm("Are you sure you want to remove this test?");
  if (confirmRemove) {
    setSelectedTests(selectedTests.filter((t) => t.id !== test.id));
  }
};


  const handleReset = () => {
    setSelectedProfile("");
    setSelectedTests([]);
    setSearch("");
    setIsActive(true); // reset to default
  };

  useEffect(() => {
    if (!search.trim()) {
      setFilteredInvestigations(investigations);
    } else {
      const lower = search.toLowerCase();
      setFilteredInvestigations(
        investigations.filter((inv) =>
          (inv.testname || "").toLowerCase().includes(lower)
        )
      );
    }
  }, [search, investigations]);

  const handleAddProfile = async () => {
    if (!selectedProfile) {
      toast.error("Please select a profile.");
      return;
    }
    if (selectedTests.length === 0) {
      toast.error("Please add at least one test to the profile.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        profileid: selectedProfile,
        investigationids: selectedTests.map((t) => t.id).filter(Boolean),
        is_active: isActive, // send active status
      };

      const res = await addProfile(payload);

      toast.success("Profile added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      handleReset();

      setTimeout(() => {
        navigate("/view-profile-master");
      }, 2200);
    } catch (err) {
      console.error("Error adding profile:", err);
      toast.error(
        err?.response?.data?.message || "Failed to add profile. Please try again.",
        { position: "top-right", autoClose: 4000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li> 
            <li>
               <Link
                to="/view-profile-master"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
              <span className="text-gray-700">Profile Master</span></Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Add Profile
            </li>
          </ol>
        </nav>
      </div>

      {/* Form Container */}
      <div className="w-full mt-16">
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add New Profile</h4>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Entry + Is Active in one row */}
            <div className="flex items-end gap-8 w-full">
              {/* Profile Entry */}
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Entry
                </label>
                <select
                  value={selectedProfile}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="">-- Select Profile --</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.profilename}
                    </option>
                  ))}
                </select>
              </div>

              {/* Is Active */}
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">
                  Is Active
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="isActive"
                      value="true"
                      checked={isActive === true}
                      onChange={() => setIsActive(true)}
                      className="accent-teal-500"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="isActive"
                      value="false"
                      checked={isActive === false}
                      onChange={() => setIsActive(false)}
                      className="accent-teal-500"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Available Investigations */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-sm font-semibold text-gray-700">
                    List of Investigations
                  </h2>
                  <div className="relative w-48">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                      placeholder="Search..."
                    />
                    <RiSearchLine className="absolute left-2 top-1.5 text-gray-400" />
                  </div>
                </div>

                {loading ? (
                  <p className="text-center text-gray-500 py-6">Loading...</p>
                ) : filteredInvestigations.length === 0 ? (
                  <p className="text-center text-gray-500 py-6">
                    No Investigations found.
                  </p>
                ) : (
                  <ul className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-2 text-sm">
                    {filteredInvestigations.map((inv) => (
                      <li
                        key={inv.investigation_id}
                        className="flex justify-between items-center p-2 border-b last:border-0"
                      >
                        <span>{inv.testname}</span>
                        <button
                          onClick={() => addTest(inv)}
                          className="px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded hover:bg-teal-200"
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Selected Tests */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">
                  Selected Tests
                </h2>
                {selectedTests.length === 0 ? (
                  <p className="text-gray-400 text-sm">No tests selected.</p>
                ) : (
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedTests.map((test) => (
                      <li
                        key={test.id}
                        className="flex items-center justify-between gap-2 p-2 border rounded-lg"
                      >
                        <p className="font-medium text-sm">{test.name}</p>
                        <button
                          onClick={() => removeTest(test)}
                          className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleAddProfile}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Processing..." : "Add Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default AddProfileMaster;
