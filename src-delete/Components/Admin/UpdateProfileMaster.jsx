import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import axios from "axios";
import { viewInvestigations, updateProfile } from "../../services/apiService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateProfileMaster = () => {
  const { id } = useParams();
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [investigations, setInvestigations] = useState([]);
  const [filteredInvestigations, setFilteredInvestigations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(true);

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

  // Fetch existing profile data for editing
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://asrlabs.asrhospitalindia.in/lims/master/get-profile/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        console.log("Profile API Response:", response.data);
        
        // Handle different possible response structures
        const profileData = response.data?.data || response.data;
        
        if (profileData) {
          console.log("Profile Data:", profileData);
          
          // Map profile data to form fields
          setSelectedProfile(profileData.profilename || profileData.profile_id?.toString() || "");
          setIsActive(profileData.is_active !== false && profileData.is_active !== 0);
          
          // Set selected tests if they exist - handle different possible structures
          let investigationIds = [];
          
          if (profileData.investigationids && Array.isArray(profileData.investigationids)) {
            investigationIds = profileData.investigationids;
          } else if (profileData.investigations && Array.isArray(profileData.investigations)) {
            // If investigations is an array of objects with ids
            investigationIds = profileData.investigations.map(inv => inv.investigation_id || inv.id);
          }
          
          console.log("Investigation IDs:", investigationIds);
          
          if (investigationIds.length > 0) {
            const tests = investigationIds.map(testId => {
              const investigation = investigations.find(inv => 
                inv.investigation_id === testId || inv.id === testId
              );
              return {
                id: testId,
                name: investigation?.testname || `Test ${testId}`
              };
            }).filter(test => test.id); // Remove any invalid tests
            
            setSelectedTests(tests);
            console.log("Selected Tests:", tests);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile data", err);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch profile data if we have investigations loaded
    if (investigations.length > 0) {
      fetchProfileData();
    }
  }, [id, investigations]);

  const handleProfileChange = (e) => {
    setSelectedProfile(e.target.value);
    // Don't clear selected tests when updating
  };

  const addTest = (inv) => {
    const testId = inv.investigation_id || inv.id;
    if (!selectedTests.some((t) => t.id === testId)) {
      setSelectedTests([...selectedTests, { id: testId, name: inv.testname }]);
    }
  };

  const removeTest = (test) => {
    setSelectedTests(selectedTests.filter((t) => t.id !== test.id));
  };

  const handleReset = () => {
    // Reset to original values instead of clearing
    const fetchOriginalData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://asrlabs.asrhospitalindia.in/lims/master/get-profile/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        // Handle different possible response structures
        const profileData = response.data?.data || response.data;
        
        if (profileData) {
          // Map profile data to form fields
          setSelectedProfile(profileData.profileid?.toString() || profileData.profile_id?.toString() || "");
          setIsActive(profileData.is_active !== false && profileData.is_active !== 0);
          
          // Set selected tests if they exist - handle different possible structures
          let investigationIds = [];
          
          if (profileData.investigationids && Array.isArray(profileData.investigationids)) {
            investigationIds = profileData.investigationids;
          } else if (profileData.investigations && Array.isArray(profileData.investigations)) {
            // If investigations is an array of objects with ids
            investigationIds = profileData.investigations.map(inv => inv.investigation_id || inv.id);
          }
          
          if (investigationIds.length > 0) {
            const tests = investigationIds.map(testId => {
              const investigation = investigations.find(inv => 
                inv.investigation_id === testId || inv.id === testId
              );
              return {
                id: testId,
                name: investigation?.testname || `Test ${testId}`
              };
            }).filter(test => test.id); // Remove any invalid tests
            
            setSelectedTests(tests);
          }
        }
      } catch (err) {
        console.error("Failed to reset profile data", err);
      }
    };
    
    fetchOriginalData();
    setSearch("");
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

  const handleUpdateProfile = async () => {
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
        is_active: isActive,
      };

      const res = await updateProfile(id, payload);

      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/view-profile-master");
      }, 2200);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(
        err?.response?.data?.message || "Failed to update profile. Please try again.",
        { position: "top-right", autoClose: 4000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !id) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

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
              <Link to="/view-profile-master" className="text-gray-700 hover:text-teal-600">
                Profile Master
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Update Profile
            </li>
          </ol>
        </nav>
      </div>

      {/* Form Container */}
      <div className="w-full mt-16">
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Update Profile (ID: {id})</h4>
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
                    {filteredInvestigations.map((inv) => {
                      const isSelected = selectedTests.some((t) => t.id === (inv.investigation_id || inv.id));
                      return (
                        <li
                          key={inv.investigation_id}
                          className={`flex justify-between items-center p-2 border-b last:border-0 ${
                            isSelected ? 'bg-teal-50' : ''
                          }`}
                        >
                          <span className={isSelected ? 'text-teal-700 font-medium' : ''}>
                            {inv.testname}
                            {isSelected && ' ✓'}
                          </span>
                          <button
                            onClick={() => addTest(inv)}
                            disabled={isSelected}
                            className={`px-2 py-1 text-xs rounded ${
                              isSelected 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                            }`}
                          >
                            {isSelected ? 'Added' : 'Add'}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Selected Tests */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">
                  Selected Tests ({selectedTests.length})
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
                    onClick={handleUpdateProfile}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Updating..." : "Update Profile"}
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

export default UpdateProfileMaster;