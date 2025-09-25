import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams, Link } from "react-router-dom";
import { viewLabToLab, updateLabToLab } from "../../services/apiService";

const UpdateLabToLab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [labData, setLabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
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
    const fetchLabData = async () => {
      if (!id) {
        toast.error("❌ No lab ID provided.");
        navigate("/view-labtolab");
        return;
      }

      try {
        setLoading(true);
        const response = await viewLabToLab(id);
        const data = response;

        if (data) {
          setLabData(data);

          reset({
            labname: data.labname || "",
            addressline: data.addressline || "",
            city: data.city || "",
            state: data.state || "",
            pincode: data.pincode || "",
            contactperson: data.contactperson || "",
            contactno: data.contactno || "",
            email: data.email || "",
            isactive: String(data.isactive),
          });
        }
      } catch (error) {
        console.error("Failed to fetch lab:", error);
        toast.error("❌ Failed to fetch lab data.");
        navigate("/view-labtolab");
      } finally {
        setLoading(false);
      }
    };

    fetchLabData();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    if (!id) {
      toast.error("❌ No valid lab ID to update.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        labname: data.labname,
        addressline: data.addressline,
        city: data.city,
        state: data.state,
        pincode: Number(data.pincode),
        contactperson: data.contactperson,
        contactno: data.contactno,
        email: data.email,
        isactive: data.isactive === "true",
      };

      await updateLabToLab(id, payload);

      toast.success("✅ Lab updated successfully!");
      navigate("/view-labtolab");
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

  // Validation regex
  const alphanumericRegex = /^[a-zA-Z0-9\s\-_]+$/;
  const pinCodeRegex = /^\d{6}$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const lettersOnlyRegex = /^[a-zA-Z\s]+$/;

  const fields = [
    {
      name: "labname",
      label: "Lab Name",
      placeholder: "Enter Lab Name",
      validation: {
        required: "Lab name is required",
        pattern: {
          value: lettersOnlyRegex,
          message: "Only letters and spaces are allowed",
        },
      },
    },
    {
      name: "addressline",
      label: "Address",
      placeholder: "Enter Address",
      validation: {
        required: "Address is required",
        pattern: {
          value: alphanumericRegex,
          message: "Only letters, numbers, space, - and _ are allowed",
        },
      },
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter City",
      validation: {
        required: "City is required",
        pattern: {
          value: lettersOnlyRegex,
          message: "Only letters and spaces are allowed",
        },
      },
    },
    {
      name: "state",
      label: "State",
      placeholder: "Enter State",
      validation: {
        required: "State is required",
        pattern: {
          value: lettersOnlyRegex,
          message: "Only letters and spaces are allowed",
        },
      },
    },
    {
      name: "pincode",
      label: "PIN Code",
      placeholder: "Enter PIN Code",
      type: "text",
      validation: {
        required: "PIN code is required",
        pattern: {
          value: pinCodeRegex,
          message: "PIN must be exactly 6 digits",
        },
      },
    },
    {
      name: "contactperson",
      label: "Contact Person",
      placeholder: "Enter Contact Person",
      validation: {
        required: "Contact person is required",
        pattern: {
          value: lettersOnlyRegex,
          message: "Only letters and spaces are allowed",
        },
      },
    },
    {
      name: "contactno",
      label: "Contact Number",
      type: "text",
      placeholder: "Enter Contact Number",
      validation: {
        required: "Contact number is required",
        pattern: {
          value: phoneRegex,
          message: "Enter valid 10-digit mobile number",
        },
      },
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter Email",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^\S+@\S+\.\S+$/,
          message: "Invalid email format",
        },
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
      validation: {
        required: "Status is required",
      },
    },
  ];

  if (loading || !labData) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          {loading ? "Loading lab data..." : "No lab selected for update."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-50">
        <nav
          className="flex items-center font-medium px-4 py-2 bg-gray-50 border-b shadow-lg"
          aria-label="breadcrumb"
        >
          <ol className="flex space-x-2 text-sm">
            <li>
              <Link to="/" className="hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/view-labtolab" className="hover:text-teal-600">
                Lab To Lab
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-500">Update Lab</li>
          </ol>
        </nav>
      </div>

      {/* Form */}
      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          {/* Page Title Bar */}
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

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/view-labtolab")}
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
