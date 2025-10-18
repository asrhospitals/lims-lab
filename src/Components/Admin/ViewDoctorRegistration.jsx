import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import ImageDIsplatDataTable from "../utils/ImageDIsplatDataTable";
// Utility to generate consistent gradient based on name
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};

const ViewDoctorRegistration = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `https://asrlabs.asrhospitalindia.in/lims/master/get-doctor?page=${currentPage}&limit=${itemsPerPage}`,
          {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          }
        );

        const data = res.data.data || [];

        console.log("data==", data);

        setDoctors(data);
        setFilteredDoctors(data);
        setTotalPages(res.data?.meta?.totalPages || 1);
        setTotalItems(res.data?.meta?.totalItems || data.length);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredDoctors(doctors);
    } else {
      const lower = search.toLowerCase();
      const filtered = (doctors || []).filter(
        (d) =>
          (d.dname && d.dname.toLowerCase().includes(lower)) ||
          (d.dqlf && d.dqlf.toLowerCase().includes(lower)) ||
          (d.dspclty && d.dspclty.toLowerCase().includes(lower)) ||
          (d.ddpt && d.ddpt.toLowerCase().includes(lower)) ||
          (d.dregno && d.dregno.toLowerCase().includes(lower)) ||
          (d.demail && d.demail.toLowerCase().includes(lower)) ||
          (d.dcnt && d.dcnt.toLowerCase().includes(lower))
      );
      setFilteredDoctors(filtered);
    }
  }, [search, doctors]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };
  const handleUpdate = (doctor) => {
    navigate(`/update-doctor-registration/${doctor.id}`);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "dname", label: "Name" },
    { key: "dqlf", label: "Qualification" },
    { key: "dspclty", label: "Specialty" },
    { key: "ddpt", label: "Department" },
    { key: "dregno", label: "Reg. Number" },
    { key: "dcnt", label: "Phone" },
    { key: "demail", label: "Email" },
    {
      key: "dphoto",
      label: "Profile Image",
      render: (d) => {
        const color = stringToColor(d.dname || "Doctor");
        const initials = d.dname
          ? d.dname
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
          : "?";

        // Check if dphoto is a valid URL
        const isValidUrl = (url) => {
          try {
            return Boolean(new URL(url));
          } catch {
            return false;
          }
        };

        return (
          <div className="relative group">
            {d.dphoto ? (
              <img
                src={encodeURI(d.dphoto)}
                alt={d.dname}
                className="w-24 h-24 rounded-full border-4 border-gradient-to-r from-teal-400 to-blue-500 object-cover transition-transform group-hover:scale-110 cursor-pointer"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer"
                style={{ backgroundColor: color }}
              >
                {initials}
              </div>
            )}
          </div>
        );
      },
    },

    { key: "dstatus", label: "Status" },
  ];

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600"
              >
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-doctor-registration"
                className="text-gray-700 hover:text-teal-600"
              >
                Doctors
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View Doctors
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Doctor List
            </h2>
            <div className="relative w-48">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition text-sm"
                placeholder="Search doctor..."
              />
              <RiSearchLine className="absolute left-2 top-2.5 text-lg text-gray-400" />
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

          {/* Add New */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/doctor-registration")}
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
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No doctors found.
            </div>
          ) : (
            <ImageDIsplatDataTable
              items={filteredDoctors}
              columns={columns}
              serverSidePagination
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

export default ViewDoctorRegistration;
