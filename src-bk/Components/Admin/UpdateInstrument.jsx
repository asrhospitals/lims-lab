import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { updateInstrument, viewInstrument } from "../../services/apiService";

const UpdateInstrument = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [instrumentData, setInstrumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm({ mode: "onBlur" });

  useEffect(() => {
    const fetchInstrumentData = async () => {
      if (!id) {
        toast.error("❌ No instrument ID provided.");
        navigate("/view-instruments");
        return;
      }
      try {
        setLoading(true);
        const data = await viewInstrument(id);
        if (data) {
          setInstrumentData(data);
          reset({
            instrumentname: data.instrumentname || "",
            make: data.make || "",
            short_code: data.short_code || "",
            installDate: data.installdate ? data.installdate.split("T")[0] : "",
            isactive: data.isactive ? "yes" : "no",
          });
        }
      } catch (error) {
        console.error("Failed to fetch instrument:", error);
        toast.error("❌ Failed to fetch instrument data.");
        navigate("/view-instruments");
      } finally {
        setLoading(false);
      }
    };
    fetchInstrumentData();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const payload = {
        instrumentname: data.instrumentname,
        make: data.make,
        short_code: data.short_code,
        installdate: data.installDate,
        isactive: data.isactive === "yes",
      };

      await updateInstrument(id, payload);
      toast.success("✅ Instrument updated successfully!");
      navigate("/view-instruments");
    } catch (error) {
      console.error("Error updating instrument:", error);
      toast.error(
        error?.response?.data?.message ||
        "❌ Failed to update instrument. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "instrumentname",
      label: "Instrument Name",
      validation: {
        required: "Instrument name is required",
        pattern: {
          value: /^[a-zA-Z0-9\s-]+$/,
          message: "Only letters, numbers, spaces, and hyphen allowed",
        },
      },
    },
    {
      name: "make",
      label: "Make",
      validation: {
        required: "Make is required",
        pattern: {
          value: /^[a-zA-Z\s]+$/,
          message: "Only letters and spaces allowed",
        },
      },
    },
    {
      name: "short_code",
      label: "Short Code",
      validation: {
        required: "Short code is required",
        pattern: {
          value: /^[a-zA-Z0-9_-]+$/,
          message: "Only letters, numbers, underscore, hyphen allowed",
        },
      },
    },
    {
      name: "installDate",
      label: "Installation Date",
      type: "date",
      validation: {
        required: "Installation date is required",
        validate: (value) => {
          const today = new Date().toISOString().split("T")[0];
          return value <= today || "Installation date cannot be in the future";
        },
      },
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      validation: { required: "Status is required" },
    },
  ];

  if (loading) return <div className="text-center py-10 text-gray-500">⏳ Loading instrument details...</div>;
  if (!instrumentData) return <div className="text-center py-10 text-gray-500">Instrument not found.</div>;

  return (
    <>
      <ToastContainer />
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li><Link to="/admin-dashboard" className="text-gray-700 hover:text-teal-600">🏠 Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-instruments" className="text-gray-700 hover:text-teal-600">Instruments</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Instrument</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Instrument</h4>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fields.map(({ name, label, type = "text", options, validation }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label} {validation?.required && <span className="text-red-500">*</span>}
                  </label>

                  {type === "radio" ? (
                    <div className="flex space-x-4 pt-2">
                      {options.map((opt) => (
                        <label key={opt.value} className="inline-flex items-center">
                          <input type="radio" {...register(name, validation)} value={opt.value} className="h-4 w-4 text-teal-600" />
                          <span className="ml-2">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={type}
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      placeholder={label}
                      className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                      max={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
                    />
                  )}

                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <button type="button" onClick={() => { reset(); navigate("/view-instruments"); }} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50">
                {isSubmitting ? "Updating..." : "Update Instrument"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateInstrument;
