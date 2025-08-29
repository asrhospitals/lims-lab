import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ProfileTestBilling from "./ProfileTestBilling";

const PatientRegistrationAdd = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const navigate = useNavigate();
  const [showAbhaModal, setShowAbhaModal] = useState(false);
  const [abhaMode, setAbhaMode] = useState("mobile");
  const [abhaValue, setAbhaValue] = useState("");
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [whatsappSameAsMobile, setWhatsappSameAsMobile] = useState(false);
  const [age, setAge] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ mode: "onBlur" });

  const watchedDob = watch("dob");

  // Auto-calculate age when DOB changes
  useEffect(() => {
    if (watchedDob) {
      const today = new Date();
      const birthDate = new Date(watchedDob);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }
      if (calculatedAge >= 0 && calculatedAge <= 100) {
        setAge(calculatedAge);
        setValue("age", calculatedAge);
      }
    }
  }, [watchedDob, setValue]);

  // Auto-fill WhatsApp number when checkbox is checked
  const handleWhatsappAutoFill = (checked) => {
    setWhatsappSameAsMobile(checked);
    if (checked) {
      const mobileValue = watch("mobileNumber");
      setValue("whatsappNumber", mobileValue);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const hospitalName = localStorage.getItem("hospital_name");
      const nodalname = localStorage.getItem("nodalname");
      const authToken = localStorage.getItem("authToken");

      // Format today's date as YYYY-MM-DD
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      const payload = {
        ptitle: data.title,
        city: data.city,
        state: data.state,
        pname: data.patientName,
        page: data.dob,
        pgender: data.gender,
        pregdate: formattedDate,
        pmobile: data.mobileNumber,
        registration_status: nodalname,
        hospital_name: hospitalName,
        investigation_ids: [],
        opbill: [],
        pptest: [],
        abha: [],
      };

      // Send the POST request to the API
      const response = await axios.post(
        `https://asrphleb.asrhospitalindia.in/phelb/add-patient-test/${hospitalName}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Success response:", response.data);
      toast.success("Patient registered successfully!");
      reset();

      setTimeout(() => {
        navigate("/patient-registration");
      }, 2000);
    } catch (error) {
      console.error(
        "❌ Error response:",
        error.response?.data || error.message
      );
      toast.error("Failed to register patient");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-sm font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/patient-registration"
                className="text-gray-700 hover:text-teal-600"
              >
                Patients
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">
              Add Patient (Patient Registration)
            </li>
          </ol>
        </nav>
      </div>
      {showAbhaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-auto p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAbhaModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-teal-700">
              Create/Verify ABHA
            </h2>
            <div className="mb-4">
              <label className="block font-medium mb-2">
                Verify Using: <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="mobile"
                    checked={abhaMode === "mobile"}
                    onChange={() => setAbhaMode("mobile")}
                    className="mr-2"
                  />
                  Mobile Number
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="abha"
                    checked={abhaMode === "abha"}
                    onChange={() => setAbhaMode("abha")}
                    className="mr-2"
                  />
                  ABHA Details
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="aadhaar"
                    checked={abhaMode === "aadhaar"}
                    onChange={() => setAbhaMode("aadhaar")}
                    className="mr-2"
                  />
                  Aadhaar Details
                </label>
              </div>
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-2">
                {abhaMode === "mobile"
                  ? "Mobile Number:"
                  : abhaMode === "abha"
                  ? "ABHA ID:"
                  : "Aadhaar Number:"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={abhaValue}
                onChange={(e) => setAbhaValue(e.target.value)}
                placeholder={
                  abhaMode === "mobile"
                    ? "Enter the ABHA Mobile Number"
                    : abhaMode === "abha"
                    ? "Enter ABHA ID"
                    : "Enter Aadhaar Number"
                }
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                type="button"
              >
                Create New ABHA
              </button>
              <div>
                <button
                  className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                  type="button"
                >
                  Verify
                </button>
                <button
                  className="bg-orange-600 text-white ml-2 px-4 py-2 rounded hover:bg-orange-700"
                  type="button"
                  onClick={() => setShowAbhaModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mt-16 px-4 space-y-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">
              Add Patient (Patient Registration)
            </h4>
          </div>

          {/* ABHA Creation Interface */}
          {/* <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">
              ABHA Creation Interface
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mode of Creation:
              </label>
              <select
                {...register("creationMode", { required: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Mode</option>
                <option value="aadhaar">Aadhaar Number</option>
                <option value="mobile">Mobile Number</option>
              </select>
              {errors.creationMode && (
                <p className="text-red-600 text-xs mt-1">
                  You must select one mode of creation.
                </p>
              )}
            </div>
          </div> */}

          {/* ABHA Verification Interface */}
          <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">
              ABHA Verification Interface
            </h3>
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => setShowAbhaModal(true)}
            >
              Create/Verify ABHA
            </button>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Centre Name
              </label>
              <input
                type="text"
                {...register("centreName", { required: true, maxLength: 100 })}
                defaultValue={localStorage.getItem("hospital_name") || ""}
                className="w-full border px-3 py-2 rounded bg-gray-100"
                placeholder="Auto-filled based on login"
                readOnly
              />
              {errors.centreName && (
                <p className="text-red-600 text-xs mt-1">
                  Centre name is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient Source Type:
              </label>
              <select
                {...register("patientSourceType", { required: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Source Type</option>
                <option value="walk-in">Walk-in</option>
                <option value="in-house">In-house</option>
                <option value="b2b">B2B</option>
                <option value="referral">Referral</option>
              </select>
              {errors.patientSourceType && (
                <p className="text-red-600 text-xs mt-1">
                  Patient source type is required.
                </p>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">
              Basic Information
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                {...register("username")}
                defaultValue={localStorage.getItem("username") || ""}
                disabled
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                {...register("country", { required: true })}
                defaultValue="India"
                className="w-full border px-3 py-2 rounded"
              />
              {errors.country && (
                <p className="text-red-600 text-xs mt-1">Country is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Referral Source
              </label>
              <select
                {...register("referralSource", { required: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Referral Source</option>
                <option value="Banner">Banner</option>
                <option value="Google">Google</option>
                <option value="SMS">SMS</option>
                <option value="Doctor">Doctor</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
              {errors.referralSource && (
                <p className="text-red-600 text-xs mt-1">
                  Referral source is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reference Details
              </label>
              <input
                {...register("referenceDetails", {
                  required: true,
                  maxLength: 50,
                  pattern: /^[A-Za-z\s]*$/,
                })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Alphabets only, max 50 chars"
              />
              {errors.referenceDetails && (
                <p className="text-red-600 text-xs mt-1">
                  Reference details are required (alphabets only, max 50 chars)
                </p>
              )}
            </div>
          </div>

          {/* Contact and Identity */}
          <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">
              Contact and Identity
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                {...register("mobileNumber", {
                  required: true,
                  pattern: /^[0-9]{10}$/,
                })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.mobileNumber && (
                <p className="text-red-600 text-xs mt-1">Must be 10 digits</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <select
                {...register("title", { required: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Dr">Dr</option>
                <option value="Baby">Baby</option>
              </select>
              {errors.title && (
                <p className="text-red-600 text-xs mt-1">Title is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient Name
              </label>
              <input
                {...register("patientName", {
                  required: true,
                  pattern: /^[A-Za-z\s.]+$/,
                })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.patientName && (
                <p className="text-red-600 text-xs mt-1">
                  Patient name is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                {...register("lastName")}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                {...register("gender", { required: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="TS">TS</option>
                <option value="TG">TG</option>
              </select>
              {errors.gender && (
                <p className="text-red-600 text-xs mt-1">Gender is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dob", {
                  required: true,
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    return (
                      selectedDate <= today || "Date cannot be in the future"
                    );
                  },
                })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.dob && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.dob.message || "Date of Birth is required"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                {...register("age", {
                  required: true,
                  min: 0,
                  max: 100,
                })}
                value={age}
                readOnly
                className="w-full border px-3 py-2 rounded bg-gray-100"
                placeholder="Auto-calculated"
              />
              {errors.age && (
                <p className="text-red-600 text-xs mt-1">
                  Age must be between 0-100
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <select
                {...register("bloodGroup", { required: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
              {errors.bloodGroup && (
                <p className="text-red-600 text-xs mt-1">
                  Blood group is required
                </p>
              )}
            </div>
          </div>

          {/* ID Proof Details */}
          <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">
              ID Proof Details
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID Type
              </label>
              <select
                {...register("idType", { required: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select ID Type</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
              </select>
              {errors.idType && (
                <p className="text-red-600 text-xs mt-1">ID Type is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID Number
              </label>
              <input
                {...register("idNumber", {
                  required: true,
                  pattern: /^[A-Za-z0-9]+$/,
                })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.idNumber && (
                <p className="text-red-600 text-xs mt-1">
                  ID Number is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email", {
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">
                  Invalid email format
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp Number
              </label>
              <div className="flex items-center space-x-2">
                <input
                  {...register("whatsappNumber", { pattern: /^[0-9]{10}$/ })}
                  className="flex-1 border px-3 py-2 rounded"
                  placeholder="10-digit number"
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="whatsapp-same"
                    checked={whatsappSameAsMobile}
                    onChange={(e) => handleWhatsappAutoFill(e.target.checked)}
                    className="mr-1"
                  />
                  <label
                    htmlFor="whatsapp-same"
                    className="text-xs text-gray-600"
                  >
                    Same as mobile
                  </label>
                </div>
              </div>
              {errors.whatsappNumber && (
                <p className="text-red-600 text-xs mt-1">Must be 10 digits</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Photo Capture
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoCapture(true)}
                  className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Capture Photo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setCapturedPhoto(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="text-sm"
                />
              </div>
              {capturedPhoto && (
                <img
                  src={capturedPhoto}
                  alt="Captured"
                  className="mt-2 w-16 h-16 object-cover rounded"
                />
              )}
            </div>
          </div>

          {/* Guardian Information */}

          <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">
              Guardian Information
              <span className="ml-2 text-sm font-normal text-gray-400">
                (required if patient is minor or elderly)
              </span>
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                {...register("guardianName", {
                  required: true,
                  pattern: /^[A-Za-z\s]+$/,
                })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter Guardian Name"
              />
              {errors.guardianName && (
                <p className="text-red-600 text-xs mt-1">
                  Name must contain alphabets only
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                {...register("guardianMobile", {
                  required: true,
                  pattern: /^[0-9]{10}$/,
                })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter 10-digit Mobile Number"
              />
              {errors.guardianMobile && (
                <p className="text-red-600 text-xs mt-1">Must be 10 digits</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address (Optional)
              </label>
              <input
                {...register("street")}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Relation
              </label>
              <select
                {...register("relation")}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Relation</option>
                <option value="Parent">Parent</option>
                <option value="Guardian">Guardian</option>
                <option value="Relative">Relative</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">
              Address Details
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Street
              </label>
              <input
                {...register("street", { maxLength: 100 })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Max 100 characters"
              />
              {errors.street && (
                <p className="text-red-600 text-xs mt-1">
                  Max 100 characters allowed
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Landmark
              </label>
              <input
                {...register("landmark")}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                {...register("city", { required: true })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.city && (
                <p className="text-red-600 text-xs mt-1">City is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                {...register("state", { required: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
              </select>
              {errors.state && (
                <p className="text-red-600 text-xs mt-1">State is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                PIN Code
              </label>
              <input
                type="text"
                {...register("pincode", {
                  pattern: /^[0-9]{6}$/,
                })}
                className="w-full border px-3 py-2 rounded"
                placeholder="6-digit PIN code"
              />
              {errors.pincode && (
                <p className="text-red-600 text-xs mt-1">Must be 6 digits</p>
              )}
            </div>
          </div>

          <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">
              Communication Preferences
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div className="mb-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailAlerts"
                  {...register("emailAlerts")}
                  className="mr-2 focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="emailAlerts"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Alerts
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                If ticked, Email must be valid
              </p>
            </div>

            <div className="mb-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="whatsappAlerts"
                  {...register("whatsappAlerts")}
                  className="mr-2 focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="whatsappAlerts"
                  className="block text-sm font-medium text-gray-700"
                >
                  WhatsApp Alerts
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                If ticked, WhatsApp number validated
              </p>
            </div>
          </div>

          {/* Barcode Management */}
          <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">
              Barcode Management
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Barcode Option
              </label>
              <select
                {...register("barcodeOption")}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Option</option>
                <option value="preprinted">Pre-printed Barcode</option>
                <option value="custom">Custom Barcode</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sample Type
              </label>
              <select
                {...register("sampleType")}
                defaultValue="elective"
                className="w-full border px-3 py-2 rounded"
              >
                <option value="elective">Elective</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Barcode Number
              </label>
              <input
                {...register("barcodeNumber")}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter barcode number"
              />
            </div>
          </div>

          <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">
              Payment Mode Selection
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6">
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="pp-mode"
                  name="paymentMode"
                  value="pp"
                  checked={paymentMode === "pp"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <label
                  htmlFor="pp-mode"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  PP Mode
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paid-mode"
                  name="paymentMode"
                  value="paid"
                  checked={paymentMode === "paid"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <label
                  htmlFor="paid-mode"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Paid Mode
                </label>
              </div>
            </div>
          </div>

          <div>
            {paymentMode === "pp" && (
              <>
                <div className="px-6 pt-6">
                  <h3 className=" text-lg font-medium text-gray-900 mb-0">
                    Hospital / Scheme Information
                  </h3>
                  <div className="mt-1 border-b border-gray-100"></div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Number Type
                    </label>
                    <select
                      id="numberType"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="OP">OP Number</option>
                      <option value="IP">IP Number</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      OP/IP Number
                    </label>
                    <input
                      {...register("opNumber")}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Scheme Type
                    </label>
                    <select
                      {...register("schemeType")}
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="">Select Scheme Type</option>
                      <option value="MJAY">MJAY</option>
                      <option value="PMJAY">PMJAY</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Registration Number
                    </label>
                    <input
                      {...register("registrationNumber")}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Referral Doctor Name
                    </label>
                    <input
                      {...register("referralDoctorName")}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Barcode No
                    </label>
                    <input
                      name="barcodeNo"
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      TRF Number
                    </label>
                    <input
                      name="trfNumber"
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <textarea
                      name="remarks"
                      rows="3"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
              </>
            )}
          </div>

          {paymentMode === "paid" && <ProfileTestBilling />}

          <div className="px-6 py-4 border-t bg-gray-50 text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Saving..." : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PatientRegistrationAdd;
