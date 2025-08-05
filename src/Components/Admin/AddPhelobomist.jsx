import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { useNavigate } from "react-router-dom";

const AddPhlebotomist = () => {
  const [nodalList, setNodalList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
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

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        const [nodalRes, hospitalRes] = await Promise.all([
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-nodal", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-hospital", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        setNodalList(nodalRes.data || []);
        setHospitalList(hospitalRes.data || []);
      } catch (error) {
        setFetchError(error.response?.data?.message || "Failed to fetch nodal or hospital data.");
      }
    };

    fetchDropdowns();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");

      const payload = {
        ...data,
        pincode: Number(data.pincode),
        contactno: data.contactno.toString(),
        isactive: data.isactive === "true",
      };

      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-phlebo",
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("✅ Phlebotomist added successfully!");
      reset();
      navigate("/view-phlebotomist");
    } catch (error) {
      toast.error(error?.response?.data?.message || "❌ Failed to add phlebotomist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const alphaNumPattern = {
    value: /^[A-Za-z0-9 _-]+$/,
    message: "Only letters, numbers, spaces, - and _ are allowed",
  };

  const fields = [
    {
      name: "phleboname",
      label: "Phlebotomist Name",
      placeholder: "Enter Full Name",
      validation: {
        required: "Name is required",
        pattern: alphaNumPattern,
      },
    },
    {
      name: "addressline",
      label: "Address",
      placeholder: "Enter Address",
      validation: {
        required: "Address is required",
        pattern: alphaNumPattern,
      },
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter City",
      validation: {
        required: "City is required",
        pattern: alphaNumPattern,
      },
    },
    {
      name: "state",
      label: "State",
      placeholder: "Enter State",
      validation: {
        required: "State is required",
        pattern: alphaNumPattern,
      },
    },
    {
      name: "pincode",
      label: "PIN Code",
      type: "number",
      placeholder: "Enter PIN Code",
      validation: {
        required: "PIN Code is required",
        pattern: { value: /^\d{6}$/, message: "PIN must be 6 digits" },
      },
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      validation: { required: "Date of birth is required" },
    },
    {
      name: "contactno",
      label: "Contact Number",
      type: "text",
      placeholder: "Enter Contact Number",
      validation: {
        required: "Contact number is required",
        pattern: {
          value: /^[6-9]\d{9}$/,
          message: "Invalid contact number",
        },
      },
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
      ],
      validation: { required: "Gender is required" },
    },
    {
      name: "nodal",
      label: "Nodal Center",
      type: "select",
      options: nodalList.map((n) => ({
        value: n.nodalname,
        label: n.nodalname,
      })),
      validation: { required: "Nodal center is required" },
    },
    {
      name: "hospital",
      label: "Hospital",
      type: "select",
      options: hospitalList.map((h) => ({
        value: h.hospitalname,
        label: h.hospitalname,
      })),
      validation: { required: "Hospital is required" },
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
      <div className="fixed top-[61px] w-full z-10">
        <CBreadcrumb className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <CBreadcrumbItem href="#" className="hover:text-blue-600">🏠︎ Home /</CBreadcrumbItem>
          <CBreadcrumbItem href="/view-phlebotomist" className="hover:text-blue-600">Phlebotomist /</CBreadcrumbItem>
          <CBreadcrumbItem active className="text-gray-500">Add Phlebotomist</CBreadcrumbItem>
        </CBreadcrumb>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        {fetchError && <p className="text-red-500 text-sm mb-4">{fetchError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Phlebotomist</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options, validation }) => (
                <div key={name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {label} {validation?.required && <span className="text-red-500">*</span>}
                  </label>
                  {type === "select" ? (
                    <select
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                      } focus:ring-2 transition`}
                    >
                      <option value="">Select {label}</option>
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : type === "radio" ? (
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
                      onBlur={() => trigger(name)}
                      placeholder={placeholder}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                      } focus:ring-2 transition`}
                    />
                  )}
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Add Phlebotomist"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPhlebotomist;
