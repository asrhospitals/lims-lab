import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import DataTable from "../utils/DataTable";
// import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

const ViewTechnician = () => {
  const [technicians, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { setTechnicianToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://srv913743.hstgr.cloud:2000/lims/master/get-tech",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        
        // const data = response.data.sort((a, b) => Number(a.id) - Number(b.id));
        const data = (response.data || []).sort((a, b) => Number(a.id) - Number(b.id));


        setTechnicians(data);
        setFilteredTechnicians(data);
        // console.log(filteredTechnicians[0].isactive);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch Technicians.");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);


  useEffect(() => {
  if (!search.trim()) {
    setFilteredTechnicians(technicians);
  } else {
    const lower = search.toLowerCase();
    const filtered = (technicians || []).filter((h) =>
      (h.technicianName || "").toLowerCase().includes(lower) ||
      (h.addressLine || "").toLowerCase().includes(lower) ||
      (h.city || "").toLowerCase().includes(lower) ||
      (h.state || "").toLowerCase().includes(lower) ||
      (h.contactNo || "").toLowerCase().includes(lower) ||
      (h.nodal || "").toLowerCase().includes(lower)
    );
    setFilteredTechnicians(filtered);
  }
}, [search, technicians]);


  const handleUpdate = (technician) => {
    // console.log(filteredtechnicians[0].isactive);
    setTechnicianToUpdate(technician);
    localStorage.setItem("technicianToUpdate", JSON.stringify(technician));
    navigate("/update-technician");
  };

//   const activeCount = (technicians || []).filter((h) => h.isactive).length;
//   const inactiveCount = (technicians || []).length - activeCount;

  const columns = [
    { key: "id", label: "ID" },
    { key: "technicianName", label: "Technician Name" },
    { key: "contactNo", label: "Phone" },
    { key: "nodal", label: "Nodal" },
    { key: "roleType", label: "Role Type" },
    { key: "instrument", label: "Instrument" },
    { key: "dob", label: "DOB" },
    { key: "gender", label: "Gender" },
    { key: "pinCode", label: "Pin Code" },
    // { key: "city", label: "City" },
    // { key: "state", label: "State" },
    
    
    // status & action handled by DataTable
  ];

  const mappedItems = (filteredTechnicians || []).map((h) => ({
    ...h,
    id: h.id,
    technicianName: h.technicianName,
    contactNo: h.contactNo,
    nodal: h.nodal,
    roleType: h.roleType,
    instrument: h.instrument,
    dob: new Date(h.dob).toLocaleDateString("en-IN") || "-",
    gender: h.gender,
    pinCode: h.pinCode,
    city: h.city,
    state: h.state,
    status: h.isactive ? "Active" : "Inactive",
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
            to="/view-technician"
            className="text-gray-700 hover:text-teal-600 transition-colors"
            >
            Technicians
            </Link>
        </li>

        <li className="text-gray-400">/</li>

        <li aria-current="page" className="text-gray-500">
            View Technicians
        </li>
        </ol>
    </nav>
    </div>



      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">


          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Technician List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search Technician..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>


          {/* Add New */}
          <div className="flex  flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-technician")}
              className="ml-3 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add New
            </button>
          </div>
          



          {/* Table */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : filteredTechnicians.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No Technicians found.
            </div>
          ) : (
            <DataTable
              items={mappedItems}
              columns={columns}
              itemsPerPage={10}
              showDetailsButtons={false}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewTechnician;
