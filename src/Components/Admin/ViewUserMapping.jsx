import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";

const ViewUserMapping = () => {
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [nodals, setNodals] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.refresh) {
      fetchUsers();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchMasterData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

      const [hRes, nRes, rRes] = await Promise.all([
        fetch("https://asrlabs.asrhospitalindia.in/lims/master/get-hospital?page=1&limit=1000", { headers }),
        fetch("https://asrlabs.asrhospitalindia.in/lims/master/get-nodal?page=1&limit=1000", { headers }),
        fetch("https://asrlabs.asrhospitalindia.in/lims/master/get-role", { headers }),
      ]);

      const [hData, nData, rData] = await Promise.all([hRes.json(), nRes.json(), rRes.json()]);
      setHospitals(hData?.data || []);
      setNodals(nData?.data || []);
      setRoles(rData?.data || []);
    } catch (err) {
      console.error("Failed to fetch master data:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await fetch("https://asrlabs.asrhospitalindia.in/lims/authentication/get-all-users", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const sorted = (data || []).sort((a, b) => a.user_id - b.user_id);
      setUsers(sorted);
      setFilteredUsers(sorted);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchMasterData();
      await fetchUsers();
    })();
  }, []);

  const getHospitalName = (id) => hospitals.find((h) => h.id === id)?.hospitalname || "-";
  const getNodalName = (id) => nodals.find((n) => n.id === id)?.nodalname || "-";
  const getRoleName = (id) => roles.find((r) => r.id === id)?.roletype || "-";

  useEffect(() => {
    const q = search.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.first_name?.toLowerCase().includes(q) ||
        u.last_name?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        getHospitalName(u.hospital_id).toLowerCase().includes(q) ||
        getNodalName(u.nodal_id).toLowerCase().includes(q) ||
        getRoleName(u.role).toLowerCase().includes(q)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [search, users, hospitals, nodals, roles]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const mappedItems = paginatedUsers.map((u) => ({
    ...u,
    hospital_name: getHospitalName(u.hospital_id),
    nodal_name: getNodalName(u.nodal_id),
    role_name: getRoleName(u.role),
    module_name: u.module_name || u.module || (Array.isArray(u.modules) ? u.modules.join(", ") : "-"),
  }));

  const columns = [
    { key: "user_id", label: "ID" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "username", label: "Username" },
    { key: "role_name", label: "Role" },
    { key: "hospital_name", label: "Hospital" },
    { key: "nodal_name", label: "Nodal" },
    { key: "module_name", label: "Module" },
  ];

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/admin-dashboard" className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors">
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              User Mapping
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">User Mapping List</h2>
            <div className="relative w-full sm:w-56"> {/* ✅ FIXED: consistent width */}
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
              onClick={() => navigate("/add-user-mapping")}
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
              showDetailsButtons={false}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewUserMapping;
