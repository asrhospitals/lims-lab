import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";
import { viewInstruments } from "../../services/apiService";

const ViewInstrument = () => {
  const navigate = useNavigate();

  const [instruments, setInstruments] = useState([]);
  const [filteredInstruments, setFilteredInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInstruments = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const params = { page, limit };
      const response = await viewInstruments(params);
      const data = response.data || [];

      setInstruments(data);
      setFilteredInstruments(data);

      setTotalItems(response.meta?.totalItems || data.length);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch instruments:", err);
      setError(err?.response?.data?.message || "Failed to fetch instruments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstruments(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Client-side search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredInstruments(instruments);
    } else {
      const lower = search.toLowerCase();
      setFilteredInstruments(
        instruments.filter(
          (inst) =>
            (inst.instrumentname &&
              inst.instrumentname.toLowerCase().includes(lower)) ||
            (inst.make && inst.make.toLowerCase().includes(lower)) ||
            (inst.short_code && inst.short_code.toLowerCase().includes(lower))
        )
      );
    }
  }, [search, instruments]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleUpdate = (instrument) => {
    navigate(`/update-instrument/${instrument.id}`);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "instrumentname", label: "Name" },
    { key: "make", label: "Make" },
    { key: "short_code", label: "Code" },
    { key: "installdate", label: "Installed" },
    { key: "status", label: "Status" },
  ];

 const mappedItems = (filteredInstruments || []).map((inst, index) => ({
  id: inst.id ?? (index + 1 + (currentPage - 1) * itemsPerPage), // Correct global index
  instrumentname: inst.instrumentname || "-",
  make: inst.make || "-",
  short_code: inst.short_code || "-",
  installdate: inst.installdate
    ? new Date(inst.installdate).toLocaleDateString("en-CA")
    : "-",
  status: inst.isactive ? "Active" : "Inactive",
}));
  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/admin-dashboard"
                className="inline-flex items-center text-gray-700 hover:text-teal-600"
              >
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Instruments
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Instrument List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[a-zA-Z0-9_,\s]*$/.test(val)) setSearch(val);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search instrument..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Stats and Add Button */}
          <div className="flex flex-wrap justify-between mb-4 text-sm text-gray-600">
          <button
              onClick={() => navigate("/add-instrument")}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add New
            </button>
            <div>
              <span>Total: {totalItems} items</span>
              <span> • </span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
       
          </div>

          {/* Data Table */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : filteredInstruments.length === 0 ? (
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

export default ViewInstrument;
