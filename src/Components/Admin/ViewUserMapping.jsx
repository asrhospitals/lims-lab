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

      const res = await fetch(
        "https://asrlabs.asrhospitalindia.in/lims/authentication/get-all-users",
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const userList = Array.isArray(data?.data) ? data.data : [];
      const sorted = userList.sort((a, b) => a.user_id - b.user_id);

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
       getHospitalName(u.hospitalid).toLowerCase().includes(q) ||
getNodalName(u.nodalid).toLowerCase().includes(q) ||
       getRoleName(Number(u.role)).toLowerCase().includes(q)

    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [search, users, hospitals, nodals, roles]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const mappedItems = paginatedUsers.map((u) => ({
    ...u,
    hospital_name: getHospitalName(u.hospitalid), 
nodal_name: getNodalName(u.nodalid), 
role_name: getRoleName(Number(u.role)),         
module_name: Array.isArray(u.module) ? u.module.join(", ") : "-", 
//  modified_by: u.modified_by || "-",    
 created_date: u.created_date || "-",          
  // modified_date: u.modified_date || "-", 
 modified_date: u.updatedAt
  ? new Date(u.updatedAt).toLocaleDateString("en-GB")
  : "-",

  // modified_date: u.modified_date ? u.modified_date : "-",
  
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
    // { key: "modified_by", label: "Modified By" },   
      { key: "created_date", label: "Created Date" },   // ✅ 
  { key: "modified_date", label: "Modified Date" }, 
  ];

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/admin-dashboard" className="text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">User Mapping</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">User Mapping List</h2>
            <div className="relative w-56">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Search User..."
              />
              <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
            </div>
          </div>

          <button
            onClick={() => navigate("/add-user-mapping")}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 mb-4"
          >
            Add New
          </button>

          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : (
            <DataTable
              items={mappedItems}
              columns={columns}
               showAction={false}  
              serverSidePagination={true}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setItemsPerPage}
              onUpdate={(row) => navigate(`/update-user-mapping/${row.user_id}`, { state: row })} // ✅ FIXED
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewUserMapping;
