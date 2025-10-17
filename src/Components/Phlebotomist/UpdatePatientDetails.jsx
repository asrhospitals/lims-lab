import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdatePatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://asrphleb.asrhospitalindia.in/api/v1/phleb/get-patient/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPatient(response.data);
      } catch (err) {
        toast.error("Failed to load patient details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `https://asrphleb.asrhospitalindia.in/api/v1/phleb/update-patient-infographic/${id}`,
        patient,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Patient updated successfully!");
      navigate("/patient-registration");
    } catch (err) {
      toast.error("Error updating patient.");
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Loading patient details...</div>;
  if (!patient)
    return <div className="p-4 text-red-500">Patient not found.</div>;

  return (
    <div className="w-full mt-12 px-2 sm:px-4 space-y-4 text-sm">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
          Update Patient Details
        </h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Patient Image */}
          {patient.p_image && (
            <div className="mb-4">
              <img
                src={patient.p_image}
                alt="Patient"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient Name
              </label>
              <input
                type="text"
                value={patient.p_name || ""}
                onChange={(e) =>
                  setPatient({ ...patient, p_name: e.target.value })
                }
                className="border px-3 py-2 rounded w-full"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                type="text"
                value={patient.p_mobile || ""}
                onChange={(e) =>
                  setPatient({ ...patient, p_mobile: e.target.value })
                }
                className="border px-3 py-2 rounded w-full"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                value={patient.p_age || ""}
                onChange={(e) =>
                  setPatient({ ...patient, p_age: e.target.value })
                }
                className="border px-3 py-2 rounded w-full"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                value={patient.p_gender || ""}
                onChange={(e) =>
                  setPatient({ ...patient, p_gender: e.target.value })
                }
                className="border px-3 py-2 rounded w-full"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={patient.city || ""}
                onChange={(e) =>
                  setPatient({ ...patient, city: e.target.value })
                }
                className="border px-3 py-2 rounded w-full"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                value={patient.state || ""}
                onChange={(e) =>
                  setPatient({ ...patient, state: e.target.value })
                }
                className="border px-3 py-2 rounded w-full"
              />
            </div>

            {/* Registration ID (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration ID
              </label>
              <input
                type="text"
                value={patient.reg_id || ""}
                readOnly
                className="border px-3 py-2 rounded w-full bg-gray-100"
              />
            </div>

            {/* Registration Date (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Date
              </label>
              <input
                type="text"
                value={patient.p_regdate || ""}
                readOnly
                className="border px-3 py-2 rounded w-full bg-gray-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 w-full sm:w-auto"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePatientDetails;
