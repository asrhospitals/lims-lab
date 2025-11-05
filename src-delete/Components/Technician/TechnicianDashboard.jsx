import React, { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";

export default function TechnicianDashboard() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(8);
  const [totalPages, setTotalPages] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mappedItems = [
    {
      slNo: 1,
      patientCode: "PT001",
      patientName: "John Smith",
      barCode: "BC123456789",
      hospitalName: "City General Hospital",
      registeredBy: "Dr. Sarah Johnson",
      dateOfRegistration: "15 Aug, 2024 09:30 AM",
      department: "Cardiology",
      testName: "ECG Test",
      status: "Pending Samples",
    },
    {
      slNo: 2,
      patientCode: "PT002",
      patientName: "Maria Garcia",
      barCode: "BC987654321",
      hospitalName: "Metro Health Center",
      registeredBy: "Nurse Jane Wilson",
      dateOfRegistration: "14 Aug, 2024 02:15 PM",
      department: "Pathology",
      testName: "Complete Blood Count",
      status: "Samples Under Processing",
    },
    {
      slNo: 3,
      patientCode: "PT003",
      patientName: "David Lee",
      barCode: "BC456789123",
      hospitalName: "Central Medical Institute",
      registeredBy: "Dr. Michael Brown",
      dateOfRegistration: "13 Aug, 2024 11:45 AM",
      department: "Radiology",
      testName: "CT Scan",
      status: "Samples Under Processing",
    },
    {
      slNo: 4,
      patientCode: "PT004",
      patientName: "Emily Chen",
      barCode: "BC789123456",
      hospitalName: "Riverside Hospital",
      registeredBy: "Dr. Lisa Anderson",
      dateOfRegistration: "12 Aug, 2024 04:20 PM",
      department: "Endocrinology",
      testName: "Thyroid Function Test",
      status: "Redo",
    },
  ];

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Pending Samples":
        return <span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>;
      case "Samples Under Processing":
        return <span className={`${base} bg-blue-100 text-blue-700`}>{status}</span>;
      case "Redo":
        return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
    }
  };

  const columns = [
    { key: "slNo", label: "SL NO" },
    { key: "patientCode", label: "PATIENT CODE" },
    { key: "patientName", label: "PATIENT NAME" },
    { key: "barCode", label: "BAR CODE" },
    { key: "hospitalName", label: "HOSPITAL NAME" },
    { key: "registeredBy", label: "REGISTERED BY" },
    { key: "dateOfRegistration", label: "DATE OF REGISTRATION" },
    { key: "department", label: "DEPARTMENT" },
    { key: "testName", label: "TEST NAME" },
    {
      key: "status",
      label: "STATUS",
      render: (item) => getStatusBadge(item.status),
    },
  ];

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => setItemsPerPage(size);
  const handleUpdate = (item) => alert(`Update ${item.patientName}`);

  // Filter based on search
  const filteredItems = mappedItems.filter(
    (p) =>
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.patientCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full mt-12 px-2 sm:px-6 space-y-4 text-sm">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Technician List
          </h2>
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="Search Technician..."
            />
            <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">{error}</div>
        ) : (
          <DataTable
            items={filteredItems}
            columns={columns}
            serverSidePagination={true}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showDetailsButtons={false}
          />
        )}
      </div>
    </div>
  );
}
