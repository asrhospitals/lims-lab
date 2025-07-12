import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiSearchLine, RiCircleFill } from "react-icons/ri";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import AdminContext from "../../context/adminContext";
import DataTable from "../utils/DataTable";

const ViewRole = () => {
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);

  const { roleToUpdate, setRoleToUpdate } = useContext(AdminContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllRoles = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlab-production.up.railway.app/lims/master/get-role",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const rolesData = response.data.sort((a, b) => a.id - b.id);
        console.log(rolesData);
        setRoles(rolesData);
        setFilteredRoles(rolesData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch roles.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllRoles();
  }, [setRoles]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredRoles(roles);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = roles.filter(
        (r) =>
          r.roleType.toLowerCase().includes(lowerSearch) ||
          r.roleDescription.toLowerCase().includes(lowerSearch)
      );
      setFilteredRoles(filtered);
    }
  }, [search, roles]);

  const handleUpdate = (role) => {
    console.log(role);
    setRoleToUpdate(role);
    localStorage.setItem("roleToUpdate", JSON.stringify(role));
    navigate("/update-role");
  };

  const activeCount = roles.filter((r) => r.isactive).length;
  const inactiveCount = roles.length - activeCount;

  const columns = [
    { key: "id", label: "ID" },
    { key: "roleType", label: "Role Type" },
    { key: "roleDescription", label: "Role Description" },
    { key: "status", label: "Status" },

    // Status and Actions handled inside DataTable component
  ];

  const mappedItems = filteredRoles.map((r) => ({
    id: r.id || Math.random().toString(36).substr(2, 9),
    roleType: r.roleType,
    roleDescription: r.roleDescription,
    isactive: r.isactive, // keep original key for update
    status: r.isactive ? "Active" : "Inactive",
  }));

  return (
    <>
      <div className="fixed top-[61px] w-full z-50 ">
        <CBreadcrumb className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <CBreadcrumbItem
            href="#"
            className="hover:text-blue-600 transition-colors"
          >
            🏠︎ Home /
          </CBreadcrumbItem>
          <CBreadcrumbItem
            href="/view-roles"
            className="hover:text-blue-600 transition-colors"
          >
            Roles /
          </CBreadcrumbItem>

          <CBreadcrumbItem
            active
            className="inline-flex items-center text-gray-500"
          >
            View Role
          </CBreadcrumbItem>
        </CBreadcrumb>
      </div>
      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Role List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search role type or description..."
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
                Active Roles
              </span>
              <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            </div>
            <div className="flex items-center bg-red-200 border border-red-100 rounded-lg px-3 py-1.5">
              <RiCircleFill className="text-red-500 text-xs mr-1.5" />
              <span className="text-sm font-medium text-gray-700">
                Inactive Roles
              </span>
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {inactiveCount}
              </span>
            </div>
            <button
              onClick={() => navigate("/add-role")}
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
          ) : filteredRoles.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No roles found.
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

export default ViewRole;
