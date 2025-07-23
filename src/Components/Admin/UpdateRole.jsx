import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";
import { useNavigate } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

const UpdateRole = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { roleToUpdate, setRoleToUpdate } = useContext(AdminContext);
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
      roletype: "",
      roledescription: "",
      isactive: "true",
    },
  });

  useEffect(() => {
    if (!roleToUpdate) {
      const stored = localStorage.getItem("roleToUpdate");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRoleToUpdate(parsed);
          reset({
            roletype: parsed.roletype || "",
            roledescription: parsed.roledescription || "",
            isactive: String(parsed.isactive),
          });
        } catch (err) {
          console.error("Failed to parse role from localStorage", err);
        }
      }
    } else {
      reset({
        roletype: roleToUpdate.roletype || "",
        roledescription: roleToUpdate.roledescription || "",
        isactive: String(roleToUpdate.isactive),
      });
    }
  }, [roleToUpdate, reset, setRoleToUpdate]);

  const onSubmit = async (data) => {
    if (!roleToUpdate?.id) return;

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-role/${roleToUpdate.id}`,
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

      navigate("/view-roles");
      toast.success("✅ Role updated successfully!");
      setRoleToUpdate(null);
      localStorage.removeItem("roleToUpdate");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to update role. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "roletype",
      label: "Role Type",
      placeholder: "Enter Role Type",
      validation: {
        required: "Role type is required",
        pattern: {
          value: /^[A-Za-z0-9 _-]+$/,
          message:
            "Only alphabets, numbers, space, dash (-), and underscore (_) allowed",
        },
        minLength: { value: 2, message: "Minimum 2 characters" },
        maxLength: { value: 20, message: "Maximum 20 characters" },
      },
    },
    {
      name: "roledescription",
      label: "Role Description",
      placeholder: "Enter Role Description",
      validation: {
        required: "Role description is required",
        pattern: {
          value: /^[A-Za-z0-9 _-]+$/,
          message:
            "Only alphabets, numbers, space, dash (-), and underscore (_) allowed",
        },
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

  if (!roleToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No role selected for update.</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <CBreadcrumb className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <CBreadcrumbItem href="#" className="hover:text-blue-600">
            🏠︎ Home /
          </CBreadcrumbItem>
          <CBreadcrumbItem href="/view-roles" className="hover:text-blue-600">
            Roles /
          </CBreadcrumbItem>
          <CBreadcrumbItem active className="text-gray-500">
            Update Role
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
            <h4 className="text-white font-semibold">Update Role</h4>
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
                  setRoleToUpdate(null);
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
                {isSubmitting ? "Updating..." : "Update Role"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateRole;
