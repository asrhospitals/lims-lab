import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  updateHospital,
  viewHospital,
  viewHospitalTypes,
} from "../../services/apiService";

const UpdateHospital = () => {
  const [hospitalToUpdate, setHospitalToUpdate] = useState(null);
  const [hospitalTypes, setHospitalTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("No hospital ID provided");
        // navigate("/view-hospital");
        return;
      }

      setIsLoading(true);
      try {
        // Fetch hospital types and hospital data in parallel
        const [hospitalTypesResponse, hospitalResponse] = await Promise.all([
          viewHospitalTypes(),
          viewHospital(id),
        ]);

        const types = hospitalTypesResponse.data || [];
        setHospitalTypes(types);

        const hospitalData = hospitalResponse
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
        console.error("Failed to fetch data:", err);
        toast.error(
          err?.response?.data?.message ||
            "Failed to fetch hospital data. Please try again."
        );
        navigate("/view-hospital");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    if (!id) {
      toast.error("❌ Hospital ID not found. Cannot update.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        hospitalname: data.hospitalname,
        hospital_type_id: data.hsptltype,
        address: data.address,
        city: data.city,
        district: data.district,
        pin: data.pin,
        states: data.states,
        email: data.email,
        phoneno: String(data.phoneno),
        cntprsn: data.cntprsn,
        cntprsnmob: String(data.cntprsnmob),
        isactive: data.isactive === "true",
      };

      await updateHospital(id, payload);

      toast.success("✅ Hospital updated successfully!");
      setHospitalToUpdate(null);
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

  const alphaNumRegex = /^[a-zA-Z0-9\s\-_,]+$/;

  const fields = [
    {
      name: "hospitalname",
      label: "Hospital Name",
      placeholder: "Hospital Name",
    },
    {
      name: "hsptltype",
      label: "Hospital Type",
      type: "select",
      options: hospitalTypes.map((t) => ({
        value: t.id,
        label: t.hsptldsc,
      })),
    },
    { name: "address", label: "Address", placeholder: "Address" },
    { name: "city", label: "City", placeholder: "City" },
    { name: "district", label: "District", placeholder: "District" },
    { name: "pin", label: "PIN", type: "number", placeholder: "Postal Code" },
    { name: "states", label: "State", placeholder: "State" },
    { name: "email", label: "Email", type: "email", placeholder: "Email" },
    { name: "phoneno", label: "Phone Number", placeholder: "Phone" },
    { name: "cntprsn", label: "Contact Person", placeholder: "Contact Person" },
    { name: "cntprsnmob", label: "Contact Mobile", placeholder: "Mobile" },
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

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading hospital data...
      </div>
    );
  }

  if (!hospitalToUpdate) {
    return (
      <div className="text-center py-10 text-gray-500">Hospital not found.</div>
    );
  }

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors"
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
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
                          <option key={option.value} value={option.value}>
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
                          ...(type !== "email" &&
                          type !== "number" &&
                          name !== "pin" &&
                          name !== "phoneno" &&
                          name !== "cntprsnmob"
                            ? {
                                pattern: {
                                  value: alphaNumRegex,
                                  message:
                                    "Only letters, numbers, -, _, and , are allowed.",
                                },
                              }
                            : {}),
                        })}
                        placeholder={placeholder}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name] ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-teal-500`}
                      />
                    )}
                    {errors[name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[name]?.message}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                navigate("/view-hospital");
              }}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg shadow hover:bg-teal-700 transition"
            >
              {isSubmitting ? "Updating..." : "Update Hospital"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateHospital;
