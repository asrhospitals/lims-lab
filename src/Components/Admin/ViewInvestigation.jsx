import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";
import { viewInvestigations } from "../../services/apiService";

const ViewInvestigation = () => {
  const [investigations, setInvestigations] = useState([]);
  const [filteredInvestigations, setFilteredInvestigations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalItems, setTotalItems] = useState(0);
   const [itemsPerPage, setItemsPerPage] = useState(10);
   

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestigations = async () => {
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };
        const response = await viewInvestigations(params);

        const data = (response.data || []).sort(
          (a, b) => Number(a.investigation_id) - Number(b.investigation_id)
        );

        setInvestigations(data);
        setFilteredInvestigations(data);
         setTotalPages(response?.meta?.totalPages || 1);
        setTotalItems(response?.meta?.totalItems || 0);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch Investigations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvestigations();
  },[currentPage, itemsPerPage]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredInvestigations(investigations);
    } else {
      const lower = search.toLowerCase();
      const filtered = (investigations || []).filter(
        (item) =>
          (item.testname || "").toLowerCase().includes(lower) ||
          (item.department || "").toLowerCase().includes(lower)
      );
      setFilteredInvestigations(filtered);
    }
  }, [search, investigations]);

  const handleUpdate = (investigation) => {
    navigate(`/update-investigation/${investigation.investigation_id}`);
  };

  const handleViewDetails = (investigation) => {
    navigate(`/view-investigation-details/${investigation.investigation_id}`);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
   const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };
  const columns = [
    { key: "id", label: "ID" },
    { key: "testname", label: "Test Name" },
    { key: "shortcode", label: "Short Code" },
    { key: "department", label: "Department" },
    { key: "status", label: "Status" },
  ];

  const mappedItems = (filteredInvestigations || []).map((item, index) => ({
    ...item,
    id: index + 1,
    investigation_id: item.id,
    shortcode: item.shortcode,
    testname: item.testname,
    department:
      item.department && typeof item.department === "object"
        ? item.department.dptname
        : item.department || "-", // fallback if null or undefined
    status: item.status ? "Active" : "Inactive",
  }));
  
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
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-investigation"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Investigations
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View Investigations
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Investigation List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search Investigation..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Add New */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-investigation")}
              className="ml-3 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add Investigation
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : filteredInvestigations.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No Investigations found.
            </div>
          ) : (
            <DataTable
              items={mappedItems}
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

export default ViewInvestigation;
