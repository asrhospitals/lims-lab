import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { useNavigate } from "react-router-dom";

const UpdateInstrument = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { instrumentToUpdate, setInstrumentToUpdate } =
    useContext(AdminContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({ mode: "onBlur" });

  // Set default values when component mounts or context updates
  useEffect(() => {
    let data = instrumentToUpdate;
    console.log(data);
    if (!data) {
      const stored = localStorage.getItem("instrumentToUpdate");
      if (stored) {
        try {
          data = JSON.parse(stored);
          setInstrumentToUpdate(data);
        } catch (err) {
          console.error("Failed to parse instrument from localStorage", err);
        }
      }
    }

    if (data) {
      const formattedDate = data.installDate
        ? new Date(data.installDate).toISOString().split("T")[0]
        : "";

      reset({
        instrumentname: data.instrumentname || "",
        make: data.make || "",
        short_code: data.short_code || "",
        installDate: data.installDateFormatted,
        isactive: data.isActive ? "true" : "false",
      });
    }
  }, [instrumentToUpdate, reset, setInstrumentToUpdate]);

  const onSubmit = async (data) => {
    if (!instrumentToUpdate?.id) return;

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");

      await axios.put(
        `http://srv913743.hstgr.cloud:2000/lims/master/update-instrument/${instrumentToUpdate.id}`,
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

      toast.success("✅ Instrument updated successfully!");
      setInstrumentToUpdate(null);
      localStorage.removeItem("instrumentToUpdate");
      navigate("/view-instruments");
    } catch (error) {
      console.error(error);
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
      validation: { required: "Instrument name is required" },
    },
    {
      name: "make",
      label: "Make",
      validation: { required: "Make is required" },
    },
    {
      name: "short_code",
      label: "Short Code",
      validation: { required: "Short code is required" },
    },
    {
      name: "installDate",
      label: "Installation Date",
      type: "date",
      validation: { required: "Installation date is required" },
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ],
      validation: { required: "This field is required." },
    },
  ];

  if (!instrumentToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No instrument selected for update.</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-[61px] w-full z-50">
        <CBreadcrumb className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <CBreadcrumbItem href="/" className="hover:text-blue-600">
            🏠︎ Home /
          </CBreadcrumbItem>
          <CBreadcrumbItem
            href="/view-instruments"
            className="hover:text-blue-600"
          >
            Instruments /
          </CBreadcrumbItem>
          <CBreadcrumbItem active className="text-gray-500">
            Update Instrument
          </CBreadcrumbItem>
        </CBreadcrumb>
      </div>

      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Instrument</h4>
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
                  setInstrumentToUpdate(null);
                  localStorage.removeItem("instrumentToUpdate");
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
