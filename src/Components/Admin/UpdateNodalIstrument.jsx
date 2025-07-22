import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";
import { useNavigate } from "react-router-dom";

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
          reset({
            ...parsed,
            isactive: String(parsed.isactive),
          });
        } catch (err) {
          console.error(
            "Failed to parse nodal instrument from localStorage",
            err
          );
        }
      }
    } else {
      reset({
        ...nodalInstrumentToUpdate,
        isactive: String(nodalInstrumentToUpdate.isactive),
      });
    }
  }, [nodalInstrumentToUpdate, reset, setNodalInstrumentToUpdate]);

  const onSubmit = async (data) => {
    if (!nodalInstrumentToUpdate?.id) return;

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-nodalinstrument/${nodalInstrumentToUpdate.id}`,
        {
          ...data,
          isactive: data.isactive === "true",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      toast.success("✅ Nodal Instrument updated successfully!");
      navigate("/view-nodal-instruments");
      setnodalInstrumentToUpdate(null);
      localStorage.removeItem("nodalInstrumentToUpdate");
    } catch (error) {
      console.error(error);
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
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      validation: {
        required: "This field is required.",
      },
    },
  ];

  if (!nodalInstrumentToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          No nodal instrument selected for update.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-full">
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
      >
        <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
          <h4 className="text-white font-semibold">Update Nodal Instrument</h4>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fields.map(
              ({ name, label, type = "text", options, validation }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {validation?.required && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  {type === "radio" ? (
                    <div className="flex space-x-4 pt-2">
                      {options.map((option) => (
                        <label
                          key={option.value}
                          className="inline-flex items-center"
                        >
                          <input
                            type="radio"
                            {...register(name, validation)}
                            value={option.value}
                            className="h-4 w-4 text-teal-600"
                          />
                          <span className="ml-2">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={type}
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      placeholder={label}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name] ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-teal-500`}
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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setNodalInstrumentToUpdate(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateNodalInstrument;
