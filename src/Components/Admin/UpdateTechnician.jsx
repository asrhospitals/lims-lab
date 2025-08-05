import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";

const UpdateTechnician = () => {
  const { technicianToUpdate, setTechnicianToUpdate } = useContext(AdminContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nodalCenters, setNodalCenters] = useState([]);
  const [roletypes, setroletypes] = useState([]);
  const [instruments, setInstruments] = useState([]);
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
    const stored = localStorage.getItem("technicianToUpdate");

    if (!technicianToUpdate && stored) {
      try {
        const parsed = JSON.parse(stored);
        setTechnicianToUpdate(parsed);
      } catch {
        console.error("Invalid technicianToUpdate in localStorage");
      }
    } else if (technicianToUpdate) {
      reset({
        technicianname: technicianToUpdate.technicianname || "",
        nodal: technicianToUpdate.nodal || "",
        roletype: technicianToUpdate.roletype || "",
        instrument: technicianToUpdate.instrument || "",
        addressline: technicianToUpdate.addressline || "",
        city: technicianToUpdate.city || "",
        state: technicianToUpdate.state || "",
        pincode: technicianToUpdate.pincode || "",
        dob: technicianToUpdate.dob || "",
        gender: technicianToUpdate.gender || "",
        contactno: technicianToUpdate.contactno || "",
        isactive: String(technicianToUpdate.isactive ?? "true"),
      });
    }
  }, [technicianToUpdate, reset, setTechnicianToUpdate]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${authToken}` },
        };

        const [nodalRes, roleRes, instrRes] = await Promise.allSettled([
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-nodal", config),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-role", config),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-instrument", config),
        ]);

        // Handle Nodal Centers
        if (nodalRes.status === "fulfilled") {
          setNodalCenters(nodalRes.value.data || []);
        } else {
          console.error("Nodal Center fetch error:", nodalRes.reason);
          toast.error("❌ Failed to fetch nodal centers.");
        }

        // Handle Roles
        if (roleRes.status === "fulfilled") {
          const roles = roleRes.value.data || [];
          setroletypes(roles.filter((r) => r?.isactive));
        } else {
          console.error("Role fetch error:", roleRes.reason);
          toast.error("❌ Failed to fetch role types.");
        }

        // Handle Instruments
        if (instrRes.status === "fulfilled") {
          const instruments = instrRes.value.data || [];
          setInstruments(instruments.filter((i) => i?.isactive));
        } else {
          console.error("Instrument fetch error:", instrRes.reason);
          toast.error("❌ Failed to fetch instruments.");
        }

      } catch (err) {
        console.error("Master data fetch failed:", err);
        toast.error("❌ Unexpected error while fetching master data.");
      }
    };

    fetchData();
  }, []);


  const onSubmit = async (data) => {
    if (!technicianToUpdate?.id) {
      toast.error("❌ Technician ID not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const payload = {
        ...data,
        isactive: data.isactive === "true",
        pincode: Number(data.pincode),
      };

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-tech/${technicianToUpdate.id}`,
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );


        toast.success("Technician updated successfully!", { autoClose: 2000 });

        setTimeout(() => {
            setTechnicianToUpdate(null);
            localStorage.removeItem("technicianToUpdate");
            navigate("/view-technician");
        }, 2000);

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to update Technician. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  

  if (!technicianToUpdate) {
    return <div className="text-center py-10 text-gray-500">No technician selected for update.</div>;
  }

  return (
    <>
        <div className="fixed top-[61px] w-full z-10">
            <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
                <li><Link to="/" className="text-gray-700 hover:text-teal-600">🏠︎ Home</Link></li>
                <li className="text-gray-400">/</li>
                <li><Link to="/view-technician" className="text-gray-700 hover:text-teal-600">Technician</Link></li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-500">Update Technician</li>
            </ol>
            </nav>
        </div>

        <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
            <ToastContainer />
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
                <h4 className="text-white font-semibold">Update Technician</h4>
                </div>

                <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Technician Name */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Technician Name</label>
                    <input
                        type="text"
                        placeholder="Full Name"
                        {...register("technicianname", { required: "Technician Name is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.technicianname ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    />
                    {errors.technicianname && <p className="text-red-500 text-xs mt-1">{errors.technicianname.message}</p>}
                    </div>

                    {/* Nodal Center */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Nodal Center</label>
                    <select
                        {...register("nodal", { required: "Nodal Center is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.nodal ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    >
                        <option value="">Select Nodal Center</option>
                        {nodalCenters.map((n) => (
                        <option key={n.nodalname} 
                                value={n.nodalname}
                                selected={technicianToUpdate.nodal === n.nodalname ? true : false}
                                >{n.nodalname}</option>
                        ))}
                    </select>
                    {errors.nodal && <p className="text-red-500 text-xs mt-1">{errors.nodal.message}</p>}
                    </div>


                   

                    {/* Role Type */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Role Type</label>
                    <select
                        {...register("roletype", { required: "Role Type is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.roletype ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    >
                        <option value="">Select Role Type</option>
                        {roletypes.map((r) => (
                        <option key={r.roletype} 
                                value={r.roletype} 
                                selected={technicianToUpdate.roletype === r.roletype ? true : false} 
                                >{r.roledescription}</option>
                        ))}
                    </select>
                    {errors.roletype && <p className="text-red-500 text-xs mt-1">{errors.roletype.message}</p>}
                    </div>

                    {/* Instrument */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Instrument</label>
                    <select
                        {...register("instrument")}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.instrument ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    >
                        <option value="">Select Instrument</option>
                        {instruments.map((i) => (
                        <option key={i.instrumentname} 
                                value={i.instrumentname} selected={technicianToUpdate.instrument === i.instrumentname ? true : false} 
                                >{i.instrumentname}</option>
                        ))}
                    </select>
                    {errors.instrument && <p className="text-red-500 text-xs mt-1">{errors.instrument.message}</p>}
                    </div>

                    {/* Address */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        placeholder="Address Line"
                        {...register("addressline", { required: "Address is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.addressline ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    />
                    {errors.addressline && <p className="text-red-500 text-xs mt-1">{errors.addressline.message}</p>}
                    </div>

                    {/* City */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                        type="text"
                        placeholder="City"
                        {...register("city", { required: "City is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.city ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>

                    {/* State */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                        type="text"
                        placeholder="State"
                        {...register("state", { required: "State is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.state ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                    </div>

                    {/* Pin Code */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Pin Code</label>
                    <input
                        type="number"
                        placeholder="PIN"
                        {...register("pincode", { required: "Pin Code is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.pincode ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                    </div>

                    {/* Date of Birth */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                        type="text"
                        {...register("dob", { required: "Date of Birth is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.dob ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    />
                    {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
                    </div>

                  

                    {/* Contact No. */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Contact No.</label>
                    <input
                        type="tel"
                        placeholder="Phone"
                        {...register("contactno", { required: "Contact No. is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.contactno ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    />
                    {errors.contactno && <p className="text-red-500 text-xs mt-1">{errors.contactno.message}</p>}
                    </div>

                    {/* Gender (radio) */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <div className="flex space-x-4 pt-2">
                        {["Male", "Female", "Other"].map((genderOption) => (
                        <label key={genderOption} className="inline-flex items-center">
                            <input
                            type="radio"
                            {...register("gender", { required: "Gender is required." })}
                            value={genderOption}
                            defaultChecked={technicianToUpdate?.gender === genderOption}
                            className="h-4 w-4 text-teal-600"
                            />
                            <span className="ml-2">{genderOption}</span>
                        </label>
                        ))}
                    </div>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                    </div>

                    {/* Is Active (radio) */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Is Active?</label>
                    <div className="flex space-x-4 pt-2">
                        {[
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" }
                        ].map((activeOption) => (
                        <label key={activeOption.value} className="inline-flex items-center">
                            <input
                            type="radio"
                            {...register("isactive", { required: "Status is required." })}
                            value={activeOption.value}
                            defaultChecked={technicianToUpdate?.isactive === activeOption.value}
                            className="h-4 w-4 text-teal-600"
                            />
                            <span className="ml-2">{activeOption.label}</span>
                        </label>
                        ))}
                    </div>
                    {errors.isactive && <p className="text-red-500 text-xs mt-1">{errors.isactive.message}</p>}
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
