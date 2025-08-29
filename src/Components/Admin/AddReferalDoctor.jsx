import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const AddReferalDoctor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hospitalList, setHospitalList] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const { data } = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-hospital",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setHospitalList(data?.data || []);
      } catch (error) {
        setFetchError(
          error.response?.data?.message ||
          "Failed to fetch hospital data."
        );
      }
    };

    fetchDropdowns();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      refDoctorName: data.refDoctorName,
      addressLine: data.addressLine,
      city: data.city,
      state: data.state,
      pinCode: Number(data.pinCode),
      qualification: data.qualification,
      email: data.email,
      ttm: data.ttm,
      gender: data.gender,
      hospital: data.hospital,
      contactNo: data.contactNo,
      isactive: data.isactive === "true" || data.isactive === true,
    };

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-refdoc",
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("Referral Doctor added successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      reset();

      setTimeout(() => {
        navigate("/view-referal-doctor");
      }, 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "❌ Failed to add Referral Doctor. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "refDoctorName",
      label: "Referral Doctor Name",
      placeholder: "Enter Doctor Name",
      validation: { required: "Doctor name is required" },
    },
    {
      name: "addressLine",
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
      name: "state",
      label: "State",
      placeholder: "Enter State",
      validation: { required: "State is required" },
    },
    {
      name: "pinCode",
      label: "PIN Code",
      type: "number",
      placeholder: "Enter PIN Code",
      validation: {
        required: "PIN code is required",
        pattern: {
          value: /^\d{6}$/,
          message: "PIN code must be exactly 6 digits",
        },
      },
    },
    {
      name: "qualification",
      label: "Qualification",
      placeholder: "Enter Qualification (e.g., MBBS)",
      validation: { required: "Qualification is required" },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter Email",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^\S+@\S+\.\S+$/,
          message: "Enter a valid email",
        },
      },
    },
    {
      name: "ttm",
      label: "TTM",
      placeholder: "Enter TTM (if any)",
      validation: { required: "TTM is required" },
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
      name: "contactNo",
      label: "Contact Number",
      type: "number",
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
        <nav className="flex items-center text-sm font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-referal-doctor" className="text-gray-700 hover:text-teal-600">
                Referral Doctor
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Add Referral Doctor</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-2 space-y-4 text-sm">
        <ToastContainer />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow rounded-xl border border-gray-200"
        >
          <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Add Referral Doctor</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options, validation }) => (
                <div key={name}>
                  <label className="block mb-1 font-medium text-gray-700">{label}</label>

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
                    <div className="flex space-x-4">
                      {options.map((opt) => (
                        <label key={opt.value} className="inline-flex items-center">
                          <input
                            type="radio"
                            value={opt.value}
                            {...register(name, validation)}
                            className="form-radio text-teal-500"
                          />
                          <span className="ml-2">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={type}
                      placeholder={placeholder}
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:ring-2 transition`}
                    />
                  )}

                  {errors[name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
                  )}
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
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                {isSubmitting ? "Submitting..." : "Add Referral Doctor"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReferalDoctor;
