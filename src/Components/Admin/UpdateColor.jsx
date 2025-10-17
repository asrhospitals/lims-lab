import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminContext from "../../context/adminContext";

const UpdateColor = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { colorToUpdate, setColorToUpdate } = useContext(AdminContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      status_of_color: "",
      colorcode: "",
    },
  });

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (colorToUpdate) {
          // ✅ Use context data if available
          reset({
            status_of_color:
              colorToUpdate.status_of_color ||
              colorToUpdate.colorstatus ||
              "unknown",
            colorcode:
              colorToUpdate.colorcode?.hex ||
              colorToUpdate.colorcode ||
              "#000000",
          });
        } else {
          // ✅ Fetch data from API if not in context
          const res = await axios.get(
            `https://asrlabs.asrhospitalindia.in/lims/master/view-color/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const data = res.data?.data || {};
          reset({
            status_of_color:
              data.status_of_color || data.colorstatus || "unknown",
            colorcode: data.colorcode?.hex || data.colorcode || "#000000",
          });
        }
      } catch (error) {
        console.error("Failed to fetch color:", error);
        toast.error("❌ Failed to load color details.");
        setTimeout(() => navigate("/view-color"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchColor();
  }, [colorToUpdate, id, navigate, reset]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      const payload = {
        status_of_color: formData.status_of_color,
        colorcode: formData.colorcode,
      };

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-color/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Color updated successfully!");
      setColorToUpdate(null);
      setTimeout(() => navigate("/view-color"), 1500);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "❌ Failed to update color.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "status_of_color",
      label: "Status of Color",
      placeholder: "e.g., Green",
      validation: {
        required: "Status of color is required",
        pattern: {
          value: /^[A-Za-z\s]+$/i,
          message: "Only alphabets allowed",
        },
      },
    },
    {
      name: "colorcode",
      label: "Color Code",
      placeholder: "#00FF00",
      validation: {
        required: "Color code is required",
        pattern: {
          value: /^#([0-9A-Fa-f]{3}){1,2}$/,
          message: "Must be a valid hex color",
        },
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-gray-500">
        Loading color details...
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto w-full mt-6 px-2 sm:px-4 text-sm">
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
          <h4 className="font-semibold text-white">Update Color</h4>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(({ name, label, placeholder, validation }) => (
              <div key={name} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {label}{" "}
                  {validation?.required && (
                    <span className="text-red-500">*</span>
                  )}
                </label>

                <input
                  type={name === "colorcode" ? "color" : "text"}
                  {...register(name, validation)}
                  onBlur={() => trigger(name)}
                  placeholder={placeholder}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors[name]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:ring-2 focus:border-transparent transition`}
                />

                {errors[name] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[name].message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
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
              } text-white rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50`}
            >
              {isSubmitting ? "Updating..." : "Update Color"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateColor;
