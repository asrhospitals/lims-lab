import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import DataTable from "../utils/DataTable";

const ViewProfileEntryMaster = () => {
  const [profileEntries, setProfileEntries] = useState([]);
  const [filteredProfileEntries, setFilteredProfileEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);   // Current page number
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(1);     // Total pages from API
  const [totalItems, setTotalItems] = useState(0);     // Total items from API

  const { setProfileEntryMasterToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  // Fetch data from API on mount & when pagination changes
  useEffect(() => {
    const fetchProfileEntries = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem("authToken");
        const params = {
          page: currentPage,   // current page
          limit: itemsPerPage, // items per page
        };

        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-profileentry",
          {
            headers: { Authorization: `Bearer ${authToken}` },
            params,
          }
        );

        const responseData = response.data.data || [];
        const data = responseData.sort((a, b) => Number(a.id) - Number(b.id));

        // ✅ Save data into state
        setProfileEntries(data);
        setFilteredProfileEntries(data);

        // Update total items & pages from API meta (if available)
        setTotalItems(response.data.meta?.totalItems || responseData.length);
        setTotalPages(response.data.meta?.totalPages || 1);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch Profile Entries.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileEntries();
  }, [currentPage, itemsPerPage]);

  // Filter on search input
  useEffect(() => {
    if (!search.trim()) {
      setFilteredProfileEntries(profileEntries);
    } else {
      const lower = search.toLowerCase();
      const filtered = profileEntries.filter(
        (entry) =>
          (entry.profilename || "").toLowerCase().includes(lower) ||
          (entry.profilecode || "").toLowerCase().includes(lower)
      );
      setFilteredProfileEntries(filtered);
    }
  }, [search, profileEntries]);

  const handleUpdate = (entry) => {
    navigate(`/update-profile-entry-master/${entry.id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1); // reset to first page
  };

  // Define table columns
  const columns = [
    { key: "serial", label: "S. No." },
    { key: "profilename", label: "Profile Name" },
    { key: "profilecode", label: "Profile Code" },
    { key: "alternativebarcode", label: "Alternative Barcode" },
    { key: "isactive", label: "Status" },
  ];

  // Prepare data for DataTable
  const mappedItems = filteredProfileEntries.map((entry, index) => ({
    ...entry,
    serial: (currentPage - 1) * itemsPerPage + index + 1, // keep serial continuous across pages
    alternativebarcode: entry.alternativebarcode ? "Yes" : "No",
    isactive: entry.isactive ? "Active" : "Inactive",
  }));

  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-profile-entry-master"
                className="text-gray-700 hover:text-teal-600"
              >
                ProfileEntryMasters
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500" aria-current="page">
              View Profile Entry Masters
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Profile Entry List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="Search Profile Entry Master..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Add New Button */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-profile-entry-master")}
              className="ml-3 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform hover:scale-105"
            >
              Add New
            </button>
          </div>

          {/* Table Section */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : filteredProfileEntries.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No Profile Entries found.
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

export default ViewProfileEntryMaster;
