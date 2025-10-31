import { useContext, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom"; // ✅ added useLocation
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import DataTable from "../utils/DataTable";
import { viewNodalInstruments } from "../../services/apiService";

const ViewNodalInstrument = () => {
  const [instruments, setInstruments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();
  const location = useLocation(); // ✅ added
  const { setNodalInstrumentToUpdate } = useContext(AdminContext);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // ✅ Refresh logic after update
  useEffect(() => {
    if (location.state?.refresh) {
      setCurrentPage(1); // triggers existing fetchAll useEffect
      navigate(location.pathname, { replace: true }); // remove state to prevent loop
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, limit: itemsPerPage };
        const response = await viewNodalInstruments(params);

        const data = (response.data || []).sort(
          (a, b) => Number(a.instruments_id) - Number(b.instruments_id)
        );

        setInstruments(data);
        setFiltered(data);
        setTotalPages(response?.meta?.totalPages || 1);
        setTotalItems(response?.meta?.totalItems || 0);
      } catch (err) {
        console.error("Failed to fetch nodal instruments:", err);
        setError(
          err.response?.data?.message || "Failed to fetch nodal instruments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [currentPage, itemsPerPage]);

  // Search filter
  useEffect(() => {
    const term = search.toLowerCase().trim();
    if (!term) {
      setFiltered(instruments);
    } else {
      const result = instruments.filter(
        (i) =>
          (i.nodalName &&
            i.nodalName.toLowerCase().includes(term)) ||
          (i.instrumentName &&
            i.instrumentName.toLowerCase().includes(term))
      );
      setFiltered(result);
    }
  }, [search, instruments]);

  const handleUpdate = (instrument) => {
    setNodalInstrumentToUpdate(instrument);
    localStorage.setItem("nodalinstrumentToUpdate", JSON.stringify(instrument));
     navigate(`/update-nodal-instrument/${instrument.id}`);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "instrumentname", label: "Instrument" },
    { key: "nodalname", label: "Nodal" },
    { key: "status", label: "Status" },
  ];

  const mappedItems = filtered.map((i) => ({
    id: i.id ?? Math.random().toString(36).substring(2, 9),
    instrumentname: i.instrumentName || "-",
    nodalname: i.nodalName || "-",
    status: i.isactive ? "Active" : "Inactive",
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
                to="/view-nodal-instruments"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Nodal Instrument
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View Nodal Instruments
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Nodal Instrument List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[a-zA-Z0-9_,\s-]*$/.test(val)) {
                      setSearch(val);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search instrument or nodal..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Add New Button */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-nodal-instrument")}
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
          ) : filtered.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No instruments found.
            </div>
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
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewNodalInstrument;
