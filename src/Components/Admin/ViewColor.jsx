import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiSearchLine, RiEyeLine } from "react-icons/ri";
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
  const [selectedColor, setSelectedColor] = useState(null);

  const navigate = useNavigate();

  // Mapping for status to emoji
  const statusMap = {
    done: { emoji: "🟢", color: "00FF00" },
    pending: { emoji: "🟡", color: "FFFF00" },
    accept: { emoji: "🔴", color: "FF0000" },
    reject: { emoji: "⚫", color: "A9A9A9" },
  };

  // Fetch colors from API
  const fetchColors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      // ✅ [ADDED LINE] Build pagination query params
      const params = { page: currentPage, limit: itemsPerPage };

      const response = await axios.get(
        "https://asrlabs.asrhospitalindia.in/lims/master/get-color",
        {
          headers: { Authorization: `Bearer ${token}` },
          params, // ✅ [ADDED LINE] Send pagination params to API
        }
      );

      const data = response.data.data || [];

      // ✅ [ADDED LINE] Debug API response
      console.log("Fetched colors:", data, "Meta:", response.data.meta);

      setColors(data);
      setFilteredColors(data);
      setTotalPages(response.data.meta?.totalPages || 1);
      setTotalItems(response.data.meta?.totalItems || data.length);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch colors.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ [ADDED LINE] Fetch on mount & whenever page/itemsPerPage changes
  useEffect(() => {
    fetchColors();
  }, [currentPage, itemsPerPage]);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredColors(colors);
    } else {
      const lower = search.toLowerCase();
      const filtered = colors.filter((c) => {
        const hex =
          typeof c.colorcode === "string"
            ? c.colorcode.replace("#", "")
            : "";
        const status = c.status_of_color || "";
        const statusEmoji = statusMap[status.toLowerCase()]?.emoji || "";
        return (
          hex.toLowerCase().includes(lower) ||
          status.toLowerCase().includes(lower) ||
          statusEmoji.includes(lower)
        );
      });
      setFilteredColors(filtered);
    }
  }, [search, colors]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  const handleUpdate = (color) => {
    navigate(`/update-color/${color.id}`);
  };

  const handlePreview = (color) => {
    setSelectedColor(color);
  };

  const closePreview = () => {
    setSelectedColor(null);
  };

  // Columns for DataTable
  const columns = [
    { key: "id", label: "S. No" },
    { key: "status", label: "Status" },
    {
      key: "color_hex",
      label: "Color",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span>{item.color_hex}</span>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: `#${item.color_hex}`,
              borderRadius: "50%",
              border: "1px solid #ccc",
            }}
          />
        </div>
      ),
    },
    // {
    //   key: "preview",
    //   label: "Preview",
    //   render: (item) => (
    //     <button
    //       onClick={() => handlePreview(item)}
    //       className="text-teal-600 hover:text-teal-800 flex items-center gap-1"
    //     >
    //       <RiEyeLine /> View
    //     </button>
    //   ),
    // },
  ];

  const mappedItems = filteredColors.map((c, index) => {
    const statusKey = (c.status_of_color || "reject").toLowerCase();
    const statusInfo = statusMap[statusKey] || statusMap.reject;

    const hex =
      typeof c.colorcode === "string"
        ? c.colorcode.replace("#", "")
        : statusInfo.color;

    // Absolute sequence number considering pagination
    const absoluteIndex = (currentPage - 1) * itemsPerPage + index + 1;

    return {
      id: absoluteIndex, // this will be sequential
      status: statusInfo.emoji,
      color_hex: hex,
      color_name: c.status_of_color || "Unknown",
    };
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
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
                to="/view-color"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Colors
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View Colors
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
              Color List
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search Color..."
                  title="Allowed characters: alphabets, numbers, underscore (_), comma (,), space"
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-color")}
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

      {/* Color Preview Modal */}
      {selectedColor && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center relative">
            <button
              onClick={closePreview}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedColor.color_name} Preview
            </h3>
            <div
              className="w-32 h-32 rounded-full mx-auto border-2 border-gray-300 shadow"
              style={{ backgroundColor: `#${selectedColor.color_hex}` }}
            />
            <p className="mt-4 font-medium text-gray-600">
              Hex Code:{" "}
              <span className="text-teal-600 font-bold">
                #{selectedColor.color_hex}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewColor;
