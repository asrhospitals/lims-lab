import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import DataTable from "../utils/DataTable";
// import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

const ViewPhlebotomist = () => {
  const [phlebotomists, setPhlebotomists] = useState([]);
  const [filteredPhlebotomists, setFilteredPhlebotomists] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { setPhlebotomistToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhlebotomists = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://srv913743.hstgr.cloud:2000/lims/master/get-phlebo",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        
        const data = response.data.sort((a, b) => Number(a.id) - Number(b.id));

        setPhlebotomists(data);
        setFilteredPhlebotomists(data);
        // console.log(filteredPhlebotomists[0].isActive);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch Phlebotomists.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhlebotomists();
  }, []);


  useEffect(() => {
  if (!search.trim()) {
    setFilteredPhlebotomists(phlebotomists);
  } else {
    const lower = search.toLowerCase();
    const filtered = (phlebotomists || []).filter((h) =>
      (h.phleboName || "").toLowerCase().includes(lower) ||
      (h.addressLine || "").toLowerCase().includes(lower) ||
      (h.city || "").toLowerCase().includes(lower) ||
      (h.state || "").toLowerCase().includes(lower) ||
      (h.contactNo || "").toLowerCase().includes(lower) ||
      (h.nodal || "").toLowerCase().includes(lower)
    );
    setFilteredPhlebotomists(filtered);
  }
}, [search, phlebotomists]);


  const handleUpdate = (phlebotomist) => {
    // console.log(filteredphlebotomists[0].isActive);
    setPhlebotomistToUpdate(phlebotomist);
    localStorage.setItem("phlebotomistToUpdate", JSON.stringify(phlebotomist));
    navigate("/update-phlebotomist");
  };

//   const activeCount = (phlebotomists || []).filter((h) => h.isActive).length;
//   const inactiveCount = (phlebotomists || []).length - activeCount;

  const columns = [
    { key: "id", label: "ID" },
    { key: "phleboName", label: "phlebotomist Name" },
    { key: "contactNo", label: "Phone" },
    { key: "nodal", label: "Nodal" },
    { key: "dob", label: "DOB" },
    { key: "gender", label: "Gender" },
    { key: "pinCode", label: "Pin Code" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "status", label: "Status" },
    
    
    // status & action handled by DataTable
  ];

  const mappedItems = (filteredPhlebotomists || []).map((h) => ({
    ...h,
    id: h.id,
    phleboName: h.phleboName,
    contactNo: h.contactNo,
    nodal: h.nodal,
    dob: new Date(h.dob).toLocaleDateString("en-IN") || "-",
    gender: h.gender,
    pinCode: h.pinCode,
    city: h.city,
    state: h.state,
    status: h.isActive ? "Active" : "Inactive",
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
            to="/view-phlebotomist"
            className="text-gray-700 hover:text-teal-600 transition-colors"
            >
            Phlebotomists
            </Link>
        </li>

        <li className="text-gray-400">/</li>

        <li aria-current="page" className="text-gray-500">
            View Phlebotomists
        </li>
        </ol>
    </nav>
    </div>



      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">


          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Phlebotomist List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search Phlebotomist..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>


          {/* Add New */}
          <div className="flex  flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-phlebotomist")}
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
          ) : filteredPhlebotomists.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No Phlebotomists found.
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

export default ViewPhlebotomist;
