import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../../context/adminContext";
import { fetchPatientReportData } from "../../../services/apiService";
import { toast } from "react-toastify";
import WithoutActionTable from "../../utils/WithoutActionTable";
import axios from "axios";

const PendingReportRegister = () => {
  const [reportDoctors, setReportDoctors] = useState([]); 
  const [filteredReportData, setfilteredReportData] = useState([]); 
  const [searchInvestigation, setSearchInvestigation] = useState("");
  const [searchBarcode, setSearchBarcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setReportDoctorToUpdate } = useContext(AdminContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // ------------------ Fetch report data ------------------
  useEffect(() => {
    const fetchReportData = async () => {
      const id = localStorage.getItem("hospital_id");
      if (!id) {
        toast.error("No hospital ID found in localStorage");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetchPatientReportData(id);

        if (response?.data) {
          const data = response.data || [];

          const mapped = data.map((item) => ({
            id: item.id,
            patientid: item.id,
            patientname: item.p_name,
            patientregdate: item.p_regdate,
            barcode: item.patientPPModes?.[0]?.pbarcode || "",
            hospitalname: item.hospital?.hospitalname || "",
            attatchfile: item.patientPPModes?.[0]?.attatchfile || "",
            testregdates: item.patientTests
              .filter((t) => t.status === "docpending")
              .map((t) => t.createddatetime || "")
              .join(", "),
          }));

          setReportDoctors(mapped);
          setfilteredReportData(mapped);
          setTotalItems(response.meta?.totalItems || mapped.length);
          setTotalPages(response.meta?.totalPages || 1);
        } else {
          toast.error(response?.message || "Failed to fetch report data");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred while fetching the report");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [itemsPerPage]);

  // ------------------ Live Notifications ------------------
  useEffect(() => {
    const fetchNewReports = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://asrphleb.asrhospitalindia.in/api/v1/phleb/report/get-center-test/new`,
          { headers: { Authorization: `Bearer ${authToken}` } }
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
        console.error("Failed to fetch new reports:", err);
      }
    };

    const interval = setInterval(fetchNewReports, 15000);
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

  // ------------------ Search & filter ------------------
  const handleSearch = () => {
    let filtered = [...reportDoctors];

    if (searchInvestigation.trim()) {
      const lower = searchInvestigation.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          (doc.investigationregistrerd || "").toLowerCase().includes(lower)
      );
    }

    if (searchBarcode.trim()) {
      const lower = searchBarcode.toLowerCase();
      filtered = filtered.filter((doc) =>
        (doc.barcode || "").toLowerCase().includes(lower)
      );
    }

    setfilteredReportData(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "patientid", label: "Patient ID" },
    { key: "patientname", label: "Patient Name" },
    { key: "barcode", label: "Barcode" },
    { key: "hospitalname", label: "Hospital Name" },
    { key: "patientregdate", label: "Patient Reg. Date" },
    { key: "testregdates", label: "Test Reg. Date" },
  ];

  const mappedItems = filteredReportData.map((t, index) => ({
    id: (currentPage - 1) * itemsPerPage + index + 1,
    patientid: t.patientid,
    patientname: t.patientname,
    barcode: t.barcode,
    hospitalname: t.hospitalname,
    patientregdate: t.patientregdate,
    testregdates: t.testregdates,
    attatchfile: t.attatchfile,
  }));

  const handleUpdate = (item) => {
    setReportDoctorToUpdate(item);
  };

  const handleExportExcel = () => {
    console.log("Export to Excel logic here...");
  };

  const handleExportPDF = () => {
    console.log("Export to PDF logic here...");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  // ------------------ Render ------------------
  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600"
              >
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-report-doctor"
                className="text-gray-700 hover:text-teal-600"
              >
                Pending Report Register
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Pending Report Register
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

              {/* Notification Bell - always visible */}
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
                            setNotifications((prev) =>
                              prev.filter((n) => n.id !== notif.id)
                            )
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

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <div className="relative">
              <input
                type="text"
                value={searchBarcode}
                onChange={(e) => setSearchBarcode(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 min-w-[180px] w-[200px]"
                placeholder="Search by Barcode..."
              />
              <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchInvestigation}
                onChange={(e) => setSearchInvestigation(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 min-w-[180px] w-[200px]"
                placeholder="Search by Investigation..."
              />
              <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
            </div>

            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:scale-105 transition"
            >
              Search
            </button>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : filteredReportData.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No report entry found.
            </div>
          ) : (
            <WithoutActionTable
              items={mappedItems}
              columns={columns}
              showDetailsButtons={false}
              onUpdate={handleUpdate}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PendingReportRegister;
