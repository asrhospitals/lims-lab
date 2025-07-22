import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { RiSearchLine, RiCircleFill } from "react-icons/ri";
import { RiHome3Line, RiCalendar2Line } from "react-icons/ri";
import DataTable from "../utils/DataTable";
import AdminContext from "../../context/adminContext";

const ViewNodalHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { nodalHospitalToUpdate, setNodalHospitalToUpdate } =
    useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const resp = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-nodalhospital",
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        const data = resp.data || [];
        console.log(data);
        setHospitals(data);
        setFiltered(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch nodal hospitals."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(hospitals);
    } else {
      const s = search.toLowerCase();
      setFiltered(
        hospitals.filter(
          (h) =>
            h.nodal?.nodalname?.toLowerCase().includes(s) ||
            h.hospital?.hospital_name?.toLowerCase().includes(s)
        )
      );
    }
  }, [search, hospitals]);

  // const active = hospitals.filter((h) => h.isactive).length;
  // const inactive = hospitals.length - active;

  const handleUpdate = (hospital) => {
    localStorage.setItem("nodalHospitalToUpdate", JSON.stringify(hospital));
    setNodalHospitalToUpdate(hospital);
    navigate("/update-nodal-hospital");
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "nodalname", label: "Nodal Name" },
    { key: "hospitalname", label: "Hospital Name" },
    { key: "hospitalId", label: "Hospital ID" },
    { key: "nodalref", label: "Nodal Ref" },
    { key: "status", label: "Status" },
  ];

  const mappedItems = filtered.map((h) => ({
    id: h.nodal_id ?? h.id ?? Math.random().toString(36).substr(2, 9),
    nodalname: h.nodal?.nodalname || "-",
    hospitalname: h.hospital?.hospital_name || "-",
    hospitalId: h.hospital_id ?? "-",
    nodalref: h.nodal?.nodalname || "-",
    isActive: h.isactive,
    status: h.isactive ? "Active" : "Inactive",
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
            href="/view-nodal-hospitals"
            className="hover:text-blue-600 transition-colors"
          >
            Nodal Hospital /
          </CBreadcrumbItem>

          <CBreadcrumbItem
            active
            className="inline-flex items-center text-gray-500"
          >
            Library
          </CBreadcrumbItem>
        </CBreadcrumb>
      </div>
      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Nodal Hospital
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search nodal hospital..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* <div className="flex items-center bg-blue-200 border border-blue-100 rounded-lg px-3 py-1.5">
              <RiCircleFill className="text-blue-500 text-xs mr-1.5" />
              <span className="text-sm font-medium text-gray-700">Active</span>
              <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {active}
              </span>
            </div>
            <div className="flex items-center bg-red-200 border border-red-100 rounded-lg px-3 py-1.5">
              <RiCircleFill className="text-red-500 text-xs mr-1.5" />
              <span className="text-sm font-medium text-gray-700">
                Inactive
              </span>
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {inactive}
              </span>
            </div> */}
            <button
              onClick={() => navigate("/add-nodal-hospital")}
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
          ) : filtered.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No records found.
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

export default ViewNodalHospital;
