import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import DataTable from "../utils/DataTable";

const ViewReportTypeMaster = () => {
  const [reportTypes, setReportTypes] = useState([]);
  const [filteredReportTypes, setFilteredReportTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { setTechnicianToUpdate } = useContext(AdminContext); // optional
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportTypes = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlab-production.up.railway.app/lims/master/get-report",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = (response.data || []).sort((a, b) => Number(a.id) - Number(b.id));
        setReportTypes(data);
        setFilteredReportTypes(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch Report Types.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportTypes();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredReportTypes(reportTypes);
    } else {
      const lower = search.toLowerCase();
      const filtered = reportTypes.filter(
        (r) =>
          (r.reporttype || "").toLowerCase().includes(lower) ||
          (r.reportdescription || "").toLowerCase().includes(lower)
      );
      setFilteredReportTypes(filtered);
    }
  }, [search, reportTypes]);

  const handleUpdate = (reportType) => {
    setTechnicianToUpdate(reportType); // reuse context if needed
    localStorage.setItem("reportTypeToUpdate", JSON.stringify(reportType));
    navigate("/update-report-type-master");
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "reporttype", label: "Report Type" },
    { key: "reportdescription", label: "Description" },
    { key: "entrytype", label: "Entry Type" },
    { key: "entryvalues", label: "Entry Values" },
    { key: "status", label: "Status" },


    // { key: "createdAt", label: "Created At" },
    // { key: "updatedAt", label: "Updated At" },
  ];

  const mappedItems = filteredReportTypes.map((r) => ({
    ...r,
    entryvalues: (r.entryvalues || []).join(", "),
    createdAt: new Date(r.createdAt).toLocaleString("en-IN"),
    updatedAt: new Date(r.updatedAt).toLocaleString("en-IN"),
    status: r.isactive ? "Active" : "Inactive",
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
                to="/view-report-type-master"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Report Types
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View Report Types
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Report Type Master
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search Report Type..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Add New */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-report-type-master")}
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
          ) : filteredReportTypes.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No Report Types found.
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

export default ViewReportTypeMaster;
