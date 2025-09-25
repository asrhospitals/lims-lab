import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import { useForm } from "react-hook-form";



const ViewPatientDetails = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hospitalsList, setHospitalsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [patientData, setPatientData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({
    tests: [],
    bills: [],
    ppdata: [],
    abha: [],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-hospital?page=1&limit=1000",
          {
            headers: {
              Authorization: `Bearer ${token}`, // if your API requires Bearer token
            },
          }
        );

        if (response.data && response.data.data) {
          console.log("response.data", response.data);

          const options = response.data.data.map((hospital) => ({
            value: hospital.id,
            label: hospital.hospitalname,
          }));
          setHospitalsList(options);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const patientId = data.hospitalselected;
      const token = localStorage.getItem("authToken");
console.log("patientId==", patientId);

      const response = await axios.get(
        `https://asrphleb.asrhospitalindia.in/api/v2/phleb/get-patient-test/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPatientData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch patient tests");
      setLoading(false);
    }
  };

  const handleUpdate = (investigation) => {
    navigate(`/update-investigation/${investigation.id}`);
  };

  const handleViewDetails = (investigation) => {
    navigate(`/view-investigation-details/${investigation.id}`);
  };

  const toggleRow = (id, type) => {
    setExpandedRows((prev) => {
      const list = prev[type];
      if (list.includes(id)) {
        return { ...prev, [type]: list.filter((item) => item !== id) };
      } else {
        return { ...prev, [type]: [...list, id] };
      }
    });
  };

  // ✅ Define this function before JSX
  const getBadgeColor = (status) => {
    return (
      {
        center: "bg-green-200 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        rejected: "bg-red-200 text-red-800",
      }[status] || "bg-blue-100 text-blue-800"
    );
  };

  // Map patient data for DataTable
  const mappedItems = (patientData || []).map((patient) => ({
    id: patient.patient_id,
    patientName: patient.p_name,
    patientAge: patient.p_age,
    hospitalName: patient.hospital_name,
    registrationStatus: patient.registration_status,
    p_regdate: patient.p_regdate,
    mobile: patient.p_mobile,
    gender: patient.p_gender,
    pbarcode: patient.ppdata?.[0]?.pbarcode || "",
    tests: patient.tests || [],
    bills: patient.bills || [],
    ppdata: patient.ppdata || [],
    abha: patient.abha || [],
  }));

  // DataTable columns
  const columns = [
    { key: "id", label: "Patient ID" },
    { key: "hospitalName", label: "Hospital" },
    { key: "patientName", label: "Patient Name" },
    { key: "patientAge", label: "Age" },
    { key: "mobile", label: "Mobile" },
    { key: "gender", label: "Gender" },
    { key: "pbarcode", label: "Barcode" },
    { key: "p_regdate", label: "Registration Date" },
    { key: "registrationStatus", label: "Registration Status" },
    { key: "tests", label: "Tests Details" },
    { key: "bills", label: "Bill Details" },
    { key: "ppdata", label: "PP Data Details" },
    { key: "abha", label: "ABHA Data" }, // New column
  ];

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
                to="/view-investigation"
                className="text-gray-700 hover:text-teal-600 transition-colors"
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
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search Patient..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Add New */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/admin-add-patient-details")}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add Patient's
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-wrap gap-6 items-end"
            >
              {/* Hospital Select */}
              <div className="flex-1 min-w-[250px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Hospital <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("hospitalselected", {
                    required: "Hospital is required",
                  })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.hospitalselected
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:ring-2 transition`}
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

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  Search By Hospital
                </button>
              </div>
            </form>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : hospitalsList.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No Patient found.
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
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
                    <React.Fragment key={patient.id}>
                      <tr className="hover:bg-blue-50 cursor-pointer">
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            className="px-4 py-2 text-center"
                            onClick={
                              col.key === "tests"
                                ? () => toggleRow(patient.id, "tests")
                                : col.key === "bills"
                                ? () => toggleRow(patient.id, "bills")
                                : col.key === "ppdata"
                                ? () => toggleRow(patient.id, "ppdata")
                                : col.key === "abha"
                                ? () => toggleRow(patient.id, "abha")
                                : undefined
                            }
                          >
                            {col.key === "tests" ? (
                              <div className="flex items-center gap-1 select-none">
                                <span> View Test Details</span>
                                <img
                                  src="./view-page.gif"
                                  alt={
                                    expandedRows.tests.includes(patient.id)
                                      ? "Collapse"
                                      : "Expand"
                                  }
                                  className="w-[30px] h-[30px]"
                                />
                              </div>
                            ) : col.key === "bills" ? (
                              <div className="flex items-center gap-1 select-none">
                                <span>View Bill Details</span>
                                <img
                                  src="./bill.gif"
                                  alt={
                                    expandedRows.bills.includes(patient.id)
                                      ? "Collapse"
                                      : "Expand"
                                  }
                                  className="w-[30px] h-[30px]"
                                />
                              </div>
                            ) : col.key === "ppdata" ? (
                              <div className="flex items-center gap-1 select-none">
                                <span>View PP Data</span>
                                <img
                                  src="./ppdata.gif"
                                  alt={
                                    expandedRows.ppdata.includes(patient.id)
                                      ? "Collapse"
                                      : "Expand"
                                  }
                                  className="w-[30px] h-[30px]"
                                />
                              </div>
                            ) : col.key === "abha" ? (
                              <div className="flex items-center gap-1 select-none">
                                <span>View ABHA</span>
                                <img
                                  src="./abha.png"
                                  alt={
                                    expandedRows.abha.includes(patient.id)
                                      ? "Collapse"
                                      : "Expand"
                                  }
                                  className="w-[20px]"
                                />
                              </div>
                            ) : (
                              patient[col.key]
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Tests Expansion */}
                      {expandedRows.tests.includes(patient.id) && (
                        <tr className="bg-gray-50">
                          <td colSpan={columns.length} className="px-4 py-4">
                            {patient.tests.length > 0 ? (
                              patient.tests.map((test) => (
                                <div
                                  key={test.patient_test_id}
                                  className="p-3 border rounded mb-2 bg-white shadow-sm"
                                >
                                  <p className="font-semibold">
                                    {test.testname}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Department:{" "}
                                    {test.department?.dptname || "N/A"}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="font-semibold">
                                      Status:
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-medium ${getBadgeColor(
                                        test.status
                                      )}`}
                                    >
                                      {test.status || "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="font-semibold">
                                      Rejection Reason:
                                    </span>
                                    <span className="text-gray-700">
                                      {test.rejection_reason ?? "None"}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">
                                No tests available
                              </p>
                            )}
                          </td>
                        </tr>
                      )}

                      {/* Bills Expansion */}
                      {expandedRows.bills.includes(patient.id) && (
                        <tr className="bg-gray-50">
                          <td colSpan={columns.length} className="px-4 py-4">
                            {patient.bills.length > 0 ? (
                              patient.bills.map((bill) => (
                                <div
                                  key={bill.id}
                                  className="p-3 border rounded mb-2 bg-white shadow-sm"
                                >
                                  <p className="text-sm">
                                    Total: {bill.ptotal}, Discount: {bill.pdisc}
                                  </p>
                                  <p className="text-sm">
                                    Paid Amount: {bill.pamtrcv}, Due:{" "}
                                    {bill.pamtdue}
                                  </p>
                                  <p className="text-sm">
                                    Payment Method: {bill.pamtmthd} (
                                    {bill.pamtmode})
                                  </p>
                                  <p className="text-sm">
                                    Status: {bill.billstatus}
                                  </p>
                                  <p className="text-sm">Note: {bill.pnote}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">
                                No bills available
                              </p>
                            )}
                          </td>
                        </tr>
                      )}

                      {/* PP Data Expansion */}
                      {expandedRows.ppdata.includes(patient.id) && (
                        <tr className="bg-gray-50">
                          <td colSpan={columns.length} className="px-4 py-4">
                            {patient.ppdata.length > 0 ? (
                              patient.ppdata.map((pp) => (
                                <div
                                  key={pp.id}
                                  className="p-3 border rounded mb-2 bg-white shadow-sm"
                                >
                                  <p className="text-sm">
                                    Scheme: {pp.pscheme}
                                  </p>
                                  <p className="text-sm">
                                    Ref Doc: {pp.refdoc}
                                  </p>
                                  <p className="text-sm">Remark: {pp.remark}</p>
                                  <p className="text-sm">TRF No: {pp.trfno}</p>
                                  <p className="text-sm">
                                    POP: {pp.pop} ({pp.popno})
                                  </p>
                                  <p className="text-sm">
                                    Attachment:{" "}
                                    <a
                                      href={pp.attatchfile}
                                      target="_blank"
                                      className="text-blue-600 underline"
                                    >
                                      View File
                                    </a>
                                  </p>
                                  <p className="text-sm">
                                    Barcode: {pp.pbarcode}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">
                                No PP Data available
                              </p>
                            )}
                          </td>
                        </tr>
                      )}

                      {/* ABHA Expansion */}
                      {expandedRows.abha.includes(patient.id) && (
                        <tr className="bg-gray-50">
                          <td colSpan={columns.length} className="px-4 py-4">
                            {patient.abha.length > 0 ? (
                              patient.abha.map((abha) => (
                                <div
                                  key={abha.id}
                                  className="p-3 border rounded mb-2 bg-white shadow-sm"
                                >
                                  <p className="text-sm">
                                    ABHA Number: {abha.number}
                                  </p>
                                  <p className="text-sm">Name: {abha.name}</p>
                                  <p className="text-sm">
                                    Status: {abha.status}
                                  </p>
                                  <p className="text-sm">Phone: {abha.phone}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">No ABHA available</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Items per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    {[5, 10, 20, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-sm text-gray-600">
                  Page {currentPage} of{" "}
                  {Math.ceil(mappedItems.length / itemsPerPage)} (
                  {mappedItems.length} total items)
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    {"«"}
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    {"‹"}
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          currentPage + 1,
                          Math.ceil(mappedItems.length / itemsPerPage)
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(mappedItems.length / itemsPerPage)
                    }
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    {"›"}
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.ceil(mappedItems.length / itemsPerPage)
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(mappedItems.length / itemsPerPage)
                    }
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    {"»"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewPatientDetails;
