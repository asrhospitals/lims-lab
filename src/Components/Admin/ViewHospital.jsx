import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import DataTable from "../utils/DataTable";

const ViewHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { setHospitalToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-hospital",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = response.data.sort((a, b) => a.id - b.id);
        setHospitals(data);
        setFilteredHospitals(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch hospitals.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredHospitals(hospitals);
    } else {
      const lower = search.toLowerCase();
      const filtered = (hospitals || []).filter(
        (h) =>
          (h.hospitalname && h.hospitalname.toLowerCase().includes(lower)) ||
          (h.city && h.city.toLowerCase().includes(lower)) ||
          (h.district && h.district.toLowerCase().includes(lower)) ||
          (h.hsptltype && h.hsptltype.toLowerCase().includes(lower)) ||
          (h.address && h.address.toLowerCase().includes(lower)) ||
          (h.email && h.email.toLowerCase().includes(lower)) ||
          (h.phoneno && h.phoneno.toLowerCase().includes(lower)) ||
          (h.cntprsn && h.cntprsn.toLowerCase().includes(lower)) ||
          (h.cntprsnmob && h.cntprsnmob.toLowerCase().includes(lower))
      );
      setFilteredHospitals(filtered);
    }
  }, [search, hospitals]);

  const handleUpdate = (hospital) => {
    setHospitalToUpdate(hospital);
    localStorage.setItem("hospitalToUpdate", JSON.stringify(hospital));
    navigate("/update-hospital");
  };

  // const activeCount = (hospitals || []).filter((h) => h.isactive).length;
  // const inactiveCount = (hospitals || []).length - activeCount;

  const columns = [
    { key: "id", label: "ID" },
    { key: "hospitalname", label: "Hospital Name" },
    { key: "hsptltype", label: "Type" },
    { key: "city", label: "City" },
    { key: "district", label: "District" },
    { key: "phoneno", label: "Phone" },
    { key: "status", label: "Status" },
    // status & action handled by DataTable
  ];

  // Map data to match columns & add status text
  const mappedItems = (filteredHospitals || []).map((h) => ({
    ...h,
    status: h.isactive ? "Active" : "Inactive",
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
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors"
              >
                🏠︎ Home
              </Link>
            </li>

            <li className="text-gray-400">/</li>

            <li>
              <Link
                to="/view-hospital"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Hospital
              </Link>
            </li>

            <li className="text-gray-400">/</li>

            <li aria-current="page" className="text-gray-500">
              View Hospitals
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Hospital List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    // Optional: Restrict input to alphabets, numbers, underscore, comma
                    const val = e.target.value;
                    if (/^[a-zA-Z0-9_,\s]*$/.test(val)) {
                      setSearch(val);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search hospital..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Add New */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-hospital")}
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
          ) : filteredHospitals.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No hospitals found.
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

export default ViewHospital;
