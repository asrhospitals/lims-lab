import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import DataTable from "../utils/DataTable";
// import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

const ViewColor = () => {
  const [colors, setColors] = useState([]);
  const [filteredColors, setFilteredColors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { setColorToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-color",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        // const data = (response.data || []).sort((a, b) =>
        //   (a.color_code || "").localeCompare(b.color_code || "")
        // );
        const data = (response.data || []).sort((a, b) => Number(a.color_id) - Number(b.color_id));

        setColors(data);
        setFilteredColors(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch Colors.");
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredColors(colors);
    } else {
      const lower = search.toLowerCase();
      const filtered = (colors || []).filter(
        (color) =>
          (color.color_code || "").toLowerCase().includes(lower) ||
          (color.color_status || "").toLowerCase().includes(lower)
      );
      setFilteredColors(filtered);
    }
  }, [search, colors]);

  const handleUpdate = (color) => {
    setColorToUpdate(color);
    localStorage.setItem("colorToUpdate", JSON.stringify(color));
    navigate("/update-color");
  };

  const columns = [
    { key: "color_id", label: "Color ID" },
    { key: "color_code", label: "Color Code" },
    { key: "color_status", label: "Color Status" },
    // status & action handled by DataTable
  ];

  const mappedItems = (filteredColors || []).map((color, index) => ({
    ...color,
    id: index + 1,
    status: color.color_status,
    color_code: color.color_code,
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



      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
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
                  placeholder="Search Color..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>


          {/* Add New */}
          <div className="flex  flex-wrap gap-2 mb-4">
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
              No Colors found.
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

export default ViewColor;
