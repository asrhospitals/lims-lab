import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { viewHospitalTypes, viewHospitals } from "../../services/apiService";
import axios from "axios";

const AddHospital = () => {
  const [hospitalTypes, setHospitalTypes] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset, setError, clearErrors, watch } = useForm({ mode: "onChange" });

  // Fetch hospital types + existing hospitals (for duplicate check)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, hospitalsRes] = await Promise.all([
          viewHospitalTypes(),
          viewHospitals(),
        ]);
        setHospitalTypes(typesRes.data || []);
        setHospitals(hospitalsRes.data || []);
      } catch (error) {
        setFetchError(error.response?.data?.message || "Failed to fetch hospital data.");
      }
    };
    fetchData();
  }, []);

  const handleValidation = (name, value) => {
    switch (name) {
      case "hospitalname":
        if (!/^[A-Za-z\s]{3,50}$/.test(value.trim())) {
          setError(name, { type: "manual", message: "Hospital name must be 3-50 letters only (no numbers or special characters)." });
        } else if (hospitals.some(h => h.hospitalname.toLowerCase() === value.trim().toLowerCase())) {
          setError(name, { type: "manual", message: "Hospital name already exists." });
        } else {
          clearErrors(name);
        }
        break;

      case "city":
      case "district":
      case "states":
      case "cntprsn":
        if (!/^[A-Za-z\s]{2,50}$/.test(value.trim())) {
          setError(name, { type: "manual", message: "Only letters and spaces allowed (2-50 characters)." });
        } else {
          clearErrors(name);
        }
        break;

      case "pin":
        if (!/^\d{6}$/.test(value.trim())) {
          setError(name, { type: "manual", message: "PIN must be exactly 6 digits." });
        } else {
          clearErrors(name);
        }
        break;

      case "phoneno":
      case "cntprsnmob":
        if (!/^\d{10}$/.test(value.trim())) {
          setError(name, { type: "manual", message: "Must be a valid 10-digit number." });
        } else {
          clearErrors(name);
        }
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          setError(name, { type: "manual", message: "Invalid email format." });
        } else {
          clearErrors(name);
        }
        break;

      case "address":
        if (!/^[A-Za-z0-9\s,.-]{5,100}$/.test(value.trim())) {
          setError(name, { type: "manual", message: "Address must be 5-100 chars and can include letters, numbers, spaces, commas, dots, hyphens." });
        } else {
          clearErrors(name);
        }
        break;

      default:
        break;
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = {
        hospitalname: data.hospitalname.trim(),
        hospital_type_id: parseInt(data.hsptltype),
        address: data.address.trim(),
        city: data.city.trim(),
        district: data.district.trim(),
        pin: parseInt(data.pin),
        states: data.states.trim(),
        email: data.email.trim(),
        phoneno: parseInt(data.phoneno),
        cntprsn: data.cntprsn.trim(),
        cntprsnmob: parseInt(data.cntprsnmob),
        isactive: data.isactive === "true",
      };

      const authToken = localStorage.getItem("authToken");

      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-hospital",
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("✅ New Hospital added successfully!");
      reset();
      setTimeout(() => navigate("/view-hospital"), 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message || "❌ Failed to add hospital. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { name: "hospitalname", label: "Hospital Name", placeholder: "Enter Hospital Name" },
    { name: "hsptltype", label: "Hospital Type", type: "select" },
    { name: "address", label: "Address", placeholder: "Enter Address" },
    { name: "city", label: "City", placeholder: "Enter City" },
    { name: "district", label: "District", placeholder: "Enter District" },
    { name: "pin", label: "PIN Code", type: "text", placeholder: "Enter 6-digit PIN" },
    { name: "states", label: "State", placeholder: "Enter State" },
    { name: "email", label: "Email", placeholder: "Enter Email" },
    { name: "phoneno", label: "Phone Number", type: "text", placeholder: "Enter 10-digit Phone Number" },
    { name: "cntprsn", label: "Contact Person", placeholder: "Enter Contact Person" },
    { name: "cntprsnmob", label: "Contact Person Mobile", type: "text", placeholder: "Enter Contact Person Mobile" },
    { name: "isactive", label: "Is Active?", type: "radio" },
  ];

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">🏠 Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-hospital" className="text-gray-700 hover:text-teal-600">Hospital</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">Add Hospital</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        {fetchError && <p className="text-red-500 text-sm mb-4">{fetchError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Hospital</h4>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map(({ name, label, type = "text", placeholder }) => (
              <div key={name} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {label} <span className="text-red-500">*</span>
                </label>

                {name === "hsptltype" ? (
                  <select
                    {...register(name, { required: `${label} is required` })}
                    className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`}
                  >
                    <option value="">Select {label}</option>
                    {hospitalTypes.map((t) => (
                      <option key={t.id} value={t.id}>{t.hsptldsc}</option>
                    ))}
                  </select>
                ) : name === "isactive" ? (
                  <div className="flex space-x-4 pt-2">
                    <label className="inline-flex items-center">
                      <input type="radio" value="true" {...register(name, { required: "Status is required" })} />
                      <span className="ml-1">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" value="false" {...register(name, { required: "Status is required" })} />
                      <span className="ml-1">No</span>
                    </label>
                  </div>
                ) : (
                  <input
                    type={type}
                    placeholder={placeholder}
                    {...register(name, { required: `${label} is required` })}
                    onChange={(e) => handleValidation(name, e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`}
                  />
                )}

                {errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]?.message}</p>}
              </div>
            ))}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button type="button" onClick={() => navigate("/view-hospital")} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-md text-white transition">
              {isSubmitting ? "Saving..." : "Add Hospital"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddHospital;
