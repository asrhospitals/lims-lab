import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Shield
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

import PropTypes from 'prop-types';

// Define prop types
const PendingDoctorPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  qualification: PropTypes.string.isRequired,
  specialty: PropTypes.string.isRequired,
  department: PropTypes.string.isRequired,
  registrationNumber: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  submittedDate: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['pending', 'approved', 'rejected']).isRequired
});

const PermissionsPropType = PropTypes.shape({
  departments: PropTypes.arrayOf(PropTypes.string).isRequired,
  hospitalNodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  accessScope: PropTypes.oneOf(['single', 'multi']).isRequired,
  crossDepartmentAccess: PropTypes.bool.isRequired,
  crossBarcodeAccess: PropTypes.bool.isRequired
});

const AdminApproval = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const [permissions, setPermissions] = useState({
    departments: [],
    hospitalNodes: [], // This will store the full node objects
    accessScope: 'single',
    crossDepartmentAccess: false,
    crossBarcodeAccess: false
  });

    const [departments, setDepartments] = useState([]);
  const [hospitalNodes, setHospitalNodes] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem('authToken');
      
      // Fetch departments
      try {
        const deptResponse = await axios.get(
          'https://asrlab-production.up.railway.app/lims/master/get-department',
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (deptResponse.data && Array.isArray(deptResponse.data)) {
          // Filter active departments and map to just the department names
          const activeDepartments = deptResponse.data
            .filter(dept => dept.isActive)
            .map(dept => dept.dptName);
          setDepartments(activeDepartments);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Failed to load departments. Using default departments.');
        setDepartments(['Internal Medicine', 'Surgery', 'Pediatrics', 'Radiology', 'Pathology', 'Emergency']);
      }

      // Fetch regular hospitals and nodal hospitals in parallel
      try {
        const [hospitalsResponse, nodalHospitalsResponse] = await Promise.all([
          axios.get('https://asrlab-production.up.railway.app/lims/master/get-hospital', {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }),
          axios.get('https://asrlab-production.up.railway.app/lims/master/get-nodalhospital', {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
        ]);

        const allHospitalNodes = [];

        // Process regular hospitals
        if (hospitalsResponse.data) {
          const hospitalsData = Array.isArray(hospitalsResponse.data) 
            ? hospitalsResponse.data 
            : [hospitalsResponse.data];
          
          const activeHospitals = hospitalsData
            .filter(hospital => hospital.isactive)
            .map(hospital => ({
              name: hospital.hospital_name,
              type: 'regular'
            }));
          
          if (activeHospitals.length > 0) {
            allHospitalNodes.push({ type: 'divider', label: 'Hospitals' });
            allHospitalNodes.push(...activeHospitals);
          }
        }

        // Process nodal hospitals
        if (nodalHospitalsResponse.data) {
          const nodalHospitalsData = Array.isArray(nodalHospitalsResponse.data)
            ? nodalHospitalsResponse.data
            : [nodalHospitalsResponse.data];
          
          const activeNodalHospitals = nodalHospitalsData
            .filter(nh => nh.isactive)
            .map(nh => ({
              name: `${nh.hospital?.hospital_name || 'Unknown'} (${nh.nodal?.nodalname || 'Nodal'})`,
              type: 'nodal',
              nodalName: nh.nodal?.nodalname,
              hospitalId: nh.hospital_id
            }));
          
          if (activeNodalHospitals.length > 0) {
            allHospitalNodes.push({ type: 'divider', label: 'Nodal Hospitals' });
            allHospitalNodes.push(...activeNodalHospitals);
          }
        }

        // Set the combined hospital nodes
        if (allHospitalNodes.length > 0) {
          setHospitalNodes(allHospitalNodes);
        } else {
          throw new Error('No active hospitals found');
        }

      } catch (error) {
        console.error('Error fetching hospitals:', error);
        toast.error('Failed to load hospitals. Using default hospital nodes.');
        setHospitalNodes([
          { type: 'divider', label: 'Hospitals' },
          { name: 'Main Hospital', type: 'regular' },
          { name: 'North Wing', type: 'regular' },
          { name: 'South Wing', type: 'regular' },
          { type: 'divider', label: 'Nodal Hospitals' },
          { 
            name: 'Kolkata SDH (Second Nodal)', 
            type: 'nodal',
            nodalName: 'Second Nodal',
            hospitalId: 3
          }
        ]);
      }
    };

    fetchData();
  }, []);

  const [pendingDoctors, setPendingDoctors] = useState([
    {
      id: 'DOC001',
      name: 'Dr. Sarah Johnson',
      qualification: 'MD',
      specialty: 'Cardiology',
      department: 'Internal Medicine',
      registrationNumber: 'MED2024001',
      email: 'sarah.johnson@hospital.com',
      phone: '+1234567890',
      submittedDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: 'DOC002',
      name: 'Dr. Michael Chen',
      qualification: 'DNB',
      specialty: 'Neurology',
      department: 'Internal Medicine',
      registrationNumber: 'MED2024002',
      email: 'michael.chen@hospital.com',
      phone: '+1234567891',
      submittedDate: '2024-01-16',
      status: 'pending'
    },
    {
      id: 'DOC003',
      name: 'Dr. Emily Rodriguez',
      qualification: 'MS',
      specialty: 'Orthopedics',
      department: 'Surgery',
      registrationNumber: 'MED2024003',
      email: 'emily.rodriguez@hospital.com',
      phone: '+1234567892',
      submittedDate: '2024-01-17',
      status: 'pending'
    }
  ]);

  // Handlers
  const handleApprove = async (doctorId) => {
    const doctor = pendingDoctors.find(d => d.id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      // Reset permissions when opening the modal
      setPermissions({
        departments: [],
        hospitalNodes: [],
        accessScope: 'single',
        crossDepartmentAccess: false,
        crossBarcodeAccess: false
      });
      setShowPermissionsModal(true);
    }
  };

  const confirmApproval = async () => {
    if (selectedDoctor && permissions) {
      try {
        const authToken = localStorage.getItem("authToken");
        // Map hospital nodes to just the names for the API
        const hospitalNodeNames = permissions.hospitalNodes.map(node => node.name);
        
        const payload = {
          doctorId: selectedDoctor.id,
          permissions: {
            departments: permissions.departments,
            hospitalNodes: hospitalNodeNames,
            accessScope: permissions.accessScope,
            crossDepartmentAccess: permissions.crossDepartmentAccess,
            crossBarcodeAccess: permissions.crossBarcodeAccess
          }
        };

        await axios.post(
          "https://asrlab-production.up.railway.app/lims/admin/approve-doctor",
          payload,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json"
            }
          }
        );

        // Update local state
        setPendingDoctors(prev =>
          prev.map(doc =>
            doc.id === selectedDoctor.id ? { ...doc, status: 'approved' } : doc
          )
        );

        toast.success(`Doctor ${selectedDoctor.name} has been approved with assigned permissions.`);
        setShowPermissionsModal(false);
        setSelectedDoctor(null);
        
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to approve doctor. Please try again.");
      }
    }
  };

  const handleReject = (doctorId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      setPendingDoctors(prev =>
        prev.map(doc =>
          doc.id === doctorId ? { ...doc, status: 'rejected' } : doc
        )
      );
      alert(`Doctor registration rejected. Reason: ${reason}`);
    }
  };

  const handleViewDetails = (doctor) => {
    alert(
      `Doctor Details:
Name: ${doctor.name}
Qualification: ${doctor.qualification}
Specialty: ${doctor.specialty}
Department: ${doctor.department}
Registration: ${doctor.registrationNumber}
Email: ${doctor.email}
Phone: ${doctor.phone}
Submitted: ${doctor.submittedDate}`
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Panel */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Settings className="w-6 h-6 mr-3" />
            Admin Approval & Permissions Panel
          </h2>
          <p className="text-purple-100 mt-2">Review and approve doctor registrations with permission assignment</p>
        </div>
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {pendingDoctors.filter(d => d.status === 'pending').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-yellow-700" />
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Approved</p>
                  <p className="text-2xl font-bold text-green-900">
                    {pendingDoctors.filter(d => d.status === 'approved').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Rejected</p>
                  <p className="text-2xl font-bold text-red-900">
                    {pendingDoctors.filter(d => d.status === 'rejected').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Doctor Registration Requests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qualification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.email}</div>
                          <div className="text-sm text-gray-500">{doctor.registrationNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.qualification}</div>
                        <div className="text-sm text-gray-500">{doctor.specialty}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            doctor.status
                          )}`}
                        >
                          {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewDetails(doctor)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {doctor.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(doctor.id)}
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(doctor.id)}
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showPermissionsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Assign Permissions - {selectedDoctor.name}
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Departments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Assign Departments
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {departments.map((dept) => (
                    <label key={dept} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={permissions.departments.includes(dept)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPermissions((prev) => ({
                              ...prev,
                              departments: [...prev.departments, dept]
                            }));
                          } else {
                            setPermissions((prev) => ({
                              ...prev,
                              departments: prev.departments.filter((d) => d !== dept)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{dept}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hospital Nodes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hospital Nodes / Labs
                </label>
                <div className="space-y-4">
                  {hospitalNodes.map((node, index) => {
                    // Skip rendering if it's a divider with no label
                    if (node.type === 'divider' && !node.label) return null;
                    
                    // Render section header
                    if (node.type === 'divider') {
                      return (
                        <div key={`divider-${index}`} className="border-t border-gray-200 pt-2">
                          <h4 className="text-sm font-medium text-gray-700">{node.label}</h4>
                        </div>
                      );
                    }
                    
                    // Render hospital node checkbox
                    return (
                      <div key={node.name || index} className="ml-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={permissions.hospitalNodes.some(n => n.name === node.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPermissions(prev => ({
                                  ...prev,
                                  hospitalNodes: [...prev.hospitalNodes, node]
                                }));
                              } else {
                                setPermissions(prev => ({
                                  ...prev,
                                  hospitalNodes: prev.hospitalNodes.filter(n => n.name !== node.name)
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {node.name}
                            {node.type === 'nodal' && node.nodalName && (
                              <span className="text-xs text-gray-500 ml-1">({node.nodalName})</span>
                            )}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Access Scope */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Access Scope
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="single"
                      checked={permissions.accessScope === 'single'}
                      onChange={(e) =>
                        setPermissions((prev) => ({
                          ...prev,
                          accessScope: e.target.value
                        }))
                      }
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Single Department</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="multi"
                      checked={permissions.accessScope === 'multi'}
                      onChange={(e) =>
                        setPermissions((prev) => ({
                          ...prev,
                          accessScope: e.target.value
                        }))
                      }
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Multi Department</span>
                  </label>
                </div>
              </div>

              {/* Additional Permissions */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={permissions.crossDepartmentAccess}
                    onChange={(e) =>
                      setPermissions((prev) => ({
                        ...prev,
                        crossDepartmentAccess: e.target.checked
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Allow report access to non-parent departments
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={permissions.crossBarcodeAccess}
                    onChange={(e) =>
                      setPermissions((prev) => ({
                        ...prev,
                        crossBarcodeAccess: e.target.checked
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enable cross-barcode test view</span>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmApproval}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve with Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApproval;