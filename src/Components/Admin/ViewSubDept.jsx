import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";
import { viewSubDepartments } from "../../services/apiService";

const ViewSubDpt = () => {
  const [subDpts, setSubDpts] = useState([]);
  const [filteredSubDpts, setFilteredSubDpts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubDepartments = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };

        const res = await viewSubDepartments(params);
        const sortedData = res?.data.sort((a, b) => a.id - b.id);
        
        setSubDpts(sortedData);
        setFilteredSubDpts(sortedData);
        setTotalPages(res?.meta?.totalPages || 1);
        setTotalItems(res?.meta?.totalItems || 0);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch sub-departments."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSubDepartments();
  }, [currentPage, itemsPerPage]);

  // Client-side search filtering
  useEffect(() => {
    if (!search.trim()) {
      setFilteredSubDpts(subDpts);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = subDpts.filter(
        (item) =>
          item.subdptname?.toLowerCase().includes(lowerSearch) ||
          item.department?.dptname?.toLowerCase().includes(lowerSearch)
      );
      setFilteredSubDpts(filtered);
    }
  }, [search, subDpts]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleUpdate = (subDpt) => {
    navigate(`/update-subDpt/${subDpt.id}`);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "dptname", label: "Department" },
    { key: "subdptname", label: "Sub-Department" },
    { key: "status", label: "Status" },
  ];

  const mappedItems = filteredSubDpts.map((item) => ({
    id: item.id,
    dptname: item.department.dptname,
    subdptname: item.subdptname,
    isactive: item.isactive,
    status: item.isactive ? "Active" : "Inactive",
  }));

  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg"
          aria-label="Breadcrumb"
        >
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
                to="/view-subDpt"
                className="text-gray-700 hover:text-teal-600"
              >
                Sub Department
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500" aria-current="page">
              Add Sub Department
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Sub-Department List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="Search sub-department..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-subDpt")}
              className="ml-3 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add New
            </button>
          </div>

          {/* Data Table */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : filteredSubDpts.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No sub-departments found.
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
              onUpdate={handleUpdate}
              showDetailsButtons={false}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewSubDpt;
