import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  updateHospital,
  viewHospital,
  viewHospitalTypes,
  viewHospitals,
} from "../../services/apiService";

const UpdateHospital = () => {
  const [hospitalToUpdate, setHospitalToUpdate] = useState(null);
  const [hospitalTypes, setHospitalTypes] = useState([]);
  const [existingHospitals, setExistingHospitals] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const { register, handleSubmit, reset, setError, clearErrors, watch, formState: { errors } } = useForm({ mode: "onChange" });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("No hospital ID provided");
        navigate("/view-hospital");
        return;
      }

      setIsLoading(true);
      try {
        const [hospitalTypesResponse, hospitalResponse, hospitalsRes] = await Promise.all([
          viewHospitalTypes(),
          viewHospital(id),
          viewHospitals(),
        ]);

        setHospitalTypes(hospitalTypesResponse.data || []);
        setExistingHospitals(hospitalsRes.data || []);

        const hospitalData = hospitalResponse;
        setHospitalToUpdate(hospitalData);

        reset({
          hospitalname: hospitalData.hospitalname || "",
          hsptltype: hospitalData.hospital_type_id || "",
          address: hospitalData.address || "",
          city: hospitalData.city || "",
          district: hospitalData.district || "",
          pin: hospitalData.pin || "",
          states: hospitalData.states || "",
          email: hospitalData.email || "",
          phoneno: hospitalData.phoneno || "",
          cntprsn: hospitalData.cntprsn || "",
          cntprsnmob: hospitalData.cntprsnmob || "",
          isactive: String(hospitalData.isactive ?? "true"),
        });
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to fetch hospital data.");
        navigate("/view-hospital");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, reset, navigate]);

  const validateField = (name, value) => {
    const lettersOnly = /^[A-Za-z\s]{2,50}$/;
    const hospitalNameRegex = /^[A-Za-z\s]{3,50}$/;
    const pinRegex = /^\d{6}$/;
    const phoneRegex = /^\d{10}$/;
    const addressRegex = /^[A-Za-z0-9\s,.-]{5,100}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (name) {
      case "hospitalname":
        if (!hospitalNameRegex.test(value.trim())) {
          setError(name, { type: "manual", message: "Hospital name must be 3-50 letters only." });
        } else if (existingHospitals.some(h => h.hospitalname.toLowerCase() === value.trim().toLowerCase() && h.id !== hospitalToUpdate.id)) {
          setError(name, { type: "manual", message: "Hospital name already exists." });
        } else clearErrors(name);
        break;

      case "city":
      case "district":
      case "states":
      case "cntprsn":
        if (!lettersOnly.test(value.trim())) {
          setError(name, { type: "manual", message: "Only letters and spaces allowed (2-50 chars)." });
        } else clearErrors(name);
        break;

      case "pin":
        if (!pinRegex.test(value.trim())) setError(name, { type: "manual", message: "PIN must be exactly 6 digits." });
        else clearErrors(name);
        break;

      case "phoneno":
      case "cntprsnmob":
        if (!phoneRegex.test(value.trim())) setError(name, { type: "manual", message: "Must be a valid 10-digit number." });
        else clearErrors(name);
        break;

      case "address":
        if (!addressRegex.test(value.trim())) setError(name, { type: "manual", message: "Address must be 5-100 chars, letters/numbers/spaces/.,- allowed." });
        else clearErrors(name);
        break;

      case "email":
        if (!emailRegex.test(value.trim())) setError(name, { type: "manual", message: "Invalid email format." });
        else clearErrors(name);
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
        phoneno: data.phoneno.trim(),
        cntprsn: data.cntprsn.trim(),
        cntprsnmob: data.cntprsnmob.trim(),
        isactive: data.isactive === "true",
      };

      await updateHospital(id, payload);
      toast.success("✅ Hospital updated successfully!");
      navigate("/view-hospital");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update hospital.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading hospital data...</div>;
  if (!hospitalToUpdate) return <div className="text-center py-10">Hospital not found.</div>;

  const fields = [
    { name: "hospitalname", label: "Hospital Name", placeholder: "Hospital Name" },
    { name: "hsptltype", label: "Hospital Type", type: "select", options: hospitalTypes.map(t => ({ value: t.id, label: t.hsptldsc })) },
    { name: "address", label: "Address", placeholder: "Address" },
    { name: "city", label: "City", placeholder: "City" },
    { name: "district", label: "District", placeholder: "District" },
    { name: "pin", label: "PIN", placeholder: "6-digit PIN" },
    { name: "states", label: "State", placeholder: "State" },
    { name: "email", label: "Email", placeholder: "Email", type: "email" },
    { name: "phoneno", label: "Phone Number", placeholder: "10-digit Phone" },
    { name: "cntprsn", label: "Contact Person", placeholder: "Contact Person" },
    { name: "cntprsnmob", label: "Contact Mobile", placeholder: "10-digit Mobile" },
    { name: "isactive", label: "Is Active?", type: "radio", options: [{ value: "true", label: "Yes" }, { value: "false", label: "No" }] },
  ];

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li><Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">🏠 Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-hospital" className="text-gray-700 hover:text-teal-600">Hospital</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Hospital</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-2 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Hospital</h4>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {fields.map(({ name, label, placeholder, type = "text", options = [] }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">
                  {label} <span className="text-red-500">*</span>
                </label>

                {type === "select" ? (
                  <select {...register(name, { required: `${label} is required` })} className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}>
                    <option value="">Select {label}</option>
                    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                ) : type === "radio" ? (
                  <div className="flex space-x-4 pt-2">
                    {options.map(opt => (
                      <label key={opt.value} className="inline-flex items-center">
                        <input type="radio" {...register(name, { required: true })} value={opt.value} className="h-4 w-4 text-teal-600" />
                        <span className="ml-2">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type={type}
                    placeholder={placeholder}
                    {...register(name, { required: `${label} is required` })}
                    onChange={(e) => validateField(name, e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                  />
                )}

                {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
            <button type="button" onClick={() => navigate("/view-hospital")} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-teal-600 text-white px-6 py-2 rounded-lg shadow hover:bg-teal-700 transition">
              {isSubmitting ? "Updating..." : "Update Hospital"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateHospital;
