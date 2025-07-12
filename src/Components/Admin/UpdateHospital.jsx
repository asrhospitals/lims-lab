import  { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";

const UpdateHospital = () => {
  const { hospitalToUpdate, setHospitalToUpdate } = useContext(AdminContext);
  const [hospitalTypes, setHospitalTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      hospital_name: "",
      hsptltype: "",
      address: "",
      city: "",
      district: "",
      pin: "",
      states: "",
      email: "",
      phoneno: "",
      cntprsn: "",
      cntprsnmob: "",
      isactive: "true",
    },
  });

  // Fetch hospital types on mount
  useEffect(() => {
    const fetchHospitalTypes = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlab-production.up.railway.app/lims/master/get-hsptltype",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setHospitalTypes(response.data || []);
      } catch (err) {
        console.error("Failed to load hospital types", err);
      }
    };

    fetchHospitalTypes();
  }, []);


  // Load hospital data from context or localStorage
  useEffect(() => {
    const stored = localStorage.getItem("hospitalToUpdate");

    if (!hospitalToUpdate && stored) {
      try {
        const parsed = JSON.parse(stored);
        setHospitalToUpdate(parsed);
      } catch (err) {
        console.error("Invalid hospitalToUpdate in localStorage");
      }
    } else if (hospitalToUpdate) {
      reset({
        hospital_name: hospitalToUpdate.hospital_name || "",
        hsptltype: hospitalToUpdate.hsptltype || "",
        address: hospitalToUpdate.address || "",
        city: hospitalToUpdate.city || "",
        district: hospitalToUpdate.district || "",
        pin: hospitalToUpdate.pin || "",
        states: hospitalToUpdate.states || "",
        email: hospitalToUpdate.email || "",
        phoneno: hospitalToUpdate.phoneno || "",
        cntprsn: hospitalToUpdate.cntprsn || "",
        cntprsnmob: hospitalToUpdate.cntprsnmob || "",
        isactive: String(hospitalToUpdate.isactive ?? "true"),
      });
    }
  }, [hospitalToUpdate, reset, setHospitalToUpdate]);

  const onSubmit = async (data) => {
    if (!hospitalToUpdate?.hospital_id) {
    toast.error("❌ Hospital ID not found. Cannot update.");
    return;
  }

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const payload = {
        ...data,
        isactive: data.isactive === "true",
      };

      await axios.put(
        `https://asrlab-production.up.railway.app/lims/master/update-hospital/${hospitalToUpdate.hospital_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      toast.success("Hospital updated successfully!");
      setHospitalToUpdate(null);
      localStorage.removeItem("hospitalToUpdate");
      navigate("/view-hospital");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to update hospital. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "hospital_name",
      label: "Hospital Name",
      placeholder: "Hospital Name",
    },
    {
      name: "hsptltype",
      label: "Hospital Type",
      type: "select",
      options: hospitalTypes.map((t) => ({
        value: t.hsptltype,
        label: t.hsptldsc,
      })),
    },
    { name: "address", label: "Address", placeholder: "Address" },
    { name: "city", label: "City", placeholder: "City" },
    { name: "district", label: "District", placeholder: "District" },
    { name: "pin", label: "PIN", type: "number", placeholder: "Postal Code" },
    { name: "states", label: "State", placeholder: "State" },
    { name: "email", label: "Email", type: "email", placeholder: "Email" },
    {
      name: "phoneno",
      label: "Phone Number",
      type: "number",
      placeholder: "Phone",
    },
    { name: "cntprsn", label: "Contact Person", placeholder: "Contact Person" },
    {
      name: "cntprsnmob",
      label: "Contact Mobile",
      type: "number",
      placeholder: "Mobile",
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
    },
  ];

  if (!hospitalToUpdate) {
    return (
      <div className="text-center py-10 text-gray-500">
        No hospital selected for update.
      </div>
    );
  }

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
                  Update Hospital
              </li>
              </ol>
          </nav>
        </div>

      

      
      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} 
           className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"  >
            
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Hospital</h4>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(
                ({ name, label, placeholder, type = "text", options = [] }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    {type === "select" ? (
                      <select
                        {...register(name, {
                          required: `${label} is required.`,
                        })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name] ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-teal-500`}
                      >
                        <option value="">Select {label}</option>
                        {options.map((option) => (
                          <option key={option.value} value={option.value} 
                             selected={option.value === hospitalToUpdate.hsptltype  ? true : false} >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : type === "radio" ? (
                      <div className="flex space-x-4 pt-2">
                        {options.map((option) => (
                          <label
                            key={option.value}
                            className="inline-flex items-center"
                          >
                            <input
                              type="radio"
                              {...register(name, { required: true })}
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
                        {...register(name, {
                          required: `${label} is required.`,
                        })}
                        placeholder={placeholder}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name] ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-teal-500`}
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
                  // reset();
                  setHospitalToUpdate(null);
                  localStorage.removeItem("hospitalToUpdate");
                  navigate("/view-hospital");
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
                {isSubmitting ? "Updating..." : "Update Hospital"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateHospital;
