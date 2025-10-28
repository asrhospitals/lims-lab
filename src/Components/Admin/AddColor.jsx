import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";

const AddColor = () => {
  const [selectedColor, setSelectedColor] = useState("#ff0000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    setValue("color_status", selectedColor, { shouldValidate: true });
  }, [selectedColor, setValue]);

  // Convert any valid CSS color name to hex
  const getHexFromName = (name) => {
    const div = document.createElement("div");
    div.style.color = name;
    document.body.appendChild(div);
    const computed = getComputedStyle(div).color;
    document.body.removeChild(div);

    const rgb = computed.match(/\d+/g);
    if (rgb) {
      return (
        "#" +
        ((1 << 24) +
          (parseInt(rgb[0]) << 16) +
          (parseInt(rgb[1]) << 8) +
          parseInt(rgb[2]))
          .toString(16)
          .slice(1)
      );
    }
    return null;
  };

  // Handle color name input
  const handleColorNameChange = (e) => {
    const name = e.target.value.trim();
    const hex = getHexFromName(name);
    if (hex) {
      setSelectedColor(hex);
    }
  };

  // Handle color picker
  const handleColorChange = (newColor) => {
    setSelectedColor(newColor);
    setValue("color_status", newColor, { shouldValidate: true });
    trigger("color_status");
  };

  // Submit form
  const onSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    try {
      const payload = {
        status_of_color: data.color_name.trim(),
        colorcode: selectedColor,
      };

      console.log("Payload being sent:", payload);

      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-color",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Color added successfully!");
      reset();
      setSelectedColor("#ff0000");
      setTimeout(() => navigate("/view-color"), 2000);
    } catch (error) {
      console.error("Add color error:", error);
      toast.error(error.response?.data?.message || "❌ Failed to add color.");
    }
  };

  return (
    <>
      {/* ===== Breadcrumb Header ===== */}
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-color" className="text-gray-700 hover:text-teal-600">
                Colors
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Add Color
            </li>
          </ol>
        </nav>
      </div>

      {/* ===== Main Form Section ===== */}
      <div className="container max-w-7xl mx-auto w-full mt-16 px-2 sm:px-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add New Color</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Color Name Input */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Status of Color <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("color_name", {
                    required: "Color name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/i,
                      message: "Only alphabets allowed",
                    },
                    onBlur: (e) => trigger("color_name"),
                    onInput: (e) => {
                      trigger("color_name");
                      handleColorNameChange(e);
                    },
                    onKeyUp: (e) => {
                      trigger("color_name");
                      handleColorNameChange(e);
                    },
                  })}
                  placeholder="e.g., Red, LightBlue, DarkGreen"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.color_name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:ring-2 focus:border-transparent transition`}
                />
                {errors.color_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.color_name.message}
                  </p>
                )}
              </div>

              {/* Color Picker */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Color Code <span className="text-red-500">*</span>
                </label>
                <div
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 cursor-pointer"
                  onClick={() => setShowColorPicker(true)}
                >
                  {selectedColor.toUpperCase()}
                </div>
                {errors.color_status && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.color_status.message}
                  </p>
                )}
              </div>
            </div>

            {/* Color Picker Modal */}
            {showColorPicker && (
              <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm mx-auto mt-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full border-4 border-gray-200 shadow-inner"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <div className="font-mono text-gray-800 text-xl font-bold">
                    {selectedColor.toUpperCase()}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-24 h-24 p-0 border-none cursor-pointer rounded-full shadow"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-8 flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSelectedColor("#ff0000");
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
    </>
  );
};

export default AddColor;
