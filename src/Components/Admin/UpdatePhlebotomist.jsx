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
            email: phlebo.email || "",
            isactive: String(phlebo.isactive ?? "true"),
          });
        }
      } catch (error) {
        toast.error("❌ Failed to load data");
        console.error(error);
        navigate("/view-phlebotomist");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    if (!id) {
      toast.error("❌ No valid phlebotomist ID to update.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 🔍 Duplicate Check
      const allPhlebos = await viewPhlebotomists();
      const duplicates = allPhlebos.filter(
        (p) =>
          p.id !== Number(id) &&
          (p.phleboname === data.phleboname ||
            p.contactno === data.contactno ||
            (data.email && p.email === data.email))
      );

      if (duplicates.length > 0) {
        toast.error(
          "❌ Duplicate entry: Name, Contact Number, or Email already exists."
        );
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
        email: data.email,
        isactive: data.isactive === "true",
      };

      await updatePhlebotomist(id, payload);

      toast.success("✅ Phlebotomist updated successfully!");
      navigate("/view-phlebotomist");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "❌ Failed to update phlebotomist."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">⏳ Loading phlebotomist details...</p>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
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
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-phlebotomist"
                className="text-gray-700 hover:text-teal-600"
              >
                Phlebotomists
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Update Phlebotomist
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-2 md:px-6">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl border border-gray-200"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Phlebotomist</h4>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Full Name */}
            <div>
              <label className="block mb-1 font-medium">Full Name*</label>
              <input
                type="text"
                {...register("phleboname", {
                  required: "Full Name is required.",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces are allowed.",
                  },
                })}
                className="border rounded px-3 py-2 w-full"
              />
              {errors.phleboname && (
                <p className="text-red-500 text-xs">
                  {errors.phleboname.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block mb-1 font-medium">Address Line*</label>
              <input
                type="text"
                {...register("addressline", {
                  required: "Address is required.",
                  pattern: {
                    value: /^[A-Za-z0-9\s]+$/,
                    message: "Only letters, numbers and spaces allowed.",
                  },
                })}
                className="border rounded px-3 py-2 w-full"
              />
              {errors.addressline && (
                <p className="text-red-500 text-xs">
                  {errors.addressline.message}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block mb-1 font-medium">City*</label>
              <input
                type="text"
                {...register("city", {
                  required: "City is required.",
                  pattern: {
                    value: /^[A-Za-z0-9\s]+$/,
                    message: "Only letters, numbers and spaces allowed.",
                  },
                })}
                className="border rounded px-3 py-2 w-full"
              />
              {errors.city && (
                <p className="text-red-500 text-xs">{errors.city.message}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block mb-1 font-medium">State*</label>
              <input
                type="text"
                {...register("state", {
                  required: "State is required.",
                  pattern: {
                    value: /^[A-Za-z0-9\s]+$/,
                    message: "Only letters, numbers and spaces allowed.",
                  },
                })}
                className="border rounded px-3 py-2 w-full"
              />
              {errors.state && (
                <p className="text-red-500 text-xs">{errors.state.message}</p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block mb-1 font-medium">Pincode*</label>
              <input
                type="text"
                {...register("pincode", {
                  required: "Pincode is required.",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Pincode must be 6 digits.",
                  },
                })}
                className="border rounded px-3 py-2 w-full"
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs">
                  {errors.pincode.message}
                </p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="block mb-1 font-medium">Date of Birth*</label>
              <input
                type="date"
                {...register("dob", { required: "DOB is required." })}
                className="border rounded px-3 py-2 w-full"
              />
              {errors.dob && (
                <p className="text-red-500 text-xs">{errors.dob.message}</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block mb-1 font-medium">Contact No*</label>
              <input
                type="text"
                {...register("contactno", {
                  required: "Contact No is required.",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Must be a valid 10-digit number.",
                  },
                })}
                className="border rounded px-3 py-2 w-full"
              />
              {errors.contactno && (
                <p className="text-red-500 text-xs">
                  {errors.contactno.message}
                </p>
              )}
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                {...register("email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
                className="border rounded px-3 py-2 w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 font-medium">Status*</label>
              <select
                {...register("isactive", { required: "Status is required." })}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              {errors.isactive && (
                <p className="text-red-500 text-xs">{errors.isactive.message}</p>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t text-right bg-gray-50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded shadow disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Phlebotomist"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdatePhlebotomist;
