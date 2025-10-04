import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";

const AddColor = () => {
  const [selectedColor, setSelectedColor] = useState("#FF0000");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm({ mode: "onChange" });

  const navigate = useNavigate();

  useEffect(() => {
    setValue("color_code", selectedColor, { shouldValidate: true });
  }, [selectedColor, setValue]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setValue("color_code", color, { shouldValidate: true });
    trigger("color_code");
  };

  const onSubmit = async (data) => {
    if (!data.color_status) {
      toast.error("❌ Please select a valid color status");
      return;
    }

    const token = localStorage.getItem("authToken");
    const payload = {
      color_status: data.color_status.trim().replace(/\b\w/g, (c) => c.toUpperCase()),
      color_code: selectedColor.trim(),
    };

    try {
      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-color",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Color added successfully");
      reset();
      setSelectedColor("#FF0000");
      setTimeout(() => navigate("/view-color"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to add color.");
    }
  };

  return (
    <div className="container max-w-7xl mx-auto w-full mt-6 px-2 sm:px-4 text-sm">
      <ToastContainer />
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">🏠 Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-color" className="text-gray-700 hover:text-teal-600">Colors</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Add Color</li>
          </ol>
        </nav>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 mt-12"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
          <h4 className="font-semibold text-white">Add New Color</h4>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Color Status Dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Color Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register("color_status", { required: "Color status is required" })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.color_status
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-teal-500"
              } focus:ring-2 focus:border-transparent transition`}
            >
              <option value="">Select Status</option>
              <option value="Accept">Accept</option>
              <option value="Reject">Reject</option>
              <option value="Pending">Pending</option>
              <option value="Done">Done</option>
            </select>
            {errors.color_status && (
              <p className="text-red-500 text-xs mt-1">{errors.color_status.message}</p>
            )}
          </div>

          {/* Color Picker */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Color Code <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                {...register("color_code", { required: "Color code is required" })}
                value={selectedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-16 h-10 cursor-pointer border rounded"
              />
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: selectedColor }}
                ></div>
                <span className="font-mono text-gray-700">{selectedColor.toUpperCase()}</span>
              </div>
            </div>
            {errors.color_code && (
              <p className="text-red-500 text-xs mt-1">{errors.color_code.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => {
                reset();
                setSelectedColor("#FF0000");
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            >
              Add Color
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddColor;
