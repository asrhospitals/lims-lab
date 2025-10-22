import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import PhlebotomistDataTable from "../utils/PhlebotomistDataTable";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const PatientReportEntry = () => {
  const [reportDoctors, setReportDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { setReportDoctorToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();
  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredDoctors(reportDoctors);
    } else {
      const lower = search.toLowerCase();
      const filtered = reportDoctors.filter(
        (doc) =>
          (doc.patientcode || "").toLowerCase().includes(lower) ||
          (doc.patientname || "").toLowerCase().includes(lower) ||
          (doc.barcode || "").toLowerCase().includes(lower) ||
          (doc.altbarcode || "").toLowerCase().includes(lower) ||
          (doc.hospitalname || "").toLowerCase().includes(lower) ||
          (doc.registeredby || "").toLowerCase().includes(lower) ||
          (doc.dateofregistration || "").toLowerCase().includes(lower)
      );
      setFilteredDoctors(filtered);
    }
  }, [search, reportDoctors]);

  // Fetch patient report entry
  useEffect(() => {
    const fetchReportEntry = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const hospital_id = localStorage.getItem("hospital_id");

        const response = await axios.get(
          `https://asrphleb.asrhospitalindia.in/api/v1/phleb/report/get-center-test/${hospital_id}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const formattedData = (response.data.data || []).map((item) => ({
          id: item.id,
          patientcode: item.patientPPModes?.[0]?.pbarcode || "-",
          patientname: item.p_name || "-",
          patientage: item.p_age || "-",
          patientgender: item.p_gender || "-",
          hospitalname: item.hospital?.hospitalname || "-",
          trfnumber: item.patientPPModes?.[0]?.trfno || "-",
          registeredby: item.reg_by || "-",
          dateofregistration: item.p_regdate || "-",
          tests: item.patientPPModes || [], // include all tests for rejection
          patientTests: item.patientTests || [],
        }));

        setReportDoctors(formattedData);
        setFilteredDoctors(formattedData);
        console.log("Formatted Data >>>", formattedData);
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("❌ Failed to fetch report");
      }
    };

    fetchReportEntry();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "patientcode", label: "Patient Code" },
    { key: "patientname", label: "Patient Name" },
    { key: "patientage", label: "Age" },
    { key: "patientgender", label: "Gender" },
    { key: "hospitalname", label: "Hospital Name" },
    { key: "trfnumber", label: "TRF Number" },
    { key: "registeredby", label: "Registered By" },
    { key: "dateofregistration", label: "Date of Registration" },
  ];

  const mappedItems = filteredDoctors.map((doc) => ({
    ...doc,
    status: doc.isactive ? "Active" : "Inactive",
  }));

  const handleEdit = (item) => {
    console.log("inside edit", item);
    navigate(`/edit-report-entry/${item.id}`, { state: { reportItem: item } });
  };
  

  const openRejectModal = (item) => {
    console.log("Opening reject modal for:", item);
    
    // Store the patient and the first test (if you want to reject one at a time)
    const selectedTest = item.patientTests?.[0]; // pick first test, or customize
    setSelectedItem({
      ...item,
      selectedTest, // store selected test for rejection
    });
  
    setRejectionReason(""); // reset reason
    setIsModalOpen(true);
  };
  
  const handleReject = async (selectedItem) => {


    console.log("selectedItem", selectedItem);

    if (!selectedItem || !Array.isArray(selectedItem.patientTests) || selectedItem.patientTests.length === 0) {
      toast.error("No test found for this patient!");
      return;
    }

    const authToken = localStorage.getItem("authToken");


    const payload = {
      test_results: [
        {
          test_id: selectedItem.selectedTest.test_id, // actual test_id
          rejection_reason: rejectionReason,
        },
      ],
    };
    console.log("payload", payload);

    try {
      const response = await axios.put(
        `https://asrphleb.asrhospitalindia.in/api/v1/phleb/report/report-reject/${selectedItem.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
      toast.success("Report rejected successfully!");

      // Remove rejected patient from table
      setReportDoctors((prev) =>
        prev.filter((doc) => doc.id !== selectedItem.id)
      );
      setFilteredDoctors((prev) =>
        prev.filter((doc) => doc.id !== selectedItem.id)
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error rejecting report:", error);
      toast.error("❌ Failed to reject report");
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors"
              >
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-report-doctor"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Report Entry
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Report Entry
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search report entry..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Table */}
          {mappedItems.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No report entry found.
            </div>
          ) : (
            <PhlebotomistDataTable
              items={mappedItems}
              columns={columns}
              itemsPerPage={10}
              showDetailsButtons={false}
              onUpdate={handleEdit}
              onView={openRejectModal}
            />
          )}

          {/* Reject Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
                <h2 className="text-lg font-bold mb-4 text-center">
                  Reject Report
                </h2>

                <div className="mb-4 flex items-center gap-2">
                  <label className="text-sm font-medium min-w-[80px]">Patient:</label>
                  <p className="text-gray-700">{selectedItem?.patientname}</p>
                </div>

                <div className="mb-4 flex flex-col">
                  <label className="text-sm font-medium mb-1">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleReject(selectedItem)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default PatientReportEntry;
