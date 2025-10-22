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

        console.log("phlebo", phlebo);

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
        // email: data.email,
        gender: data.gender,
        nodal: data.contactno,
        hospital: "",
        isactive: data.isactive === "true",
      };

      console.log("payload", payload);

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
                🏠 Home
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

      <div className="w-full mt-14 px-4 sm:px-6 space-y-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl border border-gray-200"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Phlebotomist</h4>
          </div>

          {/* Form Fields */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "phleboname",
                label: "Full Name",
                type: "text",
                validation: {
                  required: "Full Name is required",
                  pattern: {
                    value: /^[A-Za-z\s]{3,50}$/,
                    message: "Only letters and spaces allowed (3-50 chars)",
                  },
                },
              },
              {
                name: "addressline",
                label: "Address Line",
                type: "text",
                validation: {
                  required: "Address is required",
                  pattern: {
                    value: /^[A-Za-z0-9\s,.-]{5,100}$/,
                    message:
                      "Letters, numbers, spaces, comma, dot, hyphen allowed (5-100 chars)",
                  },
                },
              },
              {
                name: "city",
                label: "City",
                type: "text",
                validation: {
                  required: "City is required",
                  pattern: {
                    value: /^[A-Za-z\s]{2,50}$/,
                    message: "Only letters and spaces allowed (2-50 chars)",
                  },
                },
              },
              {
                name: "state",
                label: "State",
                type: "text",
                validation: {
                  required: "State is required",
                  pattern: {
                    value: /^[A-Za-z\s]{2,50}$/,
                    message: "Only letters and spaces allowed (2-50 chars)",
                  },
                },
              },
              {
                name: "pincode",
                label: "Pincode",
                type: "text",
                validation: {
                  required: "PIN Code is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "PIN must be exactly 6 digits",
                  },
                },
              },
              {
                name: "dob",
                label: "Date of Birth",
                type: "date",
                validation: {
                  required: "Date of Birth is required",
                  validate: (value) =>
                    new Date(value) < new Date() ||
                    "DOB cannot be today/future",
                },
              },


              {
                name: "gender",
                label: "Gender",
                type: "text",
                validation: {
                  required: "Gender is required",
                },
              },











              {
                name: "contactno",
                label: "Contact No",
                type: "text",
                validation: {
                  required: "Contact No is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Contact must be 10 digits starting with 6-9",
                  },
                },
              },
              {
                name: "email",
                label: "Email",
                type: "email",
                validation: {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                },
              },
              {
                name: "isactive",
                label: "Status",
                type: "select",
                options: [
                  { value: "true", label: "Active" },
                  { value: "false", label: "Inactive" },
                ],
                validation: { required: "Status is required" },
              },
            ].map(({ name, label, type, options, validation }) => (
              <div key={name} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {label}{" "}
                  {name !== "email" && <span className="text-red-500">*</span>}
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
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    {...register(name, validation)}
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

          {/* Submit */}
          <div className="p-6 flex justify-end border-t bg-gray-50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg shadow disabled:opacity-50 transition"
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
