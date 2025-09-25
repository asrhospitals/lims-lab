import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";

const ViewUserDetails = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  // Fetch users on page load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `https://asrlabs.asrhospitalindia.in/lims/authentication/get-all-users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log("Users data ===", data);

        setUsers(data); // API returns array
        setTotalItems(data.length);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };
  const handleUpdate = (user) => navigate(`/update-technician/${user.user_id}`);

  // Columns based on schema
  const columns = [
    { key: "user_id", label: "ID" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "wattsapp_number", label: "WhatsApp" },
    { key: "mobile_number", label: "Mobile" },
    { key: "gender", label: "Gender" },
    { key: "dob", label: "DOB" },
    { key: "username", label: "Username" },
    { key: "role", label: "Role" },
    { key: "isactive", label: "Active" },
    { key: "updatedAt", label: "Updated At" },
  ];

  // Filter users by search
  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(search.toLowerCase()) ||
      user.last_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const mappedItems = filteredUsers.map((user) => ({
    ...user,
    dob: user.dob ? new Date(user.dob).toLocaleDateString("en-IN") : "-",
    created_date: user.created_date
      ? new Date(user.created_date).toLocaleDateString("en-IN")
      : "-",
    createdAt: user.createdAt
      ? new Date(user.createdAt).toLocaleString("en-IN")
      : "-",
    updatedAt: user.updatedAt
      ? new Date(user.updatedAt).toLocaleString("en-IN")
      : "-",
    isactive: user.isactive ? "Active" : "Inactive",
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
                to="/admin-dashboard"
                className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors"
              >
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              User List
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              User List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search User..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-between mb-4 text-sm text-gray-600 gap-2">
            <button
              onClick={() => navigate("/add-user")}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add New
            </button>
            <div className="flex flex-wrap gap-2">
              <span>Total: {totalItems} items</span>
              <span>•</span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          {/* Data Table */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : mappedItems.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No Users found.</div>
          ) : (
            <DataTable
              items={mappedItems}
              columns={columns}
              serverSidePagination={false}
              showDetailsButtons={false}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewUserDetails;
