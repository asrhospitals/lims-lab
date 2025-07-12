import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    trigger,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      color_code: "",
      color_status: "",
    },
  });

  useEffect(() => {
    if (!colorToUpdate) {
      const stored = localStorage.getItem("colorToUpdate");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setColorToUpdate(parsed);
          reset({
            color_code: parsed.color_code || "",
            color_status: parsed.color_status || "",
          });
        } catch (err) {
          console.error("Failed to parse color from localStorage", err);
        }
      }
    } else {
      reset({
        color_code: colorToUpdate.color_code || "",
        color_status: colorToUpdate.color_status || "",
      });
    }
  }, [colorToUpdate, reset, setColorToUpdate]);


  

  const onSubmit = async (data) => {
    if (!colorToUpdate?.color_id) {
      toast.error("❌ Missing color ID for update.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      await axios.put(
        `https://asrlab-production.up.railway.app/lims/master/update-color/${colorToUpdate.color_id}`,
        {
          color_code: data.color_code,
          color_status: data.color_status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Color updated successfully!");
      setColorToUpdate(null);
      localStorage.removeItem("colorToUpdate");
      navigate("/view-colors");
    } catch (error) {
      console.error("Error updating color:", error);
      toast.error(
        error.response?.data?.message || "❌ Failed to update color."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "color_code",
      label: "Color Code",
      placeholder: "e.g., Red",
      validation: {
        required: "Color code is required",
        pattern: {
          value: /^[A-Za-z\s]+$/i,
          message: "Only alphabets allowed",
        },
      },
    },
    {
      name: "color_status",
      label: "Color Status",
      placeholder: "e.g., Accept / Reject",
      validation: {
        required: "Status is required",
        pattern: {
          value: /^[A-Za-z\s]+$/i,
          message: "Only alphabets allowed",
        },
      },
    },
  ];

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
                  type="text"
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
