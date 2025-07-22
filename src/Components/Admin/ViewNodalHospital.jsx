import React, { useContext, useEffect, useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";
import AdminContext from "../../context/adminContext";

const ViewNodalHospital = () => {
  const [hospitals, setHospitals] = useState([]); // Combined enriched data
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { setNodalHospitalToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem("authToken");
        // Fetch nodal master data
        const nodalResp = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-nodal",
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        const nodalData = nodalResp.data || [];

        // Fetch hospital master data
        const hospitalResp = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-hospital",
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        const hospitalData = hospitalResp.data || [];

        // Fetch combined nodalhospital relations (with only IDs)
        const nodalHospitalResp = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-nodalhospital",
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        const nodalHospitalData = nodalHospitalResp.data || [];

        // Create maps for quick lookup
        const nodalMap = new Map();
        nodalData.forEach(n => nodalMap.set(n.id, n.nodalname));

        const hospitalMap = new Map();
        hospitalData.forEach(h => hospitalMap.set(h.id, h.hospitalname));

        // Enrich nodalHospitalData with names
        const enrichedData = nodalHospitalData.map(item => ({
          ...item,
          nodalname: nodalMap.get(item.nodalid) ?? "-",
          hospitalname: hospitalMap.get(item.hospitalid) ?? "-",
          status: item.isactive ? "Active" : "Inactive",
        }));

        setHospitals(enrichedData);
        setFiltered(enrichedData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const regex = /^[a-zA-Z0-9_, ]*$/; // allow letters, numbers, underscore, comma, space
    if (regex.test(val)) {
      setSearch(val);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(hospitals);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        hospitals.filter(
          (h) =>
            (h.nodalid && String(h.nodalid).toLowerCase().includes(s)) ||
            (h.hospitalid && String(h.hospitalid).toLowerCase().includes(s)) ||
            (h.nodalname.toLowerCase().includes(s)) ||
            (h.hospitalname.toLowerCase().includes(s))
        )
      );
    }
  }, [search, hospitals]);

  const handleUpdate = (hospital) => {
    localStorage.setItem("nodalHospitalToUpdate", JSON.stringify(hospital));
    setNodalHospitalToUpdate(hospital);
    navigate("/update-nodal-hospital");
  };

  const columns = [
    { key: "nodalid", label: "Nodal ID" },
    { key: "hospitalid", label: "Hospital ID" },
    { key: "nodalname", label: "Nodal Name" },
    { key: "hospitalname", label: "Hospital Name" },
    { key: "status", label: "Status" },
  ];

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
                to="/view-nodal-hospitals"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Nodal Hospital
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View Nodal Hospital
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full mt-12 px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Nodal Hospital</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search nodal hospital..."
                  spellCheck={false}
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-nodal-hospital")}
              className="ml-3 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add New
            </button>
          </div>

          {/* Table or Loading/Error */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No records found.</div>
          ) : (
            <DataTable
              items={filtered}
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

export default ViewNodalHospital;
