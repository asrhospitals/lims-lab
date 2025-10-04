import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminContext from "../../context/adminContext";
import { Link, useNavigate } from "react-router-dom";
import { updateNodalInstrument } from "../../services/apiService";

const UpdateNodalInstrument = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { nodalInstrumentToUpdate, setNodalInstrumentToUpdate } =
    useContext(AdminContext);
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
      nodalname: "",
      instrumentname: "",
      isactive: "true",
    },
  });

  useEffect(() => {
    if (!nodalInstrumentToUpdate) {
      const stored = localStorage.getItem("nodalInstrumentToUpdate");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNodalInstrumentToUpdate(parsed);

          const isActiveValue = parsed.status === "Active" ? "true" : "false";

          reset({
            nodalname: parsed.nodalname || "",
            instrumentname: parsed.instrumentname || "",
            isactive: isActiveValue,
          });
        } catch (err) {
          console.error(
            "Failed to parse nodal instrument from localStorage",
            err
          );
        }
      }
    } else {
      const isActiveValue =
        nodalInstrumentToUpdate.status === "Active" ? "true" : "false";

      reset({
        nodalname: nodalInstrumentToUpdate.nodalname || "",
        instrumentname: nodalInstrumentToUpdate.instrumentname || "",
        isactive: isActiveValue,
      });
    }
  }, [nodalInstrumentToUpdate, reset, setNodalInstrumentToUpdate]);

  const onSubmit = async (data) => {
    if (!nodalInstrumentToUpdate?.id) return;

    setIsSubmitting(true);
    try {
      const payload = {
        nodalname: data.nodalname,
        instrumentname: data.instrumentname,
        isactive: data.isactive === "true",
      };

      await updateNodalInstrument(nodalInstrumentToUpdate.id, payload);

      toast.success("✅ Nodal Instrument updated successfully!");
      navigate("/view-nodal-instruments");
      setNodalInstrumentToUpdate(null);
      localStorage.removeItem("nodalInstrumentToUpdate");
    } catch (error) {
      console.error("Error updating nodal instrument:", error);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to update nodal instrument. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "nodalname",
      label: "Nodal Name",
      validation: {
        required: "Nodal name is required",
        minLength: { value: 2, message: "Minimum 2 characters" },
      },
    },
    {
      name: "instrumentname",
      label: "Instrument Name",
      validation: {
        required: "Instrument name is required",
        minLength: { value: 2, message: "Minimum 2 characters" },
      },
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      validation: {
        required: "Status is required.",
      },
    },
  ];

  const handleCancel = () => {
    setNodalInstrumentToUpdate(null);
    localStorage.removeItem("nodalInstrumentToUpdate");
    navigate("/view-nodal-instruments");
  };

  if (!nodalInstrumentToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No instrument selected for update.</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors"
              >
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-nodal-instruments"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Nodal Instruments
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Update Nodal Instrument
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">
              Update Nodal Instrument
            </h4>
          </div>
          <div className="p-6 space-y-6">
            {/* First Row: Nodal & Instrument Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.slice(0, 2).map(({ name, label, validation }) => (
                <div key={name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {validation?.required && (
                      <span className="text-red-500"> *</span>
                    )}
                  </label>
                  <input
                    type="text"
                    {...register(name, validation)}
                    onBlur={() => trigger(name)}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors[name] && (
                    <p className="text-red-500 text-sm">{errors[name].message}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Second Row: Active/Inactive */}
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700">
                {fields[2].label}
                <span className="text-red-500"> *</span>
              </label>
              <div className="flex space-x-6 pt-2">
                {fields[2].options.map((option) => (
                  <label key={option.value} className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register(fields[2].name, fields[2].validation)}
                      value={option.value}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors[fields[2].name] && (
                <p className="text-red-500 text-sm">{errors[fields[2].name].message}</p>
              )}
            </div>

            {/* Action Buttons aligned right */}
           {/* Action Buttons aligned right */}
<div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-6">
  {/* Cancel first */}
  <button
    type="button"
    onClick={handleCancel}
    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
  >
    Cancel
  </button>

  {/* Update next */}
  <button
    type="submit"
    disabled={isSubmitting}
    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
  >
    {isSubmitting ? (
      <span className="flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Updating...
      </span>
    ) : (
      "Update Nodal Instrument"
    )}
  </button>
</div>

          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateNodalInstrument;
