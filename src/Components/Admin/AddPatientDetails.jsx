import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Barcode from "react-barcode";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import { getHospitalList } from "../../services/apiService";
import { XCircleIcon } from "@heroicons/react/24/outline";

const AddPatientDetails = () => {
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
  // Format today's date as YYYY-MM-DD
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

  // Billing states
  const [pdisc, setDiscount] = useState({ type: "%", value: 0 });
  const [amountReceived, setAmountReceived] = useState(0);
  const [note, setNote] = useState("");
  const [payments, setPayments] = useState([{ method: "Cash", amount: 0 }]);
  const [paymentModeType, setPaymentModeType] = useState("single"); // single or multiple
  // Tab state
  const [activeTab, setActiveTab] = useState("investigation");

  // State for obbill if needed
  const [obbill, setObbill] = useState(0);
  const [billingError, setBillingError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [barcodeGenerationValue, setBarcodeGenerationValue] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [apiError, setApiError] = useState("");
  const [patientData, setPatientData] = useState(null);
  // Example: calculate obbill whenever receivable or totalPaid changes
  const [patientList, setPatientList] = useState([]);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBillingCompleted, setIsBillingCompleted] = useState(false);

  // Handle payment mode changes
  useEffect(() => {
    if (paymentModeType === "single" && payments.length > 1) {
      // Keep only the first payment method when switching to single mode
      setPayments([payments[0]]);
    }
  }, [paymentModeType]);

  const handleAddBill = (bill) => {
    const updated = [...billingItems, bill];
    setBillingItems(updated);
    if (onBillingChange) onBillingChange(updated);
  };

  // Fetch test profiles from the API

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

      // ✅ Append to addedTests instead of replacing tests
      setAddedTests((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const uniqueNew = data.filter((t) => !existingIds.has(t.id));
        return [...prev, ...uniqueNew];
      });

      setShortCodeInput(""); // clear input after adding
    } catch (err) {
      console.error("Error fetching tests:", err);
      setError(err.response?.data?.message || "Failed to fetch tests.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTest = (id) => {
    console.log("uid", id);

    setAddedTests((prev) => prev.filter((t) => t.id !== id));
  };

  // const ptotal = addedTests.reduce((sum, t) => sum + t.walkinprice, 0);

  const ptotal = addedTests.reduce((sum, test) => {
    return sum + Number(test.normalprice || 0);
  }, 0);

  console.log("ptotal==", ptotal);

  const discountValue =
    pdisc.type === "%" ? (ptotal * pdisc.value) / 100 : pdisc.value;
  const receivable = ptotal - discountValue;

  const totalPaid =
    paymentModeType === "single"
      ? payments[0]?.amount || 0
      : payments.reduce((sum, payment) => sum + payment.amount, 0);

  const dueAmount = receivable - totalPaid;

  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file && file.size <= 2 * 1024 * 1024) {
  //     setPrescriptionFile(file);
  //   } else {
  //     alert("File too large (max 2MB)");
  //     e.target.value = null;
  //   }
  // };

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

  // Fetch hospitaldetails

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const res = await getHospitalList();
        // handle either plain array or object with data/response
        const list = Array.isArray(res)
          ? res
          : res?.data ?? res?.response ?? [];
        setHospitals(list); // ✅ set state
      } catch (err) {
        console.error("Hospital Details API failed:", err);
      }
    };
    fetchHospitalDetails(); // ✅ call it
  }, []);

  // Auto-fill WhatsApp number when checkbox is checked
  const handleWhatsappAutoFill = (checked) => {
    setWhatsappSameAsMobile(checked);
    if (checked) {
      const mobileValue = watch("p_mobile");
      setValue("whatsappNumber", mobileValue);
    }
  };

  {
    /* Barcode geenration  */
  }

  // Watch for changes in barcodeOption
  const barcodeOption = watch("barcodeOption");

  // Open popup if "preprinted" is selected
  useEffect(() => {
    if (barcodeOption === "preprinted") {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [barcodeOption]);

  const mobileNumber = watch("p_mobile");
  const selectedPatientId = watch("selectedPatientId");

  const fetchPatientData = async (phone) => {
    setLoading(true);
    setApiError("");
    try {
      const response = await axios.get(
        `https://asrphleb.asrhospitalindia.in/api/v2/phleb/get-data-mobile?phone=${phone}`
      );
      setPatientList(response.data || []);
    } catch (err) {
      setPatientList([]);
      setApiError("No patient found or API error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mobileNumber && /^[0-9]{10}$/.test(mobileNumber)) {
      fetchPatientData(mobileNumber);
    } else {
      setPatientList([]);
    }
  }, [mobileNumber]);

  useEffect(() => {
    if (selectedPatientId) {
      const selected = patientList.find(
        (p) => String(p.id) === selectedPatientId
      );
      if (selected) {
        setValue("p_name", selected.p_name || "");
        setValue("lastName", selected.p_lname || "");
      }
    }
  }, [selectedPatientId, patientList, setValue]);

  // Effect to watch the mobile number input
  useEffect(() => {
    if (mobileNumber && /^[0-9]{10}$/.test(mobileNumber)) {
      fetchPatientData(mobileNumber);
    } else {
      setPatientData(null); // Reset if invalid
    }
  }, [mobileNumber]);

  const handleBarcodeSave = () => {
    // Suppose barcodeValue is already generated (from your logic)
    const generatedValue = `${sampleData.year}${sampleData.locationId}${sampleData.containerId}${sampleData.sampleId}`;
    console.log("generatedValue==", generatedValue);

    setBarcodeGenerationValue(generatedValue);

    // Push that value into react-hook-form field
    // setValue("barcodeNumber", generatedValue);
    setValue("barcodeNumber", generatedValue, { shouldValidate: true });

    // Close popup (optional)
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
    patientName: "Anand  Kumar",
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
        // Update file with S3 URL
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

  // const handleBillingSubmit = () => {
  //   if (payments.length === 0) {
  //     toast.error("Please add billing information before completing billing.");
  //     return;
  //   }
  //   setIsBillingCompleted(true);
  // };

  // const handleBillingSubmit = () => {
  //   if (payments.length === 0) {
  //     setBillingError(
  //       "Please add billing information before completing billing."
  //     );
  //     return;
  //   }

  //   setBillingError("");

  //   const opbillPayload = payments.map((p) => ({
  //     ptotal: ptotal.toFixed(2),
  //     pdisc: discountValue.toFixed(2),
  //     pamt: receivable.toFixed(2),
  //     pamtrcv: p.amount.toFixed(2),
  //     pamtdue: (receivable - totalPaid).toFixed(2),
  //     pamtmode: payments.length > 1 ? "Multiple" : "Single",
  //     pamtmthd: p.method || "UPI",
  //     pnote: p.note || "Payment received",
  //     billstatus: receivable - totalPaid <= 0 ? "Paid" : "Pending",
  //   }));

  //   console.log("opbillPayload ===", opbillPayload);

  //   setIsBillingCompleted(true);
  //   setBillingData(opbillPayload);
  // };

  const handleBillingSubmit = () => {
    if (payments.length === 0) {
      setBillingError(
        "Please add billing information before completing billing."
      );
      return;
    }
  
    setBillingError("");
  
    const opbillPayload = payments.map((p) => ({
      ptotal: receivable.toFixed(2),              // ✅ Total Amount
      pdisc: discountValue.toFixed(2),            // ✅ Discount
      pamt: totalPaid.toFixed(2),                 // ✅ Total Paid
      pamtrcv: receivable.toFixed(2),             // ✅ Receivable
      pamtdue: (receivable - totalPaid).toFixed(2), // ✅ Due Amount
      pamtmode: payments.length > 1 ? "Multiple" : "Single",
      pamtmthd: p.method || "UPI",
      pnote: p.note || "Payment received in full.",
      billstatus: receivable - totalPaid <= 0 ? "Paid" : "Pending",
    }));
  
    console.log("opbillPayload ===", opbillPayload);
  
    setIsBillingCompleted(true);
    setBillingData(opbillPayload);
  };
  

  const onSubmit = async (data) => {
    if (!isBillingCompleted) {
      toast.error("Please fill the billing information before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const hospitalName = localStorage.getItem("hospital_name");
      const nodalname = localStorage.getItem("nodalname");
      const authToken = localStorage.getItem("authToken");

      // Calculate billing totals
      const ptotal = addedTests.reduce((sum, t) => sum + t.walkinprice, 0);
      const discountValue =
        pdisc.type === "%" ? (ptotal * pdisc.value) / 100 : pdisc.value;
      const receivable = ptotal - discountValue;
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      const dueAmount = receivable - totalPaid;

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

      console.log("pptestPayload==", pptestPayload);

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

      console.log("t.addedTests ", addedTests);

      const shortcodesToSend = addedTests.map((t) => Number(t.id));

      console.log("shortcodesToSend ", shortcodesToSend);

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
        p_image:
          "https://asrtrfs.s3.ap-south-1.amazonaws.com/patients/b71d7980-03bd-4123-a28a-b4515dd55ae1-Learning Steps of a Programming language.png", // optional
        investigation_ids: shortcodesToSend,
        opbill: billingData,
        pptest: pptestPayload,
        abha: abhaPayload,
      };
      console.log("paylaod ", payload);

      const response = await axios.post(
        `https://asrphleb.asrhospitalindia.in/api/v2/phleb/create-patient`,

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
        navigate("/admin-view-patient-details");
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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Start camera when modal opens
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

  // Stop camera safely
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
    stopCamera(); // camera stops here
    setShowPhotoCapture(false);
  };
  const cancelCapturePhoto = () => {
    stopCamera(); // stop the webcam
    setTempPhoto(null); // clear any temporary captured photo
    setShowPhotoCapture(false); // close the modal
  };
  const retakePhoto = () => {
    setTempPhoto(null);
  };

  const handleDelete = (index) => {
    setTests((prevTests) => prevTests.filter((_, i) => i !== index));
  };

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
            <div className="flex items-center justify-end space-x-4">
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
            </div>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Hospital
              </label>
              <select
                {...register("referralSource", {
                  required: "Hospital is required",
                })}
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
                Centre Name
              </label>
              <input
                type="text"
                {...register("centreName", { required: true, maxLength: 100 })}
                className="w-full border px-3 py-2 rounded bg-gray-100"
                placeholder=""
              />
              {errors.centreName && (
                <p className="text-red-600 text-xs mt-1">
                  Centre name is required
                </p>
              )}
            </div> */}

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
          {/* <div className="px-6 pt-6">
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
          </div> */}

          {/* Contact and Identity */}
          <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">
              Contact and Identity
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
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

              {loading && (
                <p className="text-gray-500">Loading patient data...</p>
              )}
              {apiError && <p className="text-red-600">{apiError}</p>}

              {patientData && (
                <div className="bg-gray-100 p-4 rounded shadow">
                  <h3 className="font-semibold text-lg">Patient Data:</h3>
                  <pre>{JSON.stringify(patientData, null, 2)}</pre>
                </div>
              )}
            </div>

            {patientList.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Patient
                </label>
                <select
                  {...register("selectedPatientId", { required: true })}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">-- Select Patient --</option>
                  {patientList.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.p_name} ({patient.city}, {patient.state})
                    </option>
                  ))}
                </select>
                {errors.selectedPatientId && (
                  <p className="text-red-600 text-xs mt-1">
                    Please select a patient
                  </p>
                )}
              </div>
            )}

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
              {errors.title && (
                <p className="text-red-600 text-xs mt-1">Title is required</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                {...register("p_name", {
                  required: true,
                  pattern: /^[A-Za-z\s.]+$/,
                })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.patientName && (
                <p className="text-red-600 text-xs mt-1">
                  First name is required
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
                {...register("p_gender", { required: true })}
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
                Registration Date
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
                defaultValue={formattedDate}
                max={formattedDate}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.p_regdate && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.p_regdate.message}
                </p>
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
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp Number
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
                Photo Capture
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

          {/* Barcode Generatin  */}

          {showPopup && (
            // 🔹 Fullscreen dark overlay
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              {/* 🔹 Your popup box */}
              <div className="flex gap-6 p-6 bg-gradient-to-br from-green-100 via-white to-green-50 rounded-2xl shadow-2xl w-[90%] max-w-6xl min-h-[70vh] relative">
                {/* Close button (top-right corner) */}
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
                >
                  ✕
                </button>

                {/* Left Panel */}
                <div className="w-1/4 bg-white/90 backdrop-blur border rounded-2xl shadow-xl p-5 space-y-5">
                  <h2 className="text-lg font-semibold text-green-600 border-b pb-2">
                    Barcode Settings
                  </h2>

                  {[
                    {
                      key: "patientId",
                      label: "Add Patient ID",
                      disabled: true,
                      preSelected: true,
                    },
                    { key: "enableLocation", label: "Enable Hospital ID" },
                    { key: "enableContainer", label: "Enable Container ID" },
                    { key: "addYear", label: "Add Current Year" },
                    { key: "addDepartment", label: "Add Department" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-3 cursor-pointer hover:bg-green-50 rounded-lg p-2 transition"
                    >
                      <input
                        type="checkbox"
                        checked={settings[item.key]}
                        onChange={() => handleCheckbox(item.key)}
                        className="w-4 h-4 accent-green-600"
                      />
                      <span className="text-gray-700">{item.label}</span>
                    </label>
                  ))}

                  <div>
                    <label className="block mb-1 font-medium text-gray-600">
                      Digit Length
                    </label>
                    <select
                      value={settings.digitLength}
                      onChange={handleDigitChange}
                      className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>

                  <button
                    onClick={handleBarcodeSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full shadow transition"
                  >
                    Save
                  </button>
                </div>

                {/* Right Panel */}
                <div className="w-3/4 bg-white/90 backdrop-blur border rounded-2xl shadow-xl p-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Barcode Preview
                  </h2>

                  <table className="w-full border mb-6 text-center rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-green-50 text-green-600 font-semibold">
                        {settings.addYear && <th className="p-2">Year</th>}
                        {settings.enableLocation && (
                          <th className="p-2">Location ID</th>
                        )}
                        {settings.enableContainer && (
                          <th className="p-2">Container ID</th>
                        )}
                        {settings.addDepartment && (
                          <th className="p-2">Department</th>
                        )}
                        <th className="p-2">Sample ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="font-medium text-gray-700">
                        {settings.addYear && <td>{sampleData.year}</td>}
                        {settings.enableLocation && (
                          <td>{sampleData.locationId}</td>
                        )}
                        {settings.enableContainer && (
                          <td>{sampleData.containerId}</td>
                        )}
                        {settings.addDepartment && (
                          <td>{sampleData.department}</td>
                        )}
                        <td>{sampleData.sampleId}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Patient Info */}
                  <div className="text-center mb-4">
                    <span className="font-semibold text-gray-800">
                      {sampleData.patientName}
                    </span>{" "}
                    <span className="text-gray-500">
                      ({sampleData.patientCode})
                    </span>
                  </div>

                  {/* Barcode */}
                  {barcodeValue ? (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="bg-gradient-to-r from-green-100 to-green-50 border rounded-lg p-4 shadow-inner">
                        {/* Make sure you imported Barcode from "react-barcode" */}
                        <Barcode value={barcodeValue} height={60} />
                      </div>
                      <div className="text-gray-700 font-medium">
                        {barcodeValue}
                      </div>
                      <div className="text-green-600 font-semibold">
                        {sampleData.testName}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 italic">
                      Select at least one option to generate barcode
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Barcode Generatin  */}

          <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-center text-gray-900 mb-0">
              Payment Mode Selection
            </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>

          <Tabs value="react">
            <TabsHeader
              className="p-2 rounded"
              style={{ background: "#eef6f7" }}
            >
              <Tab value="react">PP MODE</Tab>
              <Tab value="html">PAID MODE </Tab>
            </TabsHeader>

            <TabsBody>
              <TabPanel value="react">
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
                      onChange={(e) => setNumberType(e.target.value)}
                      value={numberType}
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
                      {...register("barcodeNo")}
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      TRF Number
                    </label>
                    <input
                      {...register("trfNumber")}
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <textarea
                      {...register("remarks")}
                      rows="3"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="html">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto my-8">
                  <div className="p-6 bg-gray-50 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Patient Test & Billing System
                    </h2>
                  </div>

                  {/* Tabs Navigation */}
                  <div className="flex border-b">
                    <button
                      className={`flex-1 py-4 px-6 text-center font-medium text-lg ${
                        activeTab === "investigation"
                          ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("investigation");
                      }}
                    >
                      Add Test
                    </button>
                    <button
                      className={`flex-1 py-4 px-6 text-center font-medium text-lg ${
                        activeTab === "billing"
                          ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("billing");
                      }}
                    >
                      Billing
                    </button>
                  </div>

                  {/* Investigation Section */}
                  {activeTab === "investigation" && (
                    <div className="p-6 space-y-6">
                      {error && <p className="text-red-600">{error}</p>}

                      {/* Add Test Forms */}
                      <div className="items-center w-full p-8">
                        {/* Add by Shortcode */}
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-800">
                              Add Tests by Code
                            </h3>

                            <button
                              type="button"
                              onClick={handleShortCodeAdd}
                              className="min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                            >
                              Add Tests
                            </button>
                          </div>

                          <form
                            onSubmit={(e) => e.preventDefault()}
                            className="space-y-3"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter Test Codes (comma separated):
                              </label>
                              <input
                                value={shortCodeInput}
                                onChange={(e) =>
                                  setShortCodeInput(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. CBC, BMP, LIPID, 11 , 55"
                              />
                            </div>
                          </form>
                        </div>

                        {/* Add by Dropdown or Code */}
                        {/* <div className="bg-gray-50 p-4 rounded-lg border">
                          <h3 className="text-lg font-medium text-gray-800 mb-3">
                            Add Single Test
                          </h3>
                          <form onSubmit={handleAddTest} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Test:
                              </label>
                              <select
                                value={selectedProfile}
                                onChange={(e) =>
                                  setSelectedProfile(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">-- Select a Test --</option>
                                {tests.map((test) => (
                                  <option key={test.id} value={test.id}>
                                    {test.testname} ({test.shortname}) - ₹
                                    {test.walkinprice}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="text-center text-gray-500">OR</div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter Test Code:
                              </label>
                              <input
                                type="text"
                                value={testCodeInput}
                                onChange={(e) =>
                                  setTestCodeInput(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. CBC, BMP"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={handleAddTest}
                              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded"
                            >
                              Add Test
                            </button>
                          </form>
                        </div> */}
                      </div>

                      {/* Tests Table */}
                      {addedTests.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    SL No
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Test Name
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Short Code
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Amount
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {addedTests.map((test, index) => (
                                  <tr key={test.uid}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                      {index + 1}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                      {test.testname}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                      {test.shortcode}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                      ₹{test.normalprice}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                      <button
                                        onClick={() =>
                                          handleRemoveTest(test.id)
                                        }
                                        className="text-red-600 hover:text-red-800 font-medium"
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-gray-50">
                                <tr>
                                  <td
                                    colSpan="7"
                                    className="px-6 py-3 text-right text-sm font-medium text-gray-700"
                                  >
                                    Total
                                  </td>
                                  <td className="px-6 py-3 text-sm font-medium text-gray-700">
                                    ₹{ptotal}
                                  </td>
                                  <td className="px-6 py-3"></td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-6">
                          {tests.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed rounded-lg">
                              <p className="text-gray-500">
                                No tests added yet. Please add tests using the
                                forms above.
                              </p>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      ID
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Test Name
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Test Code
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Price
                                    </th>
                                    <th
                                      scope="col"
                                      className="relative px-6 py-3"
                                    >
                                      <span className="sr-only">Delete</span>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {tests.map((test, index) => (
                                    <tr key={test.id || index}>
                                      <td className="px-6 py-4 whitespace-nowrap text-base text-blue-800 bg-blue-100 px-2 py-1 rounded">
                                        {index + 1}
                                      </td>

                                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-blue-800 bg-blue-100 px-2 py-1 rounded">
                                        {test.testname}
                                      </td>

                                      <td className="px-6 py-4 whitespace-nowrap text-base text-blue-800 bg-blue-100 px-2 py-1 rounded">
                                        {test.shortcode}
                                      </td>

                                      <td className="px-6 py-4 whitespace-nowrap text-base text-blue-800 bg-blue-100 px-2 py-1 rounded">
                                        {test.normalprice}
                                      </td>

                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded">
                                        <button
                                          onClick={() => handleDelete(index)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <XCircleIcon className="h-5 w-5 inline" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {/* Billing Section */}
                  {activeTab === "billing" && (
                    <div className="p-6 space-y-6">
                      {/* Summary Card */}
                      <div className="bg-gray-50 p-4 rounded-lg border grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="border-r border-gray-200 pr-4">
                          <h3 className="text-sm font-medium text-gray-500">
                            Total Amount
                          </h3>
                          <p className="text-xl font-bold">₹{ptotal}</p>
                        </div>
                        <div className="border-r border-gray-200 pr-4">
                          <h3 className="text-sm font-medium text-gray-500">
                            Discount ({pdisc.type})
                          </h3>
                          <p className="text-xl font-bold">
                            {pdisc.value} {pdisc.type === "%" ? "" : "₹"}
                          </p>
                        </div>
                        <div className="border-r border-gray-200 pr-4">
                          <h3 className="text-sm font-medium text-gray-500">
                            Receivable
                          </h3>
                          <p className="text-xl font-bold text-blue-600">
                            ₹{receivable}
                          </p>
                        </div>
                        <div className="border-r border-gray-200 pr-4">
                          <h3 className="text-sm font-medium text-gray-500">
                            Total Paid
                          </h3>
                          <p className="text-xl font-bold text-green-600">
                            ₹{totalPaid}
                          </p>
                        </div>
                        <div className="">
                          <h3 className="text-sm font-medium text-gray-500">
                            Due Amount
                          </h3>
                          <p
                            className={`text-xl font-bold ${
                              dueAmount > 0 ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            ₹{dueAmount}
                          </p>
                        </div>
                      </div>

                      {/* Discount Controls */}
                      <div className="bg-white border rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">
                          Discount
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Discount Type
                            </label>
                            <select
                              value={pdisc.type}
                              onChange={(e) =>
                                setDiscount({ ...pdisc, type: e.target.value })
                              }
                              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="%">Percentage (%)</option>
                              <option value="₹">Fixed Amount (₹)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Discount Value
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={pdisc.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                setDiscount({
                                  ...pdisc,
                                  value: value === "" ? "" : Number(value),
                                });
                              }}
                              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setDiscount({ type: "%", value: 0 });
                              }}
                              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
                            >
                              Reset Discount
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Payment Mode Section */}
                      <div className="bg-white border rounded-lg p-4 mb-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">
                          Payment Mode
                        </h3>
                        <div className="flex space-x-6">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="single-payment"
                              name="paymentModeType"
                              value="single"
                              checked={paymentModeType === "single"}
                              onChange={(e) =>
                                setPaymentModeType(e.target.value)
                              }
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <label
                              htmlFor="single-payment"
                              className="ml-2 text-sm font-medium text-gray-700"
                            >
                              Single
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="multiple-payment"
                              name="paymentModeType"
                              value="multiple"
                              checked={paymentModeType === "multiple"}
                              onChange={(e) =>
                                setPaymentModeType(e.target.value)
                              }
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <label
                              htmlFor="multiple-payment"
                              className="ml-2 text-sm font-medium text-gray-700"
                            >
                              Multiple
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Payments Section */}
                      <div className="bg-white border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-medium text-gray-800">
                            Payments
                          </h3>
                          {paymentModeType === "multiple" && (
                            <button
                              onClick={addPaymentMethod}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              + Add Payment
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          {(paymentModeType === "single"
                            ? payments.slice(0, 1)
                            : payments
                          ).map((payment, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4"
                            >
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Method
                                </label>
                                <select
                                  value={payment.method}
                                  onChange={(e) => {
                                    const newPayments = [...payments];
                                    newPayments[index].method = e.target.value;
                                    setPayments(newPayments);
                                  }}
                                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option>Cash</option>
                                  <option>Credit</option>
                                  <option>Card</option>
                                  <option>UPI</option>
                                  <option>Cheque</option>
                                  <option>Bank Transfer</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Amount
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={
                                    payment.amount === 0 ? "" : payment.amount
                                  }
                                  onChange={(e) => {
                                    const newPayments = [...payments];
                                    newPayments[index].amount =
                                      e.target.value === ""
                                        ? 0
                                        : Number(e.target.value);
                                    setPayments(newPayments);
                                  }}
                                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Amount"
                                />
                              </div>
                              <div className="flex items-end justify-end">
                                {paymentModeType === "multiple" &&
                                  payments.length > 1 && (
                                    <button
                                      onClick={() => {
                                        const newPayments = [...payments];
                                        newPayments.splice(index, 1);
                                        setPayments(newPayments);
                                      }}
                                      className="text-red-600 hover:text-red-800 px-3 py-1"
                                    >
                                      Remove
                                    </button>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes & File Upload */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Notes */}
                        <div className="bg-white border rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-800 mb-3">
                            Notes
                          </h3>
                          <textarea
                            rows="4"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Any additional notes..."
                            maxLength={200}
                          />
                        </div>

                        {/* File Upload */}
                        <div className="bg-white border rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-800 mb-3">
                            Prescription / TRF - Upload
                          </h3>
                          <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Upload (PDF/JPG/PNG, max 2MB)
                            </label>
                            {/* <div className="flex items-center gap-4">
                              <label className="block w-full">
                                <div className="border border-gray-300 border-dashed rounded-lg px-6 py-4 cursor-pointer hover:bg-gray-50 transition">
                                  <div className="flex flex-col items-center justify-center gap-1">
                                    <svg
                                      className="h-10 w-10 text-gray-400"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                      />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-600">
                                      {prescriptionFile
                                        ? prescriptionFile.name
                                        : "Click to upload"}
                                    </span>
                                  </div>
                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                  />
                                </div>
                              </label>
                              {prescriptionFile && (
                                <button
                                  type="button"
                                  onClick={() => setPrescriptionFile(null)}
                                  className="text-red-600 hover:text-red-800 ml-2"
                                >
                                  Remove
                                </button>
                              )}
                            </div> */}

                            <div className="flex items-center gap-4">
                              <label className="block w-full">
                                <div className="border border-gray-300 border-dashed rounded-lg px-6 py-4 cursor-pointer hover:bg-gray-50 transition">
                                  <div className="flex flex-col items-center justify-center gap-1">
                                    <svg
                                      className="h-10 w-10 text-gray-400"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                      />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-600">
                                      {prescriptionFile
                                        ? prescriptionFile.name
                                        : "Click to upload"}
                                    </span>
                                  </div>
                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                  />
                                </div>
                              </label>
                              {prescriptionFile && (
                                <button
                                  type="button"
                                  onClick={() => setPrescriptionFile(null)}
                                  className="text-red-600 hover:text-red-800 ml-2"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            handleBillingSubmit();
                          }}
                        >
                          Complete Billing
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>

          {/* 
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
          </div> */}

          {/* <div>
            {paymentMode === "pp" && (
              <>
             
              </>
            )}
          </div> */}

          <div className="px-8 py-6 border-t bg-gray-50 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded"
            >
              {isSubmitting ? "Saving..." : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPatientDetails;
