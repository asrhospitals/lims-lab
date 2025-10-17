import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import { useForm } from "react-hook-form";
import DataTable from "../utils/DataTable";

const ViewPatientDetails = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hospitalsList, setHospitalsList] = useState([]);
  const [patientData, setPatientData] = useState([]);
  console.log("Patient Data:", patientData);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hoverType, setHoverType] = useState("");
  const [hoverData, setHoverData] = useState([]);
  const [hoverRow, setHoverRow] = useState(null);
  const [hoverPos, setHoverPos] = useState({ top: 0, left: 0 });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const selectedHospitalName = hospitalsList.find(
    (h) => h.value === watch("hospitalselected")
  )?.label;

  // Default to today's date
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-all-hospital",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (Array.isArray(response.data)) {
          const options = response.data.map((hospital) => ({
            value: hospital.id,
            label: hospital.hospitalname,
          }));

          setHospitalsList(options);

          // 👇 Auto-select 0th hospital and fetch data
          if (options.length > 0) {
            setValue("hospitalselected", options[0].value);
            // fetch patient data for default selection
            onSubmit({
              hospitalselected: options[0].value,
              startDate: today,
              endDate: today,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  // Fetch patient data (with hospital, date range & pagination)
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const { hospitalselected, startDate, endDate } = data;

      const response = await axios.get(
        `https://asrphleb.asrhospitalindia.in/api/v2/phleb/get-data/${hospitalselected}`,
        {
          params: {
            startDate,
            endDate,
            page,
            limit: itemsPerPage,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const apiData = response.data?.data || [];
      setPatientData(apiData);
      console.log("pagination", response.data);
      
      setTotalPages(response.data?.meta?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching patient data:", err);
      setError("Failed to fetch patient details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Refetch data when page or itemsPerPage changes
    const values = watch();
    onSubmit(values);
  }, [page, itemsPerPage]);


  // Pagination handler
  const handlePageChange = async (newPage) => {
    setPage(newPage);
    const values = watch();
    await onSubmit(values);
  };

  // Table columns
  const columns = [
    // { key: "id", label: "Patient ID" },
    { key: "patientName", label: "Patient Name" },
    // { key: "hospitalName", label: "Hospital" },
    { key: "patientAge", label: "Age" },
    { key: "mobile", label: "Mobile" },
    { key: "gender", label: "Gender" },
    { key: "pbarcode", label: "Barcode" },
    { key: "p_regdate", label: "Registration Date" },
    // { key: "registrationStatus", label: "Registration Status" },
  ];

  // Map patient data
  const mappedItems = Array.isArray(patientData)
    ? patientData.map((p) => ({
        id: p.id,
        patientName: p.p_name,
        patientAge: p.p_age,
        hospitalName: p.hospital?.hospitalname || "N/A",
        registrationStatus: p.reg_by,
        p_regdate: p.p_regdate,
        mobile: p.p_mobile,
        gender: p.p_gender,
        pbarcode: p.patientPPModes?.[0]?.pbarcode || "—",
      }))
    : [];

  const handleUpdate = (item) => {
    // Navigate to a detailed view or edit page for the patient
    navigate(`/admin-update-patient-details/${item.id}`);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-investigation"
                className="text-gray-700 hover:text-teal-600"
              >
                Patient Details
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View Patient
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              All Patient List
            </h2>
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Search Patient..."
              />
              <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
            </div>
          </div>

          {/* Add New */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/admin-add-patient-details")}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600"
            >
              Add Patient's
            </button>
          </div>

          {/* Hospital & Date Filter Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-wrap gap-4 items-end mb-6"
          >
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Hospital <span className="text-red-500">*</span>
              </label>
              <select
                {...register("hospitalselected", {
                  required: "Hospital is required",
                })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.hospitalselected ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-teal-500`}
              >
                <option value="">Select Hospital</option>
                {hospitalsList.map((hospital) => (
                  <option key={hospital.value} value={hospital.value}>
                    {hospital.label}
                  </option>
                ))}
              </select>
              {errors.hospitalselected && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.hospitalselected.message}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                defaultValue={today}
                {...register("startDate")}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                defaultValue={today}
                {...register("endDate")}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Search
            </button>
          </form>

          {/* Table */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : patientData.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No Patient found for the selected hospital{" "}
              <b>{selectedHospitalName}</b> and date range :{" "}
              <b>{watch("startDate")}</b> to <b>{watch("endDate")}</b>
            </div>
          ) : (
            <>
              {/* <div className="overflow-x-auto border rounded-lg relative">
                <table className="min-w-full divide-y divide-gray-300 text-sm text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col.key}
                          className="px-4 py-2 font-bold text-gray-600 text-center"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mappedItems.map((patient) => (
                      <tr key={patient.id} className="hover:bg-blue-50">
                        {columns.map((col) => (
                          <td key={col.key} className="px-4 py-2 text-center">
                            {patient[col.key] || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}

              <DataTable
                items={mappedItems}
                columns={columns}
                serverSidePagination={true}
                currentPage={page}
                totalPages={totalPages}
                totalItems={mappedItems.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onPageSizeChange={(newSize) => setItemsPerPage(newSize)}
                onUpdate={handleUpdate}
                showDetailsButtons={false}
              />

              {/* Pagination */}
              <div className="flex justify-center items-center mt-4 space-x-3">
                <button
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewPatientDetails;
