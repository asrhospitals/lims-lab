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
import "react-toastify/dist/ReactToastify.css";
import { Bell } from "lucide-react";

const TestDetails = () => {
  const [reportDoctors, setReportDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const { setReportDoctorToUpdate } = useContext(AdminContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hospitalName = localStorage.getItem("hospital_name");
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await fetch(
          "https://asrphleb.asrhospitalindia.in/api/v1/phleb/get-patient-test/2",
          { method: "GET", headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (!response.ok) throw new Error("Network response was not ok");
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

  // Map API response to table format with colored status circles
  useEffect(() => {
    if (data?.data) {
      const mapped = data.data.map((item) => ({
        id: item.id,
        patientCode: item.patientPPModes?.[0]?.popno || "",
        opType: item.patientPPModes?.[0]?.pop || "",
        opNo: item.patientPPModes?.[0]?.popno || "",
        patientDetails: (
          <div>
            <div className="font-semibold">{item.p_name}</div>
            <div className="text-xs text-gray-500">
              Age: {item.p_age} / Gender: {item.p_gender}
            </div>
            <div className="mt-1 flex flex-wrap gap-2 items-center">
              {item.patientTests.map((t) => {
                let dotColor =
                  t.status === "completed"
                    ? "bg-green-500"
                    : t.status === "pending"
                    ? "bg-red-500"
                    : "bg-blue-500"; // unknown

                return (
                  <div
                    key={t.investigation?.testname}
                    className="flex items-center gap-1 text-xs"
                  >
                    <span className={`w-3 h-3 rounded-full ${dotColor}`}></span>
                    <span>{t.investigation?.testname || "Unknown"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ),
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

  // Quick date filters function
  const applyDateFilter = (filterType) => {
    const now = new Date();
    let filtered;

    if (filterType === "today") {
      filtered = reportDoctors.filter((item) => {
        const regDate = new Date(item.dateOfRegistration);
        return (
          regDate.getFullYear() === now.getFullYear() &&
          regDate.getMonth() === now.getMonth() &&
          regDate.getDate() === now.getDate()
        );
      });
    } else if (filterType === "yesterday") {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      filtered = reportDoctors.filter((item) => {
        const regDate = new Date(item.dateOfRegistration);
        return (
          regDate.getFullYear() === yesterday.getFullYear() &&
          regDate.getMonth() === yesterday.getMonth() &&
          regDate.getDate() === yesterday.getDate()
        );
      });
    } else if (filterType === "last3days") {
      const threeDaysAgo = new Date(now);
      threeDaysAgo.setDate(now.getDate() - 3);
      filtered = reportDoctors.filter((item) => {
        const regDate = new Date(item.dateOfRegistration);
        return regDate >= threeDaysAgo && regDate <= now;
      });
    } else {
      filtered = reportDoctors; // no filter
    }

    setFilteredDoctors(filtered);
  };

  // Search filter
  useEffect(() => {
    if (!search.trim()) setFilteredDoctors(reportDoctors);
    else {
      const lower = search.toLowerCase();
      const filtered = reportDoctors.filter(
        (doc) =>
          (doc.patientCode || "").toLowerCase().includes(lower) ||
          (typeof doc.patientDetails === "string"
            ? doc.patientDetails.toLowerCase().includes(lower)
            : false) ||
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

  const sendtesttoreceiption = async (ids) => {
    if (!ids || ids.length === 0) {
      toast.error("No valid patient IDs to send");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      const payload = { patient_ids: ids };
      await axios.put(
        "https://asrphleb.asrhospitalindia.in/api/v1/phleb/send-tests",
        payload,
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Tests sent successfully!");
    } catch (error) {
      toast.error(
        `Error sending tests: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleExportExcel = () => {
    if (!mappedItems || mappedItems.length === 0) {
      alert("No data to export");
      return;
    }
    const exportData = mappedItems.map((item) => ({
      ID: item.id,
      "Patient Code": item.patientCode,
      "OP / IP": item.opType,
      "OP / IP No": item.opNo,
      "Patient Details / Test Details":
        typeof item.patientDetails === "string"
          ? item.patientDetails
          : item.patientDetails.props.children
              .map((child) =>
                typeof child === "string"
                  ? child
                  : child.props.children
                      .map((c) =>
                        typeof c === "string"
                          ? c
                          : typeof c === "object"
                          ? c.props.children
                              .map((cc) => (typeof cc === "string" ? cc : ""))
                              .join(" ")
                          : ""
                      )
                      .join(" ")
              )
              .join(" "),
      Mobile: item.mobile,
      Barcode: item.barcode,
      "Hospital Name": item.hospitalName,
      "Registered By": item.registeredBy,
      "Date of Registration": item.dateOfRegistration,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patient Tests");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "PatientTestData.xlsx");
  };

  const handleExportPDF = () => console.log("Exporting to PDF...");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li><Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors">🏠 Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-report-doctor" className="text-gray-700 hover:text-teal-600 transition-colors">Test Details</Link></li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">View</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Test Details</h2>
            <div className="flex flex-row gap-3 items-center">
              <div onClick={handleExportExcel} className="bg-green-100 rounded-lg p-2 cursor-pointer hover:bg-green-200 transition flex items-center justify-center">
                <img src="./excel.png" alt="Export to Excel" className="w-7 h-7" />
              </div>
              <div onClick={handleExportPDF} className="bg-red-100 rounded-lg p-2 cursor-pointer hover:bg-red-200 transition flex items-center justify-center">
                <img src="./pdf.png" alt="Export to PDF" className="w-7 h-7" />
              </div>
              <div onClick={() => toast.info("🔔 You have new updates!")} className="relative bg-blue-100 rounded-lg p-2 cursor-pointer hover:bg-blue-200 transition flex items-center justify-center" title="Notifications">
                <Bell size={28} strokeWidth={2.5} className="text-blue-700" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </div>
            </div>
          </div>

          {/* Quick Date Filters */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => applyDateFilter("today")} className="px-4 py-1 rounded-full bg-teal-100 text-teal-800 font-semibold hover:bg-teal-200 transition">Today</button>
            <button onClick={() => applyDateFilter("yesterday")} className="px-4 py-1 rounded-full bg-orange-100 text-orange-800 font-semibold hover:bg-orange-200 transition">Yesterday</button>
            <button onClick={() => applyDateFilter("last3days")} className="px-4 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition">Last 3 Days</button>
            <button onClick={() => applyDateFilter("all")} className="px-4 py-1 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition">All</button>
          </div>

          <div className="mb-4">
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded w-full sm:w-1/3" />
          </div>

          {mappedItems.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No report entry found.</div>
          ) : (
            <>
              <DataTableWithoutAction items={mappedItems} columns={columns} itemsPerPage={10} showDetailsButtons={false} onRowSelect={setSelectedRows} />
              <div className="mt-4 flex justify-end">
                <button type="button" disabled={selectedRows.length === 0} className={`px-6 py-3 rounded text-white ${selectedRows.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`} onClick={() => sendtesttoreceiption(selectedRows)}>
                  Send to {hospitalName}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
};

export default TestDetails;
