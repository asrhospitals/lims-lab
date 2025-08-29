import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { viewNodals, viewHospitals, viewPhlebotomist, updatePhlebotomist } from "../../services/apiService";

const UpdatePhlebotomist = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nodalCenters, setNodalCenters] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [phlebotomistData, setPhlebotomistData] = useState(null);
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

        const [nodalRes, hospitalRes, phlebotomistRes] = await Promise.all([
          viewNodals(),
          viewHospitals(),
          viewPhlebotomist(id),
        ]);

        const nodalData = nodalRes?.data || [];
        const hospitalData = (hospitalRes?.data || []).filter(
          (h) => h.isactive
        );
        const phlebotomistData = phlebotomistRes || null;

        setNodalCenters(nodalData);
        setHospitalList(hospitalData);
        setPhlebotomistData(phlebotomistData);

        // Populate form immediately after fetching data
        if (phlebotomistData) {
          reset({
            phleboname: phlebotomistData.phleboname || "",
            nodal: phlebotomistData.nodal || "",
            hospital: phlebotomistData.hospital || "",
            addressline: phlebotomistData.addressline || "",
            city: phlebotomistData.city || "",
            state: phlebotomistData.state || "",
            pincode: phlebotomistData.pincode || "",
            dob: phlebotomistData.dob ? phlebotomistData.dob.split("T")[0] : "", // Format date for input
            gender: phlebotomistData.gender || "",
            contactno: phlebotomistData.contactno || "",
            isactive: String(phlebotomistData.isactive ?? "true"),
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
      const payload = {
        phleboname: data.phleboname,
        addressline: data.addressline,
        city: data.city,
        state: data.state,
        pincode: Number(data.pincode),
        dob: data.dob,
        contactno: data.contactno,
        gender: data.gender,
        nodal: data.nodal,
        hospital: data.hospital,
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

  const textValidation = {
    required: "This field is required.",
    pattern: {
      value: /^[A-Za-z0-9\s\-_]+$/,
      message:
        "Only letters, numbers, spaces, hyphens, and underscores are allowed.",
    },
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">⏳ Loading phlebotomist details...</p>
      </div>
    );
  }

  if (!phlebotomistData) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Phlebotomist not found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
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
                to="/view-phlebotomist"
                className="text-gray-700 hover:text-teal-600 transition-colors"
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
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Phlebotomist</h4>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Full Name */}
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  {...register("phleboname", textValidation)}
                  className="input-style border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.phleboname && (
                  <p className="text-red-500 text-xs">
                    {errors.phleboname.message}
                  </p>
                )}
              </div>

              {/* Address Line */}
              <div>
                <label className="block mb-1 font-medium">Address Line</label>
                <input
                  type="text"
                  {...register("addressline", textValidation)}
                  className="input-style border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.addressline && (
                  <p className="text-red-500 text-xs">
                    {errors.addressline.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block mb-1 font-medium">City</label>
                <input
                  type="text"
                  {...register("city", textValidation)}
                  className="input-style border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.city && (
                  <p className="text-red-500 text-xs">{errors.city.message}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block mb-1 font-medium">State</label>
                <input
                  type="text"
                  {...register("state", textValidation)}
                  className="input-style border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.state && (
                  <p className="text-red-500 text-xs">{errors.state.message}</p>
                )}
              </div>

              {/* Pincode */}
              <div>
                <label className="block mb-1 font-medium">Pincode</label>
                <input
                  type="number"
                  {...register("pincode", { required: "Pincode is required." })}
                  className="input-style border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs">
                    {errors.pincode.message}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block mb-1 font-medium">Date of Birth</label>
                <input
                  type="date"
                  {...register("dob", { required: "DOB is required." })}
                  className="input-style border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs">{errors.dob.message}</p>
                )}
              </div>

              {/* Contact No */}
              <div>
                <label className="block mb-1 font-medium">Contact No</label>
                <input
                  type="text"
                  {...register("contactno", {
                    required: "Contact No is required.",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Must be a valid 10-digit number.",
                    },
                  })}
                  className="input-style border border-gray-300 rounded px-3 py-2 w-full"
                />
                {errors.contactno && (
                  <p className="text-red-500 text-xs">
                    {errors.contactno.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-1 font-medium">Gender</label>
                <select
                  {...register("gender", { required: "Gender is required." })}
                  className="input-style border border-gray-300 rounded px-3 py-2 w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Nodal Center */}
              <div>
                <label className="block mb-1 font-medium">Nodal Center</label>
                <select
                  {...register("nodal", {
                    required: "Nodal Center is required.",
                  })}
                  className="input-style border border-gray-300 rounded px-3 py-2 w-full"
                >
                  <option value="">Select Nodal Center</option>
                  {nodalCenters.map((n, i) => (
                    <option key={i} value={n.nodalname}>
                      {n.nodalname}
                    </option>
                  ))}
                </select>
                {errors.nodal && (
                  <p className="text-red-500 text-xs">{errors.nodal.message}</p>
                )}
              </div>

              {/* Hospital */}
              <div>
                <label className="block mb-1 font-medium">Hospital</label>
                <select
                  {...register("hospital", {
                    required: "Hospital is required.",
                  })}
                  className="input-style border border-gray-300 rounded px-3 py-2 w-full"
                >
                  <option value="">Select Hospital</option>
                  {hospitalList.map((h, i) => (
                    <option key={i} value={h.hospitalname}>
                      {h.hospitalname}
                    </option>
                  ))}
                </select>
                {errors.hospital && (
                  <p className="text-red-500 text-xs">
                    {errors.hospital.message}
                  </p>
                )}
              </div>

              {/* Is Active */}
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  {...register("isactive")}
                  className="input-style border border-gray-300 rounded px-3 py-2 w-full"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t text-right bg-gray-50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded shadow-md disabled:opacity-50"
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
