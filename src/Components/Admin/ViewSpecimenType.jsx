import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import DataTable from "../utils/DataTable";

const ViewSpecimenType = () => {
  const [specimenTypes, setSpecimenTypes] = useState([]);
  const [filteredSpecimenTypes, setFilteredSpecimenTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { setSpecimenTypeToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    const fetchSpecimenTypes = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlab-production.up.railway.app/lims/master/get-specimen",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = (response.data || []).sort((a, b) => Number(a.id) - Number(b.id));
        setSpecimenTypes(data);
        setFilteredSpecimenTypes(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch Specimen Types.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecimenTypes();
  }, []);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredSpecimenTypes(specimenTypes);
    } else {
      const lower = search.toLowerCase();
      const filtered = specimenTypes.filter((item) =>
        (item.specimenname || "").toLowerCase().includes(lower) ||
        (item.specimendes || "").toLowerCase().includes(lower)
      );
      setFilteredSpecimenTypes(filtered);
    }
  }, [search, specimenTypes]);

  const handleUpdate = (specimenType) => {
    setSpecimenTypeToUpdate(specimenType);
    localStorage.setItem("specimenTypeToUpdate", JSON.stringify(specimenType));
    navigate("/update-specimen-type");
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "specimenname", label: "Specimen Name" },
    { key: "specimendes", label: "Description" },
    // { key: "status", label: "Status" },
    { key: "status", label: "Status" },
  ];

  const mappedItems = filteredSpecimenTypes.map((item) => ({
    ...item,
    status: item.isactive ? "Active" : "Inactive",
  }));

  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-sm font-medium px-4 py-2 bg-gray-50 border-b shadow-md">
          <ol className="inline-flex items-center space-x-2 sm:space-x-3">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-specimenType" className="text-gray-700 hover:text-teal-600">
                Specimen Types
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">View Specimen Types</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-16 px-2 sm:px-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4 space-y-4">

          {/* Header + Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">Specimen Type List</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search Specimen Type..."
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-red-500 text-sm"
                  >
                    ✖
                  </button>
                )}
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Add New */}
          <div>
            <button
              onClick={() => navigate("/add-specimen-type")}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow transition-transform transform hover:scale-105"
            >
              + Add New
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : mappedItems.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No Specimen Types found.</div>
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

export default ViewSpecimenType;
