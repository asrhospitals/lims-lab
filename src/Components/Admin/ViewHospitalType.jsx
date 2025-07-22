import { useContext, useEffect, useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import DataTable from "../utils/DataTable";

const ViewHospitalType = () => {
  const [filteredHospitalTypes, setFilteredHospitalTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { hospitalTypes, setHospitalTypes, setHospitalTypeToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitalTypes = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-hsptltype",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = response.data || [];
        // Ensure data has proper keys: id, hsptltype, hsptldsc, isactive
        setHospitalTypes(data);
        setFilteredHospitalTypes(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch hospital types.");
      } finally {
        setLoading(false);
      }
    };
    fetchHospitalTypes();
  }, [setHospitalTypes]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredHospitalTypes(hospitalTypes);
    } else {
      const lower = search.toLowerCase();
      const filtered = hospitalTypes.filter(
        (t) =>
          (t.hsptltype?.toLowerCase().includes(lower) ||
          t.hsptldsc?.toLowerCase().includes(lower))
      );
      setFilteredHospitalTypes(filtered);
    }
  }, [search, hospitalTypes]);

  const handleUpdate = (hospitalType) => {
    setHospitalTypeToUpdate(hospitalType);
    navigate("/update-hospitaltype");
  };

  // Stats count for active and inactive hospital types
  // const activeCount = hospitalTypes.filter((t) => t.isactive).length;
  // const inactiveCount = hospitalTypes.length - activeCount;

  const columns = [
    { key: "id", label: "ID" },
    { key: "hsptltype", label: "Type" },
    { key: "hsptldsc", label: "Description" },
    { key: "status", label: "Status" },
  ];

  const mappedItems = filteredHospitalTypes.map((t) => ({
    id: t.id ?? Math.random().toString(36).substr(2, 9),
    hsptltype: t.hsptltype,
    hsptldsc: t.hsptldsc,
    isactive: t.isactive,
    status: t.isactive ? "Active" : "Inactive",
  }));

  // Handler for search input change with validation (allow only alphabets, numbers, underscore, comma, space)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    // Regex to allow alphabets, numbers, underscore, comma, space
    const regex = /^[a-zA-Z0-9_,\s]*$/;
    if (value === "" || regex.test(value)) {
      setSearch(value);
    }
  };

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
                to="/view-hospitaltype"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Hospital Type
              </Link>
            </li>

            <li className="text-gray-400">/</li>

            <li aria-current="page" className="text-gray-500">
              View Hospital Types
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full mt-14 sm:px-6 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Hospital Type List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search hospital type..."
                  title="Allowed characters: alphabets, numbers, underscore (_), comma (,), space"
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mb-4">
            
            <button
              onClick={() => navigate("/add-hospitaltype")}
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
          ) : filteredHospitalTypes.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No hospital types found.
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

export default ViewHospitalType;
