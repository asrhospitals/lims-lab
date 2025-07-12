import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AdminContext from "../../context/adminContext";

const ViewColor = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setColorToUpdate } = useContext(AdminContext);

  useEffect(() => {
    const fetchColors = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          "https://asrlab-production.up.railway.app/lims/master/get-color",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setColors(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load colors.");
        setLoading(false);
      }
    };

    fetchColors();
  }, []);


    const handleUpdate = (color) => {
        setColorToUpdate(color);
        localStorage.setItem("colorToUpdate", JSON.stringify(color));
        navigate("/update-color");
    };

  return (
    <div className="w-full px-0 sm:px-2 text-[14.4px] space-y-4">
      <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
          Color Master List
        </h2>

        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">{error}</div>
        ) : colors.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No colors found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-4 py-3 border-b">ID</th>
                  <th className="px-4 py-3 border-b">Color Code</th>
                  <th className="px-4 py-3 border-b">Status</th>
                  <th className="px-4 py-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {colors.map((color) => (
                  <tr
                    key={color.id}
                    className="hover:bg-gray-50 transition duration-100"
                  >
                    <td className="px-4 py-2 border-b">{color.color_id}</td>
                    <td className="px-4 py-2 border-b">{color.color_code}</td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${
                          color.color_status === "Accept"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {color.color_status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        
                        onClick={() => handleUpdate(color)}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-[#238781] hover:bg-[#1d6f6d] rounded-md transition duration-150"
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




export default ViewColor;
