import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiSearchLine, RiCircleFill } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import DataTable from "../utils/DataTable";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

const ViewInstrument = () => {
  const [filteredInstruments, setFilteredInstruments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [instruments, setInstruments] = useState([]);
  const { setInstrumentToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllInstruments = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlab-production.up.railway.app/lims/master/get-instrument",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = response.data || [];
        setInstruments(data);
        setFilteredInstruments(data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch instruments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllInstruments();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredInstruments(instruments);
    } else {
      const lower = search.toLowerCase();
      const filtered = instruments.filter((inst) =>
        inst.instrumentname.toLowerCase().includes(lower)
      );
      setFilteredInstruments(filtered);
    }
  }, [search, instruments]);

  const handleUpdate = (instrument) => {
    setInstrumentToUpdate(instrument);
    localStorage.setItem("instrumentToUpdate", JSON.stringify(instrument));
    navigate("/update-instrument");
  };

  const activeCount = instruments.filter((i) => i.isactive).length;
  const inactiveCount = instruments.length - activeCount;

  const columns = [
    { key: "id", label: "ID" },
    { key: "instrumentname", label: "Name" },
    { key: "make", label: "Make" },
    { key: "short_code", label: "Code" },
    { key: "installDateFormatted", label: "Installed" },
    { key: "status", label: "Status" },
  ];

  const mappedItems = filteredInstruments.map((inst) => ({
    id: inst.id ?? Math.random().toString(36).substring(2, 9),
    instrumentname: inst.instrumentname,
    make: inst.make,
    short_code: inst.short_code,
    installDateFormatted: new Date(inst.installDate).toLocaleDateString(
      "en-CA"
    ),
    isActive: inst.isactive,
    status: inst.isactive ? "Active" : "Inactive",
  }));

  return (
    <>
      <div className="fixed top-[61px] w-full z-50">
        <CBreadcrumb className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <CBreadcrumbItem href="/" className="hover:text-blue-600">
            🏠︎ Home /
          </CBreadcrumbItem>
          <CBreadcrumbItem
            href="/view-instruments"
            className="hover:text-blue-600"
          >
            Instruments /
          </CBreadcrumbItem>
          <CBreadcrumbItem active className="text-gray-500">
            Library
          </CBreadcrumbItem>
        </CBreadcrumb>
      </div>
      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Instrument List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search instrument..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center bg-blue-200 border border-blue-100 rounded-lg px-3 py-1.5">
              <RiCircleFill className="text-blue-500 text-xs mr-1.5" />
              <span className="text-sm font-medium text-gray-700">
                Active Instruments
              </span>
              <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            </div>
            <div className="flex items-center bg-red-200 border border-red-100 rounded-lg px-3 py-1.5">
              <RiCircleFill className="text-red-500 text-xs mr-1.5" />
              <span className="text-sm font-medium text-gray-700">
                Inactive Instruments
              </span>
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {inactiveCount}
              </span>
            </div>
            <button
              onClick={() => navigate("/add-instrument")}
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
          ) : filteredInstruments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No instruments found.
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

export default ViewInstrument;
