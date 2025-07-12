import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddNodalInstrument = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");

      const payload = {
        ...data,
        isactive: data.isactive === "true", // convert to boolean
      };

      await axios.post(
        "https://asrlab-production.up.railway.app/lims/master/add-nodalinstrument",
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("✅ Nodal Instrument added successfully!");
      reset();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to add Nodal Instrument. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "nodalname",
      label: "Nodal Name",
      placeholder: "Enter Nodal Name",
      validation: { required: "Nodal name is required" },
    },
    {
      name: "instrumentname",
      label: "Instrument Name",
      placeholder: "Enter Instrument Name",
      validation: { required: "Instrument name is required" },
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      validation: { required: "Status is required." },
    },
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
      >
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
          <h4 className="font-semibold text-white">Add Nodal Instrument</h4>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(
              (
                {
                  name,
                  label,
                  placeholder,
                  type = "text",
                  options,
                  validation,
                },
                idx
              ) => (
                <div key={name + idx} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}{" "}
                    {validation?.required && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>

                  {type === "radio" ? (
                    <div className="flex space-x-4 pt-2">
                      {options.map((opt) => (
                        <label
                          key={opt.value}
                          className="inline-flex items-center"
                        >
                          <input
                            type="radio"
                            {...register(name, validation)}
                            value={opt.value}
                            className="h-4 w-4 text-teal-600"
                          />
                          <span className="ml-2">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={type}
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      placeholder={placeholder}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:ring-2 transition`}
                    />
                  )}

                  {errors[name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[name].message}
                    </p>
                  )}
                </div>
              )
            )}
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
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Create Nodal Instrument"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNodalInstrument;
