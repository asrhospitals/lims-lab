import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import AdminContext from "../../context/adminContext";

const UpdateReferalDoctor = () => { 
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { referalDoctorToUpdate, setReferalDoctorToUpdate } = useContext(AdminContext);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://asrlabs.asrhospitalindia.in/lims/master/get-refdoc/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReferalDoctorToUpdate(response.data);
        reset(response.data);
      } catch (err) {
        toast.error("Failed to load referal doctor data.");
        navigate("/view-referal-doctor");
      }
    };
    fetchDoctor();
  }, [id, reset, setReferalDoctorToUpdate, navigate]);

  useEffect(() => {
    if (referalDoctorToUpdate) {
      reset({
        category: referalDoctorToUpdate.category || "",
        ref_doc_name: referalDoctorToUpdate.ref_doc_name || "",
        contact_no: referalDoctorToUpdate.contact_no || "",
        ref_by: referalDoctorToUpdate.ref_by || "",
        status: referalDoctorToUpdate.isactive ? "Active" : "Inactive",
        incentive_plan_name: referalDoctorToUpdate.incentive_plan_name || "",
        alternate_contact_no: referalDoctorToUpdate.alternate_contact_no || "",
        street: referalDoctorToUpdate.street || "",
        company: referalDoctorToUpdate.company || "",
        area: referalDoctorToUpdate.area || "",
        city: referalDoctorToUpdate.city || "",
        state: referalDoctorToUpdate.state || "",
        pincode: referalDoctorToUpdate.pincode || "",
        email: referalDoctorToUpdate.email || "",
        marketing_source: referalDoctorToUpdate.marketing_source || "",
        visit_type: referalDoctorToUpdate.visit_type || "",
        incentive_amount_type: referalDoctorToUpdate.incentive_amount_type || "",
        consultant_incentive_rate_plan: referalDoctorToUpdate.consultant_incentive_rate_plan || "",
        referral_incentive_rate_plan: referalDoctorToUpdate.referral_incentive_rate_plan || "",
        pharmacy_incentive_percentage: referalDoctorToUpdate.pharmacy_incentive_percentage || "",
        include_discount: referalDoctorToUpdate.include_discount || "",
        include_full_discount: referalDoctorToUpdate.include_full_discount || "",
        other_details: referalDoctorToUpdate.other_details || "",
      });
    }
  }, [referalDoctorToUpdate, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        ...data,
        isactive: data.status === "Active",
        pincode: data.pincode ? Number(data.pincode) : null,
        pharmacy_incentive_percentage: data.pharmacy_incentive_percentage
          ? Number(data.pharmacy_incentive_percentage)
          : null,
      };
      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-refdoc/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Referral Doctor updated successfully!");
      setTimeout(() => {
        setReferalDoctorToUpdate(null);
        navigate("/view-referal-doctor");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update Referral Doctor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CONSULTANT_PLANS = ["20 PERCENTAGE", "25 PERCENTAGE", "30 PERCENTAGE", "40 PERCENTAGE"];
  const REFERRAL_PLANS = ["20 PERCENTAGE", "25 PERCENTAGE", "30 PERCENTAGE", "40 PERCENTAGE"];
  const yesNoOptions = ["Yes", "No"];
  const categoryOptions = ["Hospital", "External Doctor"];
  const visitTypes = ["OP"];
  const incentiveAmountTypes = ["Billed Amount", "Collected Amount"];

  const fields = [
    { name: "category", label: "Category", type: "select", options: categoryOptions, validation: { required: "Category is required" } },
    { name: "ref_doc_name", label: "Name", placeholder: "Enter Name", validation: { required: "Name is required" } },
    { name: "contact_no", label: "Contact No", placeholder: "+91...", validation: { required: "Contact number is required" } },
    { name: "ref_by", label: "Referred By", placeholder: "Enter Referred By" },
    { name: "incentive_plan_name", label: "Incentive Plan", type: "select", options: REFERRAL_PLANS, validation: { required: "Incentive Plan is required" } },
    { name: "alternate_contact_no", label: "Alternate Contact No", placeholder: "Enter Alternate Contact No" },
    { name: "street", label: "Street", placeholder: "Enter Street" },
    { name: "company", label: "Company", placeholder: "Enter Company" },
    { name: "area", label: "Area", placeholder: "Enter Area" },
    { name: "city", label: "City", placeholder: "Enter City" },
    { name: "state", label: "State", placeholder: "Enter State" },
    { name: "pincode", label: "Pincode", placeholder: "Enter Pincode" },
    { name: "email", label: "Email", placeholder: "Enter Email" },
    { name: "marketing_source", label: "Marketing Source", placeholder: "Enter Marketing Source" },
    { name: "visit_type", label: "Visit Type", type: "select", options: visitTypes, validation: { required: "Visit Type is required" } },
    { name: "incentive_amount_type", label: "Incentive Amount Type", type: "select", options: incentiveAmountTypes, validation: { required: "Incentive Amount Type is required" } },
    { name: "consultant_incentive_rate_plan", label: "Consultant Incentive Rate Plan", type: "select", options: CONSULTANT_PLANS },
    { name: "referral_incentive_rate_plan", label: "Referral Incentive Rate Plan", type: "select", options: REFERRAL_PLANS },
    { name: "pharmacy_incentive_percentage", label: "Pharmacy Incentive Percentage", placeholder: "Enter Pharmacy Incentive Percentage" },
    { name: "include_discount", label: "Include Discount", type: "select", options: yesNoOptions },
    { name: "include_full_discount", label: "Include Full Discount", type: "select", options: yesNoOptions },
    { name: "other_details", label: "Other Details", type: "textarea", placeholder: "Enter Other Details" },
  ];

  return (
    <>
      <ToastContainer />
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-sm font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li><Link to="/" className="text-gray-700 hover:text-teal-600">🏠 Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-referal-doctor" className="text-gray-700 hover:text-teal-600">View Referal Dotor</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Referal Doctor</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-2 space-y-4 text-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Referal Doctor</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {fields.map(({ name, label, placeholder, type = "text", options, validation }) => (
                <div key={name}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {label} {validation?.required && <span className="text-red-500">*</span>}
                  </label>

                  {type === "select" ? (
                    <select
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`}
                    >
                      <option value="">Select {label}</option>
                      {options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : type === "textarea" ? (
                    <textarea {...register(name, validation)} placeholder={placeholder} className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`} />
                  ) : (
                    <input type={type} placeholder={placeholder} {...register(name, validation)} onBlur={() => trigger(name)} className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"} focus:ring-2 transition`} />
                  )}

                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                </div>
              ))}

              {/* ✅ Status Radio Buttons (Active default always) */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-6 mt-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="Active"
                      defaultChecked
                      {...register("status", { required: "Status is required" })}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    Active
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="Inactive"
                      {...register("status", { required: "Status is required" })}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    Inactive
                  </label>
                </div>

                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
                )}
              </div>

            </div>

           <div className="mt-6 flex justify-end gap-3">
  <button
    type="button"
    onClick={() => navigate("/view-referal-doctor")}
    className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-md transition"
  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={isSubmitting}
    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-60"
  >
    {isSubmitting ? "Updating..." : "Update Referal Doctor"}
  </button>
</div>

          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateReferalDoctor;
