import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import { viewNodal, updateNodal } from "../../services/apiService";

const UpdateNodal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nodalToUpdate, setNodalToUpdate] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

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
      motherlab: "true",
      isactive: "true",
    },
  });

  useEffect(() => {
    const fetchNodalData = async () => {
      if (!id) {
        toast.error("No nodal ID provided");
        navigate("/view-nodal");
        return;
      }

      setIsLoading(true);
      try {
        const response = await viewNodal(id);
        const nodalData = response;
        setNodalToUpdate(nodalData);

        // Convert boolean values to form radio string values
        reset({
          nodalname: nodalData.nodalname || "",
          motherlab: nodalData.motherlab ? "true" : "false",
          isactive: nodalData.isactive ? "true" : "false",
        });
      } catch (error) {
        console.error("Failed to fetch nodal data:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to fetch nodal data. Please try again."
        );
        navigate("/view-nodal");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNodalData();
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const payload = {
        nodalname: data.nodalname,
        motherlab: data.motherlab === "true",
        isactive: data.isactive === "true",
      };

      await updateNodal(id, payload);

      toast.success("✅ Nodal updated successfully!");
      navigate("/view-nodal");
      setNodalToUpdate(null);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to update nodal. Please try again."
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
        maxLength: { value: 50, message: "Maximum 50 characters" },
        pattern: {
          // Allow alphabets, numbers, underscore (_), comma (,), and spaces
          value: /^[A-Za-z0-9_,\s]+$/i,
          message: "Only alphabets, numbers, underscore (_) and comma (,) allowed",
        },
      },
    },
    {
      name: "motherlab",
      label: "Is Mother Lab?",
      type: "radio",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      validation: {
        required: "This field is required.",
      },
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ],
      validation: {
        required: "This field is required.",
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Loading nodal data...</p>
      </div>
    );
  }

  if (!nodalToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Nodal lab not found.</p>
      </div>
    );
  }

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
                to="/view-nodal"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Nodal
              </Link>
            </li>

            <li className="text-gray-400">/</li>

            <li aria-current="page" className="text-gray-500">
              Update Nodal
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl border border-gray-200"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Nodal Lab</h4>
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
                  navigate("/view-nodal");
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
                {isSubmitting ? "Updating..." : "Update Nodal Lab"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateNodal;
