import { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";

import axios from "axios";
import { useForm } from "react-hook-form";
import { fetchPhebotomistPatientData } from "../../../services/apiService";
import PhlebotomistDataTable from "../../utils/PhlebotomistDataTable";

const DailyPatientRegister = () => {
  const [reportDoctors, setReportDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [patientFetchData, setPatientFetchData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const {
    register,
    formState: { errors },
  } = useForm();

  // ------------------ Search Filter ------------------
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
          (doc.hospitalname || "").toLowerCase().includes(lower)
      );
      setFilteredDoctors(filtered);
    }
  }, [search, reportDoctors]);

  // ------------------ Fetch Patient Data ------------------
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const id = localStorage.getItem("hospital_id");
        const response = await fetchPhebotomistPatientData(id);

        if (response?.data && Array.isArray(response.data)) {
          setPatientFetchData(response.data);
        } else {
          setPatientFetchData([]);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setPatientFetchData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  // ------------------ Live Notifications ------------------
  useEffect(() => {
    const fetchNewReports = async () => {
      try {
        const authToken = localStorage.getItem("auth_token");
        const response = await axios.get(
          `https://asrphleb.asrhospitalindia.in/api/v1/phleb/report/get-center-test/new`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const newReports = (response.data.data || []).filter(
          (r) => !patientFetchData.some((d) => d.id === r.id)
        );

        if (newReports.length > 0) {
          const formatted = newReports.map((item) => ({
            id: item.id,
            patientname: item.p_name || "-",
            patientcode: item.patientPPModes?.[0]?.pbarcode || "-",
            dateofregistration: item.p_regdate || "-",
          }));
          setNotifications((prev) => [...formatted, ...prev]);
        }
      } catch (err) {
        console.error("Failed to fetch new reports:", err);
      }
    };

    const interval = setInterval(fetchNewReports, 15000);
    return () => clearInterval(interval);
  }, [patientFetchData]);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "patientcode", label: "Patient Code" },
    { key: "patientname", label: "Patient Name" },
    { key: "barcode", label: "Barcode" },
    { key: "dateofregistration", label: "Date of Registration" },
    { key: "hospitalname", label: "Hospital Name" },
    { key: "investigationregistrerd", label: "Investigation Registered" },
    { key: "reportready", label: "Report Ready" },
    { key: "reportpending", label: "Report Pending" },
  ];

  const mapped = useMemo(() => {
    return patientFetchData.map((item, index) => ({
      id: index + 1,
      patientcode: item.patientPPModes?.[0]?.popno || "N/A",
      patientname: item.p_name || "N/A",
      barcode: item.patientPPModes?.[0]?.pbarcode || "N/A",
      dateofregistration: item.p_regdate || "N/A",
      hospitalname: item.hospital?.hospitalname || "N/A",
      investigationregistrerd: item.patientPPModes?.length || 0,
      reportready: item.patientBills?.[0]?.billstatus === "Paid" ? "Yes" : "No",
      reportpending:
        item.patientBills?.[0]?.billstatus !== "Paid" ? "Yes" : "No",
    }));
  }, [patientFetchData]);

  const handleUpdate = (item) => {
    setReportDoctorToUpdate(item);
  };

  const handleSearch = async () => {
    if (!startDate) {
      alert("Please select a start date");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `https://asrphleb.asrhospitalindia.in/api/v1/phleb/search-patient?startDate=${startDate}&endDate=${endDate || new Date().toISOString().split("T")[0]}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data?.data && Array.isArray(data.data)) {
        setPatientFetchData(data.data);
      } else {
        setPatientFetchData([]);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setPatientFetchData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => console.log("Exporting to Excel...");
  const handleExportPDF = () => console.log("Exporting to PDF...");

  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
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
                Daily Patient Register
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">View</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Daily Patient Register
            </h2>

            {/* Export + Notification */}
            <div className="flex items-center gap-3">
              <div
                onClick={handleExportExcel}
                className="bg-green-100 rounded-lg p-2 cursor-pointer hover:bg-green-200 transition flex items-center justify-center"
              >
                <img src="./excel.png" alt="Excel" className="w-7 h-7" />
              </div>
              <div
                onClick={handleExportPDF}
                className="bg-red-100 rounded-lg p-2 cursor-pointer hover:bg-red-200 transition flex items-center justify-center"
              >
                <img src="./pdf.png" alt="PDF" className="w-7 h-7" />
              </div>

              {/* Notification Bell */}
              <div
                ref={notifRef}
                className="bg-yellow-100 rounded-lg p-2 cursor-pointer hover:bg-yellow-200 transition flex items-center justify-center relative"
              >
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative text-gray-700"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                    <path d="M9 18a3 3 0 006 0H9z" />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 p-2 max-h-80 overflow-y-auto">
                    {notifications.length === 0 && (
                      <div className="text-gray-500 text-sm p-2 text-center">
                        No new notifications
                      </div>
                    )}
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex justify-between items-center text-sm py-1 px-2 border-b last:border-b-0"
                      >
                        <div>
                          <div><strong>Patient:</strong> {notif.patientname}</div>
                          <div><strong>Barcode:</strong> {notif.patientcode}</div>
                          <div><strong>Date:</strong> {notif.dateofregistration}</div>
                        </div>
                        <button
                          onClick={() =>
                            setNotifications((prev) => prev.filter((n) => n.id !== notif.id))
                          }
                          className="px-2 py-1 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search + Filter Section */}
          <div className="flex flex-col sm:flex-row items-end gap-4 mb-4 flex-wrap">
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-1 min-w-[160px]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:scale-105 transition"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          {patientFetchData.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No report entry found.
            </div>
          ) : (
            <PhlebotomistDataTable
              items={mapped}
              columns={columns}
              itemsPerPage={10}
              showDetailsButtons={false}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DailyPatientRegister;
