import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminContext from "../../../context/adminContext";
import DataTableWithoutAction from "../../utils/DataTableWithoutAction";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";



const TestDetails = () => {
  const [reportDoctors, setReportDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const { setReportDoctorToUpdate } = useContext(AdminContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const doc = new jsPDF();
  const hospitalName = localStorage.getItem("hospital_name");
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch API data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        const response = await fetch(
          "https://asrphleb.asrhospitalindia.in/api/v1/phleb/get-patient-test/2",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map API response to table format
  useEffect(() => {
    if (data?.data) {
      const mapped = data.data.map((item) => ({
        id: item.id,
        patientCode: item.patientPPModes?.[0]?.popno || "",
        opType: item.patientPPModes?.[0]?.pop || "",
        opNo: item.patientPPModes?.[0]?.popno || "",
        patientDetails: `${item.p_name} / Age: ${item.p_age} / Gender: ${
          item.p_gender
        } `,
        mobile: item.p_mobile || "",
        barcode: item.patientPPModes?.[0]?.pbarcode || "",
        hospitalName: item.hospital?.hospitalname || "",
        registeredBy: item.reg_by || "",
        dateOfRegistration: item.p_regdate || "",
      }));

      setReportDoctors(mapped);
      setFilteredDoctors(mapped);
    }
  }, [data]);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredDoctors(reportDoctors);
    } else {
      const lower = search.toLowerCase();
      const filtered = reportDoctors.filter(
        (doc) =>
          (doc.patientCode || "").toLowerCase().includes(lower) ||
          (doc.patientDetails || "").toLowerCase().includes(lower) ||
          (doc.mobile || "").toLowerCase().includes(lower) ||
          (doc.barcode || "").toLowerCase().includes(lower) ||
          (doc.hospitalName || "").toLowerCase().includes(lower) ||
          (doc.registeredBy || "").toLowerCase().includes(lower)
      );
      setFilteredDoctors(filtered);
    }
  }, [search, reportDoctors]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "patientCode", label: "Patient Code" },
    { key: "opType", label: "OP / IP" },
    { key: "opNo", label: "OP / IP No" },
    { key: "patientDetails", label: "Patient Details / Test Details" },
    { key: "mobile", label: "Mobile" },
    { key: "barcode", label: "Barcode" },
    { key: "hospitalName", label: "Hospital Name" },
    { key: "registeredBy", label: "Registered By" },
    { key: "dateOfRegistration", label: "Date of Registration" },
  ];

  const mappedItems = filteredDoctors;

  const handleUpdate = (item) => {
    setReportDoctorToUpdate(item);
    // navigate("/update-report-doctor"); // Uncomment if using navigation
  };

const sendtesttoreceiption = async (ids) => {

  if (!ids || ids.length === 0) {
    toast.error("No valid patient IDs to send");
    return;
  }

  try {
    const token = localStorage.getItem("authToken");

    const payload = {
      patient_ids: ids, // dynamic list of IDs
    };

    const response = await axios.put(
      "https://asrphleb.asrhospitalindia.in/api/v1/phleb/send-tests",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // only if API uses auth
        },
      }
    );

    console.log("✅ Response:", response.data);

    // ✅ Show success toast
    toast.success("Tests sent successfully!");
  } catch (error) {
    console.error(
      "❌ Error sending tests:",
      error.response?.data || error.message
    );
    // ✅ Show error toast
    toast.error(
      `Error sending tests: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

  // inside TestDetails component
  const handleExportExcel = () => {
    if (!mappedItems || mappedItems.length === 0) {
      alert("No data to export");
      return;
    }

    // Prepare data for Excel
    const exportData = mappedItems.map((item) => ({
      ID: item.id,
      "Patient Code": item.patientCode,
      "OP / IP": item.opType,
      "OP / IP No": item.opNo,
      "Patient Details / Test Details": item.patientDetails,
      Mobile: item.mobile,
      Barcode: item.barcode,
      "Hospital Name": item.hospitalName,
      "Registered By": item.registeredBy,
      "Date of Registration": item.dateOfRegistration,
    }));

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patient Tests");

    // Write workbook and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "PatientTestData.xlsx");
  };

  const handleExportPDF = () => {
    console.log("Exporting to PDF...");
    // TODO: add logic using jsPDF or pdfmake
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors"
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
                Test Details
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View
            </li>
          </ol>
        </nav>
      </div>

      {/* Page Content */}
      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Test Details
            </h2>

            {/* Action Buttons */}
            <div className="flex flex-row gap-3">
              <div
                onClick={handleExportExcel}
                className="bg-green-100 rounded-lg p-2 cursor-pointer hover:bg-green-200 transition flex items-center justify-center"
              >
                <img
                  src="./excel.png"
                  alt="Export to Excel"
                  className="w-7 h-7"
                />
              </div>

              <div
                onClick={handleExportPDF}
                className="bg-red-100 rounded-lg p-2 cursor-pointer hover:bg-red-200 transition flex items-center justify-center"
              >
                <img src="./pdf.png" alt="Export to PDF" className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded w-full sm:w-1/3"
            />
          </div>

          {/* Table */}
          <>
            {mappedItems.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No report entry found.
              </div>
            ) : (
              <>
                <DataTableWithoutAction
                  items={mappedItems}
                  columns={columns}
                  itemsPerPage={10}
                  showDetailsButtons={false}
                  onRowSelect={setSelectedRows}
                />

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={selectedRows.length === 0}
                    className={`px-6 py-3 rounded text-white ${
                      selectedRows.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-teal-600 hover:bg-teal-700"
                    }`}
                    onClick={() => {
                      console.log("Sending patient IDs:", selectedRows);
                      sendtesttoreceiption(selectedRows); // send IDs to API
                    }}
                  >
                    Send to {hospitalName}
                  </button>
                </div>
              </>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default TestDetails;
