import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "../utils/DataTable";

const ViewColor = () => {
  const [colors, setColors] = useState([]);
  const [filteredColors, setFilteredColors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // 🔹 Fetch colors from API
  const fetchColors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://asrlabs.asrhospitalindia.in/lims/master/get-color?page=${currentPage}&limit=${itemsPerPage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data.data || [];
      setColors(data);
      setFilteredColors(data);
      setTotalPages(res?.data?.meta?.totalPages || 1);
      setTotalItems(res?.data?.meta?.totalItems || data.length);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch colors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, [currentPage, itemsPerPage]);

  // 🔹 Client-side search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredColors(colors);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = colors.filter((c) =>
        c.status_of_color?.toLowerCase().includes(lowerSearch)
      );
      setFilteredColors(filtered);
    }
  }, [search, colors]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleUpdate = (color) => {
    navigate(`/update-color/${color.id}`);
  };

  // 🔹 Copy color code to clipboard
  const handleCopyColor = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code} to clipboard!`, { autoClose: 1500 });
  };

  // 🔹 Table columns
  const columns = [
    { key: "id", label: "S.No" },
    { key: "status_of_color", label: "Status" },
    { key: "colorcode", label: "Color Code" },
    { key: "color_code", label: "Color" },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Updated At" },
  ];

  // 🔹 Data mapping
  const mappedItems = filteredColors.map((c, idx) => {
    const validColor =
      typeof c.colorcode === "string" && c.colorcode.trim() !== ""
        ? c.colorcode
        : "#FFFFFF";

    return {
      id: (currentPage - 1) * itemsPerPage + idx + 1,
      status_of_color: c.status_of_color || "-",
      colorcode: validColor.toUpperCase(),
      color_code: (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: validColor }}
          ></div>
  
        </div>
      ),
      createdAt: c.createdAt
        ? new Date(c.createdAt).toLocaleString()
        : "-",
      updatedAt: c.updatedAt
        ? new Date(c.updatedAt).toLocaleString()
        : "-",
    };
  });

  return (
    <div className="w-full mt-14 px-0 sm:px-2 space-y-4 text-sm">
      <ToastContainer />

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
            {/* <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-color"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Colors
              </Link>
            </li> */}
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View Colors
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Color List
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                placeholder="Search by status..."
              />
              <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
            </div>
            <button
              onClick={() => navigate("/add-color")}
              className="ml-3 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add New Color
            </button>
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

        {/* Data Table */}
        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">{error}</div>
        ) : filteredColors.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No colors found.
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
  );
};

export default ViewColor;
