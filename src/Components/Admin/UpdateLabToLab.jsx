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

          // Populate form with fetched data
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
      <div className="fixed top-[61px] w-full z-50">
        <nav
          className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors"
          aria-label="breadcrumb"
        >
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="hover:text-blue-600">
                🏠︎ Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/view-labtolab" className="hover:text-blue-600">
                Lab To Lab
              </Link>
            </li>
            <li
              className="breadcrumb-item active text-gray-500"
              aria-current="page"
            >
              Update Lab
            </li>
          </ol>
        </nav>
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
                  navigate("/view-labtolab");
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
