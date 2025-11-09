import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";

const UpdateNewUserMapping = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userMapping, setUserMapping] = useState(null);
    const [hospitalsList, setHospitalsList] = useState([]);
    const [nodalsList, setNodalsList] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const fetchMasterData = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const headers = { Authorization: `Bearer ${token}` };

            const [hRes, nRes, rRes] = await Promise.all([
                fetch("https://asrlabs.asrhospitalindia.in/lims/master/get-hospital?page=1&limit=1000", { headers }),
                fetch("https://asrlabs.asrhospitalindia.in/lims/master/get-nodal?page=1&limit=1000", { headers }),
                fetch("https://asrlabs.asrhospitalindia.in/lims/master/get-role", { headers }),
            ]);

            const [hData, nData, rData] = await Promise.all([hRes.json(), nRes.json(), rRes.json()]);
            setHospitalsList(hData?.data || []);
            setNodalsList(nData?.data || []);
            setRolesList(rData?.data || []);
        } catch (err) {
            console.error("Failed to fetch master data", err);
            toast.error("❌ Failed to load dropdown data.");
        }
    };

    const fetchUserMapping = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("authToken");

            const res = await fetch(
                `https://asrlabs.asrhospitalindia.in/lims/authentication/get-user/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!res.ok) throw new Error("Failed to fetch user mapping");

            const data = await res.json();
            setUserMapping(data);

            // Format current date (dd/mm/yyyy)
            const today = new Date().toLocaleDateString("en-IN");

            reset({
                user_name: data.username || "",
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                dob: data.dob || "",
                mobile_number: data.mobile_number || "",
                alternate_number: data.alternate_number || "",
                whatsapp_number: data.whatsapp_number || "",
                address: data.address || "",
                city: data.city || "",
                state: data.state || "",
                pincode: data.pincode || "",
                password: data.password || "",
                hospital: data.hospitalid || "",
                nodal: data.nodalid || "",
                role: data.role || "",
                module: Array.isArray(data.module) ? data.module.join(", ") : data.module || "",
                created_by: "Admin", // ✅ Always Admin
                created_date: today, // ✅ Always today
                isactive: data.isactive ? "true" : "false",
            });
        } catch (err) {
            console.error("❌ Error fetching user mapping:", err);
            toast.error("❌ Failed to load user mapping data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMasterData();
        fetchUserMapping();
    }, [id]);

    // ✅ Ensure dropdowns pre-select after data loads
    useEffect(() => {
        if (userMapping && hospitalsList.length > 0 && nodalsList.length > 0 && rolesList.length > 0) {
            setValue("hospital", userMapping.hospitalid || "");
            setValue("nodal", userMapping.nodalid || "");
            setValue("role", userMapping.role || "");
        }
    }, [userMapping, hospitalsList, nodalsList, rolesList, setValue]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("authToken");
            const payload = {
                user_id: Number(id),
                first_name: data.first_name,
                last_name: data.last_name,
                dob: data.dob,
                mobile_number: data.mobile_number,
                alternate_number: data.alternate_number,
                whatsapp_number: data.whatsapp_number,
                address: data.address,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                password: data.password,
                hospital_id: Number(data.hospital),
                nodal_id: Number(data.nodal),
                role: Number(data.role),
                module: data.module ? [data.module] : [],
                isactive: data.isactive === "true",
                modified_by: "Admin",
                modified_date: new Date().toISOString(),
            };

            const response = await axios.put(
                `https://asrlabs.asrhospitalindia.in/lims/authentication/update-users/${id}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                toast.success("✅ User mapping updated successfully!");
                navigate("/view-user-mapping", { state: { refresh: true } });
            }
        } catch (err) {
            console.error(err);
            toast.error("❌ Failed to update user mapping.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center py-10 text-gray-500">Loading User Mapping data...</div>;
    if (!userMapping) return <div className="text-center py-10 text-gray-500">No User Mapping found.</div>;

    return (
        <>
            <div className="fixed top-[61px] w-full z-10">
                <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
                        <li><Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">🏠 Home</Link></li>
                        <li className="text-gray-400">/</li>
                        <li><Link to="/view-user-mapping" className="text-gray-700 hover:text-teal-600">User Mapping</Link></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-500">Update User Mapping</li>
                    </ol>
                </nav>
            </div>

            <div className="w-full mt-12 px-2 space-y-4 text-sm">
                <ToastContainer />
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl border border-gray-200">
                    <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
                        <h4 className="text-white font-semibold">Update User Mapping</h4>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Basic Info */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input type="text" {...register("first_name")} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input type="text" {...register("last_name")} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select Hospital</label>
                                <select {...register("hospital")} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500">
                                    <option value="">Select Hospital</option>
                                    {hospitalsList.map((h) => (
                                        <option key={h.id} value={h.id}>{h.hospitalname}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select Nodal</label>
                                <select {...register("nodal")} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500">
                                    <option value="">Select Nodal</option>
                                    {nodalsList.map((n) => (
                                        <option key={n.id} value={n.id}>{n.nodalname}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select Role</label>
                                <select {...register("role")} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500">
                                    <option value="">Select Role</option>
                                    {rolesList.map((r) => (
                                        <option key={r.id} value={r.id}>{r.roletype}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Module</label>
                                <input type="text" {...register("module")} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500" disabled />
                            </div>

                            {/* Always Admin / Today */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Modified By</label>
                                <input type="text" value="Admin" {...register("created_by")} readOnly className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Modified Date</label>
                                <input type="text" value={new Date().toLocaleDateString("en-IN")} {...register("created_date")} readOnly className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Is Active?</label>
                                <div className="flex space-x-4 pt-2">
                                    <label className="inline-flex items-center">
                                        <input type="radio" value="true" {...register("isactive")} className="h-4 w-4 text-teal-600" />
                                        <span className="ml-2">Yes</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input type="radio" value="false" {...register("isactive")} className="h-4 w-4 text-teal-600" />
                                        <span className="ml-2">No</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate("/view-user-mapping")}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {isSubmitting ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdateNewUserMapping;
