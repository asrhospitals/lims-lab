import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";
import { viewNodals } from "../../services/apiService";

const ViewNodal = () => {
  const [nodalLabs, setNodalLabs] = useState([]);
  const [filteredNodalLabs, setFilteredNodalLabs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNodalLabs = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };

        const res = await viewNodals(params);
        const data = res.data.sort((a, b) => a.id - b.id);
        
        setNodalLabs(data);
        setFilteredNodalLabs(data);
        setTotalPages(res?.meta?.totalPages || 1);
        setTotalItems(res?.meta?.totalItems || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch nodal labs.");
      } finally {
        setLoading(false);
      }
    };

    fetchNodalLabs();
  }, [currentPage, itemsPerPage]);

  // Client-side search filtering
  useEffect(() => {
    if (!search.trim()) {
      setFilteredNodalLabs(nodalLabs);
    } else {
      const lower = search.toLowerCase();
      const filtered = (nodalLabs || []).filter((n) =>
        (n.nodalname && n.nodalname.toLowerCase().includes(lower))
      );
      setFilteredNodalLabs(filtered);
    }
  }, [search, nodalLabs]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleUpdate = (nodal) => {
    navigate(`/update-nodal/${nodal.id}`);
  };

  // Columns reflect actual database column names and types
  const columns = [
    { key: "id", label: "ID" },
    { key: "nodalname", label: "Nodal Name" },
    { key: "motherlab", label: "Mother Lab" },
    { key: "status", label: "Status" },
  ];

  // Map nodal labs with exact fields and logic for status & motherlab display
  const mappedItems = filteredNodalLabs.map((n) => ({
    id: n.id ?? Math.random().toString(36).substring(2, 9),
    nodalname: n.nodalname,
    motherlab: n.motherlab ? "Yes" : "No",
    status: n.isactive ? "Active" : "Inactive",
    isactive: n.isactive, // for any internal use (optional)
  }));

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
                to="/view-nodal"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Nodal
              </Link>
            </li>

            <li className="text-gray-400">/</li>

            <li aria-current="page" className="text-gray-500">
              View Nodal
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Nodal Lab List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    // Optional: Restrict input to alphabets, numbers, underscore, comma
                    const val = e.target.value;
                    if (/^[a-zA-Z0-9_,\s]*$/.test(val)) {
                      setSearch(val);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search nodal lab..."
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

          {/* Add Button */}
          <div className="flex flex-wrap gap-2 mb-4 justify-start">
            <button
              onClick={() => navigate("/add-nodal")}
              className="ml-3 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add New
            </button>
          </div>

          {/* Table or Status */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : filteredNodalLabs.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No nodal labs found.
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

export default ViewNodal;
