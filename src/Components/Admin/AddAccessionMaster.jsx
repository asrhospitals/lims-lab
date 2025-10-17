import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import Barcode from "react-barcode";
import axios from "axios";
import { addAccessionMaster } from "../../services/apiService";

const AddAccessionMaster = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [barcodeValue, setBarcodeValue] = useState("");

  // Sample Data State
  const generateRandomId = (min = 1000, max = 9999) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const [sampleData, setSampleData] = useState({
    year: "2025",
    locationId: 1,
    containerId: 123,
    department: 5,
    sampleId: generateRandomId(),
  });

  // Barcode Settings
  const [settings, setSettings] = useState({
    enableLocation: false,
    enableContainer: false,
    addYear: false,
    addDepartment: false,
    digitLength: 4,
  });

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });

  const handleCheckbox = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // -------------------------------
  // API Calls
  // -------------------------------

  // 1️⃣ Save accession and return savedId
  const saveAccession = async () => {
    const nextSampleId = sampleData.sampleId + 1;
    setSampleData((prev) => ({ ...prev, sampleId: nextSampleId }));

    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Authorization token missing");

    const payload = {
      a_year: Number(sampleData.year),
      a_location_id: sampleData.locationId,
      a_container_id: sampleData.containerId,
      a_department: sampleData.department,
      a_sample_id: nextSampleId,
    };

    const response = await addAccessionMaster(payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
      toast.success("Accession saved successfully!");
      setSavedId(response.data.id);
      return response.data.id;
    } else {
      throw new Error("Unexpected server response during save.");
    }
  };

  // 2️⃣ Generate barcode from savedId
  const generateBarcode = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Authorization token missing");

    try {
      const response = await axios.get(
        `https://asrlabs.asrhospitalindia.in/lims/master/get-barcode/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          responseType: "blob", // <- important
        }
      );

      if (response.status === 200) {
        // Convert binary data to URL
        const imageUrl = URL.createObjectURL(response.data);
        setBarcodeValue(imageUrl); // set it to state
        toast.success("Barcode generated successfully!");
      } else {
        toast.error("Failed to generate barcode.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error generating barcode.");
    }
  };

  // -------------------------------
  // Form Submit Handler
  // -------------------------------
  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const id = await saveAccession();
      await generateBarcode(id);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <>
      <ToastContainer />
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-accession-master"
                className="text-gray-700 hover:text-teal-600"
              >
                Accession Master
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Add Accession Master</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-2 text-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">
              Add New Accession Master
            </h4>
          </div>

          {/* Barcode Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="bg-white/90 backdrop-blur border shadow-xl p-5 space-y-5">
              <h2 className="text-lg font-semibold text-green-600 border-b pb-2">
                Barcode Settings
              </h2>

              {[
                { key: "enableLocation", label: "Enable Hospital ID" },
                { key: "enableContainer", label: "Enable Container ID" },
                { key: "addYear", label: "Add Current Year" },
                { key: "addDepartment", label: "Add Department" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-3 cursor-pointer hover:bg-green-50 rounded-lg p-2 transition"
                >
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={() => handleCheckbox(item.key)}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-gray-700">{item.label}</span>
                </label>
              ))}

              <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70"
              >
                {isSubmitting ? "Generating Barcode..." : "Generate Bar Code"}
              </button>
            </div>

            {/* Barcode Preview */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur border rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Barcode Preview
              </h2>

              <table className="w-full border mb-6 text-center rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-green-50 text-green-600 font-semibold">
                    {settings.addYear && <th className="p-2">Year</th>}
                    {settings.enableLocation && (
                      <th className="p-2">Location ID</th>
                    )}
                    {settings.enableContainer && (
                      <th className="p-2">Container ID</th>
                    )}
                    {settings.addDepartment && (
                      <th className="p-2">Department</th>
                    )}
                    <th className="p-2">Sample ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-medium text-gray-700">
                    {settings.addYear && <td>{sampleData.year}</td>}
                    {settings.enableLocation && (
                      <td>{sampleData.locationId}</td>
                    )}
                    {settings.enableContainer && (
                      <td>{sampleData.containerId}</td>
                    )}
                    {settings.addDepartment && <td>{sampleData.department}</td>}
                    <td>{sampleData.sampleId}</td>
                  </tr>
                </tbody>
              </table>

              {barcodeValue ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="bg-gradient-to-r from-green-100 to-green-50 border rounded-lg p-4 shadow-inner">
                    <img
                      src={barcodeValue}
                      alt="Generated Barcode"
                      className="h-16"
                    />
                  </div>
                  <div className="text-gray-700 font-medium">
                    Barcode Preview
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 italic">
                  Barcode will appear here after saving and generating
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddAccessionMaster;
