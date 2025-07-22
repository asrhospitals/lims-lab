import  {  useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// import AdminContext from "../../context/adminContext";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { useNavigate, Link } from "react-router-dom";

const AddHospital = () => {
  const [hospitalTypes, setHospitalTypes] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({ mode: "onBlur" });

  // Fetch hospital types
  useEffect(() => 
    {
    const fetchHospitalTypes = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-hsptltype",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setHospitalTypes(response.data || []);
      } catch (error) {
        setFetchError(
          error.response?.data?.message || "Failed to fetch hospital types."
        );
      }
    };
    fetchHospitalTypes();
  }, []);




  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log(data);

    const payload = {
        ...data,
        pin: Number(data.pin),
        phoneno: Number(data.phoneno),
        cntprsnmob: Number(data.cntprsnmob),
        isactive: data.isactive === "true",
      };

    console.log("Submitting payload:", payload);
    
    try {
      const authToken = localStorage.getItem("authToken");

      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-hospital",
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("Hospital added successfully!");
      reset();
      navigate("/view-hospital");
    } catch (error) {
      console.error("Submission error:", error?.response?.data);
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to add hospital. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "hospital_name",
      label: "Hospital Name",
      placeholder: "Enter Hospital Name",
      validation: { required: "Hospital name is required" },
    },
    {
      name: "hsptltype",
      label: "Hospital Type",
      type: "select",
      options: hospitalTypes.map((t) => ({
        value: t.hsptltype,
        label: t.hsptldsc,
      })),
      validation: { required: "Hospital type is required" },
    },
    {
      name: "address",
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
      name: "district",
      label: "District",
      placeholder: "Enter District",
      validation: { required: "District is required" },
    },
    {
      name: "pin",
      label: "PIN Code",
      type: "number",
      placeholder: "Enter PIN Code",
      validation: {
        required: "PIN is required",
        pattern: { value: /^\d{6}$/, message: "PIN must be 6 digits" },
      },
    },
    {
      name: "states",
      label: "State",
      placeholder: "Enter State",
      validation: { required: "State is required" },
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
      name: "phoneno",
      label: "Phone Number",
      type: "number",
      placeholder: "Enter Phone Number",
      validation: { required: "Phone number is required" },
    },
    {
      name: "cntprsn",
      label: "Contact Person",
      placeholder: "Enter Contact Person",
      validation: { required: "Contact person is required" },
    },
    {
      name: "cntprsnmob",
      label: "Contact Person Mobile",
      type: "number",
      placeholder: "Enter Contact Person Mobile",
      validation: { required: "Mobile number is required" },
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

      {/* Breadcrumb */}
        <div className="fixed top-[61px] w-full z-10">
          <nav
              className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors"
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
                  to="/view-hospital"
                  className="text-gray-700 hover:text-teal-600 transition-colors"
                  >
                  Hospital
                  </Link>
              </li>
      
              <li className="text-gray-400">/</li>
      
              <li aria-current="page" className="text-gray-500">
                  Add Hospital
              </li>
              </ol>
          </nav>
        </div>


      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        {fetchError && (
          <p className="text-red-500 text-sm mb-4">{fetchError}</p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Hospital</h4>
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
                      {label}{" "}
                      {validation?.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    {type === "select" ? (
                      <select
                        {...register(name, validation)}
                        onBlur={() => trigger(name)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        } focus:ring-2 transition`}
                      >
                        <option value="">Select {label}</option>
                        {options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : type === "radio" ? (
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
                {isSubmitting ? "Saving..." : "Create Hospital"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddHospital;
