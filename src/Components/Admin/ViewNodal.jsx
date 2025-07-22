import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiSearchLine, RiCircleFill } from "react-icons/ri";
import AdminContext from "../../context/adminContext";
import DataTable from "../utils/DataTable";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

const ViewNodal = () => {
  const [nodalLabs, setNodalLabs] = useState([]);
  const [filteredNodalLabs, setFilteredNodalLabs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { setNodalToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNodalLabs = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-nodal",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = response.data || [];
        console.log(data);
        setNodalLabs(data);
        setFilteredNodalLabs(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch nodal labs.");
      } finally {
        setLoading(false);
      }
    };

    fetchNodalLabs();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredNodalLabs(nodalLabs);
    } else {
      const lower = search.toLowerCase();
      const filtered = nodalLabs.filter((n) =>
        n.nodalname.toLowerCase().includes(lower)
      );
      setFilteredNodalLabs(filtered);
    }
  }, [search, nodalLabs]);

  const handleUpdate = (nodal) => {
    setNodalToUpdate(nodal);
    localStorage.setItem("nodalToUpdate", JSON.stringify(nodal));
    navigate("/update-nodal");
  };

  // const activeCount = nodalLabs.filter((n) => n.isactive).length;
  // const inactiveCount = nodalLabs.length - activeCount;

  const columns = [
    { key: "id", label: "ID" },
    { key: "nodalname", label: "Nodal Name" },
    { key: "motherlabText", label: "Mother Lab" },
    { key: "status", label: "Status" },
  ];

  const mappedItems = filteredNodalLabs.map((n) => ({
    id: n.nodal_id ?? Math.random().toString(36).substring(2, 9),
    nodalname: n.nodalname,
    motherlabText: n.motherlab ? "Yes" : "No",
    isActive: n.isactive,
    status: n.isactive ? "Active" : "Inactive",
  }));

  return (
    <>
      <div className="fixed top-[61px] w-full z-50">
        <CBreadcrumb className="flex gap-2 items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <CBreadcrumbItem href="#" className="hover:text-blue-600">
            🏠︎ Home /
          </CBreadcrumbItem>
          <CBreadcrumbItem href="/view-nodal" className="hover:text-blue-600">
            Nodal /
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
              Nodal Lab List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search nodal lab..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* <div className="flex items-center bg-blue-200 border border-blue-100 rounded-lg px-3 py-1.5">
              <RiCircleFill className="text-blue-500 text-xs mr-1.5" />
              <span className="text-sm font-medium text-gray-700">
                Active Nodal Labs
              </span>
              <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            </div>
            <div className="flex items-center bg-red-200 border border-red-100 rounded-lg px-3 py-1.5">
              <RiCircleFill className="text-red-500 text-xs mr-1.5" />
              <span className="text-sm font-medium text-gray-700">
                Inactive Nodal Labs
              </span>
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {inactiveCount}
              </span>
            </div> */}
            <button
              onClick={() => navigate("/add-nodal")}
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
          ) : filteredNodalLabs.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No nodal labs found.
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

export default ViewNodal;
