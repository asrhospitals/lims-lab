import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

const AddLabToLab = () => {
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
        labName: data.labName,
        addressLine: data.addressLine,
        city: data.city,
        state: data.state,
        pinCode: Number(data.pinCode),
        contactPerson: data.contactPerson,
        contactNo: Number(data.contactNo),
        email: data.email,
        isactive: data.isactive === "true",
      };

      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-labtolab",
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("✅ Lab added successfully!");
      reset();
      navigate("/view-labtolab");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to add lab. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "labName",
      label: "Lab Name",
      placeholder: "Enter Lab Name",
      validation: { required: "Lab name is required" },
    },
    {
      name: "addressLine",
      label: "Address",
      placeholder: "Enter Address",
      validation: { required: "Address is required" },
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter City",
      validation: { required: "City is required" },
    },
    {
      name: "state",
      label: "State",
      placeholder: "Enter State",
      validation: { required: "State is required" },
    },
    {
      name: "pinCode",
      label: "PIN Code",
      placeholder: "Enter PIN Code",
      type: "number",
      validation: {
        required: "PIN code is required",
        pattern: { value: /^\d{6}$/, message: "PIN must be 6 digits" },
      },
    },
    {
      name: "contactPerson",
      label: "Contact Person",
      placeholder: "Enter Contact Person",
      validation: { required: "Contact person is required" },
    },
    {
      name: "contactNo",
      label: "Contact Number",
      type: "number",
      placeholder: "Enter Contact Number",
      validation: { required: "Contact number is required" },
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter Email",
      validation: {
        required: "Email is required",
        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
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
      validation: { required: "Status is required" },
    },
  ];

  return (
    <>
      <div className="fixed top-[61px] w-full z-50">
        <CBreadcrumb className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <CBreadcrumbItem href="/" className="hover:text-blue-600">
            🏠︎ Home /
          </CBreadcrumbItem>
          <CBreadcrumbItem
            href="/view-labtolab"
            className="hover:text-blue-600"
          >
            Lab To Lab /
          </CBreadcrumbItem>
          <CBreadcrumbItem active className="text-gray-500">
            Library
          </CBreadcrumbItem>
        </CBreadcrumb>
      </div>
      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Lab To Lab</h4>
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
                      {label}
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
                              className="h-4 w-4 text-blue-600"
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
                {isSubmitting ? "Saving..." : "Create Lab"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddLabToLab;
