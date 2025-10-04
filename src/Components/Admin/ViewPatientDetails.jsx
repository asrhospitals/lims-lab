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
  const [patientData, setPatientData] = useState([]);

  const [hoverType, setHoverType] = useState("");
  const [hoverData, setHoverData] = useState([]);
  const [hoverRow, setHoverRow] = useState(null);
  const [hoverPos, setHoverPos] = useState({ top: 0, left: 0 });

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Fetch hospitals
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
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };
    fetchHospitals();
  }, []);

  // Fetch patient data
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const hospitalId = data.hospitalselected;
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `https://asrphleb.asrhospitalindia.in/api/v2/phleb/get-patient-test/${hospitalId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPatientData(response.data?.data || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch patient tests");
      setLoading(false);
    }
  };

  // Map patient data
  const mappedItems = Array.isArray(patientData)
    ? patientData.map((patient) => ({
        id: patient.id,
        patientName: patient.p_name,
        patientAge: patient.p_age,
        hospitalName: patient.hospital?.hospitalname || "N/A",
        registrationStatus: patient.reg_by,
        p_regdate: patient.p_regdate,
        mobile: patient.p_mobile,
        gender: patient.p_gender,
        pbarcode: patient.patientPPModes?.[0]?.pbarcode || "",
        tests: patient.patientTests?.map((test) => ({
          testname: test.investigation?.testname,
          department: test.investigation?.department,
          status: test.status,
          rejection_reason: test.rejection_reason,
        })) || [],
        bills: [],
        ppdata: patient.patientPPModes || [],
        abha: [],
      }))
    : [];

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
    { key: "abha", label: "ABHA Data" },
  ];

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
              <Link to="/view-investigation" className="text-gray-700 hover:text-teal-600">
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
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">All Patient List</h2>
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

          {/* Hospital Search Form */}
          <form
  onSubmit={handleSubmit(onSubmit)}
  className="flex flex-wrap gap-4 items-end mb-6"
>
  <div className="flex-1 min-w-[150px]">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Select Hospital <span className="text-red-500">*</span>
    </label>
    <select
      {...register("hospitalselected", { required: "Hospital is required" })}
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
      <p className="text-red-500 text-xs mt-1">{errors.hospitalselected.message}</p>
    )}
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
            <div className="text-center py-6 text-gray-500">No Patient found.</div>
          ) : (
            <div className="overflow-x-auto border rounded-lg relative">
              <table className="min-w-full divide-y divide-gray-300 text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key} className="px-4 py-2 font-bold text-gray-600 text-center">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mappedItems.map((patient) => (
                    <tr key={patient.id} className="hover:bg-blue-50">
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-2 text-center relative">
                          {["tests", "bills", "ppdata", "abha"].includes(col.key) ? (
                            <div
                              className="flex items-center gap-1 cursor-pointer text-blue-600 hover:underline"
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setHoverType(col.key);
                                setHoverData(patient[col.key]);
                                setHoverRow(patient.id + col.key);
                                setHoverPos({ top: rect.bottom + window.scrollY, left: rect.left + rect.width / 2 });
                              }}
                              onMouseLeave={() => {
                                setHoverType("");
                                setHoverData([]);
                                setHoverRow(null);
                              }}
                            >
                              <span>View {col.label}</span>
                              <img
                                src={
                                  col.key === "tests"
                                    ? "./view-page.gif"
                                    : col.key === "bills"
                                    ? "./bill.gif"
                                    : col.key === "ppdata"
                                    ? "./ppdata.gif"
                                    : "./abha.png"
                                }
                                alt="View"
                                className="w-[25px] h-[25px]"
                              />
                            </div>
                          ) : (
                            patient[col.key] || "—"
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Hover Popup */}
              {hoverRow && hoverData.length > 0 && (
                <div
                  className="fixed bg-white border rounded-lg shadow-lg p-4 z-50 w-80 text-left"
                  style={{
                    top: `${hoverPos.top}px`,
                    left: `${hoverPos.left}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {hoverType === "tests" ? (
                    hoverData.map((test, idx) => (
                      <div key={idx} className="border-b pb-2 mb-2">
                        <p className="font-medium">{test.testname}</p>
                        <p className="text-xs text-gray-600">
                          Department: {test.department?.dptname || "N/A"}
                        </p>
                        <p className="text-xs">Status: {test.status}</p>
                      </div>
                    ))
                  ) : hoverType === "ppdata" ? (
                    hoverData.map((pp, idx) => (
                      <div key={idx} className="border-b pb-2 mb-2">
                        <p>Scheme: {pp.pscheme}</p>
                        <p>Ref Doc: {pp.refdoc}</p>
                        <p>Remark: {pp.remark}</p>
                      </div>
                    ))
                  ) : (
                    <p>Other {hoverType} data...</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewPatientDetails;
