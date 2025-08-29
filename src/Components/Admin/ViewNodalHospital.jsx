import React, { useEffect, useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";
import { viewNodalHospitals } from "../../services/apiService";

const ViewNodalHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNodalHospitals = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };

        const res = await viewNodalHospitals(params);
        const data = res.data.sort((a, b) => a.id - b.id);
        
        // Map the data to include status
        const enrichedData = data.map(item => ({
          ...item,
          status: item.isactive ? "Active" : "Inactive",
        }));

        setHospitals(enrichedData);
        setFiltered(enrichedData);
        setTotalPages(res?.meta?.totalPages || 1);
        setTotalItems(res?.meta?.totalItems || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch nodal hospitals.");
      } finally {
        setLoading(false);
      }
    };

    fetchNodalHospitals();
  }, [currentPage, itemsPerPage]);

  // Client-side search filtering
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(hospitals);
    } else {
      const s = search.toLowerCase();
      const filteredData = (hospitals || []).filter((h) =>
        (h.nodalName && h.nodalName.toLowerCase().includes(s)) ||
        (h.hospitalName && h.hospitalName.toLowerCase().includes(s)) ||
        (h.status && h.status.toLowerCase().includes(s))
      );
      setFiltered(filteredData);
    }
  }, [search, hospitals]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const regex = /^[a-zA-Z0-9_, ]*$/; // allow letters, numbers, underscore, comma, space
    if (regex.test(val)) {
      setSearch(val);
    }
  };

  const handleUpdate = (hospital) => {
    navigate(`/update-nodal-hospital/${hospital.id}`);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "nodalName", label: "Nodal Name" },
    { key: "hospitalName", label: "Hospital Name" },
    { key: "status", label: "Status" },
  ];

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
                className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors"
              >
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-nodal-hospitals"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Nodal Hospital
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View Nodal Hospital
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Nodal Hospital</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search nodal hospital..."
                  spellCheck={false}
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-600">
            <span>Total: {totalItems} items</span>
            <span>•</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-nodal-hospital")}
              className="ml-3 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add New
            </button>
          </div>

          {/* Table or Loading/Error */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No records found.</div>
          ) : (
            <DataTable
              items={filtered}
              columns={columns}
              serverSidePagination={true}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showDetailsButtons={false}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewNodalHospital;
