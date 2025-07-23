import React, { useEffect, useState } from "react";  
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const AddNodalHospital = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hospitalList, setHospitalList] = useState([]);
  const [nodalList, setNodalList] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-hospital",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setHospitalList(response.data || []);
      } catch (error) {
        setFetchError(
          error?.response?.data?.message || "Failed to fetch hospital list."
        );
      }
    };

    const fetchNodals = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-nodal",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setNodalList(response.data || []);
      } catch (error) {
        setFetchError(
          error?.response?.data?.message || "Failed to fetch nodal list."
        );
      }
    };

    fetchHospitals();
    fetchNodals();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const authToken = localStorage.getItem("authToken");

      const payload = {
        nodalid: parseInt(data.nodal_id, 10),
        hospitalid: parseInt(data.hospital_id, 10),
        isactive: data.isactive === "true",
      };

      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-nodalhospital",
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("✅ Nodal Hospital added successfully!");
      reset();
      navigate("/view-nodal-hospitals");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to add Nodal Hospital. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "nodal_id",
      label: "Nodal Name",
      type: "select",
      options: nodalList.map((n) => ({
        value: n.id,
        label: n.nodalname,
      })),
      validation: { required: "Nodal name is required" },
    },
    {
      name: "hospital_id",
      label: "Hospital Name",
      type: "select",
      options: hospitalList.map((h) => ({
        value: h.id,
        label: h.hospitalname,
      })),
      validation: { required: "Hospital name is required" },
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
      defaultValue: "true", // optional default
    },
  ];

  return (
    <>
      {/* Breadcrumb */}
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
                to="/view-nodal-hospitals"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Nodal Hospital
              </Link>
            </li>

            <li className="text-gray-400">/</li>

            <li aria-current="page" className="text-gray-500">
              Add Nodal Hospital
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        {fetchError && (
          <p className="text-red-500 text-sm mb-4">{fetchError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Nodal Hospital</h4>
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
                    defaultValue,
                  },
                  index
                ) => (
                  <div key={name} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                      {validation?.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>

                    {type === "select" ? (
                      <select
                        {...register(name, validation)}
                        onBlur={() => trigger(name)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        } focus:ring-2 transition`}
                        defaultValue=""
                      >
                        <option value="">Select {label}</option>
                        {options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : type === "radio" ? (
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
                              defaultChecked={defaultValue === opt.value}
                            />
                            <span className="ml-2">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={type}
                        {...register(name, {
                          ...validation,
                          pattern: {
                            value: /^[a-zA-Z0-9_,\s-]*$/,
                            message:
                              "Only alphabets, numbers, underscore (_), comma (,) and hyphen (-) are allowed",
                          },
                        })}
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
                {isSubmitting ? "Saving..." : "Create Nodal Hospital"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNodalHospital;
