import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminContext from "../../context/adminContext";

const ViewSpecimenType = () => {
  const [specimenList, setSpecimenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setSpecimenToUpdate } = useContext(AdminContext);

  useEffect(() => {
    const fetchSpecimens = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          "http://srv913743.hstgr.cloud:2000/lims/master/get-specimen",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSpecimenList(res.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching specimen types:", error);
        setError("Failed to load specimen types.");
        setLoading(false);
      }
    };

    fetchSpecimens();
  }, []);

  const handleEdit = (item) => {
    setSpecimenToUpdate(item);
    localStorage.setItem("specimenToUpdate", JSON.stringify(item));
    navigate("/update-specimen-type");
  };

  return (
    <div className="w-full px-0 sm:px-2 text-[14.4px] space-y-4">
      <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
          Specimen Type List
        </h2>

        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">{error}</div>
        ) : specimenList.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No specimen types found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-4 py-3 border-b">#</th>
                  <th className="px-4 py-3 border-b">Name</th>
                  <th className="px-4 py-3 border-b">Description</th>
                  <th className="px-4 py-3 border-b">Status</th>
                  <th className="px-4 py-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {specimenList.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition duration-100"
                  >
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">{item.specimenname}</td>
                    <td className="px-4 py-2 border-b">{item.specimendes}</td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${
                          item.isactive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isactive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-md transition duration-150"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSpecimenType;
