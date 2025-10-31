import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  viewPhlebotomist,
  viewPhlebotomists,
  updatePhlebotomist,
} from "../../services/apiService";

const UpdatePhlebotomist = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("❌ No phlebotomist ID provided.");
        navigate("/view-phlebotomist");
        return;
      }

      try {
        setLoading(true);
        const phlebo = await viewPhlebotomist(id);

        if (phlebo) {
          reset({
            phleboname: phlebo.phleboname || "",
            addressline: phlebo.addressline || "",
            city: phlebo.city || "",
            state: phlebo.state || "",
            pincode: phlebo.pincode || "",
            dob: phlebo.dob ? phlebo.dob.split("T")[0] : "",
            contactno: phlebo.contactno || "",
            gender: phlebo.gender || "",
            isactive: String(phlebo.isactive ?? "true"),
          });
        }
      } catch (error) {
        toast.error("❌ Failed to load data");
        navigate("/view-phlebotomist");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    if (!id) {
      toast.error("❌ Invalid phlebotomist ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await viewPhlebotomists();
      const allPhlebos = response.data ?? response;

      const duplicates = allPhlebos.filter(
        (p) =>
          p.id !== Number(id) &&
          (p.phleboname.toLowerCase() === data.phleboname.toLowerCase() ||
            p.contactno === data.contactno)
      );

      if (duplicates.length > 0) {
        toast.error("❌ Name or Contact Number already exists.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        phleboname: data.phleboname,
        addressline: data.addressline,
        city: data.city,
        state: data.state,
        pincode: Number(data.pincode),
        dob: data.dob,
        contactno: data.contactno,
        gender: data.gender,
        isactive: data.isactive === "true",
      };

      await updatePhlebotomist(id, payload);

      toast.success("✅ Phlebotomist updated successfully!", { autoClose: 1500 });
      setTimeout(() => navigate("/view-phlebotomist"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Update failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">⏳ Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-3 text-sm">
            <li><Link to="/" className="text-gray-700 hover:text-teal-600">🏠 Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-phlebotomist" className="text-gray-700 hover:text-teal-600">Phlebotomists</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Phlebotomist</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-4 sm:px-6 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl border border-gray-200">
          <div className="px-6 py-4 bg-teal-600 text-white font-semibold">Update Phlebotomist</div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "phleboname", label: "Full Name", pattern: /^[A-Za-z\s]{3,50}$/, msg: "Only letters (3-50 chars)" },
              { name: "addressline", label: "Address Line", pattern: /^[A-Za-z0-9\s,.-]{5,100}$/, msg: "Invalid address" },
              { name: "city", label: "City", pattern: /^[A-Za-z\s]{2,50}$/, msg: "Only letters allowed" },
              { name: "state", label: "State", pattern: /^[A-Za-z\s]{2,50}$/, msg: "Only letters allowed" },
              { name: "pincode", label: "Pincode", pattern: /^\d{6}$/, msg: "6-digit PIN required" },
              { name: "dob", label: "Date of Birth", type: "date" },
              { name: "gender", label: "Gender" },
              { name: "contactno", label: "Contact No", pattern: /^[6-9]\d{9}$/, msg: "Enter valid 10-digit mobile" },
            ].map(({ name, label, type, pattern, msg }) => (
              <div key={name} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={type || "text"}
                  {...register(name, {
                    required: `${label} is required`,
                    pattern: pattern && { value: pattern, message: msg },
                  })}
                  className={`w-full px-4 py-2 rounded-lg border ${errors[name] ? "border-red-500" : "border-gray-300"} focus:ring-2`}
                  onBlur={() => trigger(name)}
                />
                {errors[name] && <p className="text-red-500 text-xs">{errors[name]?.message}</p>}
              </div>
            ))}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select {...register("isactive", { required: true })} className="w-full px-4 py-2 rounded-lg border border-gray-300">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="p-6 flex justify-end bg-gray-50 border-t gap-3">
            <button
              type="button"
              onClick={() => navigate("/view-phlebotomist")}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg">
              {isSubmitting ? "Updating..." : "Update Phlebotomist"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdatePhlebotomist;
