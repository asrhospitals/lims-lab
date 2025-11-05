import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";
import { viewPhlebotomists } from "../../services/apiService";

const ViewPhlebotomist = () => {
  const [phlebotomists, setPhlebotomists] = useState([]);
  const [filteredPhlebotomists, setFilteredPhlebotomists] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhlebotomists = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, limit: itemsPerPage };
        const res = await viewPhlebotomists(params);

        const phlebotomistsData = (res.data?.data || res.data || []).sort(
          (a, b) => Number(a.id) - Number(b.id)
        );

        setPhlebotomists(phlebotomistsData);
        setFilteredPhlebotomists(phlebotomistsData);
        setTotalPages(res?.meta?.totalPages || 1);
        setTotalItems(res?.meta?.totalitems || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch Phlebotomists.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhlebotomists();
  }, [currentPage, itemsPerPage]);

  // ✅ Fixed Search Filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredPhlebotomists(phlebotomists);
    } else {
      const lower = search.toLowerCase();
      const filtered = (phlebotomists || []).filter(
        (h) =>
          (h.phleboname || "").toLowerCase().includes(lower) ||
          (h.addressline || "").toLowerCase().includes(lower) ||
          (h.city || "").toLowerCase().includes(lower) ||
          (h.state || "").toLowerCase().includes(lower) ||
          (h.contactno || "").toLowerCase().includes(lower)
      );
      setFilteredPhlebotomists(filtered);
    }
  }, [search, phlebotomists]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  const handleUpdate = (phlebotomist) => {
    navigate(`/update-phlebotomist/${phlebotomist.id}`);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "phleboname", label: "Phlebotomist Name" },
    { key: "contactno", label: "Phone" },
    { key: "dob", label: "DOB" },
    { key: "gender", label: "Gender" },
    { key: "pincode", label: "Pin Code" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "status", label: "Status" },
  ];

  const mappedItems = (filteredPhlebotomists || []).map((h) => ({
    ...h,
    dob: h.dob ? new Date(h.dob).toLocaleDateString("en-IN") : "-",
    status: h.isactive ? "Active" : "Inactive",
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
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-phlebotomist" className="text-gray-700 hover:text-teal-600">
                Phlebotomists
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">View Phlebotomists</li>
          </ol>
        </nav>
      </div>

      {/* Content */}
      <div className="w-full mt-14 px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Phlebotomist List</h2>

            <div className="relative sm:w-64 w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Search Phlebotomist..."
              />
              <RiSearchLine className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Add New */}
          <button
            onClick={() => navigate("/add-user")}
            className="mb-3 px-6 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
          >
            Add New
          </button>

          {/* Table */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : filteredPhlebotomists.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No Phlebotomists found.</div>
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

export default ViewPhlebotomist;
