import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { RiSearchLine, RiNotificationLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import RejectedSamplePhlbTable from "../utils/RejectedSamplePhlbTable";
import axios from "axios";
import { toast } from "react-toastify";

const RejectedSampleCollections = () => {
  const [reportDoctors, setReportDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchBarcode, setSearchBarcode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { setReportDoctorToUpdate } = useContext(AdminContext);
  const notifRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  // Fetch data and manage live notifications
  useEffect(() => {
    const fetchRejectedReportEntry = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrphleb.asrhospitalindia.in/api/v1/phleb/report/get-reject-report/2",
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const formattedData = (response.data.data || []).map((item) => ({
          id: item.id,
          patientCode: item.patientPPModes?.[0]?.pbarcode || "-",
          patientname: item.p_name || "-",
          patientage: item.p_age || "-",
          patientgender: item.p_gender || "-",
          dateofregistration: item.p_regdate || "-",
          mobilenumber: item.p_mobile || "-",
          hospitalName: item.hospital?.hospitalname || "-",
          trfnumber: item.patientPPModes?.[0]?.trfno || "-",
          registeredBy: item.reg_by || "-",
          rejectionReason: item.patientTests?.[0]?.rejection_reason || "-",
          rejectionstatus: item.patientTests?.[0]?.status || "-",
          rejectedBy: item.patientTests?.[0]?.rejected_by || "-",
          rejectedAt: item.patientTests?.[0]?.rejected_at
            ? new Date(item.patientTests[0].rejected_at).toLocaleString()
            : "-",
        }));

        setReportDoctors(formattedData);
        setFilteredDoctors(formattedData);

        const existingIds = notifications.map((n) => n.id);
        const newNotifs = formattedData
          .filter((item) => !existingIds.includes(item.id))
          .map((item) => ({
            id: item.id,
            barcode: item.patientCode,
            rejectedBy: item.rejectedBy,
            rejectedAt: item.rejectedAt,
          }));
        if (newNotifs.length > 0) setNotifications((prev) => [...newNotifs, ...prev]);
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("❌ Failed to fetch rejected samples");
      }
    };

    fetchRejectedReportEntry();
    const interval = setInterval(fetchRejectedReportEntry, 15000);
    return () => clearInterval(interval);
  }, [notifications]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "patientCode", label: "Barcode" },
    { key: "patientname", label: "Patient Name" },
    { key: "patientage", label: "Age" },
    { key: "patientgender", label: "Gender" },
    { key: "mobilenumber", label: "Mobile Number" },
    { key: "dateofregistration", label: "Registered Date" },
    { key: "hospitalName", label: "Hospital Name" },
    { key: "rejectionReason", label: "Rejected Reason" },
    { key: "rejectionstatus", label: "Rejected Status" },
  ];

  const mappedItems = filteredDoctors.map((doc) => ({
    ...doc,
    status: doc.isactive ? "Active" : "Inactive",
  }));

  const handleUpdate = (item) => setReportDoctorToUpdate(item);

  const handleSearch = () => {
    let filtered = reportDoctors;

    if (searchBarcode.trim()) {
      const lower = searchBarcode.toLowerCase();
      filtered = filtered.filter((doc) =>
        (doc.patientCode || "").toLowerCase().includes(lower)
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((doc) => {
        const docDate = new Date(doc.dateofregistration);
        return docDate >= new Date(startDate) && docDate <= new Date(endDate);
      });
    }

    setFilteredDoctors(filtered);
  };

  const handleExportExcel = () => console.log("Exporting to Excel...");
  const handleExportPDF = () => console.log("Exporting to PDF...");

  const removeNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const downloadSample = (id) => {
    const sample = reportDoctors.find((s) => s.id === id);
    if (!sample) return;
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `rejected_sample_${sample.patientCode}.json`;
    link.click();
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li><Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600 transition">🏠 Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-report-doctor" className="text-gray-700 hover:text-teal-600 transition">Rejected Sample List</Link></li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">View</li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Rejected Sample List</h2>

            <div className="flex flex-row gap-3 items-center">
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <RiNotificationLine
                  className="text-2xl text-gray-700 hover:text-teal-600 transition cursor-pointer"
                  onClick={() => setShowNotifications((prev) => !prev)}
                />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}

                {showNotifications && notifications.length > 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 p-2 max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex justify-between items-center text-sm py-2 px-3 border-b last:border-b-0 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex flex-col gap-1">
                          <span><strong>Barcode:</strong> {notif.barcode}</span>
                          <span><strong>Rejected By:</strong> {notif.rejectedBy}</span>
                          <span><strong>Time:</strong> {notif.rejectedAt}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => downloadSample(notif.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-teal-600 border border-teal-600 hover:bg-teal-50 transition"
                            title="Download"
                          >
                            ⬇
                          </button>
                          <button
                            onClick={() => removeNotification(notif.id)}
                            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition"
                            title="Close"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div onClick={handleExportExcel} className="bg-green-100 rounded-lg p-2 cursor-pointer hover:bg-green-200 transition flex items-center justify-center">
                <img src="./excel.png" alt="Export to Excel" className="w-7 h-7" />
              </div>

              <div onClick={handleExportPDF} className="bg-red-100 rounded-lg p-2 cursor-pointer hover:bg-red-200 transition flex items-center justify-center">
                <img src="./pdf.png" alt="Export to PDF" className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchBarcode}
                  onChange={(e) => setSearchBarcode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search by Barcode..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="date"
                    max={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                  <span className="absolute -top-5 left-1 text-xs text-gray-500">From</span>
                </div>

                <div className="relative flex-1 sm:w-64">
                  <input
                    type="date"
                    max={today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                  <span className="absolute -top-5 left-1 text-xs text-gray-500">To</span>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
              >
                Search
              </button>
            </div>
          </div>

          {mappedItems.length > 0 ? (
            <RejectedSamplePhlbTable
              items={mappedItems}
              columns={columns}
              itemsPerPage={10}
              showDetailsButtons={false}
              onUpdate={handleUpdate}
            />
          ) : (
            <div className="text-center py-6 text-gray-500">
              No rejected report entry found.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RejectedSampleCollections;
