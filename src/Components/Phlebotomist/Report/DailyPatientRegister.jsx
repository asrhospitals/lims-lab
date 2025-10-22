import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
=======
import { RiSearchLine } from "react-icons/ri";
>>>>>>> updated code

import axios from "axios";
import { useForm } from "react-hook-form";
import { fetchPatientReportData } from "../../../services/apiService";
import PhlebotomistDataTable from "../../utils/PhlebotomistDataTable";

const DailyPatientRegister = () => {
  const [reportDoctors, setReportDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [patientFetchData, setPatientFetchData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(""); // Add this for end date
<<<<<<< HEAD
  const [searchbybarcode, setSearchByBarcode] = useState(""); // Add this for end date
=======

>>>>>>> updated code
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
        const response = await fetchPatientReportData(id);

<<<<<<< HEAD
=======
        console.log("response ==", response.data);

        // response.data should be the array
>>>>>>> updated code
        if (response?.data && Array.isArray(response.data)) {
          // Get today's date in YYYY-MM-DD format
          const today = new Date();
          const todayStr = today.toISOString().split("T")[0];

          // Filter patients registered today
          const todaysPatients = response.data.filter(
            (patient) => patient.p_regdate === todayStr
          );

          setPatientFetchData(todaysPatients);
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

<<<<<<< HEAD
  const handleSearch = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setIsLoading(true);

    try {
      const hospitalId = localStorage.getItem("hospital_id");
      const token = localStorage.getItem("authToken"); // Replace 'token' with your actual key

      const query = `startDate=${startDate}&endDate=${endDate}&hospitalId=${
        hospitalId || ""
      }`;

      const response = await fetch(
        `https://asrphleb.asrhospitalindia.in/api/v1/phleb/search-patient?${query}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // important for 401
          },
        }
      );

      if (response.status === 401) {
        alert("Unauthorized! Please login again.");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setPatientFetchData(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setPatientFetchData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!mapped || mapped.length === 0) {
      alert("No data to export!");
      return;
    }

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(mapped);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create blob and save file
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(
      data,
      `Daily_Patient_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };
=======
const handleSearch = async () => {
  if (!startDate) {
    alert("Please select a start date");
    return;
  }

  try {
    setIsLoading(true);
    const id = localStorage.getItem("hospital_id");

    // Get token from localStorage (or wherever you store it)
    const token = localStorage.getItem("auth_token"); // make sure you save token at login

    const response = await fetch(
      `https://asrphleb.asrhospitalindia.in/api/v1/phleb/search-patient?startDate=${startDate}&endDate=${endDate || new Date().toISOString().split("T")[0]}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // << important
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
>>>>>>> updated code

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
            </div>
          </div>

          {/* Search + Filter Section */}
<<<<<<< HEAD
          <div className="flex items-end gap-2 mb-4 flex-wrap">
            {/* From Date */}
            <div className="w-[150px]">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
              />
            </div>

            {/* To Date */}
            <div className="w-[150px]">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
              />
            </div>

            {/* Search Button */}
            <div>
              <button
                onClick={handleSearch}
                className="px-3 py-1 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105 text-sm"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
=======
          <div className="flex flex-col sm:flex-row items-end gap-4 mb-4 flex-wrap">
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              {/* Start Date */}
              <div className="flex-1 min-w-[160px]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2"
                  placeholder="End Date"
                />

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:scale-105 transition"
                >
                  Search
                </button>
              </div>
>>>>>>> updated code
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
