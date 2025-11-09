import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";

import DataTable from "../utils/DataTable";
import { viewRoles } from "../../services/apiService";

const ViewRole = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { roleToUpdate, setRoleToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, limit: itemsPerPage };
        const response = await viewRoles(params);
        const rolesData = response.data.sort((a, b) => a.id - b.id);

        setRoles(rolesData);
        setFilteredRoles(rolesData);
        setTotalPages(response?.meta?.totalPages || 1);
        setTotalItems(response?.meta?.totalItems || rolesData.length);
      } catch (err) {
        console.error("Failed to fetch roles:", err);
        setError(err?.response?.data?.message || "Failed to fetch roles.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [currentPage, itemsPerPage]);

  // Search filter
  useEffect(() => {
    const lower = search.toLowerCase();
    if (!lower.trim()) {
      setFilteredRoles(roles);
    } else {
      setFilteredRoles(
        roles.filter(
          (r) =>
            r.roletype?.toLowerCase().includes(lower) ||
            r.roledescription?.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, roles]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleUpdate = (role) => {
    setRoleToUpdate(role);
    localStorage.setItem("roleToUpdate", JSON.stringify(role));
    navigate("/update-role");
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "roletype", label: "Role Type" },
    { key: "roledescription", label: "Role Description" },
    { key: "status", label: "Status" },
  ];

  const mappedItems = filteredRoles.map((r) => ({
    id: r.id ?? Math.random().toString(36).substr(2, 9),
    roletype: r.roletype || "",
    roledescription: r.roledescription || "",
    isactive: !!r.isactive,
    status: r.isactive ? "Active" : "Inactive",
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
            {/* <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-roles"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Roles
              </Link>
            </li> */}
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View Role
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Role List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search role type or description..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-600">
            <span>Total: {totalItems} items</span>
            <span>•</span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Add Button */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-role")}
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
          ) : filteredRoles.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No roles found.
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

export default ViewRole;
