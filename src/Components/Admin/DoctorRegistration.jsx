import React, { useState, useEffect, useCallback } from 'react';
import { Upload as UploadIcon, Calendar, User, Mail, Phone, FileText, Camera, X } from 'lucide-react';

const FileUpload = ({ 
  id, 
  label, 
  accept, 
  multiple = false, 
  maxSizeMB = 2, 
  value, 
  onChange, 
  previewType = 'text' 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [fileUrls, setFileUrls] = useState({});

  const validateFile = (file) => {
    const validTypes = accept.split(',').map(type => type.trim());
    const fileType = file.type;
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (!validTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      return fileType === type;
    })) {
      return `File type not supported. Accepted types: ${accept}`;
    }
    
    if (fileSizeMB > maxSizeMB) {
      return `File size exceeds ${maxSizeMB}MB limit`;
    }
    
    return '';
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if the drag leave event is from the container itself
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
  }, [multiple, onChange, validateFile, value]);

  const removeFile = (index) => {
    if (multiple) {
      const newFiles = [...value];
      newFiles.splice(index, 1);
      onChange(newFiles);
    } else {
      onChange(null);
    }
  };

  // Create URLs when files change
  useEffect(() => {
    const urls = {};
    if (value) {
      const files = multiple ? value : [value];
      files.forEach((file, index) => {
        if (file && file instanceof window.File) {  
          try {
            urls[`${file.name}-${index}`] = URL.createObjectURL(file);
          } catch (error) {
            console.error('Failed to create object URL:', error);
          }
        } else if (file) {
          console.warn('Skipping non-file object:', file);
        }
      });
    }

    // Set the new URLs
    setFileUrls(urls);

    // Cleanup function to revoke URLs
    return () => {
      Object.values(urls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [value, multiple]);

  const renderPreview = () => {
    if (!value || (multiple && value.length === 0)) return null;
    
    const files = multiple ? value : [value];
    
    return (
      <div className="mt-2 space-y-2">
        {files.map((file, index) => {
          if (!file) return null;
          
          // Check if file is valid
          if (!file.type || !file.name || !file.size) {
            console.error('Invalid file object:', file);
            return (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-red-500">
                  Invalid file format
                </span>
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
            <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="flex items-center space-x-2 truncate">
                {isImage && fileUrl ? (
                  <img 
                    src={fileUrl} 
                    alt="Preview" 
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <File className="w-5 h-5 text-gray-500" />
                )}
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)}MB
                </span>
              </div>
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
        })}
      </div>
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div 
        id={id}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
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
        <label 
          htmlFor={`${id}-input`} 
          className="cursor-pointer flex flex-col items-center"
        >
          <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <span className="text-sm text-gray-600">
            {multiple ? 'Drag & drop files here or click to select' : 'Drag & drop a file or click to select'}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {accept.split(',').join(', ')}, max {maxSizeMB}MB
          </span>
        </label>
        {error && (
          <p className="text-red-500 text-xs mt-2">{error}</p>
        )}
        {renderPreview()}
      </div>
    </div>
  );
};

export const DoctorRegistration = () => {
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

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://asrlab-production.up.railway.app/lims/master/get-department', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'accept': 'application/json'
          }
        });
        const data = await response.json();
        console.log('Fetched departments data:', data);  
        if (Array.isArray(data)) {
          setDepartments(data.map(dept => dept.dptName));  
        } else {
          console.error('API response is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setIsLoading(false);
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
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^(\+\d{1,3}[\s-]?)?\d{10}$/;
    if (formData.contactNumber && !phoneRegex.test(formData.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }
    if (formData.whatsappNumber && !phoneRegex.test(formData.whatsappNumber.replace(/\D/g, ''))) {
      newErrors.whatsappNumber = 'Please enter a valid 10-digit WhatsApp number';
    }

    // Document validations
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
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate Doctor ID
    const doctorId = `DOC${Date.now().toString().slice(-6)}`;
    
    alert(`Registration submitted successfully!\nDoctor ID: ${doctorId}\nStatus: Pending Approval`);
    
    // Reset form
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
    setErrors({}); // Clear errors
    setIsSubmitting(false);
  };

  const handleFileChange = (field, files) => {
    if (!files) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: files
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Doctor Registration
          </h1>
          <p className="mt-2 text-gray-600">
            Please fill in the details to register a new doctor
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                  Qualification
                </label>
                <select
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select qualification</option>
                  {qualifications.map((qual) => (
                    <option key={qual} value={qual}>{qual}</option>
                  ))}
                </select>
                {errors.qualification && (
                  <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>
                )}
              </div>

              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <select
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select specialty</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                {errors.specialty && (
                  <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>
                )}
              </div>

              <div>
                <label htmlFor="parentDepartment" className="block text-sm font-medium text-gray-700">
                  Parent Department
                </label>
                <select
                  id="parentDepartment"
                  value={formData.parentDepartment}
                  onChange={(e) => setFormData({ ...formData, parentDepartment: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select parent department</option>
                  {departments.length === 0 ? (
                    <option value="">No departments found</option>
                  ) : (
                    departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))
                  )}
                </select>
                {errors.parentDepartment && (
                  <p className="mt-1 text-sm text-red-600">{errors.parentDepartment}</p>
                )}
              </div>

              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter registration number"
                />
                {errors.registrationNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="registrationCouncil" className="block text-sm font-medium text-gray-700">
                  Registration Council
                </label>
                <select
                  id="registrationCouncil"
                  value={formData.registrationCouncil}
                  onChange={(e) => setFormData({ ...formData, registrationCouncil: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select registration council</option>
                  {councils.map((council) => (
                    <option key={council} value={council}>{council}</option>
                  ))}
                </select>
                {errors.registrationCouncil && (
                  <p className="mt-1 text-sm text-red-600">{errors.registrationCouncil}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter contact number"
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  id="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter WhatsApp number"
                />
                {errors.whatsappNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FileUpload
                  id="photo"
                  label="Profile Photo"
                  accept="image/jpeg,image/png"
                  value={formData.photo}
                  onChange={(files) => handleFileChange('photo', files)}
                  maxSizeMB={5}
                />
                {errors.photo && (
                  <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
                )}
              </div>
              <div>
                <FileUpload
                  id="certificates"
                  label="Certificates"
                  accept=".pdf,.doc,.docx"
                  multiple={true}
                  value={formData.certificates}
                  onChange={(files) => handleFileChange('certificates', files)}
                  maxSizeMB={10}
                />
                {errors.certificates && (
                  <p className="mt-1 text-sm text-red-600">{errors.certificates}</p>
                )}
              </div>
              <div>
                <FileUpload
                  id="digitalSignature"
                  label="Digital Signature"
                  accept="image/jpeg,image/png"
                  value={formData.digitalSignature}
                  onChange={(files) => handleFileChange('digitalSignature', files)}
                  maxSizeMB={2}
                />
                {errors.digitalSignature && (
                  <p className="mt-1 text-sm text-red-600">{errors.digitalSignature}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } transition-colors duration-200`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Registration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};