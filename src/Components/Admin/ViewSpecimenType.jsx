import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";
import axios from "axios";
import { viewSpecimenTypes } from "../../services/apiService";

const ViewSpecimenType = () => {
  const [specimenTypes, setSpecimenTypes] = useState([]);
  const [filteredSpecimenTypes, setFilteredSpecimenTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    const fetchSpecimenTypes = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/api/lims/master/specimen-types",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data.data || [];

        setSpecimenTypes(data);
        setFilteredSpecimenTypes(data);
      } catch (error) {
        console.error("Error fetching specimen types:", error);
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
      const filtered = specimenTypes.filter(
        (item) =>
          (item.specimenname || "").toLowerCase().includes(lower) ||
          (item.specimendes || "").toLowerCase().includes(lower)
      );
      setFilteredSpecimenTypes(filtered);
    }
  }, [search, specimenTypes]);

  const handleUpdate = (specimenType) => {
    // Navigate and pass the ID in URL
    navigate(`/update-specimen-type/${specimenType.id}`);
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
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/admin-dashboard"
                className="text-gray-700 hover:text-teal-600"
              >
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-specimenType"
                className="text-gray-700 hover:text-teal-600"
              >
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
            <h2 className="text-xl font-bold text-gray-800">
              Specimen Type List
            </h2>
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
            <div className="text-center py-6 text-gray-500">
              No Specimen Types found.
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

export default ViewSpecimenType;
