import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { addReception } from "../../services/apiService";

const AddReceptionist = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({ mode: "onBlur" });

  // Today’s date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      receptionistname: data.receptionistname.trim(),
      addressline: data.addressline.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      pincode: Number(data.pincode),
      dob: today, // force present date only
      contactno: data.contactno.trim(),
      gender: data.gender,
      isactive: data.isactive === "true",
    };

    try {
      await addReception(payload);

      toast.success("Receptionist added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      reset();
      setTimeout(() => {
        navigate("/view-reception");
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error?.response?.data);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to add receptionist. Please try again.",
        { position: "top-right", autoClose: 3000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "receptionistname",
      label: "Receptionist Name",
      placeholder: "Enter Receptionist Name",
      validation: {
        required: "Receptionist name is required",
        pattern: {
          value: /^[a-zA-Z\s]+$/,
          message: "Name should only contain letters and spaces",
        },
      },
    },
    {
      name: "addressline",
      label: "Address",
      placeholder: "Enter Address",
      validation: { required: "Address is required" },
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter City",
      validation: {
        required: "City is required",
        pattern: {
          value: /^[a-zA-Z\s]+$/,
          message: "City should only contain letters and spaces",
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
          value: /^[a-zA-Z\s]+$/,
          message: "State should only contain letters and spaces",
        },
      },
    },
    {
      name: "pincode",
      label: "PIN Code",
      type: "text",
      placeholder: "Enter PIN Code",
      validation: {
        required: "PIN Code is required",
        pattern: {
          value: /^\d{6}$/,
          message: "PIN must be exactly 6 digits",
        },
      },
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      validation: { required: "Date of birth is required" },
      max: today, // restrict to today or past
    },
    {
      name: "contactno",
      label: "Contact Number",
      type: "text",
      placeholder: "Enter Contact Number",
      validation: {
        required: "Contact number is required",
        pattern: {
          value: /^\d{10}$/,
          message: "Contact number must be 10 digits",
        },
      },
    },
    {
      name: "gender",
      label: "Gender",
      type: "radio",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
      ],
      validation: { required: "Gender is required" },
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
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600"
              >
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-reception"
                className="text-gray-700 hover:text-teal-600"
              >
                Receptionist
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Add Receptionist
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Receptionist</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(
                ({ name, label, placeholder, type = "text", options, validation }) => (
                  <div key={name} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                      {validation?.required && (
                        <span className="text-red-500"> *</span>
                      )}
                    </label>

                    {type === "radio" ? (
                      <div className="flex space-x-4 pt-2">
                        {options.map((opt) => (
                          <label key={opt.value} className="inline-flex items-center">
                            <input
                              type="radio"
                              {...register(name, validation)}
                              value={opt.value}
                              onInput={() => trigger(name)}
                              className="h-4 w-4 text-teal-600"
                            />
                            <span className="ml-2">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    ) : type === "date" ? (
                      <input
                        type="date"
                        {...register(name, validation)}
                        onInput={() => trigger(name)}
                        min={today}
                        max={today}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        } focus:ring-2 transition`}
                      />
                    ) : (
                      <input
                        type={type}
                        {...register(name, validation)}
                        onInput={() => trigger(name)}
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
                className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 ${
                  isSubmitting && "opacity-50 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Add Receptionist"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReceptionist;
