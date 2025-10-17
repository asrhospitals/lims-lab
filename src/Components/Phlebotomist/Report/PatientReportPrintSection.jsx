import { useContext, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../../context/adminContext";
import PrintSectionDataTable from "../../utils/PrintSectionDataTable";
import { fetchPatientReportData } from "../../../services/apiService";

const PatientReportPrintSection = () => {
  const [reportDoctors, setReportDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState(""); // New state for date
  const [searchInvestigation, setSearchInvestigation] = useState("");
  const { setReportDoctorToUpdate } = useContext(AdminContext);
  const [searchBarcode, setSearchBarcode] = useState("");
  const [patientFetchData, setPatientFetchData] = useState([]);
  const [endDate, setEndDate] = useState(""); // To store the "To" date
  const [isLoading, setIsLoading] = useState(false); // Loading state for API

  // Hardcoded data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const id = localStorage.getItem("hospital_id");
        const response = await fetchPatientReportData(id);

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
    // navigate("/update-report-doctor"); // Optional if using navigation
  };



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
          (doc.investigationregistrerd || "").toLowerCase().includes(lower) ||
          (doc.reportready || "").toLowerCase().includes(lower) ||
          (doc.reportpending || "").toLowerCase().includes(lower)
      );
      setFilteredDoctors(filtered);
    }
  }, [search, reportDoctors]);

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
      alert("No data available to export!");
      return;
    }

    // Format headers using column labels
    const formattedData = mapped.map((row) => {
      const formattedRow = {};
      columns.forEach((col) => {
        formattedRow[col.label] = row[col.key];
      });
      return formattedRow;
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patient Report");

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Download file
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(
      blob,
      `Daily_Patient_Registration_${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );
  };



const handlePrintInvoice = (patient) => {
  // ✅ Get hospital name from localStorage (with fallback)
  const hospitalName = localStorage.getItem("hospital_name") || "ASR Hospitals";

  const invoiceWindow = window.open("", "_blank", "width=900,height=1000");

  if (!invoiceWindow) {
    alert("Please allow pop-ups to view the invoice.");
    return;
  }

  const invoiceHTML = `
    <html>
      <head>
        <title>Invoice - ${patient.patientname}</title>
        <style>
          body {
            font-family: "Poppins", Arial, sans-serif;
            background-color: #f9f8ff;
            margin: 0;
            padding: 30px;
            color: #333;
          }

          .invoice-container {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(120, 81, 169, 0.1);
            padding: 30px 40px;
            border-top: 5px solid #6b21a8;
          }

          .header {
            text-align: center;
            margin-bottom: 30px;
          }

          .header h1 {
            margin: 0;
            color: #6b21a8;
            font-size: 28px;
            letter-spacing: 0.5px;
          }

          .header h3 {
            margin: 4px 0;
            color: #7e22ce;
            font-weight: 500;
          }

          .divider {
            border-top: 2px solid #a855f7;
            margin: 20px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th, td {
            text-align: left;
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
          }

          th {
            background-color: #f3e8ff;
            color: #5b21b6;
            font-weight: 600;
            border-bottom: 2px solid #c084fc;
          }

          tr:hover {
            background-color: #faf5ff;
          }

          .highlight {
            background: #f3e8ff;
            border-left: 4px solid #a855f7;
            padding: 12px;
            margin-top: 20px;
            border-radius: 8px;
          }

          .footer {
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            margin-top: 40px;
          }

          .footer p {
            margin: 3px 0;
          }

          .print-btn {
            display: inline-block;
            background-color: #7e22ce;
            color: white;
            border: none;
            padding: 10px 18px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 20px;
            transition: 0.3s;
          }

          .print-btn:hover {
            background-color: #6b21a8;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>${hospitalName}</h1>
            <h3>Patient Invoice</h3>
          </div>

          <div class="divider"></div>

          <table>
            <tr><th>Patient Code</th><td>${patient.patientcode}</td></tr>
            <tr><th>Patient Name</th><td>${patient.patientname}</td></tr>
            <tr><th>Barcode</th><td>${patient.barcode}</td></tr>
            <tr><th>Date of Registration</th><td>${patient.dateofregistration}</td></tr>
            <tr><th>Hospital Name</th><td>${patient.hospitalname}</td></tr>
            <tr><th>Investigation Registered</th><td>${patient.investigationregistrerd}</td></tr>
            <tr><th>Report Ready</th><td>${patient.reportready}</td></tr>
            <tr><th>Report Pending</th><td>${patient.reportpending}</td></tr>
          </table>

          <div class="highlight">
            <strong>Note:</strong> Please carry this invoice during your next visit. For billing queries, contact ${hospitalName} billing desk.
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>© ${new Date().getFullYear()} ${hospitalName}. All Rights Reserved.</p>
            <button class="print-btn" onclick="window.print()">🖨️ Print Invoice</button>
          </div>
        </div>
      </body>
    </html>
  `;

  invoiceWindow.document.write(invoiceHTML);
  invoiceWindow.document.close();
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
                Patient Report Print Section
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
              Patient Report Print Section
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
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3 mb-4">
            {/* Search by Investigation + Barcode + Date */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchInvestigation}
                  onChange={(e) => setSearchInvestigation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search by Investigation..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>

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

              <div className="relative flex-4 sm:w-64">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
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
          {patientFetchData.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No report entry found.
            </div>
          ) : (
            <PrintSectionDataTable
              items={mapped}
              columns={columns}
              itemsPerPage={10}
              showDetailsButtons={false}
              onUpdate={handleUpdate}
                onPrint={handlePrintInvoice}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PatientReportPrintSection;
