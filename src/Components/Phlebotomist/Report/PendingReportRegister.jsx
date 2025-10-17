import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import AdminContext from "../../../context/adminContext";
import PhlebotomistDataTable from "../../utils/PhlebotomistDataTable";
import { fetchPatientReportData } from "../../../services/apiService";
import { toast } from "react-toastify";

const PendingReportRegister = () => {
  const [reportDoctors, setReportDoctors] = useState([]); // full API data
  const [filteredReportData, setfilteredReportData] = useState([]); // filtered data for table
  const [searchInvestigation, setSearchInvestigation] = useState("");
  const [searchBarcode, setSearchBarcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setReportDoctorToUpdate } = useContext(AdminContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ------------------ Fetch report data ------------------
  useEffect(() => {
    const fetchReportData = async () => {
      const id = localStorage.getItem("hospital_id");
      if (!id) {
        toast.error("No hospital ID found in localStorage");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetchPatientReportData(id);
        if (response?.data) {
          const data = response.data || [];

          // Map API response to table-friendly format
          const mapped = data.map((item) => ({
            id: item.id,
            patientid: item.id,
            patientname: item.p_name,
            patientregdate: item.p_regdate,
            barcode: item.patientPPModes?.[0]?.pbarcode || "",
            investigationregistrerd: item.patientTests
              .filter((t) => t.status === "docpending") // Only pending investigations
              .map((t) => t.investigation?.testname)
              .join(", "),
            hospitalname: item.hospital?.hospitalname || "",
            attatchfile: item.patientPPModes?.[0]?.attatchfile || "",
          }));

          setReportDoctors(mapped);
          setfilteredReportData(mapped);

          // Pagination
          // setTotalItems(response.meta?.totalItems || mapped.length);
          // setTotalPages(response.meta?.totalPages || 1);

        setTotalPages(response?.meta?.totalPages || 1);
        setTotalItems(response?.meta?.totalItems || 1);

        } else {
          toast.error(response?.message || "Failed to fetch report data");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred while fetching the report");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [itemsPerPage]);

  // ------------------ Search & filter ------------------
  const handleSearch = () => {
    let filtered = [...reportDoctors];

    if (searchInvestigation.trim()) {
      const lower = searchInvestigation.toLowerCase();
      filtered = filtered.filter((doc) =>
        (doc.investigationregistrerd || "").toLowerCase().includes(lower)
      );
    }

    if (searchBarcode.trim()) {
      const lower = searchBarcode.toLowerCase();
      filtered = filtered.filter((doc) =>
        (doc.barcode || "").toLowerCase().includes(lower)
      );
    }

    setfilteredReportData(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  // ------------------ Table columns ------------------
  const columns = [
    { key: "id", label: "ID" },
    { key: "patientid", label: "Patient ID" },
    { key: "patientname", label: "Patient Name" },
    { key: "barcode", label: "Barcode" },
    { key: "hospitalname", label: "Hospital Name" },
    { key: "investigationregistrerd", label: "Investigation Pending" },
  ];

  // ------------------ Pagination ------------------
// const paginatedItems = filteredReportData.slice(
//   (currentPage - 1) * itemsPerPage,
//   currentPage * itemsPerPage
// );

// Use index + offset to create a continuous row number
const mappedItems = filteredReportData.map((t, index) => ({
  id: (currentPage - 1) * itemsPerPage + index + 1, // Row number
  patientid: t.patientid,
  patientname: t.patientname,
  barcode: t.barcode,
  hospitalname: t.hospitalname,
  investigationregistrerd: t.investigationregistrerd,
}));


  // const mappedItems = (filteredHospitals || []).map((h) => ({
  //   ...h,
  //   status: h.isactive ? "Active" : "Inactive",
  // }));



  // ------------------ Handlers ------------------
  const handleUpdate = (item) => {
    setReportDoctorToUpdate(item);
    // navigate("/update-report-doctor"); // optional
  };

  const handleExportExcel = () => {
    console.log("Export to Excel logic here...");
  };

  const handleExportPDF = () => {
    console.log("Export to PDF logic here...");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };


  // ------------------ Render ------------------
  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors"
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
                to="/view-report-doctor"
                className="text-gray-700 hover:text-teal-600"
              >
                Pending Report Register
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              View
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <div className="bg-white rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Pending Report Register
            </h2>

            {/* Export Buttons */}
            <div className="flex flex-row gap-3">
              <div
                onClick={handleExportExcel}
                className="bg-green-100 rounded-lg p-2 cursor-pointer hover:bg-green-200 transition"
              >
                <img src="./excel.png" alt="Excel" className="w-7 h-7" />
              </div>
              <div
                onClick={handleExportPDF}
                className="bg-red-100 rounded-lg p-2 cursor-pointer hover:bg-red-200 transition"
              >
                <img src="./pdf.png" alt="PDF" className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <div className="relative">
              <input
                type="text"
                value={searchBarcode}
                onChange={(e) => setSearchBarcode(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 min-w-[180px] w-[200px]"
                placeholder="Search by Barcode..."
              />
              <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchInvestigation}
                onChange={(e) => setSearchInvestigation(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 min-w-[180px] w-[200px]"
                placeholder="Search by Investigation..."
              />
              <RiSearchLine className="absolute left-3 top-2.5 text-lg text-gray-400" />
            </div>

            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow hover:scale-105 transition"
            >
              Search
            </button>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : filteredReportData.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No report entry found.
            </div>
          ) : (
            <PhlebotomistDataTable
              items={mappedItems}
              columns={columns}
              showDetailsButtons={false}
              onUpdate={handleUpdate}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PendingReportRegister;
