import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { addInstrument, viewInstruments } from "../../services/apiService";

const AddInstrument = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [instruments, setInstruments] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
 } = useForm({
  mode: "onBlur",
  defaultValues: {
    isactive: "true", // ✅ Default Active = Yes
  },
});

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await viewInstruments();
        setInstruments(response || []);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };
    fetchInstruments();
  }, []);

  const validateMake = (name, value) => {
    const isValid = /^[A-Za-z\s]*$/.test(value);
    if (!isValid) {
      setError(name, {
        type: "manual",
        message: "Only letters and spaces allowed",
      });
    } else {
      clearErrors(name);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const validateInstrumentName = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue.length < 2 || trimmedValue.length > 50) {
      return "Instrument name must be between 2 and 50 characters.";
    }
    const validChars = /^[A-Za-z0-9\s-]+$/;
    if (!validChars.test(trimmedValue)) {
      return "Only letters, numbers, spaces, and hyphens allowed.";
    }
    if (!/[A-Za-z]/.test(trimmedValue)) {
      return "Instrument name must contain at least one letter.";
    }
    return true;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        instrumentname: data.instrumentname.trim(),
        make: data.make.trim(),
        short_code: data.short_code,
        installdate: data.installdate,
        isactive: data.isactive === "true",
      };

      const result = await addInstrument(payload);

      // ✅ Show toast first, then navigate
      if (result?.data?.message?.toLowerCase().includes("success")) {
        toast.success("Instrument added successfully!", {
          position: "top-right",
          autoClose: 2000,
        });

        reset();

        setTimeout(() => {
          navigate("/view-instruments");
        }, 2000); // wait 2 seconds before redirect
      } else {
        toast.error(result?.data?.message || "❌ Failed to add Instrument. Please try again.");
      }
    } catch (error) {
      console.error("Error adding instrument:", error);
      toast.error(
        error?.response?.data?.message || error?.message || "❌ Failed to add Instrument. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "instrumentname",
      label: "Instrument Name",
      placeholder: "Enter Instrument Name",
      validation: {
        required: "Instrument name is required",
        minLength: { value: 2, message: "Minimum 2 characters" },
        maxLength: { value: 50, message: "Maximum 50 characters" },
        validate: validateInstrumentName,
      },
    },
    {
      name: "make",
      label: "Make",
      placeholder: "Enter Make",
      validation: { required: "Make is required" },
      customValidation: validateMake,
    },
    {
      name: "short_code",
      label: "Short Code",
      placeholder: "Enter Short Code",
      validation: {
        required: "Short code is required",
        pattern: {
          value: /^[A-Za-z0-9]+$/,
          message: "Short code can only contain letters and numbers",
        },
      },
    },
    {
      name: "installdate",
      label: "Install Date",
      type: "date",
      validation: {
        required: "Install date is required",
        max: { value: today, message: "Install date cannot be in the future" },
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
      validation: { required: "Status is required." },
    },
  ];

  return (
    <>
      <ToastContainer />
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-instruments" className="text-gray-700 hover:text-teal-600">
                Instruments
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Add Instrument
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Instrument</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options, validation, customValidation }) => (
                <div key={name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {validation?.required && <span className="text-red-500">*</span>}
                  </label>

                  {type === "radio" ? (
                    <div className="flex space-x-4 pt-2">
                      {options.map((opt) => (
                        <label key={opt.value} className="inline-flex items-center">
                          <input
                            type="radio"
                            {...register(name, validation)}
                            value={opt.value}
                            className="h-4 w-4 text-teal-600"
                          />
                          <span className="ml-2">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={type}
                      {...register(name, validation)}
                      placeholder={placeholder}
                      max={name === "installdate" ? today : undefined}
                      onInput={(e) => customValidation && customValidation(name, e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                      } focus:ring-2 transition`}
                    />
                  )}

                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                </div>
              ))}
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
                {isSubmitting ? "Saving..." : "Add Instrument"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddInstrument;
