import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";
import api from "../../services/axiosService";

const ViewUserDetails = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");

<<<<<<< HEAD
        // ✅ Use full URL to correct domain directly here
=======
        // ✅ Correct API URL
>>>>>>> main
        const res = await api.post(
          "https://asrauth.asrhospitalindia.in/lims/authentication/get-all-users",
          {
            userid: 1,
            otp: 7519,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sortedData = (res.data || []).sort((a, b) => a.user_id - b.user_id);

        setUsers(sortedData);
        setFilteredUsers(sortedData);
        setTotalItems(sortedData.length);
        setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
      } catch (err) {
        console.error("Fetch users error:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [itemsPerPage]);

  // Client-side search filtering
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.first_name?.toLowerCase().includes(lowerSearch) ||
          user.last_name?.toLowerCase().includes(lowerSearch) ||
          user.email?.toLowerCase().includes(lowerSearch)
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  }, [search, users]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // Actions function for DataTable
  const handleActions = (user) =>
    navigate(`/update-user-details/${user.user_id}`, { state: { user } });

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
    { key: "isactive", label: "Active" },
    { key: "updatedAt", label: "Updated At" },
  ];

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const mappedItems = paginatedUsers.map((user) => ({
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
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/admin-dashboard"
                className="inline-flex items-center text-gray-700 hover:text-teal-600"
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

      <div className="w-full mt-12 px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">User List</h2>
            <div className="relative w-full sm:w-56">
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

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-user")}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add New
            </button>
          </div>

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
              serverSidePagination={true}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onUpdate={handleActions}
              showDetailsButtons={true}
              tableContainerClass="overflow-x-auto max-h-[65vh]"
              stickyActionColumn={true}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewUserDetails;
