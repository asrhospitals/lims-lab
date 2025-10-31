import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload as UploadIcon, X, User, Briefcase, Phone, Mail, FileText, Signature, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ Added for navigation
import { viewDepartments } from "../../services/apiService";

// Custom Dropdown Component
const CustomDropdown = ({ options, value, onChange, placeholder, disabled = false, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // const selectedOption = options.find(option => option.value === value);
  const selectedOption = options.find(option => option.value?.trim() === (value?.trim() || ""));

  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border ${
          disabled ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700'
        } border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                value === option.value ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
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

// FileUpload Component
const FileUpload = ({ 
  id, 
  label, 
  accept, 
  multiple = false, 
  maxSizeMB = 2, 
  value, 
  onChange, 
  previewType = 'text',
  icon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  
  // Validate file type and size
  const validateFile = (file) => {
    const validTypes = accept.split(',').map(type => type.trim());
    const fileType = file.type;
    const fileSizeMB = file.size / (1024 * 1024);
    const isAcceptedType = validTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      return fileType === type || fileType.startsWith(type.split('/')[0]);
    });
    if (!isAcceptedType) {
      return `File type not supported. Accepted: ${accept}`;
    }
    if (fileSizeMB > maxSizeMB) {
      return `File size exceeds ${maxSizeMB}MB limit`;
    }
    return '';
  };
  
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.id === id) {
      setIsDragging(false);
    }
  }, [id]);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);
  
  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };
  
  const processFiles = useCallback((files) => {
    if (!files.length) return;
    const validFiles = [];
    const newErrors = [];
    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });
    if (newErrors.length > 0) {
      setError(newErrors.join('\n'));
      setTimeout(() => setError(''), 5000);
    } else {
      setError('');
    }
    if (validFiles.length > 0) {
      if (multiple) {
        onChange([...(value || []), ...validFiles]);
      } else {
        onChange(validFiles[0]);
      }
    }
  }, [multiple, onChange, value, validateFile]);
  
  const removeFile = (index) => {
    if (multiple) {
      const newFiles = [...value];
      newFiles.splice(index, 1);
      onChange(newFiles);
    } else {
      onChange(null);
    }
  };
  
  // Create preview URLs
  const [fileUrls, setFileUrls] = useState({});
  useEffect(() => {
    const urls = {};
    const files = value ? (Array.isArray(value) ? value : [value]) : [];
    files.forEach((file, index) => {
      if (file && file instanceof File) {
        try {
          urls[`${file.name}-${index}`] = URL.createObjectURL(file);
        } catch (err) {
          console.error('Failed to create object URL:', err);
        }
      }
    });
    setFileUrls(urls);
    return () => {
      Object.values(urls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [value]);
  
  const renderPreview = () => {
    if (!value || (multiple && value.length === 0)) return null;
    const files = Array.isArray(value) ? value : [value];
    return (
      <div className="mt-3 space-y-2">
        {files.map((file, index) => {
          if (!file || !(file instanceof File)) {
            return (
              <div key={index} className="flex items-center justify-between bg-red-50 p-2 rounded-lg border border-red-200">
                <span className="text-sm text-red-600">Invalid file</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          }
          const isImage = file.type.startsWith('image/');
          const fileUrl = fileUrls[`${file.name}-${index}`];
          return (
            <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2 truncate">
                {isImage && fileUrl ? (
                  <img src={fileUrl} alt="Preview" className="w-8 h-8 object-cover rounded-md" />
                ) : (
                  <div className="bg-gray-100 p-1.5 rounded-md">
                    <FileText className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <div className="truncate">
                  <span className="text-sm text-gray-700 block truncate max-w-xs">{file.name}</span>
                  <span className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)}MB</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
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
  
  return (
    <div>
      <div
        id={id}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all duration-300 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
        }`}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={`${id}-input`}
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <label htmlFor={`${id}-input`} className="cursor-pointer flex flex-col items-center">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            {icon || <UploadIcon className="w-6 h-6 text-blue-600" />}
          </div>
          <span className="text-sm font-medium text-gray-700 mb-1">{label}</span>
          <span className="text-xs text-gray-500 mb-2">
            {multiple ? 'Drag & drop files or click to select' : 'Drag & drop a file or click to select'}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            {accept.split(',').join(', ')}, max {maxSizeMB}MB
          </span>
        </label>
        {renderPreview()}
        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 whitespace-pre-line">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const navigate = useNavigate(); // ✅ Added
  const [toastMessage, setToastMessage] = useState(''); // ✅ Added
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
    photo: null,
    certificates: [],
    digitalSignature: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const response = await viewDepartments(); 
      console.log("Department API response:", response);

      const deptArray = Array.isArray(response?.data) ? response.data : [];

      const deptList = deptArray
        .filter(d => d.dptname) // only keep items with dptname
        .map(d => ({
          value: d.dptname.trim(),
          label: d.dptname.trim(),
        }));

      setDepartments(deptList);

      // Preselect first department if none selected
      if (deptList.length > 0 && !formData.parentDepartment) {
        setFormData(prev => ({ ...prev, parentDepartment: deptList[0].value }));
      }

      console.log("✅ Departments loaded:", deptList);
    } catch (err) {
      console.error("❌ Error fetching departments:", err);
      setDepartments([]);
    }
  };

  fetchDepartments();
}, []);





  
  const qualifications = ['MD', 'DNB', 'DM', 'MCh', 'MBBS', 'MS', 'PhD'];
  const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Radiology', 'Pathology', 'Pediatrics'];
  const councils = ['MCI', 'State Medical Council', 'Delhi Medical Council', 'Mumbai Medical Council'];
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.qualification) newErrors.qualification = 'Qualification is required';
    if (!formData.specialty) newErrors.specialty = 'Specialty is required';
    if (!formData.parentDepartment) newErrors.parentDepartment = 'Parent department is required';
    if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration number is required';
    if (!formData.registrationCouncil) newErrors.registrationCouncil = 'Registration council is required';
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
    if (!formData.whatsappNumber) newErrors.whatsappNumber = 'WhatsApp number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const cleanPhone = (num) => num.replace(/\D/g, '');
    if (formData.contactNumber && cleanPhone(formData.contactNumber).length !== 10) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }
    if (formData.whatsappNumber && cleanPhone(formData.whatsappNumber).length !== 10) {
      newErrors.whatsappNumber = 'Please enter a valid 10-digit WhatsApp number';
    }
    
    if (!formData.photo) newErrors.photo = 'Profile photo is required';
    if (!formData.certificates || formData.certificates.length === 0) {
      newErrors.certificates = 'At least one certificate is required';
    }
    if (!formData.digitalSignature) newErrors.digitalSignature = 'Digital signature is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return; // ✅ Validation first
  setIsSubmitting(true);

  try {
    // 1️⃣ Upload Digital Signature
    const signatureFormData = new FormData();
    signatureFormData.append('digitalsignature', formData.digitalSignature);

    const signatureResponse = await fetch(
      'https://asrlabs.asrhospitalindia.in/lims/signature/upload-signature',
      {
        method: 'POST',
        body: signatureFormData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    );
    const signatureData = await signatureResponse.json();

    // 2️⃣ Upload Profile Photo
    const profileFormData = new FormData();
    profileFormData.append('profile', formData.photo);

    const profileResponse = await fetch(
      'https://asrlabs.asrhospitalindia.in/lims/profile/upload-profile',
      {
        method: 'POST',
        body: profileFormData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    );
    const profileData = await profileResponse.json();

    // 3️⃣ Upload Certificate
    const certFormData = new FormData();
    certFormData.append('certificate', formData.certificates[0]);

    const certResponse = await fetch(
      'https://asrlabs.asrhospitalindia.in/lims/certificate/upload-certificate',
      {
        method: 'POST',
        body: certFormData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    );
    const certData = await certResponse.json();

    // 4️⃣ Submit Doctor Data
    const doctorData = {
      dname: formData.fullName,
      ddob: formData.dateOfBirth,
      dqlf: formData.qualification,
      dspclty: formData.specialty,
      ddpt: formData.parentDepartment,
      dregno: formData.registrationNumber,
      dregcnl: formData.registrationCouncil,
      dcnt: formData.contactNumber,
      dwhtsap: formData.whatsappNumber,
      demail: formData.email,
      dphoto: profileData.fileUrl,
      dcrtf: certData.fileUrl,
      dditsig: signatureData.fileUrl,
      dstatus: 'pending'
    };

    const doctorResponse = await fetch(
      'https://asrlabs.asrhospitalindia.in/lims/master/add-doctor',
      {
        method: 'POST',
        body: JSON.stringify(doctorData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    );

    const doctorDataResponse = await doctorResponse.json();

    if (doctorResponse.status === 409) {
  setToastMessage(doctorDataResponse.message || "Doctor already exists");
} else if (!doctorResponse.ok) {
  setToastMessage(doctorDataResponse.message || "Failed to register doctor. Please try again.");
} else {
  // ✅ show popup with actual submitted data
  setSuccessMessage({
    ...doctorData,
    id: doctorDataResponse.id || null,
  });

  setToastMessage("Doctor registered successfully!");

  // ✅ auto-navigate to view page after 2 seconds
  // setTimeout(() => {
  //   navigate("/view-doctor-registration-details");
  // }, 2000);
setTimeout(() => {
  setSuccessMessage(null); // hide modal first
  navigate("/view-doctor-registration-details");
}, 2000);

  // reset form
  setFormData({
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
    photo: null,
    certificates: [],
    digitalSignature: null,
  });
  setErrors({});
}

  } catch (error) {
    console.error("Registration failed:", error);
    setToastMessage("Registration failed. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  
  const handleFileChange = (field, files) => {
    setFormData(prev => ({
      ...prev,
      [field]: files
    }));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Registration</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Please fill in the details to register a new doctor
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter full name"
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                  </div>
                </div>
              </div>
              
              {/* Professional Information */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Professional Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                      Qualification
                    </label>
                    <CustomDropdown
                      options={qualifications.map(qual => ({ value: qual, label: qual }))}
                      value={formData.qualification}
                      onChange={(value) => setFormData({ ...formData, qualification: value })}
                      placeholder="Select qualification"
                      className="mb-1"
                    />
                    {errors.qualification && <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>}
                  </div>
                  <div>
                    <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialty
                    </label>
                    <CustomDropdown
                      options={specialties.map(spec => ({ value: spec, label: spec }))}
                      value={formData.specialty}
                      onChange={(value) => setFormData({ ...formData, specialty: value })}
                      placeholder="Select specialty"
                      className="mb-1"
                    />
                    {errors.specialty && <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>}
                  </div>
                  <div>
                    <label htmlFor="parentDepartment" className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Department
                    </label>
             <CustomDropdown
  options={departments}
  value={formData.parentDepartment}
  onChange={(value) => setFormData({ ...formData, parentDepartment: value })}
  placeholder="Select department"
/>






                    {errors.parentDepartment && <p className="mt-1 text-sm text-red-600">{errors.parentDepartment}</p>}
                  </div>
                  <div>
                    <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      id="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter registration number"
                    />
                    {errors.registrationNumber && <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>}
                  </div>
                  <div>
                    <label htmlFor="registrationCouncil" className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Council
                    </label>
                    <CustomDropdown
                      options={councils.map(council => ({ value: council, label: council }))}
                      value={formData.registrationCouncil}
                      onChange={(value) => setFormData({ ...formData, registrationCouncil: value })}
                      placeholder="Select council"
                      className="mb-1"
                    />
                    {errors.registrationCouncil && <p className="mt-1 text-sm text-red-600">{errors.registrationCouncil}</p>}
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g. 9876543210"
                    />
                    {errors.contactNumber && <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>}
                  </div>
                  <div>
                    <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      id="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g. 9876543210"
                    />
                    {errors.whatsappNumber && <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="doctor@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>
              </div>
              
              {/* Documents */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 p-2 rounded-lg mr-3">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Documents</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <FileUpload
                      id="photo"
                      label="Profile Photo"
                      accept="image/*"
                      value={formData.photo}
                      onChange={(file) => handleFileChange('photo', file)}
                      icon={<User className="w-6 h-6 text-blue-600" />}
                    />
                    {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
                  </div>
                  <div>
                    <FileUpload
                      id="certificates"
                      label="Certificates"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      value={formData.certificates}
                      onChange={(files) => handleFileChange('certificates', files)}
                      icon={<FileText className="w-6 h-6 text-blue-600" />}
                    />
                    {errors.certificates && <p className="text-red-500 text-xs mt-1">{errors.certificates}</p>}
                  </div>
                  <div>
                    <FileUpload
                      id="digitalSignature"
                      label="Digital Signature"
                      accept="image/*"
                      value={formData.digitalSignature}
                      onChange={(file) => handleFileChange('digitalSignature', file)}
                      icon={<Signature className="w-6 h-6 text-blue-600" />}
                    />
                    {errors.digitalSignature && <p className="text-red-500 text-xs mt-1">{errors.digitalSignature}</p>}
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : 'Submit Registration'}
                </button>
              </div>
            </form>
           {successMessage && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-green-600">Doctor Registered Successfully!</h3>
          <button 
            onClick={() => setSuccessMessage(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-gray-900">{successMessage?.dname || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                successMessage?.dstatus === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {successMessage?.dstatus
                  ? successMessage.dstatus.charAt(0).toUpperCase() + successMessage.dstatus.slice(1)
                  : 'Pending'}
              </span>
            </div>
            {/* Add other fields similarly with ? optional chaining */}
          </div>
        </div>
      </div>
    </div>
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
