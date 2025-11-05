<<<<<<< HEAD
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  Briefcase,
  Phone,
  FileText,
  Signature,
  ChevronDown,
  X,
  Upload as UploadIcon,
} from "lucide-react";

// CustomDropdown component
const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
}) => {
=======
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, Briefcase, Phone, FileText, Signature, ChevronDown, X, Upload as UploadIcon } from 'lucide-react';
import { viewDepartments } from "../../services/apiService";

// CustomDropdown component
const CustomDropdown = ({ options, value, onChange, placeholder, disabled = false, className = '' }) => {
>>>>>>> updated code
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
<<<<<<< HEAD
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
=======
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
>>>>>>> updated code
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border ${
<<<<<<< HEAD
          disabled ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700"
=======
          disabled ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700'
>>>>>>> updated code
        } border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
<<<<<<< HEAD
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
=======
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
>>>>>>> updated code
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
<<<<<<< HEAD
                value === option.value
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700"
=======
                value === option.value ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
>>>>>>> updated code
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// FileUpload component
<<<<<<< HEAD
const FileUpload = ({
  id,
  label,
  accept,
  multiple = false,
  maxSizeMB = 2,
  value,
  onChange,
  icon,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (file) => {
    const validTypes = accept.split(",").map((type) => type.trim());
    const fileType = file.type;
    const fileSizeMB = file.size / (1024 * 1024);
    const isAcceptedType = validTypes.some((type) => {
      if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type);
      return fileType === type || fileType.startsWith(type.split("/")[0]);
    });
    if (!isAcceptedType) return `File type not supported. Accepted: ${accept}`;
    if (fileSizeMB > maxSizeMB) return `File size exceeds ${maxSizeMB}MB limit`;
    return "";
=======
const FileUpload = ({ id, label, accept, multiple = false, maxSizeMB = 2, value, onChange, icon }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    const validTypes = accept.split(',').map((type) => type.trim());
    const fileType = file.type;
    const fileSizeMB = file.size / (1024 * 1024);
    const isAcceptedType = validTypes.some((type) => {
      if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type);
      return fileType === type || fileType.startsWith(type.split('/')[0]);
    });
    if (!isAcceptedType) return `File type not supported. Accepted: ${accept}`;
    if (fileSizeMB > maxSizeMB) return `File size exceeds ${maxSizeMB}MB limit`;
    return '';
>>>>>>> updated code
  };

  const processFiles = useCallback(
    (files) => {
      if (!files.length) return;
      const validFiles = [];
      const newErrors = [];
      files.forEach((file) => {
        const err = validateFile(file);
        if (err) newErrors.push(`${file.name}: ${err}`);
        else validFiles.push(file);
      });
      if (newErrors.length > 0) {
<<<<<<< HEAD
        setError(newErrors.join("\n"));
        setTimeout(() => setError(""), 5000);
      } else setError("");
=======
        setError(newErrors.join('\n'));
        setTimeout(() => setError(''), 5000);
      } else setError('');
>>>>>>> updated code

      if (validFiles.length > 0) {
        if (multiple) onChange([...(value || []), ...validFiles]);
        else onChange(validFiles[0]);
      }
    },
    [multiple, onChange, value]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleChangeInput = (e) => processFiles(Array.from(e.target.files));

  const removeFile = (index) => {
    if (multiple) {
      const newFiles = [...value];
      newFiles.splice(index, 1);
      onChange(newFiles);
    } else onChange(null);
  };

<<<<<<< HEAD
  const [fileUrls, setFileUrls] = useState({});

  useEffect(() => {
    const urls = {};
    const files = value ? (Array.isArray(value) ? value : [value]) : [];

    files.forEach((file, index) => {
      if (file instanceof File) {
        // Blob URL for new uploads
        urls[`${file.name}-${index}`] = URL.createObjectURL(file);
      } else if (typeof file === "string") {
        // Full URL for API data
        urls[`${file}-${index}`] = file.startsWith("http")
          ? file
          : `https://asrlabs.asrhospitalindia.in/${file}`;
      }
    });

    setFileUrls(urls);

    // Cleanup blob URLs only
    return () => {
      Object.values(urls).forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [value]);

  const renderPreview = () => {
    if (!value || (multiple && value.length === 0)) return null;
    const files = Array.isArray(value) ? value : [value];

    return (
      <div className="mt-3 space-y-2">
        {files.map((file, index) => {
          if (!file) return null;

          // Determine if the file is an image
          const isImage =
            file instanceof File
              ? file.type.startsWith("image/")
              : file.endsWith(".jpg") ||
                file.endsWith(".jpeg") ||
                file.endsWith(".png");

          // Use blob URL for File, or full URL for API string
          const fileUrl =
            file instanceof File
              ? fileUrls[`${file.name}-${index}`]
              : fileUrls[`${file}-${index}`] || file;

          return (
            <div
              key={`${file instanceof File ? file.name : file}-${index}`}
              className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex items-center space-x-2 truncate">
                {isImage && fileUrl ? (
                  <img
                    src={fileUrl}
                    alt="Preview"
                    className="w-8 h-8 object-cover rounded-md"
                  />
                ) : (
                  <div className="bg-gray-100 p-1.5 rounded-md">
                    <FileText className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <div className="truncate">
                  <span className="text-sm text-gray-700 block truncate max-w-xs">
                    {file instanceof File ? file.name : file.split("/").pop()}
                  </span>
                  {file instanceof File && (
                    <span className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)}MB
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    );
  };
=======
 const [fileUrls, setFileUrls] = useState({});

useEffect(() => {
  const urls = {};
  const files = value ? (Array.isArray(value) ? value : [value]) : [];

  files.forEach((file, index) => {
    if (file instanceof File) {
      // Blob URL for new uploads
      urls[`${file.name}-${index}`] = URL.createObjectURL(file);
    } else if (typeof file === 'string') {
      // Full URL for API data
      urls[`${file}-${index}`] = file.startsWith('http')
        ? file
        : `https://asrlabs.asrhospitalindia.in/${file}`;
    }
  });

  setFileUrls(urls);

  // Cleanup blob URLs only
  return () => {
    Object.values(urls).forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
  };
}, [value]);

 const renderPreview = () => {
  if (!value || (multiple && value.length === 0)) return null;
  const files = Array.isArray(value) ? value : [value];

  return (
    <div className="mt-3 space-y-2">
      {files.map((file, index) => {
        if (!file) return null;

        // Determine if the file is an image
        const isImage =
          file instanceof File
            ? file.type.startsWith('image/')
            : file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png');

        // Use blob URL for File, or full URL for API string
        const fileUrl =
          file instanceof File ? fileUrls[`${file.name}-${index}`] : fileUrls[`${file}-${index}`] || file;

        return (
          <div
            key={`${file instanceof File ? file.name : file}-${index}`}
            className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center space-x-2 truncate">
              {isImage && fileUrl ? (
                <img src={fileUrl} alt="Preview" className="w-8 h-8 object-cover rounded-md" />
              ) : (
                <div className="bg-gray-100 p-1.5 rounded-md">
                  <FileText className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <div className="truncate">
                <span className="text-sm text-gray-700 block truncate max-w-xs">
                  {file instanceof File ? file.name : file.split('/').pop()}
                </span>
                {file instanceof File && (
                  <span className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)}MB</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

>>>>>>> updated code

  return (
    <div
      id={id}
      className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all duration-300 ${
<<<<<<< HEAD
        isDragging
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
=======
        isDragging ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
>>>>>>> updated code
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
<<<<<<< HEAD
      <input
        type="file"
        id={`${id}-input`}
        accept={accept}
        multiple={multiple}
        onChange={handleChangeInput}
        className="hidden"
      />
      <label
        htmlFor={`${id}-input`}
        className="cursor-pointer flex flex-col items-center"
      >
        <div className="bg-blue-100 p-3 rounded-full mb-3">
          {icon || <UploadIcon className="w-6 h-6 text-blue-600" />}
        </div>
        <span className="text-sm font-medium text-gray-700 mb-1">{label}</span>
        <span className="text-xs text-gray-500">
          {multiple
            ? "Drag & drop files or click to select"
            : "Drag & drop a file or click to select"}
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
          {accept.split(",").join(", ")}, max {maxSizeMB}MB
        </span>
      </label>
      {renderPreview()}
      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 whitespace-pre-line">
          {error}
        </p>
      )}
=======
      <input type="file" id={`${id}-input`} accept={accept} multiple={multiple} onChange={handleChangeInput} className="hidden" />
      <label htmlFor={`${id}-input`} className="cursor-pointer flex flex-col items-center">
        <div className="bg-blue-100 p-3 rounded-full mb-3">{icon || <UploadIcon className="w-6 h-6 text-blue-600" />}</div>
        <span className="text-sm font-medium text-gray-700 mb-1">{label}</span>
        <span className="text-xs text-gray-500">{multiple ? 'Drag & drop files or click to select' : 'Drag & drop a file or click to select'}</span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{accept.split(',').join(', ')}, max {maxSizeMB}MB</span>
      </label>
      {renderPreview()}
      {error && <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 whitespace-pre-line">{error}</p>}
>>>>>>> updated code
    </div>
  );
};

// Main UpdateDoctorRegistration component
const UpdateDoctorRegistration = () => {
<<<<<<< HEAD
  const { id } = useParams();
  console.log(id);
  
  const navigate = useNavigate();
  // Step: Add this helper function here
  const capitalizeFirstLetter = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  // Helper to match dropdown option values safely
  const matchOption = (value, options) =>
    options.find((opt) => opt.value.toLowerCase() === value.toLowerCase())
      ?.value || "";

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    qualification: "",
    specialty: "",
    parentDepartment: "",
    registrationNumber: "",
    registrationCouncil: "",
    contactNumber: "",
    whatsappNumber: "",
    email: "",
=======
  const { doctorId } = useParams();
  const navigate = useNavigate();
  // Step: Add this helper function here
  const capitalizeFirstLetter = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
  
  // Helper to match dropdown option values safely
  const matchOption = (value, options) =>
    options.find((opt) => opt.value.toLowerCase() === value.toLowerCase())?.value || '';


  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    qualification: '',
    specialty: '',
    parentDepartment: '',
    registrationNumber: '',
    registrationCouncil: '',
    contactNumber: '',
    whatsappNumber: '',
    email: '',
>>>>>>> updated code
    photo: null,
    certificates: [],
    digitalSignature: null,
  });
  const [doctorData, setDoctorData] = useState(null);
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

<<<<<<< HEAD
  const qualifications = ["MD", "DNB", "DM", "MCh", "MBBS", "MS", "PhD"];
  const specialties = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Radiology",
    "Pathology",
    "Pediatrics",
  ];
  const councils = [
    "MCI",
    "State Medical Council",
    "Delhi Medical Council",
    "Mumbai Medical Council",
  ];

  // Load departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-department",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const data = await res.json();
        console.log("Departments API response:", data);
        if (Array.isArray(data)) {
          const mapped = data.map((d) => ({
            value: d.dptname?.trim() || "",
            label: d.dptname?.trim() || "",
          }));
          console.log("Mapped departments:", mapped);
          setDepartments(mapped);
        }
      } catch (err) {
        console.error("Failed to load departments", err);
      }
    };
    fetchDepartments();
  }, []);

  // Load doctor data safely
  // Fetch doctor
  useEffect(() => {
    if (!id) return;
    const fetchDoctor = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://asrlabs.asrhospitalindia.in/lims/master/get-doctor/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!res.ok) {
          toast.error("Doctor not found or invalid ID");
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        setDoctorData(data); // <-- set doctorData
      } catch (err) {
        toast.error("Failed to load doctor details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  // ✅ Step 1: When doctor data arrives — fill everything except department
  useEffect(() => {
    if (!doctorData) return;

    setFormData((prev) => ({
      ...prev,
      fullName: doctorData.dname || "",
      dateOfBirth: doctorData.ddob ? doctorData.ddob.split("T")[0] : "",
      qualification: doctorData.dqlf || "",
      specialty: doctorData.dspclty || "",
      registrationNumber: doctorData.dregno || "",
      registrationCouncil: doctorData.dregcnl || "",
      contactNumber: doctorData.dcnt || "",
      whatsappNumber: doctorData.dwhtsap || "",
      email: doctorData.demail || "",
      photo: doctorData.dphoto || null,
      certificates: Array.isArray(doctorData.dcrtf)
        ? doctorData.dcrtf
        : doctorData.dcrtf
        ? [doctorData.dcrtf]
        : [],
      digitalSignature: doctorData.dditsig || null,
    }));
  }, [doctorData]);

  // ✅ Step 2: When departments arrive — map and set correct department
  // ✅ Step 2: When departments arrive — ensure department always shown
  useEffect(() => {
    if (!doctorData) return;

    const findValue = (val, options) => {
      if (!val || !options?.length) return val || ""; // fallback to API value
      const match = options.find(
        (opt) => opt.value?.trim().toLowerCase() === val?.trim().toLowerCase()
      );
      return match ? match.value : val; // fallback if not matched
    };

    setFormData((prev) => ({
      ...prev,
      parentDepartment: findValue(doctorData.ddpt, departments),
    }));
  }, [doctorData, departments]);

  // Update a specific field in formData
  const handleFileChange = (field, files) => {
    setFormData((prev) => ({
      ...prev,
      [field]: files,
    }));
  };

  // Validate form before submitting
  const validateForm = () => {
    const newErrors = {};

    if (!formData.qualification) {
      newErrors.qualification = "Qualification is required";
    }

    if (!formData.specialty) {
      newErrors.specialty = "Specialty is required";
    }

    if (!formData.parentDepartment) {
      newErrors.parentDepartment = "Parent Department is required";
    }

    if (!formData.registrationNumber) {
      newErrors.registrationNumber = "Registration Number is required";
    }

    if (!formData.registrationCouncil) {
      newErrors.registrationCouncil = "Registration Council is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
=======
  const qualifications = ['MD', 'DNB', 'DM', 'MCh', 'MBBS', 'MS', 'PhD'];
  const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Radiology', 'Pathology', 'Pediatrics'];
  const councils = ['MCI', 'State Medical Council', 'Delhi Medical Council', 'Mumbai Medical Council'];

  // Load departments
useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const response = await viewDepartments(); 
      const deptArray = Array.isArray(response?.data) ? response.data : [];

      const deptList = deptArray
        .filter(d => d.dptname)
        .map(d => ({
          value: d.dptname.trim(),
          label: d.dptname.trim(),
        }));

      setDepartments(deptList);
    } catch (err) {
      console.error("❌ Error fetching departments:", err);
      setDepartments([]);
    }
  };

  fetchDepartments();
}, []);





  // Load doctor data safely
 // Fetch doctor
useEffect(() => {
  if (!doctorId) return;
  const fetchDoctor = async () => {
    setIsLoading(true);
    try {
   const res = await fetch(`https://asrlabs.asrhospitalindia.in/lims/master/get-doctor/${doctorId}`, {

        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });

      if (!res.ok) {
        toast.error('Doctor not found or invalid ID');
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      setDoctorData(data); // <-- set doctorData
    } catch (err) {
      toast.error('Failed to load doctor details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  fetchDoctor();
}, [doctorId]);

// ✅ Step 1: When doctor data arrives — fill everything except department
useEffect(() => {
  if (!doctorData) return;

  setFormData(prev => ({
    ...prev,
    fullName: doctorData.dname || '',
    dateOfBirth: doctorData.ddob ? doctorData.ddob.split('T')[0] : '',
    qualification: doctorData.dqlf || '',
    specialty: doctorData.dspclty || '',
    registrationNumber: doctorData.dregno || '',
    registrationCouncil: doctorData.dregcnl || '',
    contactNumber: doctorData.dcnt || '',
    whatsappNumber: doctorData.dwhtsap || '',
    email: doctorData.demail || '',
    photo: doctorData.dphoto || null,
    certificates: Array.isArray(doctorData.dcrtf)
      ? doctorData.dcrtf
      : doctorData.dcrtf
      ? [doctorData.dcrtf]
      : [],
    digitalSignature: doctorData.dditsig || null,
  }));
}, [doctorData]);

// ✅ Step 2: When departments arrive — map and set correct department
// ✅ Step 2: When departments arrive — ensure department always shown
useEffect(() => {
  if (!doctorData) return;

  const findValue = (val, options) => {
    if (!val || !options?.length) return val || ''; // fallback to API value
    const match = options.find(opt =>
      opt.value?.trim().toLowerCase() === val?.trim().toLowerCase()
    );
    return match ? match.value : val; // fallback if not matched
  };

  setFormData(prev => ({
    ...prev,
    parentDepartment: findValue(doctorData.ddpt, departments),
  }));
}, [doctorData, departments]);




 // Update a specific field in formData
const handleFileChange = (field, files) => {
  setFormData((prev) => ({
    ...prev,
    [field]: files,
  }));
};

// Validate form before submitting
const validateForm = () => {
  const newErrors = {};

  if (!formData.qualification) {
    newErrors.qualification = 'Qualification is required';
  }

  if (!formData.specialty) {
    newErrors.specialty = 'Specialty is required';
  }

  if (!formData.parentDepartment) {
    newErrors.parentDepartment = 'Parent Department is required';
  }

  if (!formData.registrationNumber) {
    newErrors.registrationNumber = 'Registration Number is required';
  }

  if (!formData.registrationCouncil) {
    newErrors.registrationCouncil = 'Registration Council is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
>>>>>>> updated code

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
<<<<<<< HEAD
      const updatedDoctor = {
        dname: formData.fullName,
        ddob: formData.dateOfBirth,
        dqlf: matchOption(
          formData.qualification,
          qualifications.map((q) => ({ value: q }))
        ),
        dspclty: matchOption(
          formData.specialty,
          specialties.map((s) => ({ value: s }))
        ),
        ddpt: matchOption(formData.parentDepartment, departments),
        dregno: formData.registrationNumber,
        dregcnl: matchOption(
          formData.registrationCouncil,
          councils.map((c) => ({ value: c }))
        ),
        dcnt: formData.contactNumber,
        dwhtsap: formData.whatsappNumber,
        demail: formData.email,
        dphoto:
          formData.photo instanceof File
            ? await fileToBase64(formData.photo)
            : formData.photo,
        // dcrtf: formData.certificates[0] instanceof File ? await fileToBase64(formData.certificates[0]) : formData.certificates[0],
        dcrtf:
          formData.certificates && formData.certificates.length > 0
            ? formData.certificates[0] instanceof File
              ? await fileToBase64(formData.certificates[0])
              : formData.certificates[0]
            : "",

        dditsig:
          formData.digitalSignature instanceof File
            ? await fileToBase64(formData.digitalSignature)
            : formData.digitalSignature,
        dstatus: "active",
      };

      const res = await fetch(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-doctor/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(updatedDoctor),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Doctor details updated successfully!");
        setTimeout(() => navigate("/view-doctor-registration"), 2000);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
=======
     const updatedDoctor = {
  dname: formData.fullName,
  ddob: formData.dateOfBirth,
  dqlf: matchOption(formData.qualification, qualifications.map(q => ({ value: q }))),
dspclty: matchOption(formData.specialty, specialties.map(s => ({ value: s }))),
ddpt: matchOption(formData.parentDepartment, departments),
  dregno: formData.registrationNumber,
 dregcnl: matchOption(formData.registrationCouncil, councils.map(c => ({ value: c }))),
  dcnt: formData.contactNumber,
  dwhtsap: formData.whatsappNumber,
  demail: formData.email,
  dphoto: formData.photo instanceof File ? await fileToBase64(formData.photo) : formData.photo,
  // dcrtf: formData.certificates[0] instanceof File ? await fileToBase64(formData.certificates[0]) : formData.certificates[0],
  dcrtf:
  formData.certificates && formData.certificates.length > 0
    ? formData.certificates[0] instanceof File
      ? await fileToBase64(formData.certificates[0])
      : formData.certificates[0]
    : '',



  dditsig: formData.digitalSignature instanceof File ? await fileToBase64(formData.digitalSignature) : formData.digitalSignature,
  dstatus: 'active',
};

      const res = await fetch(`https://asrlabs.asrhospitalindia.in/lims/master/update-doctor/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(updatedDoctor),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Doctor details updated successfully!');
        setTimeout(() => navigate(("/view-doctor-registration")), 2000);
      } else {
        toast.error('Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
>>>>>>> updated code
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="fixed top-[61px] w-full z-10">
<<<<<<< HEAD
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
                to="/view-doctor-registration-details"
                className="text-gray-700 hover:text-teal-600"
              >
                Doctor Registration
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Update Doctor
            </li>
=======
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link to="/" className="inline-flex items-center text-gray-700 hover:text-teal-600">🏠 Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/admin/view-doctor-registration" className="text-gray-700 hover:text-teal-600">Doctor Registration</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">Update Doctor</li>
>>>>>>> updated code
          </ol>
        </nav>
      </div>

<<<<<<< HEAD
      <div className="max-w-7xl mx-auto mt-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Update Doctor Registration
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Update doctor details below
            </p>
=======
      <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Doctor Registration</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Update doctor details below</p>
>>>>>>> updated code
          </div>

          <form onSubmit={handleUpdate} className="space-y-8">
            {/* Personal Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
<<<<<<< HEAD
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>
=======
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
>>>>>>> updated code
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  value={formData.fullName}
<<<<<<< HEAD
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
=======
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
>>>>>>> updated code
                  placeholder="Full Name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                />
                <input
                  type="date"
                  value={formData.dateOfBirth}
<<<<<<< HEAD
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
=======
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
>>>>>>> updated code
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                </div>
<<<<<<< HEAD
                <h2 className="text-xl font-semibold text-gray-800">
                  Professional Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>
                  <CustomDropdown
                    options={qualifications.map((q) => ({
                      value: q,
                      label: q,
                    }))}
                    value={formData.qualification}
                    onChange={(value) =>
                      setFormData({ ...formData, qualification: value })
                    }
                    placeholder="Select qualification"
                    className="mb-1"
                  />
                  {errors.qualification && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.qualification}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty
                  </label>
                  <CustomDropdown
                    options={specialties.map((s) => ({ value: s, label: s }))}
                    value={formData.specialty}
                    onChange={(value) =>
                      setFormData({ ...formData, specialty: value })
                    }
                    placeholder="Select specialty"
                    className="mb-1"
                  />
                  {errors.specialty && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.specialty}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Department
                  </label>
                  <CustomDropdown
                    options={departments}
                    value={formData.parentDepartment}
                    onChange={(value) =>
                      setFormData({ ...formData, parentDepartment: value })
                    }
                    placeholder="Select department"
                    className="mb-1"
                  />
                  {errors.parentDepartment && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.parentDepartment}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationNumber: e.target.value,
                      })
                    }
                    placeholder="Enter registration number"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {errors.registrationNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Council
                  </label>
                  <CustomDropdown
                    options={councils.map((c) => ({ value: c, label: c }))}
                    value={formData.registrationCouncil}
                    onChange={(value) =>
                      setFormData({ ...formData, registrationCouncil: value })
                    }
                    placeholder="Select council"
                    className="mb-1"
                  />
                  {errors.registrationCouncil && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.registrationCouncil}
                    </p>
                  )}
=======
                <h2 className="text-xl font-semibold text-gray-800">Professional Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <CustomDropdown
                    options={qualifications.map((q) => ({ value: q, label: q }))}
                    value={formData.qualification}
                    onChange={(value) => setFormData({ ...formData, qualification: value })}
                    placeholder="Select qualification"
                    className="mb-1"
                  />
                  {errors.qualification && <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <CustomDropdown
                    options={specialties.map((s) => ({ value: s, label: s }))}
                    value={formData.specialty}
                    onChange={(value) => setFormData({ ...formData, specialty: value })}
                    placeholder="Select specialty"
                    className="mb-1"
                  />
                  {errors.specialty && <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Department</label>
                  {departments.length > 0 ? (
  <CustomDropdown
    options={departments}
    value={formData.parentDepartment}
    onChange={(value) => setFormData({ ...formData, parentDepartment: value })}
    placeholder="Select department"
    className="mb-1"
  />
) : (
  <p className="text-gray-500 text-sm">Loading departments...</p>
)}

                  {errors.parentDepartment && <p className="mt-1 text-sm text-red-600">{errors.parentDepartment}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="Enter registration number"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {errors.registrationNumber && <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Council</label>
                  <CustomDropdown
                    options={councils.map((c) => ({ value: c, label: c }))}
                    value={formData.registrationCouncil}
                    onChange={(value) => setFormData({ ...formData, registrationCouncil: value })}
                    placeholder="Select council"
                    className="mb-1"
                  />
                  {errors.registrationCouncil && <p className="mt-1 text-sm text-red-600">{errors.registrationCouncil}</p>}
>>>>>>> updated code
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
<<<<<<< HEAD
                <h2 className="text-xl font-semibold text-gray-800">
                  Contact Information
                </h2>
=======
                <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
>>>>>>> updated code
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  value={formData.contactNumber}
<<<<<<< HEAD
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
=======
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
>>>>>>> updated code
                  placeholder="Contact Number"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.whatsappNumber}
<<<<<<< HEAD
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappNumber: e.target.value })
                  }
=======
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
>>>>>>> updated code
                  placeholder="WhatsApp Number"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                />
                <input
                  type="email"
                  value={formData.email}
<<<<<<< HEAD
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
=======
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
>>>>>>> updated code
                  placeholder="Email"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300"
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FileUpload
                id="photo"
                label="Upload Photo"
                accept=".jpg,.jpeg,.png"
                value={formData.photo}
<<<<<<< HEAD
                onChange={(files) => handleFileChange("photo", files)}
=======
                onChange={(files) => handleFileChange('photo', files)}
>>>>>>> updated code
                icon={<User className="w-6 h-6 text-blue-600" />}
              />
              <FileUpload
                id="certificates"
                label="Upload Certificates"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                value={formData.certificates}
<<<<<<< HEAD
                onChange={(files) => handleFileChange("certificates", files)}
=======
                onChange={(files) => handleFileChange('certificates', files)}
>>>>>>> updated code
                icon={<FileText className="w-6 h-6 text-green-600" />}
              />
              <FileUpload
                id="signature"
                label="Digital Signature"
                accept=".jpg,.jpeg,.png"
                value={formData.digitalSignature}
<<<<<<< HEAD
                onChange={(files) =>
                  handleFileChange("digitalSignature", files)
                }
=======
                onChange={(files) => handleFileChange('digitalSignature', files)}
>>>>>>> updated code
                icon={<Signature className="w-6 h-6 text-indigo-600" />}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
<<<<<<< HEAD
                {isSubmitting ? "Updating..." : "Update Doctor"}
=======
                {isSubmitting ? 'Updating...' : 'Update Doctor'}
>>>>>>> updated code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDoctorRegistration;
