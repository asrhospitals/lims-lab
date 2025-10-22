import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { viewTechnician, updateTechnician, viewNodals, viewRoles, viewInstruments } from "../../services/apiService";

const UpdateTechnician = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nodalCenters, setNodalCenters] = useState([]);
  const [roletypes, setroletypes] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [technicianData, setTechnicianData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      technicianname: "",
      nodal: "",
      roletype: "",
      instrument: "",
      addressline: "",
      city: "",
      state: "",
      pincode: "",
      dob: "",
      gender: "",
      contactno: "",
      isactive: "true",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("❌ No technician ID provided.");
        navigate("/view-technician");
        return;
      }

      try {
        setLoading(true);

        // Fetch dropdown data and technician data
        const [nodalResponse, roleResponse, instrumentResponse, technicianResponse] = await Promise.allSettled([
          viewNodals(),
          viewRoles(),
          viewInstruments(),
          viewTechnician(id),
        ]);

        // Handle Nodal Centers
        if (nodalResponse.status === "fulfilled") {
          setNodalCenters(nodalResponse.value.data || []);
        } else {
          console.error("Nodal Center fetch error:", nodalResponse.reason);
          toast.error("❌ Failed to fetch nodal centers.");
        }

        // Handle Roles
        if (roleResponse.status === "fulfilled") {
          const roles = roleResponse.value || [];
          setroletypes(roles.filter((r) => r?.isactive));
        } else {
          console.error("Role fetch error:", roleResponse.reason);
          toast.error("❌ Failed to fetch role types.");
        }

        // Handle Instruments
        if (instrumentResponse.status === "fulfilled") {
          const instruments = instrumentResponse.value || [];
          setInstruments(instruments.filter((i) => i?.isactive));
        } else {
          console.error("Instrument fetch error:", instrumentResponse.reason);
          toast.error("❌ Failed to fetch instruments.");
        }

        // Handle Technician Data
        if (technicianResponse.status === "fulfilled") {
          const technicianData = technicianResponse.value || null;
          setTechnicianData(technicianData);

          // Populate form immediately after fetching data
          if (technicianData) {
            reset({
              technicianname: technicianData.technicianname || "",
              nodal: technicianData.nodal || "",
              roletype: technicianData.roletype || "",
              instrument: technicianData.instrument || "",
              addressline: technicianData.addressline || "",
              city: technicianData.city || "",
              state: technicianData.state || "",
              pincode: technicianData.pincode || "",
              dob: technicianData.dob ? technicianData.dob.split("T")[0] : "", // Format date for input
              gender: technicianData.gender || "",
              contactno: technicianData.contactno || "",
              isactive: String(technicianData.isactive ?? "true"),
            });
          }
        } else {
          console.error("Technician fetch error:", technicianResponse.reason);
          toast.error("❌ Failed to fetch technician data.");
          navigate("/view-technician");
        }
      } catch (err) {
        console.error("Master data fetch failed:", err);
        toast.error("❌ Unexpected error while fetching data.");
        navigate("/view-technician");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    if (!id) {
      toast.error("❌ No valid technician ID to update.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        technicianname: data.technicianname,
        nodal: data.nodal,
        roletype: data.roletype,
        instrument: data.instrument,
        addressline: data.addressline,
        city: data.city,
        state: data.state,
        pincode: Number(data.pincode),
        dob: data.dob,
        gender: data.gender,
        contactno: data.contactno,
        isactive: data.isactive === "true",
      };

      await updateTechnician(id, payload);

      toast.success("✅ Technician updated successfully!");
      navigate("/view-technician", { state: { refresh: true } });

    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to update Technician. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">⏳ Loading technician details...</p>
      </div>
    );
  }

  if (!technicianData) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Technician not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/admin-dashboard" className="text-gray-700 hover:text-teal-600">
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-technician"
                className="text-gray-700 hover:text-teal-600"
              >
                Technicians
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Technician</li>
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
            <h4 className="text-white font-semibold">Update Technician</h4>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Technician Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Technician Name
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("technicianname", {
                    required: "Technician Name is required.",
                  })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.technicianname ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                />
                {errors.technicianname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.technicianname.message}
                  </p>
                )}
              </div>

              {/* Nodal Center */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nodal Center
                </label>
                <select
                  {...register("nodal", {
                    required: "Nodal Center is required.",
                  })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.nodal ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                >
                  <option value="">Select Nodal Center</option>
                  {nodalCenters.map((n) => (
                    <option key={n.nodalname} value={n.nodalname}>
                      {n.nodalname}
                    </option>
                  ))}
                </select>
                {errors.nodal && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nodal.message}
                  </p>
                )}
              </div>

              {/* Role Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role Type
                </label>
                <select
                  {...register("roletype", {
                    required: "Role Type is required.",
                  })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.roletype ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                >
                  <option value="">Select Role Type</option>
                  {roletypes.map((r) => (
                    <option key={r.roletype} value={r.roletype}>
                      {r.roledescription}
                    </option>
                  ))}
                </select>
                {errors.roletype && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.roletype.message}
                  </p>
                )}
              </div>

              {/* Instrument */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instrument
                </label>
                <select
                  {...register("instrument")}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.instrument ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                >
                  <option value="">Select Instrument</option>
                  {instruments.map((i) => (
                    <option key={i.instrumentname} value={i.instrumentname}>
                      {i.instrumentname}
                    </option>
                  ))}
                </select>
                {errors.instrument && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.instrument.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Address Line"
                  {...register("addressline", {
                    required: "Address is required.",
                  })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.addressline ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                />
                {errors.addressline && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.addressline.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  {...register("city", { required: "City is required." })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  placeholder="State"
                  {...register("state", { required: "State is required." })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>

              {/* Pin Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pin Code
                </label>
                <input
                  type="number"
                  placeholder="PIN"
                  {...register("pincode", {
                    required: "Pin Code is required.",
                  })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.pincode ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pincode.message}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("dob", {
                    required: "Date of Birth is required.",
                  })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.dob ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dob.message}
                  </p>
                )}
              </div>

              {/* Contact No. */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact No.
                </label>
                <input
                  type="tel"
                  placeholder="Phone"
                  {...register("contactno", {
                    required: "Contact No. is required.",
                  })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.contactno ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                />
                {errors.contactno && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactno.message}
                  </p>
                )}
              </div>

              {/* Gender (radio) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="flex space-x-4 pt-2">
                  {["Male", "Female", "Other"].map((genderOption) => (
                    <label
                      key={genderOption}
                      className="inline-flex items-center"
                    >
                      <input
                        type="radio"
                        {...register("gender", {
                          required: "Gender is required.",
                        })}
                        value={genderOption}
                        className="h-4 w-4 text-teal-600"
                      />
                      <span className="ml-2">{genderOption}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Is Active (radio) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Is Active?
                </label>
                <div className="flex space-x-4 pt-2">
                  {[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" },
                  ].map((activeOption) => (
                    <label
                      key={activeOption.value}
                      className="inline-flex items-center"
                    >
                      <input
                        type="radio"
                        {...register("isactive", {
                          required: "Status is required.",
                        })}
                        value={activeOption.value}
                        className="h-4 w-4 text-teal-600"
                      />
                      <span className="ml-2">{activeOption.label}</span>
                    </label>
                  ))}
                </div>
                {errors.isactive && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.isactive.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/view-technician")}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Technician"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateTechnician;
