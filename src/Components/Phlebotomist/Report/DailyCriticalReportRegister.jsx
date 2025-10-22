import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../../context/adminContext";
import PhlebotomistDataTable from "../../utils/PhlebotomistDataTable";
import { useForm } from "react-hook-form";

const DailyCriticalReportRegister = () => {
  const [reportDoctors, setReportDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState(""); // New state for date
  const [searchInvestigation, setSearchInvestigation] = useState("");
  const { setReportDoctorToUpdate } = useContext(AdminContext);
  const [searchBarcode, setSearchBarcode] = useState("");
  const [hospitalsList, setHospitalsList] = useState([]);
  const [startDate, setStartDate] = useState(""); // From Date

  const {
    register,
    formState: { errors },
  } = useForm();

  // Hardcoded data
  useEffect(() => {
    const data = [
      {
        id: 1,
        patientcode: "Mahukaram",
        patientname: "Cardiology",
        barcode: "MRN001",
        dateofregistration: "9876543210",
        hospitalname: "john@example.com",
        investigationregistrerd: "Mumbai",
   
      },
      {
        id: 2,
        patientcode: "Smitha",
        patientname: "Neurology",
        barcode: "MRN002",
        dateofregistration: "9876543211",
        hospitalname: "jane@example.com",
        investigationregistrerd: "Delhi",
 
      },
      {
        id: 3,
        patientcode: "Aparna",
        patientname: "Orthopedics",
        barcode: "MRN003",
        dateofregistration: "9876543212",
        hospitalname: "alice@example.com",
        investigationregistrerd: "Bangalore",
      },
    ];

    setReportDoctors(data);
    setFilteredDoctors(data);
  }, []);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-hospital?page=1&limit=1000",
          {
            headers: {
              Authorization: `Bearer ${token}`, // if your API requires Bearer token
            },
          }
        );

        if (response.data && response.data.data) {
          console.log("response.data", response.data);

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
               Daily Critical Report Register
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
            Daily Critical Report Register
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

          <div className="flex flex-col sm:flex-row items-end gap-4 mb-4 flex-wrap">
            {/* Hospital Select + Button */}
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-1 min-w-[250px]">
                <select
                  {...register("hospitalselected", {
                    required: "Hospital is required",
                  })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.hospitalselected
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:ring-2 transition`}
                >
                  <option value="">Select Hospital</option>
                  {hospitalsList.map((hospital) => (
                    <option key={hospital.value} value={hospital.value}>
                      {hospital.label}
                    </option>
                  ))}
                </select>
                {errors.hospitalselected && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.hospitalselected.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date Range + Button */}
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              {/* From Date */}
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

          {/* Table */}
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
