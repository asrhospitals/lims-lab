import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import RejectedSamplePhlbTable from "../utils/RejectedSamplePhlbTable";
import axios from "axios";

import { toast } from "react-toastify";

const RejectedSampleCollections = () => {
  const [reportDoctors, setReportDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInvestigation, setSearchInvestigation] = useState("");
  const { setReportDoctorToUpdate } = useContext(AdminContext);
  const [searchBarcode, setSearchBarcode] = useState("");

  const [startDate, setStartDate] = useState(""); // From Date
  const [endDate, setEndDate] = useState(""); // To Date
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    console.log("useEffect fired"); // <-- check this

    const fetchRejectedReportEntry = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        console.log("authToken:", authToken); // check token

        const response = await axios.get(
          "https://asrphleb.asrhospitalindia.in/api/v1/phleb/report/get-reject-report/2",
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        console.log("response==", response);

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
        }));

        setReportDoctors(formattedData);
        setFilteredDoctors(formattedData);
        console.log("Formatted Data >>>", formattedData);
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("❌ Failed to fetch report");
      }
    };

    fetchRejectedReportEntry();
  }, []);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredDoctors(reportDoctors);
    } else {
      const lower = search.toLowerCase();
      const filtered = reportDoctors.filter(
        (doc) =>
          (doc.patientid || "").toLowerCase().includes(lower) ||
          (doc.patientname || "").toLowerCase().includes(lower) ||
          (doc.barcode || "").toLowerCase().includes(lower) ||
          (doc.hospitalname || "").toLowerCase().includes(lower) ||
          (doc.investigationregistrerd || "").toLowerCase().includes(lower)
      );
      setFilteredDoctors(filtered);
    }
  }, [search, reportDoctors]);

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
    status: doc.isactive ? "Active" : "Inactive", // optional, remove if not needed
  }));

  const handleUpdate = (item) => {
    setReportDoctorToUpdate(item);
    // navigate("/update-report-doctor"); // Optional if using navigation
  };

  const handleSearch = () => {
    let filtered = reportDoctors;

    if (searchInvestigation.trim()) {
      const lower = searchInvestigation.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          (doc.doctorName || "").toLowerCase().includes(lower) ||
          (doc.department || "").toLowerCase().includes(lower)
      );
    }

    if (searchBarcode.trim()) {
      const lower = searchBarcode.toLowerCase();
      filtered = filtered.filter((doc) =>
        (doc.medicalRegNo || "").toLowerCase().includes(lower)
      );
    }

    if (searchDate) {
      filtered = filtered.filter(
        (doc) => doc.dateOfRegistration === searchDate
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleExportExcel = () => {
    console.log("Exporting to Excel...");
    // TODO: add logic (xlsx or SheetJS)
  };

  const handleExportPDF = () => {
    console.log("Exporting to PDF...");
    // TODO: add logic (jspdf or pdfmake)
  };

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
                Rejected Sample List
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
            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Rejected Sample List
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
        </div>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3 mb-4">
            {/* Search by Investigation + Barcode + Date */}
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
                {/* From Date */}
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    placeholder="From Date"
                  />
                  <span className="absolute -top-5 left-1 text-xs text-gray-500">
                    From
                  </span>
                </div>

                {/* To Date */}
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    placeholder="To Date"
                  />
                  <span className="absolute -top-5 left-1 text-xs text-gray-500">
                    To
                  </span>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
              >
                Search
              </button>
            </div>
          </div>

          {/* Table */}
          {mappedItems.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No rejected report entry found.
            </div>
          ) : (
            <RejectedSamplePhlbTable
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

export default RejectedSampleCollections;
