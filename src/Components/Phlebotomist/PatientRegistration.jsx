import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DataTable from "../utils/DataTable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const PatientRegistration = () => { 
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pBarcode, setPBarcode] = useState("");
  const navigate = useNavigate();
const [searchValue, setSearchValue] = useState("");



  // 🔹 Initial Fetch Patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setError("");
        const hospitalIdLocalStorage = localStorage.getItem("hospital_id");
        const authToken = localStorage.getItem("authToken");

        const response = await fetch(
          `https://asrphleb.asrhospitalindia.in/api/v1/phleb/get-patient-data/${hospitalIdLocalStorage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();

        const formattedData = (result.data || []).map((item) => ({
          id: item.id,
          p_name: item.p_name,
          pbarcode: item.patientPPModes?.[0]?.pbarcode ?? "-",
          p_age: item.p_age,
          p_gender: item.p_gender,
          p_mobile: item.p_mobile,
          hospital_name: item.hospital?.hospitalname ?? "-",
          p_regdate: item.p_regdate,
          reg_by: item.reg_by,
          registration_status: item.registration_status ?? "-",
  billstatus: item.patientBills?.[0]?.billstatus ?? "-",

        }));

        setPatients(formattedData);
        setFilteredPatients(formattedData);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to fetch patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // 🔹 Search Filter
  useEffect(() => {
    let filtered = [...patients];
    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.p_name || "").toLowerCase().includes(lower) ||
          (item.p_mobile || "").includes(lower)
      );
    }
    setFilteredPatients(filtered);
  }, [search, patients]);

  // 🔹 Fetch by Date / Barcode
const fetchPatientsBySearch = async () => {
  if (!searchValue && !fromDate && !toDate) {
    alert("Please enter a search value or date range.");
    return;
  }

  try {
    setLoading(true);
    setError("");
    const authToken = localStorage.getItem("authToken");
    const hospitalId = localStorage.getItem("hospital_id") || 2;

    const buildUrl = (param, value) => {
      const query = [];
      if (fromDate) query.push(`startDate=${fromDate}`);
      if (toDate) query.push(`endDate=${toDate}`);
      if (value) query.push(`${param}=${encodeURIComponent(value)}`);
      return `https://asrphleb.asrhospitalindia.in/api/v1/phleb/search-patient/${hospitalId}?${query.join("&")}`;
    };

    let patientsArray = [];

    // Sequential search params
    const searchParams = ["pbarcode", "p_mobile", "p_name", "refdoc", "department"];
    const validBillStatus = ["Paid", "Pending", "Partial"];

    // Loop through search params
    for (const param of searchParams) {
      const url = buildUrl(param, searchValue);
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        patientsArray = result.data || [];
        if (patientsArray.length > 0) break; // stop if found
      }
    }

    // Try billstatus last if still no data
    if (patientsArray.length === 0 && validBillStatus.includes(searchValue)) {
      const url = buildUrl("billstatus", searchValue);
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });
      if (response.ok) {
        const result = await response.json();
        patientsArray = result.data || [];
      }
    }

    // Format data
    const formattedData = patientsArray.map((item, idx) => ({
      id: item.id || idx + 1,
      p_name: item.p_name,
      pbarcode: item.patientPPModes?.[0]?.pbarcode ?? "-",
      p_age: item.p_age,
      p_gender: item.p_gender,
      p_mobile: item.p_mobile ?? "-",
      hospital_name: item.hospital?.hospitalname ?? "-",
      p_regdate: item.p_regdate,
      registration_status: item.patientBills?.[0]?.billstatus ?? "-",
      refdoc: item.patientPPModes?.[0]?.refdoc ?? "-",
      department: item.patientTests?.[0]?.investigation?.department?.dptname ?? "-",
    }));

    setPatients(formattedData);
    setFilteredPatients(formattedData);
    setError(formattedData.length === 0 ? "No patients found." : "");
  } catch (err) {
    console.error("Error fetching patients:", err);
    setError(err.message || "Failed to fetch patients.");
  } finally {
    setLoading(false);
  }
};






  // 🔹 Export to Excel
  const handleExportExcel = () => {
    if (!filteredPatients || filteredPatients.length === 0) {
      alert("No data to export");
      return;
    }

    const exportData = filteredPatients.map((item) => ({
      ID: item.id,
      "Patient Code": item.pbarcode,
      Name: item.p_name,
      Age: item.p_age,
      Gender: item.p_gender,
      Mobile: item.p_mobile,
      Hospital: item.hospital_name,
      "Registration Date": item.p_regdate
        ? new Date(item.p_regdate).toLocaleDateString()
        : "-",
      Status: item.registration_status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "PatientRegistration.xlsx");
  };

  // 🔹 Table Columns
  const columns = [
    { key: "id", label: "ID" },
    { key: "pbarcode", label: "Bar Code" },
    { key: "p_name", label: "Name" },
    { key: "p_age", label: "Age" },
    { key: "p_gender", label: "Gender" },
    { key: "p_mobile", label: "Mobile" },
    { key: "hospital_name", label: "Hospital" },
    { key: "billstatus", label: "Bill Status" },
    { key: "p_regdate", label: "Registration Date" },
    { key: "reg_by", label: "Registered By" },


  ];

  const mappedItems = filteredPatients.map((item) => ({
    ...item,
    p_regdate: item.p_regdate
      ? new Date(item.p_regdate).toLocaleDateString()
      : "-",
  }));

  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600"
              >
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/patient-registration"
                className="text-gray-700 hover:text-teal-600"
              >
                Patients
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">View Patients</li>
          </ol>
        </nav>
      </div>

      {/* Content */}
      <div className="w-full mt-12 px-2 sm:px-4 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header & Export */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Patient Registration List
            </h2>

            <div className="flex flex-row gap-3">
              <div
                onClick={handleExportExcel}
                className="bg-green-100 rounded-lg p-2 cursor-pointer hover:bg-green-200 transition flex items-center justify-center"
              >
                <img src="./excel.png" alt="Export to Excel" className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Add Patient Button */}
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/patient-registration-add")}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 w-full sm:w-auto"
            >
              Add Patient
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-8">
            <div className="flex flex-col w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border px-3 py-2 rounded w-full md:w-48"
              />
            </div>

            <div className="flex flex-col w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border px-3 py-2 rounded w-full md:w-48"
              />
            </div>

      <div className="flex w-full md:w-auto items-end gap-2">
  <div className="flex flex-col w-full md:w-72">
    <label className="block text-sm font-medium text-gray-700">
      Search by any
    </label>
    <input
      type="text"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="Enter name, barcode, mobile, ref doc, bill status, or department"
      className="border px-3 py-2 rounded w-full"
    />
  </div>

  <button
    type="button"
    onClick={fetchPatientsBySearch}
    className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 w-full md:w-auto"
  >
    Search
  </button>
</div>

          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-6 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center py-6 text-red-500">{error}</div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No patients found.
              </div>
            ) : (
              <DataTable
                items={mappedItems}
                columns={columns}
                itemsPerPage={10}
                showDetailsButtons={false}
                onUpdate={(patient) =>
               navigate(`/update-patient-details/${patient.id}`)
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientRegistration;
