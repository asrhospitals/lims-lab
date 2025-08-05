import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const AddInstrument = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
   const navigate = useNavigate();

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
        isactive: data.isactive === "true",
      };

      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-instrument",
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("✅ Instrument added successfully!");
      
      reset();
      navigate("/view-instruments");

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to add Instrument. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
  {
    name: "instrumentname",
    label: "Instrument Name",
    type: "text",
    placeholder: "Enter Instrument Name",
    validation: { required: "Instrument name is required" },
  },
  {
    name: "make",
    label: "Make",
    type: "text",
    placeholder: "Enter Make",
    validation: { required: "Make is required" },
  },
  {
    name: "short_code",
    label: "Short Code",
    type: "text",
    placeholder: "Enter Short Code",
    validation: { required: "Short code is required" },
  },
  {
    name: "installdate",
    label: "Install Date",
    type: "date",
    validation: { required: "Install date is required" },
  },
  {
    name: "isactive",
    label: "Is Active?",
    type: "radio",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
    validation: { required: "Status is required." },
  },
];


  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
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
            Add Instruments
          </CBreadcrumbItem>
        </CBreadcrumb>
      </div>
      <div className="w-full mt-14 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Instrument</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(
                ({
                  name,
                  label,
                  placeholder,
                  type = "text",
                  options,
                  validation,
                }) => (
                  <div key={name} className="space-y-1">
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
                {isSubmitting ? "Saving..." : "Add Instrument"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddInstrument;
