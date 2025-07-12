import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";

const UpdateReception = () => {
  const { receptionToUpdate, setReceptionToUpdate } = useContext(AdminContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nodalCenters, setNodalCenters] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      receptionistName: "",
      nodal: "",
      addressLine: "",
      city: "",
      state: "",
      pinCode: "",
      dob: "",
      gender: "",
      contactNo: "",
      isactive: "true",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("receptionToUpdate");

    if (!receptionToUpdate && stored) {
      try {
        const parsed = JSON.parse(stored);
        setReceptionToUpdate(parsed);
      } catch {
        console.error("Invalid receptionToUpdate in localStorage");
      }
    } else if (receptionToUpdate) {
      reset({
        receptionistName: receptionToUpdate.receptionistName || "",
        nodal: receptionToUpdate.nodal || "",
        addressLine: receptionToUpdate.addressLine || "",
        city: receptionToUpdate.city || "",
        state: receptionToUpdate.state || "",
        pinCode: receptionToUpdate.pinCode || "",
        dob: receptionToUpdate.dob || "",
        gender: receptionToUpdate.gender || "",
        contactNo: receptionToUpdate.contactNo || "",
        isactive: String(receptionToUpdate.isactive ?? "true"),
      });
    }
  }, [receptionToUpdate, reset, setReceptionToUpdate]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    const fetchData = async () => {
      try {
        const [nodalRes] = await Promise.all([
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-nodal", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        setNodalCenters(nodalRes.data.filter((r) => r.isactive) || []);
 
      } catch (error) {
        toast.error("❌ Failed to fetch master data.");
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    if (!receptionToUpdate?.id) {
      toast.error("❌ reception ID not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const payload = {
        ...data,
        isactive: data.isactive === "true",
        pinCode: Number(data.pinCode),
      };

      await axios.put(
        `https://asrlab-production.up.railway.app/lims/master/update-recep/${receptionToUpdate.id}`,
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );


        toast.success("reception updated successfully!", { autoClose: 2000 });

        setTimeout(() => {
            setReceptionToUpdate(null);
            localStorage.removeItem("receptionToUpdate");
            navigate("/view-reception");
        }, 2000);

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to update reception. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  

  if (!receptionToUpdate) {
    return <div className="text-center py-10 text-gray-500">No reception selected for update.</div>;
  }

  return (
    <>
        <div className="fixed top-[61px] w-full z-10">
            <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
                <li><Link to="/" className="text-gray-700 hover:text-teal-600">🏠︎ Home</Link></li>
                <li className="text-gray-400">/</li>
                <li><Link to="/view-reception" className="text-gray-700 hover:text-teal-600">Reception</Link></li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-500">Update Reception</li>
            </ol>
            </nav>
        </div>

        <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
            <ToastContainer />
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
                <h4 className="text-white font-semibold">Update Reception</h4>
                </div>

                <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Reception Name */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Reception Name</label>
                    <input
                        type="text"
                        placeholder="Full Name"
                        {...register("receptionistName", { required: "Reception Name is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.receptionistName ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    />
                    {errors.receptionistName && <p className="text-red-500 text-xs mt-1">{errors.receptionistName.message}</p>}
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
                                selected={receptionToUpdate.nodal === n.nodalname ? true : false}
                                >{n.nodalname}</option>
                        ))}
                    </select>
                    {errors.nodal && <p className="text-red-500 text-xs mt-1">{errors.nodal.message}</p>}
                    </div>




                    {/* Address */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        placeholder="Address Line"
                        {...register("addressLine", { required: "Address is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.addressLine ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    />
                    {errors.addressLine && <p className="text-red-500 text-xs mt-1">{errors.addressLine.message}</p>}
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
                        {...register("pinCode", { required: "Pin Code is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.pinCode ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    />
                    {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode.message}</p>}
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
                        {...register("contactNo", { required: "Contact No. is required." })}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.contactNo ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-teal-500`}
                    />
                    {errors.contactNo && <p className="text-red-500 text-xs mt-1">{errors.contactNo.message}</p>}
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
                            defaultChecked={receptionToUpdate?.gender === genderOption}
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
                            defaultChecked={receptionToUpdate?.isactive === activeOption.value}
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
                    onClick={() => navigate("/view-reception")}
                    className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-60"
                >
                    {isSubmitting ? "Updating..." : "Update Reception"}
                </button>
                </div>
            </form>
        </div>

    </>
  );
};

export default UpdateReception;
