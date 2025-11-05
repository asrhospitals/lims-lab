import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { addLabToLab } from "../../services/apiService";

const AddLabToLab = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    isactive: "true", // ✅ Default Active = Yes
  },
});
  const onSubmit = async (data) => {
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

      await addLabToLab(payload);


      toast.success("New Lab added successfully!");
      reset();
      setTimeout(() => navigate("/view-labtolab"), 1500);



    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to add lab. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLettersOnly = (name, value) => {
    // Only letters and spaces allowed
    const isValid = /^[a-zA-Z\s]*$/.test(value);

    if (!isValid) {
      setError(name, {
        type: "manual",
        message: "Only letters are allowed",
      });
    } else {
      clearErrors(name);
    }
  };

  // Validation regex
  const alphanumericRegex = /^[a-zA-Z0-9\s\-_]+$/;
  const pinCodeRegex = /^\d{6}$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const lettersOnlyRegex = /^[a-zA-Z\s]+$/; // Only letters, space, _ and -
  const fields = [
  {
    name: "labname",
    label: "Lab Name",
    placeholder: "Enter Lab Name",
    validation: {
      required: "Lab name is required",
      pattern: {
        value: lettersOnlyRegex,
        message: "Only letters, spaces, underscore (_) and hyphen (-) are allowed",
      },
      lettersOnly: true,
    },
    onBlur: (e, errors) => {
      if (errors?.labname) {
        const inputElement = document.querySelector(`[name="labname"]`);
        if (inputElement) inputElement.focus();
      }
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
    onBlur: (e, errors) => {
      if (errors?.addressline) {
        const inputElement = document.querySelector(`[name="addressline"]`);
        if (inputElement) inputElement.focus();
      }
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
    onBlur: (e, errors) => {
      if (errors?.city) {
        const inputElement = document.querySelector(`[name="city"]`);
        if (inputElement) inputElement.focus();
      }
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
    onBlur: (e, errors) => {
      if (errors?.state) {
        const inputElement = document.querySelector(`[name="state"]`);
        if (inputElement) inputElement.focus();
      }
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
    onBlur: (e, errors) => {
      if (errors?.pincode) {
        const inputElement = document.querySelector(`[name="pincode"]`);
        if (inputElement) inputElement.focus();
      }
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
    onBlur: (e, errors) => {
      if (errors?.contactperson) {
        const inputElement = document.querySelector(`[name="contactperson"]`);
        if (inputElement) inputElement.focus();
      }
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
    onBlur: (e, errors) => {
      if (errors?.contactno) {
        const inputElement = document.querySelector(`[name="contactno"]`);
        if (inputElement) inputElement.focus();
      }
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
    onBlur: (e, errors) => {
      if (errors?.email) {
        const inputElement = document.querySelector(`[name="email"]`);
        if (inputElement) inputElement.focus();
      }
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
    // No cursor-preserving needed for radio
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
                to="/admin-dashboard"
                className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors"
              >
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-labtolab"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Lab To Lab
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Add Lab
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
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Lab To Lab</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(
                (
                  { name, label, placeholder, type = "text", options, validation },
                  index
                ) => (
                  <div key={index} className="space-y-1">
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
                              onInput={() => trigger(name)}
                              onKeyUp={() => trigger(name)}
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
                        onInput={() => trigger(name)}
                        onKeyUp={() => trigger(name)}
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
                {isSubmitting ? "Saving..." : "Add Lab"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddLabToLab;
