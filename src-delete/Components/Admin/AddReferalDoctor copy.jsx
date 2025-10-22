import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AddReferalDoctor = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({ mode: "onBlur" });

  // ✅ ENUM-safe helper
  const clean = (val) => (val === "" || val === undefined ? null : val);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("❌ Token missing. Please login again.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        category: data.category,
        ref_doc_name: data.ref_doc_name,
        contact_no: data.contact_no,
        ref_by: clean(data.ref_by),
        isactive: data.status === "Active",
        incentive_plan: clean(data.incentive_plan_name),
        alternate_contact_no: clean(data.alternate_contact_no),
        street: clean(data.street),
        company: clean(data.company),
        area: clean(data.area),
        city: clean(data.city),
        state: clean(data.state),
        pincode: data.pincode ? Number(data.pincode) : null,
        email: clean(data.email),
        marketing_source: clean(data.marketing_source),
        other_agents: clean(data.other_agents),
        hospitalid: 3,
        other_details: clean(data.other_details),
        include_in_referred_by: clean(data.include_in_referred_by),
        is_external: clean(data.is_external),
        visit_type: data.visit_type,
        incentive_plan_name: clean(data.incentive_plan_name),
        incentive_amount_type: clean(data.incentive_amount_type),
        consultant_incentive_rate_plan: clean(data.consultant_incentive_rate_plan),
        referral_incentive_rate_plan: clean(data.referral_incentive_rate_plan),
        pharmacy_incentive_percentage: data.pharmacy_incentive_percentage
          ? Number(data.pharmacy_incentive_percentage)
          : null,
        include_discount: clean(data.include_discount),
        include_full_discount: clean(data.include_full_discount),
      };

      await axios.post("/lims/master/add-refdoc", payload, {
        headers: {
          Authorization: token?.startsWith("Bearer") ? token : `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("✅ Referral Doctor added successfully!");
      reset();
      setTimeout(() => navigate("/view-referal-doctor"), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Failed to add Referral Doctor"
      );
      console.error("Add Referral Doctor Error:", error.response || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ ENUM-safe options matching backend
  const CONSULTANT_PLANS = [
    "20 PERCENTAGE",
    "25 PERCENTAGE",
    "30 PERCENTAGE",
    "40 PERCENTAGE",
  ];

  const REFERRAL_PLANS = [
    "20 PERCENTAGE",
    "25 PERCENTAGE",
    "30 PERCENTAGE",
    "40 PERCENTAGE",
  ];

  const fields = [
    { name: "category", label: "Category", type: "select", options: ["Hospital", "External Doctor"], validation: { required: "Category is required" } },
    { name: "ref_doc_name", label: "Name", placeholder: "Enter Name", validation: { required: "Name is required" } },
    { name: "contact_no", label: "Contact No", placeholder: "+91...", validation: { required: "Contact number is required" } },
    { name: "ref_by", label: "Referred By", placeholder: "Enter Referred By" },
    { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"], validation: { required: "Status is required" } },
    { name: "incentive_plan_name", label: "Incentive Plan", type: "select", options: ["20 PERCENTAGE", "25 PERCENTAGE", "30 PERCENTAGE", "40 PERCENTAGE"], validation: { required: "Incentive plan is required" } },
    { name: "street", label: "Street", placeholder: "Enter Street" },
    { name: "company", label: "Company", placeholder: "Enter Company" },
    { name: "area", label: "Area", placeholder: "Enter Area" },
    { name: "city", label: "City", placeholder: "Enter City" },
    { name: "state", label: "State", placeholder: "Enter State" },
    { name: "pincode", label: "Pincode", placeholder: "Enter Pincode" },
    { name: "email", label: "Email", placeholder: "Enter Email" },
    { name: "marketing_source", label: "Marketing Source", placeholder: "Enter Marketing Source" },
    { name: "visit_type", label: "Visit Type", type: "select", options: ["OP"], validation: { required: "Visit Type is required" } },
    { name: "incentive_amount_type", label: "Incentive Amount Type", type: "select", options: ["Billed Amount", "Collected Amount"], validation: { required: "Incentive Amount Type is required" } },
    { name: "consultant_incentive_rate_plan", label: "Consultant Incentive Rate Plan", type: "select", options: CONSULTANT_PLANS },
    { name: "referral_incentive_rate_plan", label: "Referral Incentive Rate Plan", type: "select", options: REFERRAL_PLANS },
    { name: "pharmacy_incentive_percentage", label: "Pharmacy Incentive Percentage", placeholder: "Enter Pharmacy Incentive Percentage" },
    { name: "include_discount", label: "Include Discount", type: "select", options: ["Yes", "No"] },
    { name: "include_full_discount", label: "Include Full Discount", type: "select", options: ["Yes", "No"] },
    { name: "other_details", label: "Other Details", type: "textarea", placeholder: "Enter Other Details" },
  ];

  return (
    <>
      <ToastContainer />
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600"
              >
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-referal-doctor"
                className="text-gray-700 hover:text-teal-600"
              >
                Referral Doctors
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Add Referral Doctor
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-0 sm:px-2 space-y-4 text-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Referral Doctor</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options, validation }) => (
                <div key={name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {label} {validation?.required && <span className="text-red-500">*</span>}
                  </label>

                  {type === "select" ? (
                    <select
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:ring-2 transition`}
                    >
                      <option value="">Select {label}</option>
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : type === "textarea" ? (
                    <textarea
                      {...register(name, validation)}
                      placeholder={placeholder}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:ring-2 transition`}
                    />
                  ) : (
                    <input
                      type={type}
                      {...register(name, validation)}
                      placeholder={placeholder}
                      onBlur={() => trigger(name)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-teal-500"
                      } focus:ring-2 transition`}
                    />
                  )}

                  {errors[name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => reset()}
                className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Add Referral Doctor"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReferalDoctor;
