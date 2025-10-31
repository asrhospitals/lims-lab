import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../../context/adminContext";
import PhlebotomistDataTable from "../../utils/PhlebotomistDataTable";
import { useForm } from "react-hook-form";
import axios from "axios";

const DailyCriticalReportRegister = () => {
  const [reportDoctors, setReportDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState(""); 
  const [searchInvestigation, setSearchInvestigation] = useState("");
  const { setReportDoctorToUpdate } = useContext(AdminContext);
  const [searchBarcode, setSearchBarcode] = useState("");
  const [hospitalsList, setHospitalsList] = useState([]);
  const [startDate, setStartDate] = useState(""); 

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const {
    register,
    formState: { errors },
  } = useForm();

  // Hardcoded data
  useEffect(() => {
    const data = [
      { id: 1, patientcode: "Mahukaram", patientname: "Cardiology", barcode: "MRN001", dateofregistration: "9876543210", hospitalname: "john@example.com", investigationregistrerd: "Mumbai" },
      { id: 2, patientcode: "Smitha", patientname: "Neurology", barcode: "MRN002", dateofregistration: "9876543211", hospitalname: "jane@example.com", investigationregistrerd: "Delhi" },
      { id: 3, patientcode: "Aparna", patientname: "Orthopedics", barcode: "MRN003", dateofregistration: "9876543212", hospitalname: "alice@example.com", investigationregistrerd: "Bangalore" },
    ];
    setReportDoctors(data);
    setFilteredDoctors(data);
  }, []);

  // Fetch hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-hospital?page=1&limit=1000",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && response.data.data) {
          const options = response.data.data.map((hospital) => ({
            value: hospital.id,
            label: hospital.hospitalname,
          }));
          setHospitalsList(options);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };
    fetchHospitals();
  }, []);

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
          (doc.dateofregistration || "").toLowerCase().includes(lower) ||
          (doc.hospitalname || "").toLowerCase().includes(lower) ||
          (doc.investigationregistrerd || "").toLowerCase().includes(lower)
      );
      setFilteredDoctors(filtered);
    }
  }, [search, reportDoctors]);

  // ------------------ Live Notifications for Critical Reports ------------------
  useEffect(() => {
    const fetchCriticalReports = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://asrphleb.asrhospitalindia.in/api/v1/phleb/report/critical/new`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const newReports = (response.data.data || []).filter(
          (r) => !reportDoctors.some((d) => d.id === r.id)
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
        console.error("Failed to fetch critical reports:", err);
      }
    };

    const interval = setInterval(fetchCriticalReports, 15000);
    return () => clearInterval(interval);
  }, [reportDoctors]);

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
    { key: "patientcode", label: "Test Name" },
    { key: "patientname", label: "Patient ID" },
    { key: "barcode", label: "Patient Name" },
    { key: "dateofregistration", label: "Result" },
    { key: "hospitalname", label: "Flag" },
    { key: "investigationregistrerd", label: "Reporting User Id" },
  ];

  const mappedItems = filteredDoctors.map((doc) => ({
    ...doc,
    status: doc.isactive ? "Active" : "Inactive",
  }));

  const handleUpdate = (item) => setReportDoctorToUpdate(item);

  const handleExportExcel = () => console.log("Exporting to Excel...");
  const handleExportPDF = () => console.log("Exporting to PDF...");

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
                Daily Critical Report Register
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">View</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Daily Critical Report Register
            </h2>

            {/* Action Buttons + Notification Bell */}
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

          {/* Search + Table */}
          <div className="flex flex-col sm:flex-row items-end gap-4 mb-4 flex-wrap">
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-1 min-w-[250px]">
                <select
                  {...register("hospitalselected", { required: "Hospital is required" })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.hospitalselected
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:ring-2 transition`}
                >
                  <option value="">Select Hospital</option>
                  {hospitalsList.map((hospital) => (
                    <option key={hospital.value} value={hospital.value}>{hospital.label}</option>
                  ))}
                </select>
                {errors.hospitalselected && (
                  <p className="text-red-500 text-xs mt-1">{errors.hospitalselected.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-1 min-w-[160px]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>
              <div>
                <button className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105">
                  Search
                </button>
              </div>
            </div>
          </div>

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
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DailyCriticalReportRegister;
