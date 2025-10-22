import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";
import { viewTechnicians } from "../../services/apiService";

const ViewTechnician = () => {
  const [technicians, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();
  const location = useLocation();

  // Refetch list when coming back from update
  useEffect(() => {
    if (location.state?.refresh) {
      setCurrentPage(1); // optional: reset page
      navigate(location.pathname, { replace: true, state: {} }); // clear state
    }
  }, [location, navigate]);

  // Fetch technicians with pagination
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        const params = { page: currentPage, limit: itemsPerPage };
        const response = await viewTechnicians(params);

        if (response?.data) {
          const data = response.data.sort(
            (a, b) => Number(a.id) - Number(b.id)
          );
          setTechnicians(data);
          setFilteredTechnicians(data);
          setTotalPages(response?.meta?.totalPages || 1);
          setTotalItems(response?.meta?.totalItems || 0);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch Technicians.");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [currentPage, itemsPerPage]);

  // Client-side search filtering
  useEffect(() => {
    if (!search.trim()) {
      setFilteredTechnicians(technicians);
    } else {
      const lower = search.toLowerCase();
      const filtered = (technicians || []).filter(
        (t) =>
          (t.technicianname || "").toLowerCase().includes(lower) ||
          (t.addressline || "").toLowerCase().includes(lower) ||
          (t.city || "").toLowerCase().includes(lower) ||
          (t.state || "").toLowerCase().includes(lower) ||
          (t.contactno || "").toLowerCase().includes(lower) ||
          (String(t.pincode) || "").toLowerCase().includes(lower)
      );
      setFilteredTechnicians(filtered);
    }
  }, [search, technicians]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  // Correctly navigate to UpdateTechnician page
  const handleUpdate = (technician) => {
    if (technician?.id) {
      navigate(`/update-technician/${technician.id}`);
    }
  };

  // const columns = [
  //   { key: "id", label: "ID" },
  //   { key: "technicianname", label: "Technician Name" },
  //   { key: "contactno", label: "Phone" },
  //   { key: "addressline", label: "Address" },
  //   { key: "city", label: "City" },
  //   { key: "state", label: "State" },
  //   { key: "pincode", label: "PIN Code" },
  //   { key: "dob", label: "DOB" },
  //   { key: "gender", label: "Gender" },
  //   { key: "status", label: "Status" },
  // ];

  // const mappedItems = (filteredTechnicians || []).map((t) => ({
  //   ...t,
  //   dob: t.dob ? new Date(t.dob).toLocaleDateString("en-IN") : "-",
  //   status: t.isactive ? "Active" : "Inactive",
  // }));
  const columns = [
    { key: "id", label: "ID" },
    { key: "technicianname", label: "Technician Name" },
    { key: "contactno", label: "Phone" },
    { key: "addressline", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "pincode", label: "PIN Code" },
    { key: "dob", label: "DOB" },
    { key: "gender", label: "Gender" },
    { key: "status", label: "Status" },
    // {
    //   key: "actions",
    //   label: "Actions",
    //   render: (technician) => (
    //     <button
    //       onClick={() => handleUpdate(technician)}
    //       className="px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
    //     >
    //       Update
    //     </button>
    //   ),
    // },
  ];
  const mappedItems = (filteredTechnicians || []).map((t) => ({
    ...t,
    dob: t.dob ? new Date(t.dob).toLocaleDateString("en-IN") : "-",
    status: t.isactive ? "Active" : "Inactive",
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
                to="/admin-dashboard"
                className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors"
              >
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Technicians
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View Technicians
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Technician List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search Technician..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-600">
            <span>Total: {totalItems} items</span>
            <span>•</span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Add Button */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-user")}
              className="ml-3 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add New
            </button>
          </div>

          {/* Data Table */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : filteredTechnicians.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No Technicians found.
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
              onUpdate={handleUpdate} // <-- ensures navigate works
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewTechnician;
