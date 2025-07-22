import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";
import { useNavigate } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

const UpdateNodalHospital = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { nodalHospitalToUpdate, setNodalHospitalToUpdate } =
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
      hospitalname: "",
      isactive: "true",
    },
  });

  useEffect(() => {
    if (!nodalHospitalToUpdate) {
      const stored = localStorage.getItem("nodalHospitalToUpdate");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNodalHospitalToUpdate(parsed);
          reset({
            nodalname: parsed.nodalname || "",
            hospitalname: parsed.hospitalname || "",
            isactive: String(parsed.isactive),
          });
        } catch (err) {
          console.error(
            "Failed to parse nodal hospital from localStorage",
            err
          );
        }
      }
    } else {
      reset({
        nodalname: nodalHospitalToUpdate.nodalname || "",
        hospitalname: nodalHospitalToUpdate.hospitalname || "",
        isactive: String(nodalHospitalToUpdate.isActive),
      });
    }
  }, [nodalHospitalToUpdate, reset, setNodalHospitalToUpdate]);

  const onSubmit = async (data) => {
    console.log(data);
    if (!nodalHospitalToUpdate?.id) return;

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-nodalhospital/${nodalHospitalToUpdate.id}`,
        {
          ...data,
          isactive: data.isActive === "true",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      navigate("/view-nodal-hospitals");
      toast.success("✅ Nodal Hospital updated successfully!");
      setNodalHospitalToUpdate(null);
      localStorage.removeItem("nodalHospitalToUpdate");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to update nodal hospital. Please try again."
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
      validation: {
        required: "Nodal name is required",
        minLength: { value: 2, message: "Minimum 2 characters" },
        maxLength: { value: 100, message: "Maximum 100 characters" },
      },
    },
    {
      name: "hospitalname",
      label: "Hospital Name",
      placeholder: "Enter Hospital Name",
      validation: {
        required: "Hospital name is required",
        minLength: { value: 2, message: "Minimum 2 characters" },
        maxLength: { value: 100, message: "Maximum 100 characters" },
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

  if (!nodalHospitalToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No nodal hospital selected for update.</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-[61px] w-full z-50 ">
        <CBreadcrumb className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <CBreadcrumbItem
            href="#"
            className="hover:text-blue-600 transition-colors"
          >
            🏠︎ Home /
          </CBreadcrumbItem>
          <CBreadcrumbItem
            href="/view-nodal-hospitals"
            className="hover:text-blue-600 transition-colors"
          >
            Nodal Hospitals /
          </CBreadcrumbItem>
          <CBreadcrumbItem
            active
            className="inline-flex items-center text-gray-500"
          >
            Update
          </CBreadcrumbItem>
        </CBreadcrumb>
      </div>
      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl border border-gray-200"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Nodal Hospital</h4>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(
                ({
                  name,
                  label,
                  placeholder,
                  type = "text",
                  options,
                  validation,
                }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700">
                      {label}{" "}
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
                        placeholder={placeholder}
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
                  setNodalHospitalToUpdate(null);
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
                {isSubmitting ? "Updating..." : "Update Nodal Hospital"}
              </button>
            </div>
          </div>
        </form>
        <h2
          className="text-red-700 font-semibold text-2xl animate-blink"
          style={{
            animation: "blink 2s steps(2, start) infinite",
          }}
        >
          Problem Schema needed to update
        </h2>

        <style>
          {`
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: .3; }
    }
  `}
        </style>
      </div>
    </>
  );
};

export default UpdateNodalHospital;
