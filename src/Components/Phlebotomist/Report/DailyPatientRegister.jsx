import { useEffect, useState } from "react";
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
  const [searchBarcode, setSearchBarcode] = useState("");

  const [searchInvestigation, setSearchInvestigation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [hospitalsList, setHospitalsList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [reportDoctorToUpdate, setReportDoctorToUpdate] = useState(null);
  const [patientData, setPatientData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [patientFetchData, setPatientFetchData] = useState([]);

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

        // response.data should be the array
        if (response?.data && Array.isArray(response.data)) {
          setPatientFetchData(response.data);
        } else {
          setPatientFetchData([]); // fallback empty array
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

  // ------------------ Table Columns ------------------
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
  const mapped = patientFetchData.map((item, index) => ({
    id: index + 1,
    patientcode: item.patientPPModes?.[0]?.popno || "N/A",
    patientname: item.p_name || "N/A",
    barcode: item.patientPPModes?.[0]?.pbarcode || "N/A",
    dateofregistration: item.p_regdate || "N/A",
    hospitalname: item.hospital?.hospitalname || "N/A",
    investigationregistrerd: item.patientPPModes?.length || 0,
    reportready: item.patientBills?.[0]?.billstatus === "Paid" ? "Yes" : "No",
    reportpending: item.patientBills?.[0]?.billstatus !== "Paid" ? "Yes" : "No",
  }));

  const handleUpdate = (item) => {
    setReportDoctorToUpdate(item);
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

          {/* Search + Filter Section */}
          <div className="flex flex-col sm:flex-row items-end gap-4 mb-4 flex-wrap">

            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-1 min-w-[160px]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:scale-105 transition">
                Search
              </button>
            </div>
          </div>

          {/* Data Table */}
          {patientFetchData.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No report entry found.
            </div>
          ) : (
            <PhlebotomistDataTable
              items={patientData}
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
