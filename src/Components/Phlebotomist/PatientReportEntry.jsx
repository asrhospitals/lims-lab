import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import PhlebotomistDataTable from "../utils/PhlebotomistDataTable";

const PatientReportEntry = () => {
  const [reportDoctors, setReportDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");

  const { setReportDoctorToUpdate } = useContext(AdminContext);  

  // Hardcoded data
  useEffect(() => {
    const data = [
      {
        id: 1,
        patientcode: "Mahukaram",
        patientname: "Cardiology",
        barcode: "MRN001",
        altbarcode: "9876543210",
        hospitalname: "john@example.com",
        registeredby: "Mumbai",
        dateofregistration: "Maharashtra",
      },
      {
        id: 2,
        patientcode: "Smitha",
        patientname: "Neurology",
        barcode: "MRN002",
        altbarcode: "9876543211",
        hospitalname: "jane@example.com",
        registeredby: "Delhi",
        dateofregistration: "Delhi",
      },
      {
        id: 3,
        patientcode: "Aparna",
        patientname: "Orthopedics",
        barcode: "MRN003",
        altbarcode: "9876543212",
        hospitalname: "alice@example.com",
        registeredby: "Bangalore",
        dateofregistration: "Karnataka",
      }
    ];

    setReportDoctors(data);
    setFilteredDoctors(data);
  }, []);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredDoctors(reportDoctors);
    } else {
      const lower = search.toLowerCase();
      const filtered = reportDoctors.filter((doc) =>
        (doc.patientcode || "").toLowerCase().includes(lower) ||
        (doc.patientname || "").toLowerCase().includes(lower) ||
        (doc.barcode || "").toLowerCase().includes(lower) ||
        (doc.altbarcode || "").toLowerCase().includes(lower) ||
        (doc.hospitalname || "").toLowerCase().includes(lower) ||
        (doc.registeredby || "").toLowerCase().includes(lower) ||
        (doc.dateofregistration || "").toLowerCase().includes(lower) 
      );
      setFilteredDoctors(filtered);
    }
  }, [search, reportDoctors]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "patientcode", label: "Patient Code" },
    { key: "patientname", label: "Patient Name" },
    { key: "barcode", label: "Barcode" },
    { key: "altbarcode", label: "Alt Barcode" },
    { key: "hospitalname", label: "Hospital Name" },
    { key: "registeredby", label: "Registered By" },
    { key: "dateofregistration", label: "Date of Registration" },

  ];

  const mappedItems = filteredDoctors.map((doc) => ({
    ...doc,
    status: doc.isactive ? "Active" : "Inactive",
  }));

  const handleUpdate = (item) => {
    setReportDoctorToUpdate(item);
    // navigate("/update-report-doctor"); // Optional if using navigation
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors">🏠 Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-report-doctor" className="text-gray-700 hover:text-teal-600 transition-colors">Report Entry</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">View</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Report Entry</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search report entry..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Table */}
          {mappedItems.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No report entry found.</div>
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

export default PatientReportEntry;
