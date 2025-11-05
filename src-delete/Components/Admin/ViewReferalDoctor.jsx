import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";

const ViewReferalDoctor = () => {
  const [referalDoctors, setReferalDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Get token from localStorage
  const token = localStorage.getItem("authToken");

  // ✅ Function to get axios headers in backend-required format
  const getAuthHeaders = () => ({
    AUTHORIZATION: token?.startsWith("Bearer Token ")
      ? token
      : `Bearer Token ${token}`,
  });

  // ✅ Fetch referal doctors
  useEffect(() => {
    const fetchReferalDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/lims/master/get-refdoc",
          {
            headers: getAuthHeaders(),
          }
        );

        const data = (response.data || []).sort(
          (a, b) => Number(a.id) - Number(b.id)
        );
        setReferalDoctors(data);
        setFilteredDoctors(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err.response?.data?.message ||
            "❌ Failed to fetch Referral Doctors. Please check token or server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReferalDoctors();
  }, []);

  // ✅ Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredDoctors(referalDoctors);
    } else {
      const lower = search.toLowerCase();
      const filtered = referalDoctors.filter((doc) =>
        [
          doc.ref_doc_name,
          doc.city,
          doc.state,
          doc.email,
          doc.contact_no,
        ]
          .join(" ")
          .toLowerCase()
          .includes(lower)
      );
      setFilteredDoctors(filtered);
    }
  }, [search, referalDoctors]);

  // ✅ Handle Update button click
  const handleUpdate = async (doctor) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/lims/master/get-refdoc/${doctor.id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      localStorage.setItem(
        "referalDoctorToUpdate",
        JSON.stringify(response.data)
      );

      navigate("/update-referal-doctor");
    } catch (err) {
      console.error("Update fetch failed:", err);
      alert("Failed to fetch Referral Doctor details. Please try again.");
    }
  };

  // ✅ Table Columns
  const columns = [
    { key: "id", label: "ID" },
    { key: "category", label: "Category" },
    { key: "ref_doc_name", label: "Doctor Name" },
    { key: "contact_no", label: "Contact" },
    { key: "ref_by", label: "Referred By" },
    { key: "isactive", label: "Status" },
    { key: "incentive_plan_name", label: "Incentive Plan" },
    { key: "visit_type", label: "Visit Type" },
    { key: "incentive_amount_type", label: "Incentive Amount Type" },
    { key: "street", label: "Street" },
    { key: "company", label: "Company" },
    { key: "area", label: "Area" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "pincode", label: "Pincode" },
    { key: "email", label: "Email" },
    { key: "marketing_source", label: "Marketing Source" },
    { key: "other_agents", label: "Other Agents" },
    { key: "other_details", label: "Other Details" },
    { key: "include_in_referred_by", label: "Include in Referred By" },
    { key: "is_external", label: "Is External" },
    {
      key: "consultant_incentive_rate_plan",
      label: "Consultant Incentive Rate Plan",
    },
    {
      key: "referral_incentive_rate_plan",
      label: "Referral Incentive Rate Plan",
    },
    { key: "pharmacy_incentive_percentage", label: "Pharmacy Incentive %" },
    { key: "include_discount", label: "Include Discount" },
    { key: "include_full_discount", label: "Include Full Discount" },
  ];

  const mappedItems = filteredDoctors.map((doc) => ({
    ...doc,
    isactive: doc.isactive ? "Active" : "Inactive",
  }));

  return (
    <>
      {/* ✅ Breadcrumb */}
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
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-refdoc"
                className="text-gray-700 hover:text-teal-600"
              >
                Referral Doctors
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View
            </li>
          </ol>
        </nav>
      </div>

      {/* ✅ Page Content */}
      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Referral Doctor List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholder="Search referral doctor..."
                />
                <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
              </div>
            </div>
          </div>

          {/* Add New Button */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/add-refdoc")}
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
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No referral doctors found.
            </div>
          ) : (
            <DataTable
              items={mappedItems}
              columns={columns}
              itemsPerPage={10}
              showDetailsButtons={true}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewReferalDoctor;
