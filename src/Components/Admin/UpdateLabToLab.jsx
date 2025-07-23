import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";
import { useNavigate } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

const UpdateLabToLab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { labToUpdate, setLabToUpdate } = useContext(AdminContext);
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
      labname: "",
      addressline: "",
      city: "",
      state: "",
      pincode: "",
      contactperson: "",
      contactno: "",
      email: "",
      isactive: "true",
    },
  });

  useEffect(() => {
    if (!labToUpdate) {
      const stored = localStorage.getItem("labToUpdate");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLabToUpdate(parsed);
          reset({
            ...parsed,
            isactive: String(parsed.isactive),
          });
        } catch (err) {
          console.error("Failed to parse lab from localStorage", err);
        }
      }
    } else {
      reset({
        ...labToUpdate,
        isactive: String(labToUpdate.isactive),
      });
    }
  }, [labToUpdate, reset, setLabToUpdate]);

  const onSubmit = async (data) => {
    if (!labToUpdate?.labid) return;

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-labtolab/${labToUpdate.labid}`,
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

      toast.success("✅ Lab updated successfully!");
      navigate("/view-labtolab");
      setLabToUpdate(null);
      localStorage.removeItem("labToUpdate");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to update lab. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const alphaNumericPattern = /^[a-zA-Z0-9\s\-_]+$/;

  const fields = [
    {
      name: "labname",
      label: "Lab Name",
      validation: {
        required: "Lab name is required",
        pattern: {
          value: alphaNumericPattern,
          message: "Only letters, numbers, spaces, -, _ allowed",
        },
      },
    },
    {
      name: "addressline",
      label: "Address",
      validation: {
        required: "Address is required",
        pattern: {
          value: alphaNumericPattern,
          message: "Only letters, numbers, spaces, -, _ allowed",
        },
      },
    },
    {
      name: "city",
      label: "City",
      validation: {
        required: "City is required",
        pattern: {
          value: alphaNumericPattern,
          message: "Only letters, numbers, spaces, -, _ allowed",
        },
      },
    },
    {
      name: "state",
      label: "State",
      validation: {
        required: "State is required",
        pattern: {
          value: alphaNumericPattern,
          message: "Only letters, numbers, spaces, -, _ allowed",
        },
      },
    },
    {
      name: "pincode",
      label: "Pin Code",
      type: "number",
      validation: {
        required: "Pincode is required",
        pattern: {
          value: /^[0-9]{5,6}$/,
          message: "Enter a valid 5 or 6 digit pin code",
        },
      },
    },
    {
      name: "contactperson",
      label: "Contact Person",
      validation: {
        required: "Contact person is required",
        pattern: {
          value: alphaNumericPattern,
          message: "Only letters, numbers, spaces, -, _ allowed",
        },
      },
    },
    {
      name: "contactno",
      label: "Contact Number",
      validation: {
        required: "Contact number is required",
        pattern: {
          value: /^[0-9]{10}$/,
          message: "Enter a valid 10-digit number",
        },
      },
    },
    {
      name: "email",
      label: "Email",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^\S+@\S+\.\S+$/,
          message: "Enter a valid email address",
        },
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

  if (!labToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No lab selected for update.</p>
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
            href="/view-labtolab"
            className="hover:text-blue-600"
          >
            Lab To Lab /
          </CBreadcrumbItem>
          <CBreadcrumbItem active className="text-gray-500">
            Update Lab
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
            <h4 className="text-white font-semibold">Update Lab</h4>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fields.map(
                ({
                  name,
                  label,
                  type = "text",
                  options,
                  validation,
                  readOnly = false,
                }) => (
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
                        readOnly={readOnly}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name] ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-teal-500 ${
                          readOnly ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
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
                  setLabToUpdate(null);
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
                {isSubmitting ? "Updating..." : "Update Lab"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateLabToLab;
