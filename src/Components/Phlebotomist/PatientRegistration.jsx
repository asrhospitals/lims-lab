import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import DataTable from "../utils/DataTable";

const PatientRegistration = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    const fetchPatients = async () => {
        try {
            const hospitalName = localStorage.getItem("hospital_name");
            const authToken = localStorage.getItem("authToken"); // Retrieve the token from local storage

            const response = await fetch(`https://asrphleb.asrhospitalindia.in/phelb/get-patient-test/${encodeURIComponent(hospitalName)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`, // Use the token in the Authorization header
                'Content-Type': 'application/json'
            }
            });
            
            // Log the response status and URL for debugging
            console.log(`Fetching patients from: ${response.url}`);
            console.log(`Response status: ${response.status}`);

            if (!response.ok) {
            const errorMessage = await response.text(); // Get the error message from the response
            console.error("Error fetching patients:", errorMessage);
            throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("Successfully fetched patients:", data); // Log the successful response

            const formattedData = data.map(item => ({
            id: item.id, // Assuming 'id' is a unique identifier
            name: item.pname,
            mobile: item.pmobile,
            registrationDate: item.pregdate,
            }));

            setPatients(formattedData);
            setFilteredPatients(formattedData);
        } catch (err) {
            console.error("Failed to fetch patients:", err); // Log the error
            setError("Failed to fetch patients.");
        } finally {
            setLoading(false);
        }
        };


    fetchPatients();
  }, []);

  useEffect(() => {
    let filtered = patients;

    // Filter by search
    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(item =>
        (item.name || "").toLowerCase().includes(lower) ||
        (item.mobile || "").includes(lower)
      );
    }

    // Filter by date
    if (dateFilter !== "All" && dateFilter !== "Custom") {
      const today = new Date();
      let filterDate = new Date();

      switch (dateFilter) {
        case "Today":
          break;
        case "3 days":
          filterDate.setDate(today.getDate() - 3);
          break;
        case "Week":
          filterDate.setDate(today.getDate() - 7);
          break;
        case "Month":
          filterDate.setMonth(today.getMonth() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(item => {
        const regDate = new Date(item.registrationDate);
        return dateFilter === "Today" 
          ? regDate.toDateString() === today.toDateString()
          : regDate >= filterDate;
      });
    }

    // Filter by custom date range
    if (dateFilter === "Custom" && startDate && endDate) {
      filtered = filtered.filter(item => {
        const regDate = new Date(item.registrationDate);
        return regDate >= new Date(startDate) && regDate <= new Date(endDate);
      });
    }

    setFilteredPatients(filtered);
  }, [search, dateFilter, patients, startDate, endDate]);

  const handleDateFilterChange = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    setShowDateRange(value === "Custom");
    setStartDate("");
    setEndDate("");
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "mobile", label: "Mobile" },
    { key: "registrationDate", label: "Registration Date" }
  ];

  const mappedItems = filteredPatients.map(item => ({
    ...item,
    id: item.id,
    name: item.name,
    mobile: item.mobile,
    registrationDate: new Date(item.registrationDate).toLocaleDateString()
  }));

  const handleUpdate = (investigation) => {
    // setInvestigationToUpdate(investigation);
    // localStorage.setItem("investigationToUpdate", JSON.stringify(investigation));
    // navigate("/update-investigation");
  };

  const handleViewDetails = (investigation) => {
    // localStorage.setItem("investigationToView", JSON.stringify(investigation));
    // navigate("/view-investigation-details");
  };

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors">
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/patient-registration" className="text-gray-700 hover:text-teal-600 transition-colors">
                Patients
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View Patients
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Patient Registration List</h2>
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
              <div className="flex items-center gap-2">
                <select
                  value={dateFilter}
                  onChange={handleDateFilterChange}
                  className="border border-gray-300 rounded-lg p-2"
                >
                  <option value="All">All</option>
                  <option value="Today">Today</option>
                  <option value="3 days">Last 3 Days</option>
                  <option value="Week">Last Week</option>
                  <option value="Month">Last Month</option>
                  <option value="Custom">Custom</option>
                </select>
                {showDateRange && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2"
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2"
                      placeholder="End Date"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => navigate("/patient-registration-add")}
              className="ml-3 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:from-teal-700 hover:to-teal-600 transition-transform transform hover:scale-105"
            >
              Add Patient
            </button>
          </div>

          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No patients found.</div>
          ) : (
            <DataTable
              items={mappedItems}
              columns={columns}
              itemsPerPage={10}
              showDetailsButtons={false}            
              onUpdate={handleUpdate}
              onView={handleViewDetails} // Pass the view handler
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PatientRegistration;