
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import Barcode from "react-barcode";
// import captureImg from "../../../public/capture-new.png";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import { getHospitalList } from "../../services/apiService";
import { XCircleIcon } from "@heroicons/react/24/outline";

const UpdatePatientDetails = () => {
  const { id: patientId } = useParams();
  const [paymentMode, setPaymentMode] = useState("");
  const navigate = useNavigate();
  const [showAbhaModal, setShowAbhaModal] = useState(false);
  const [abhaMode, setAbhaMode] = useState("mobile");
  const [abhaValue, setAbhaValue] = useState("");
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [p_image, setCapturedPhoto] = useState(null);
  const [tempPhoto, setTempPhoto] = useState(null);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [showCamera, setShowCamera] = useState(false);
  const [whatsappSameAsMobile, setWhatsappSameAsMobile] = useState(false);
  const [age, setAge] = useState("");

  const [numberType, setNumberType] = useState("OP");
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const [billingItems, setBillingItems] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [tests, setTests] = useState([]);
  const [addedTests, setAddedTests] = useState([]);
  const [testCodeInput, setTestCodeInput] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [shortCodeInput, setShortCodeInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pdisc, setDiscount] = useState({ type: "%", value: 0 });
  const [amountReceived, setAmountReceived] = useState(0);
  const [note, setNote] = useState("");
  const [payments, setPayments] = useState([{ method: "Cash", amount: 0 }]);
  const [paymentModeType, setPaymentModeType] = useState("single");
  const [activeTab, setActiveTab] = useState("investigation");

  const [obbill, setObbill] = useState(0);
  const [billingError, setBillingError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [barcodeGenerationValue, setBarcodeGenerationValue] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [apiError, setApiError] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [patientList, setPatientList] = useState([]);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBillingCompleted, setIsBillingCompleted] = useState(false);

  useEffect(() => {
    if (paymentModeType === "single" && payments.length > 1) {
      setPayments([payments[0]]);
    }
  }, [paymentModeType]);

  const handleAddBill = (bill) => {
    const updated = [...billingItems, bill];
    setBillingItems(updated);
  };

  const handleAddTest = (e) => {
    if (e) e.preventDefault();
    let profile = null;

    if (selectedProfile) {
      profile = tests.find((p) => p.id.toString() === selectedProfile);
    } else if (testCodeInput) {
      profile = tests.find(
        (p) => p.shortname.toLowerCase() === testCodeInput.toLowerCase()
      );
    }

    if (!profile) return;

    setAddedTests((prev) => [...prev, { ...profile, uid: Date.now() }]);
    setTestCodeInput("");
    setSelectedProfile("");
  };

  const handleShortCodeAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authToken = localStorage.getItem("authToken");
      const isNumeric = /^[0-9,\s]+$/.test(shortCodeInput.trim());

      const params = {};
      if (isNumeric) {
        params.shortcodes = shortCodeInput.trim();
      } else {
        params.testname = shortCodeInput.trim();
      }

      const response = await axios.get(
        "https://asrphleb.asrhospitalindia.in/api/v2/phleb/search-test",
        {
          params,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = (response.data || []).sort(
        (a, b) => Number(a.id) - Number(b.id)
      );

      setAddedTests((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const uniqueNew = data.filter((t) => !existingIds.has(t.id));
        return [...prev, ...uniqueNew];
      });

      setShortCodeInput("");
    } catch (err) {
      console.error("Error fetching tests:", err);
      setError(err.response?.data?.message || "Failed to fetch tests.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTest = (id) => {
    setAddedTests((prev) => prev.filter((t) => t.id !== id));
  };

  const ptotal = addedTests.reduce((sum, test) => {
    return sum + Number(test.normalprice || 0);
  }, 0);

  const discountValue =
    pdisc.type === "%" ? (ptotal * pdisc.value) / 100 : pdisc.value;
  const receivable = ptotal - discountValue;

  const totalPaid =
    paymentModeType === "single"
      ? payments[0]?.amount || 0
      : payments.reduce((sum, payment) => sum + payment.amount, 0);

  const dueAmount = receivable - totalPaid;

  const addPaymentMethod = (e) => {
    e.preventDefault();
    setPayments([...payments, { method: "Cash", amount: 0 }]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ mode: "onBlur" });

  const watchedDob = watch("dob");

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

  // Fetch existing patient data
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://asrphleb.asrhospitalindia.in/api/v2/phleb/get-patient/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const patient = response.data;
        setPatientData(patient);

        // Pre-fill form with existing data
        setValue("p_title", patient.p_title);
        setValue("referralSource", patient.hospital_id);
        setValue("patientSourceType", patient.patient_source_type);
        setValue("p_mobile", patient.p_mobile);
        setValue("p_name", patient.p_name);
        setValue("lastName", patient.p_lname);
        setValue("p_gender", patient.p_gender);
        setValue("p_regdate", patient.p_regdate);
        setValue("dob", patient.dob);
        setValue("p_age", patient.p_age);
        setValue("bloodGroup", patient.blood_group);
        setValue("idType", patient.id_type);
        setValue("idNumber", patient.id_number);
        setValue("email", patient.email);
        setValue("whatsappNumber", patient.whatsapp_number);
        setValue("guardianName", patient.guardian_name);
        setValue("guardianMobile", patient.guardian_mobile);
        setValue("street", patient.street);
        setValue("relation", patient.relation);
        setValue("landmark", patient.landmark);
        setValue("city", patient.city);
        setValue("state", patient.state);
        setValue("pincode", patient.pincode);
        setValue("emailAlerts", patient.email_alerts);
        setValue("whatsappAlerts", patient.whatsapp_alerts);
        setValue("barcodeOption", patient.barcode_option);
        setValue("sampleType", patient.sample_type);
        setValue("barcodeNumber", patient.barcode_number);

        // Set other states
        setNumberType(patient.number_type || "OP");
        setCapturedPhoto(patient.p_image);
        setAge(patient.p_age);

        // Set ABHA data if exists
        if (patient.abha) {
          setAbhaValue(
            patient.abha.mobile || patient.abha.abha || patient.abha.aadhar
          );
          if (patient.abha.ismobile) setAbhaMode("mobile");
          else if (patient.abha.isaadhar) setAbhaMode("aadhaar");
          else setAbhaMode("abha");
        }

        // Set tests if exist
        if (patient.tests && patient.tests.length > 0) {
          setAddedTests(patient.tests);
        }

        // Set billing data if exists
        if (patient.billing) {
          setPayments(
            patient.billing.payments || [{ method: "Cash", amount: 0 }]
          );
          setDiscount(patient.billing.discount || { type: "%", value: 0 });
          setNote(patient.billing.note || "");
          setPaymentModeType(patient.billing.paymentModeType || "single");
          setIsBillingCompleted(true);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching patient:", err);
        toast.error("Failed to load patient data");
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId, setValue]);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const res = await getHospitalList();
        const list = Array.isArray(res)
          ? res
          : res?.data ?? res?.response ?? [];
        setHospitals(list);
      } catch (err) {
        console.error("Hospital Details API failed:", err);
      }
    };
    fetchHospitalDetails();
  }, []);

  const handleWhatsappAutoFill = (checked) => {
    setWhatsappSameAsMobile(checked);
    if (checked) {
      const mobileValue = watch("p_mobile");
      setValue("whatsappNumber", mobileValue);
    }
  };

  const barcodeOption = watch("barcodeOption");

  useEffect(() => {
    if (barcodeOption === "preprinted") {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [barcodeOption]);

  const handleBarcodeSave = () => {
    const generatedValue = `${sampleData.year}${sampleData.locationId}${sampleData.containerId}${sampleData.sampleId}`;
    setBarcodeGenerationValue(generatedValue);
    setValue("barcodeNumber", generatedValue, { shouldValidate: true });
    setShowPopup(false);
  };

  const [settings, setSettings] = useState({
    enableLocation: false,
    enableContainer: false,
    addYear: false,
    addDepartment: false,
    digitLength: "4",
    patientId: true,
  });

  const [sampleData] = useState({
    patientName: "Anand Kumar",
    patientCode: "HMI-123",
    testName: "CBC",
    year: "2025",
    locationId: "0001",
    containerId: "C-123",
    department: "Pathology",
    sampleId: "00000024",
  });

  const barcodeValue =
    (settings.addYear ? sampleData.year : "") +
    (settings.enableLocation ? sampleData.locationId : "") +
    (settings.enableContainer ? sampleData.containerId : "") +
    (settings.addDepartment ? sampleData.department : "") +
    (settings.digitLength
      ? sampleData.sampleId.slice(-settings.digitLength)
      : "");

  const handleCheckbox = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDigitChange = (e) => {
    setSettings((prev) => ({ ...prev, digitLength: e.target.value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB");
      return;
    }

    setPrescriptionFile(file);

    try {
      const formData = new FormData();
      formData.append("attatchfile", file);

      const response = await axios.post(
        "https://asrphleb.asrhospitalindia.in/trf/upload/upload-patient",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success("File uploaded successfully");
        setPrescriptionFile({ ...file, url: response.data.fileUrl });
      } else {
        toast.error("Upload failed");
        setPrescriptionFile(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
      setPrescriptionFile(null);
    }
  };

  const handleBillingSubmit = () => {
    if (payments.length === 0) {
      setBillingError(
        "Please add billing information before completing billing."
      );
      return;
    }

    setBillingError("");

    const opbillPayload = payments.map((p) => ({
      ptotal: receivable.toFixed(2),
      pdisc: discountValue.toFixed(2),
      pamt: totalPaid.toFixed(2),
      pamtrcv: receivable.toFixed(2),
      pamtdue: (receivable - totalPaid).toFixed(2),
      pamtmode: payments.length > 1 ? "Multiple" : "Single",
      pamtmthd: p.method || "UPI",
      pnote: p.note || "Payment received in full.",
      billstatus: receivable - totalPaid <= 0 ? "Paid" : "Pending",
    }));

    setIsBillingCompleted(true);
    setBillingData(opbillPayload);
  };

  const onSubmit = async (data) => {
    // if (!isBillingCompleted) {
    //   toast.error("Please fill the billing information before submitting");
    //   return;
    // }

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");

      const pptestPayload =
        addedTests.length > 0
          ? addedTests.map((test) => ({
              pop: data.opNumber || "",
              popno: data.registrationNumber || "",
              pipno: numberType || "",
              pscheme: data.schemeType || "",
              refdoc: data.referralDoctorName || "",
              pbarcode: data.barcodeNumber || test.uid || "",
              trfno: data.trfNumber || "",
              remark: data.remarks || note || "",
              attatchfile: prescriptionFile?.url,
            }))
          : [
              {
                pop: data.opNumber || "",
                popno: data.registrationNumber || "",
                pipno: numberType || "",
                pscheme: data.schemeType || "",
                refdoc: data.referralDoctorName || "",
                pbarcode: data.barcodeNumber,
                trfno: data.trfNumber || "",
                remark: data.remarks || note || "",
                attatchfile: prescriptionFile?.url,
              },
            ];

      let abhaPayload = [];

      if (abhaMode === "mobile") {
        abhaPayload = [
          {
            isaadhar: false,
            ismobile: true,
            aadhar: null,
            mobile: abhaValue || null,
            abha: null,
          },
        ];
      } else if (abhaMode === "abha") {
        abhaPayload = [
          {
            isaadhar: false,
            ismobile: false,
            aadhar: null,
            mobile: null,
            abha: abhaValue || null,
          },
        ];
      } else if (abhaMode === "aadhaar") {
        abhaPayload = [
          {
            isaadhar: true,
            ismobile: false,
            aadhar: abhaValue || null,
            mobile: null,
            abha: null,
          },
        ];
      }

      const shortcodesToSend = addedTests.map((t) => Number(t.id));

      const payload = {
        p_title: data.p_title,
        hospital_id: data.referralSource,
        city: data.city,
        state: data.state,
        p_name: data.p_name,
        p_age: data.p_age,
        p_gender: data.p_gender,
        p_regdate: data.p_regdate,
        p_mobile: data.p_mobile,
        p_image: p_image || patientData?.p_image,
        investigation_ids: shortcodesToSend,
        opbill: billingData,
        pptest: pptestPayload,
        abha: abhaPayload,
      };

      const response = await axios.put(
        `https://asrphleb.asrhospitalindia.in/api/v2/phleb/update-patient-infographic/${patientId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Success response:", response.data);
      toast.success("Patient updated successfully!");

      setTimeout(() => {
        navigate("/admin-view-patient-details");
      }, 2000);
    } catch (error) {
      console.error(
        "❌ Error response:",
        error.response?.data || error.message
      );
      toast.error("Failed to update patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (showPhotoCapture && !tempPhoto) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) videoRef.current.srcObject = mediaStream;
        })
        .catch((err) => console.error("Camera error:", err));
    }
  }, [showPhotoCapture, tempPhoto]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setTempPhoto(canvas.toDataURL("image/png"));
    }
  };

  const confirmPhoto = () => {
    setCapturedPhoto(tempPhoto);
    setTempPhoto(null);
    stopCamera();
    setShowPhotoCapture(false);
  };

  const cancelCapturePhoto = () => {
    stopCamera();
    setTempPhoto(null);
    setShowPhotoCapture(false);
  };

  const retakePhoto = () => {
    setTempPhoto(null);
  };

  const handleDelete = (index) => {
    setTests((prevTests) => prevTests.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading patient data...</div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-sm font-medium justify-start px-4 py-4 bg-gray-50 border-b shadow-lg">
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
            <li className="text-gray-500">Update Patient Details</li>
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
              Update ABHA Details
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
      )}

      <div className="w-full mt-16 px-4 space-y-4 text-sm">
        <ToastContainer />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Update Patient Details</h4>
          </div>

          {/* ABHA Verification Interface */}
          {/* <div className="px-6 pt-6">
            <div className="flex items-center justify-end space-x-4">
              <h3 className="text-lg font-medium text-gray-900 mb-0">
                ABHA Verification Interface
              </h3>
              <button
                type="button"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => setShowAbhaModal(true)}
              >
                Update ABHA
              </button>
            </div>
            <div className="mt-1 border-b border-gray-100"></div>
          </div> */}

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Hospital<span className="text-red-500">*</span>
              </label>
              <select
                {...register("referralSource", {
                  required: "Hospital is required",
                })}
                disabled
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Hospital</option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.hospitalname}
                  </option>
                ))}
              </select>
              {errors.referralSource && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.referralSource.message}
                </p>
              )}
            </div>

            {/* <div>
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
            </div> */}
            
          </div>

          {/* Rest of the form follows the same structure as AddPatientDetails */}
          {/* Contact and Identity */}
          <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">
              Contact and Identity<span className="text-red-500">*</span>
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number<span className="text-red-500">*</span>
              </label>
              <input
                {...register("p_mobile", {
                  required: true,
                  pattern: /^[0-9]{10}$/,
                })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter 10-digit mobile number"
              />
              {errors.p_mobile && (
                <p className="text-red-600 text-xs mt-1">
                  Must be exactly 10 digits
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <select
                {...register("p_title", { required: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Dr">Dr</option>
                <option value="Baby">Baby</option>
              </select>
              {errors.p_title && (
                <p className="text-red-600 text-xs mt-1">Title is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("p_name", {
                  required: "First name is required",
                  pattern: {
                    value: /^[A-Za-z\s.-]+$/,
                    message:
                      "Only alphabets, spaces, periods, and hyphens allowed",
                  },
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "First name cannot exceed 50 characters",
                  },
                  setValueAs: (v) => v?.trim(),
                })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter first name"
              />
              {errors.p_name && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.p_name.message}
                </p>
              )}
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("lastName", {
                  required: "Last name is required",
                  pattern: {
                    value: /^[A-Za-z\s.-]+$/,
                    message:
                      "Only alphabets, spaces, periods, and hyphens allowed",
                  },
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Last name cannot exceed 50 characters",
                  },
                  setValueAs: (v) => v?.trim(),
                })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender<span className="text-red-500">*</span>
              </label>
              <select
                {...register("p_gender", { required: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="TS">TS</option>
                <option value="TG">TG</option>
              </select>
              {errors.p_gender && (
                <p className="text-red-600 text-xs mt-1">Gender is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("p_regdate", {
                  required: "Date is required",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    return (
                      selectedDate <= today || "Date cannot be in the future"
                    );
                  },
                })}
                max={formattedDate}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.p_regdate && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.p_regdate.message}
                </p>
              )}
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth<span className="text-red-500">*</span>
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
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("p_age", {
                  required: true,
                  min: 0,
                  max: 100,
                })}
                value={age}
                readOnly
                className="w-full border px-3 py-2 rounded bg-gray-100"
                placeholder="Auto-calculated"
              />
              {errors.p_age && (
                <p className="text-red-600 text-xs mt-1">
                  Age must be between 0-100
                </p>
              )}
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Blood Group<span className="text-red-500">*</span>
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
            </div> */}
          </div>

          {/* ID Proof Details */}
          {/* <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">
              ID Proof Details<span className="text-red-500">*</span>
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register("idType", {
                  required: "ID Type is required",
                })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select ID Type</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
              </select>
              {errors.idType && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.idType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register("idNumber", {
                  required: "ID Number is required",
                  validate: (value, formValues) => {
                    if (formValues.idType === "Aadhaar") {
                      return (
                        /^[0-9]{12}$/.test(value) ||
                        "Aadhaar must be exactly 12 digits"
                      );
                    } else if (formValues.idType === "PAN") {
                      return (
                        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
                          value.toUpperCase()
                        ) || "PAN must be 10 characters (e.g., ABCDE1234F)"
                      );
                    }
                    return true;
                  },
                  setValueAs: (v) => v?.trim().toUpperCase(),
                })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter ID Number"
              />
              {errors.idNumber && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.idNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div> */}

          {/* <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp Number<span className="text-red-500">*</span>
              </label>
              <div className="flex mt-2 items-center space-x-2">
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
                Photo Capture<span className="text-red-500">*</span>
              </label>

              <div className="border mt-2 p-2 w-full rounded flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setCapturedPhoto(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="text-sm flex-1"
                />

                <button
                  type="button"
                  onClick={() => {
                    setTempPhoto(null);
                    setShowPhotoCapture(true);
                  }}
                  className="flex items-center bg-white px-3 py-2 rounded text-sm space-x-2 
             transform transition-transform duration-200 hover:scale-105"
                >
                  <img
                    src="capture-new.png"
                    alt="Capture Icon"
                    className="w-5 h-5"
                  />
                  <span className="text-black">Capture Photo</span>
                </button>
              </div>

              {p_image && (
                <div className="mt-2 relative flex justify-center items-center mt-4 bg-[#efefef] py-4">
                  <img
                    src={p_image}
                    alt="Captured"
                    className="w-124 h-124 object-cover rounded"
                  />
                  <button
                    onClick={() => setCapturedPhoto(null)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}

              {showPhotoCapture && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    {!tempPhoto ? (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          className="w-[500px] h-[400px] rounded"
                        />
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={capturePhoto}
                            className="bg-white-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                          >
                            <img
                              src="focus.gif"
                              alt="Capture Icon"
                              className="w-8 h-8"
                            />
                            <span className="text-black">Capture</span>
                          </button>

                          <button
                            onClick={() => {
                              stopCamera();
                              setShowPhotoCapture(false);
                            }}
                            className="bg-white-600 text-white px-4 py-2 rounded  flex items-center space-x-2"
                          >
                            <img
                              src="cancel.png"
                              alt="Capture Icon"
                              className="w-5 h-5"
                            />
                            <span className="text-black">Cancel</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={tempPhoto}
                          alt="Preview"
                          className="w-[500px] h-[400px] object-cover rounded"
                        />
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={confirmPhoto}
                            className="bg-white-600 text-white px-4 py-2 rounded  flex items-center space-x-2"
                          >
                            <img
                              src="checkmark.png"
                              alt="Capture Icon"
                              className="w-5 h-5"
                            />
                            <span className="text-black">Use Photo</span>
                          </button>

                          <button
                            onClick={retakePhoto}
                            className="bg-white-600 text-white px-4 py-2 rounded  flex items-center space-x-2"
                          >
                            <img
                              src="arrow.png"
                              alt="Capture Icon"
                              className="w-5 h-5"
                            />
                            <span className="text-black">Retake</span>
                          </button>

                          <button
                            onClick={cancelCapturePhoto}
                            className="bg-white-600 text-white px-4 py-2 rounded  flex items-center space-x-2"
                          >
                            <img
                              src="cancel.png"
                              alt="Capture Icon"
                              className="w-5 h-5"
                            />
                            <span className="text-black">Cancel</span>
                          </button>
                        </div>
                      </>
                    )}
                    <canvas ref={canvasRef} className="hidden"></canvas>
                  </div>
                </div>
              )}
            </div>
          </div> */}

          {/* Photo Capture Section - Keep this as p_image has data */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Photo Capture<span className="text-red-500">*</span>
              </label>

              <div className="border mt-2 p-2 w-full rounded flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setCapturedPhoto(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="text-sm flex-1"
                />

                <button
                  type="button"
                  onClick={() => {
                    setTempPhoto(null);
                    setShowPhotoCapture(true);
                  }}
                  className="flex items-center bg-white px-3 py-2 rounded text-sm space-x-2 
             transform transition-transform duration-200 hover:scale-105"
                >
                 <img
  src="/capture-new.png"
  alt="Capture Icon"
  className="w-5 h-5"
/>
<span className="text-black">Capture Photo</span>

                </button>
              </div>

              {p_image && (
                <div className="mt-2 relative flex justify-center items-center mt-4 bg-[#efefef] py-4">
                  <img
                    src={p_image}
                    alt="Captured"
                    className="w-124 h-124 object-cover rounded"
                  />
                  <button
                    onClick={() => setCapturedPhoto(null)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}

              {showPhotoCapture && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    {!tempPhoto ? (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          className="w-[500px] h-[400px] rounded"
                        />
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={capturePhoto}
                            className="bg-white-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                          >
                            <img
                              src="focus.gif"
                              alt="Capture Icon"
                              className="w-8 h-8"
                            />
                            <span className="text-black">Capture</span>
                          </button>

                          <button
                            onClick={() => {
                              stopCamera();
                              setShowPhotoCapture(false);
                            }}
                            className="bg-white-600 text-white px-4 py-2 rounded  flex items-center space-x-2"
                          >
                            <img
                              src="cancel.png"
                              alt="Capture Icon"
                              className="w-5 h-5"
                            />
                            <span className="text-black">Cancel</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={tempPhoto}
                          alt="Preview"
                          className="w-[500px] h-[400px] object-cover rounded"
                        />
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={confirmPhoto}
                            className="bg-white-600 text-white px-4 py-2 rounded  flex items-center space-x-2"
                          >
                            <img
                              src="checkmark.png"
                              alt="Capture Icon"
                              className="w-5 h-5"
                            />
                            <span className="text-black">Use Photo</span>
                          </button>

                          <button
                            onClick={retakePhoto}
                            className="bg-white-600 text-white px-4 py-2 rounded  flex items-center space-x-2"
                          >
                            <img
                              src="arrow.png"
                              alt="Capture Icon"
                              className="w-5 h-5"
                            />
                            <span className="text-black">Retake</span>
                          </button>

                          <button
                            onClick={cancelCapturePhoto}
                            className="bg-white-600 text-white px-4 py-2 rounded  flex items-center space-x-2"
                          >
                            <img
                              src="cancel.png"
                              alt="Capture Icon"
                              className="w-5 h-5"
                            />
                            <span className="text-black">Cancel</span>
                          </button>
                        </div>
                      </>
                    )}
                    <canvas ref={canvasRef} className="hidden"></canvas>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Guardian Information */}
          {/* <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">
              Guardian Information<span className="text-red-500">*</span>
              <span className="ml-2 text-sm font-normal text-gray-400">
                (required if patient is minor or elderly)
              </span>
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name<span className="text-red-500">*</span>
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
                Mobile<span className="text-red-500">*</span>
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
                Address (Optional)<span className="text-red-500">*</span>
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
          </div> */}

          {/* Address Details - Keep only city and state as they have data */}
          <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">
              Address Details<span className="text-red-500">*</span>
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Street<span className="text-red-500">*</span>
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
                {...register("landmark", {
                  maxLength: {
                    value: 100,
                    message: "Landmark cannot exceed 100 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z0-9\s.,'-]*$/,
                    message: "Invalid characters in Landmark",
                  },
                  setValueAs: (v) => v?.trim(),
                })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter landmark"
              />
              {errors.landmark && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.landmark.message}
                </p>
              )}
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                {...register("city", {
                  required: "City is required",
                  maxLength: {
                    value: 50,
                    message: "City cannot exceed 50 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "City must contain only letters and spaces",
                  },
                  setValueAs: (v) => v?.trim(),
                })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                State<span className="text-red-500">*</span>
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

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                PIN Code<span className="text-red-500">*</span>
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
            </div> */}
          </div>

          {/* Communication Preferences */}
          {/* <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">
              Communication Preferences<span className="text-red-500">*</span>
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
          </div> */}

          {/* Barcode Management */}
          {/* <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">
              Barcode Management<span className="text-red-500">*</span>
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
                Sample Type<span className="text-red-500">*</span>
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
                Barcode Number<span className="text-red-500">*</span>
              </label>
              <input
                {...register("barcodeNumber", {
                  required: "Barcode Number is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Barcode must contain only digits",
                  },
                  minLength: {
                    value: 6,
                    message: "Barcode must be at least 6 digits",
                  },
                  maxLength: {
                    value: 20,
                    message: "Barcode cannot exceed 20 digits",
                  },
                })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter barcode number"
              />
              {errors.barcodeNumber && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.barcodeNumber.message}
                </p>
              )}
            </div>
          </div> */}

          {/* Submit Button */}
          <div className="px-8 py-6 border-t bg-gray-50 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded"
            >
              {isSubmitting ? "Updating..." : "Update Patient"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdatePatientDetails;
