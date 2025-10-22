import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AdminContext from "../../context/adminContext";

const UpdateColor = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colorToUpdate, setColorToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      color_name: "",
      color_code: "#ff0000",
    },
  });

  // Safe population of form fields
  useEffect(() => {
    if (!colorToUpdate) return navigate("/view-color");

    let mounted = true;

    if (mounted) {
      const name = colorToUpdate.colorname || "";
      let hex = "#ff0000";

      try {
        const parsedCode = colorToUpdate.colorcode
          ? JSON.parse(colorToUpdate.colorcode)
          : {};
        hex = parsedCode.hex || (name.startsWith("#") ? name : "#ff0000");
      } catch (e) {
        hex = name.startsWith("#") ? name : "#ff0000";
      }

      reset({ color_name: name, color_code: hex });
    }

    return () => {
      mounted = false; // Prevent cleanup errors
    };
  }, [colorToUpdate, navigate, reset]);

  // Handle color update
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      const payload = {
        colorname: data.color_name.trim(),
        colorcode: { hex: data.color_code },
      };

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/api/lims/master/colors/${colorToUpdate.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Color updated successfully!");
      setColorToUpdate(null);
      navigate("/view-color");
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to update color.");
      console.error("Update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto mt-6 px-2 sm:px-4 text-sm">
      <ToastContainer />

      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
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
              Update Color
            </li>
          </ol>
        </nav>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 mt-20"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
          <h4 className="font-semibold text-white">Update Color</h4>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Color Name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Color Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("color_name", {
                required: "Color name is required",
                pattern: {
                  value: /^([A-Za-z\s]+|#([0-9A-Fa-f]{3}){1,2})$/,
                  message: "Only alphabets or hex code allowed",
                },
                onBlur: () => trigger("color_name"),
              })}
              placeholder="e.g., Red or #ff0000"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.color_name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
              } focus:ring-2 focus:border-transparent transition`}
            />
            {errors.color_name && (
              <p className="text-red-500 text-xs mt-1">{errors.color_name.message}</p>
            )}
          </div>

          {/* Color Picker */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Color Code <span className="text-red-500">*</span>
            </label>
            <input
              type="color"
              {...register("color_code", { required: "Color code is required" })}
              onChange={(e) => setValue("color_name", e.target.value)}
              className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
            {errors.color_code && (
              <p className="text-red-500 text-xs mt-1">{errors.color_code.message}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end px-6 pb-6">
          <button
            type="button"
            onClick={() => reset()}
            className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600"
            } text-white rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105`}
          >
            {isSubmitting ? "Updating..." : "Update Color"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateColor;
