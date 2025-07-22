import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AdminContext from "../../context/adminContext";

const UpdateReferalDoctor = () => {
  const navigate = useNavigate();
  const [hospitalList, setHospitalList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { referalDoctorToUpdate, setReferalDoctorToUpdate } = useContext(AdminContext);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  // Fetch hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-hospital", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setHospitalList(response.data || []);
      } catch (err) {
        toast.error("Failed to load hospitals.");
      }
    };

    fetchHospitals();
  }, []);

  // Pre-fill data
  useEffect(() => {
    if (referalDoctorToUpdate) {
      reset({
        refDoctorName: referalDoctorToUpdate.refDoctorName || "",
        addressLine: referalDoctorToUpdate.addressLine || "",
        city: referalDoctorToUpdate.city || "",
        state: referalDoctorToUpdate.state || "",
        pinCode: referalDoctorToUpdate.pinCode || "",
        qualification: referalDoctorToUpdate.qualification || "",
        email: referalDoctorToUpdate.email || "",
        ttm: referalDoctorToUpdate.ttm || "",
        gender: referalDoctorToUpdate.gender || "",
        hospital: referalDoctorToUpdate.hospital || "",
        contactNo: referalDoctorToUpdate.contactNo || "",
        isactive: String(referalDoctorToUpdate.isactive ?? "true"),
      });
    } else {
      toast.error("Referral doctor data not found.");
      navigate("/view-referal-doctor");
    }
  }, [referalDoctorToUpdate, reset, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const payload = {
      ...data,
      pinCode: Number(data.pinCode),
      isactive: data.isactive === "true",
    };

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-refdoc/${referalDoctorToUpdate?.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("Referral Doctor updated successfully!");
      setTimeout(() => {
        setReferalDoctorToUpdate(null);
        navigate("/view-referal-doctor");
      }, 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { name: "refDoctorName", label: "Referral Doctor Name", placeholder: "Enter Doctor Name", validation: { required: "Doctor name is required" } },
    { name: "addressLine", label: "Address", placeholder: "Enter Address", validation: { required: "Address is required" } },
    { name: "city", label: "City", placeholder: "Enter City", validation: { required: "City is required" } },
    { name: "state", label: "State", placeholder: "Enter State", validation: { required: "State is required" } },
    {
      name: "pinCode",
      label: "PIN Code",
      type: "number",
      placeholder: "Enter PIN Code",
      validation: {
        required: "PIN code is required",
        pattern: {
          value: /^\d{6}$/,
          message: "PIN code must be 6 digits",
        },
      },
    },
    { name: "qualification", label: "Qualification", placeholder: "Enter Qualification", validation: { required: "Qualification is required" } },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter Email",
      validation: {
        required: "Email is required",
        pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
      },
    },
    { name: "ttm", label: "TTM", placeholder: "Enter TTM", validation: { required: "TTM is required" } },
    {
      name: "hospital",
      label: "Hospital",
      type: "select",
      options: hospitalList.map(h => ({ value: h.hospital_name, label: h.hospital_name })),
      validation: { required: "Hospital is required" },
    },
    {
      name: "contactNo",
      label: "Contact Number",
      type: "number",
      placeholder: "Enter Contact Number",
      validation: {
        required: "Contact number is required",
        pattern: { value: /^\d{10}$/, message: "Must be 10 digits" },
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
      <ToastContainer />
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-sm font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li><Link to="/" className="text-gray-700 hover:text-teal-600">🏠 Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-referal-doctor" className="text-gray-700 hover:text-teal-600">Referral Doctor</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Referral Doctor</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-2 space-y-4 text-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-xl border border-gray-200">
          <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Referral Doctor</h4>
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
                      className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`}
                    >
                      <option value="">Select {label}</option>
                      {options.map(opt => (
                        <option key={opt.value} value={opt.value} selected={ referalDoctorToUpdate.hospital === opt.value ? true : false}>{opt.label}</option>
                      ))}
                    </select>
                  ) : type === "radio" ? (
                    <div className="flex space-x-4">
                      {options.map(opt => (
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
                      className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`}
                    />
                  )}
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateReferalDoctor;
