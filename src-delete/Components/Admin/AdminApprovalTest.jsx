import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Settings, Shield } from 'lucide-react';

// Proper ErrorBoundary class
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div className="p-4 bg-red-100">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

export default function AdminApprovalTest() {
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

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [permissions, setPermissions] = useState({
    departments: [],
    hospitalNodes: [],
    accessScope: 'single',
    crossDepartmentAccess: false,
    crossBarcodeAccess: false
  });

  const departments = ['Internal Medicine', 'Surgery', 'Pediatrics', 'Radiology', 'Pathology', 'Emergency'];
  const hospitalNodes = ['Main Hospital', 'North Wing', 'South Wing', 'Lab Center A', 'Lab Center B'];

  useEffect(() => {
    console.log('Pending doctors state:', pendingDoctors);
    console.log('Permissions state:', permissions);
  }, [pendingDoctors, permissions]);

  const handleApprove = (doctorId) => {
    const doctor = pendingDoctors.find(d => d.id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      setShowPermissionsModal(true);
    }
  };

  const confirmApproval = () => {
    if (selectedDoctor) {
      setPendingDoctors(prev =>
        prev.map(doc =>
          doc.id === selectedDoctor.id
            ? { ...doc, status: 'approved' }
            : doc
        )
      );
      setShowPermissionsModal(false);
      setSelectedDoctor(null);
      alert(`Doctor ${selectedDoctor.name} has been approved with assigned permissions.`);
    }
  };

  const handleReject = (doctorId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      setPendingDoctors(prev =>
        prev.map(doc =>
          doc.id === doctorId
            ? { ...doc, status: 'rejected' }
            : doc
        )
      );
      alert(`Doctor registration rejected. Reason: ${reason}`);
    }
  };

  const handleViewDetails = (doctor) => {
    alert(`Doctor Details:\n\nName: ${doctor.name}\nQualification: ${doctor.qualification}\nSpecialty: ${doctor.specialty}\nDepartment: ${doctor.department}\nRegistration: ${doctor.registrationNumber}\nEmail: ${doctor.email}\nPhone: ${doctor.phone}\nSubmitted: ${doctor.submittedDate}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 bg-red-500 text-white p-2 z-50">
        DEBUG: AdminApproval mounted
      </div>

      <ErrorBoundary fallback={<div className="p-4 bg-red-100">Section Error</div>}>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {['pending', 'approved', 'rejected'].map((status) => {
              const count = pendingDoctors.filter(d => d.status === status).length;
              const color = status === 'pending' ? 'yellow' : status === 'approved' ? 'green' : 'red';
              const Icon = status === 'pending' ? Eye : status === 'approved' ? CheckCircle : XCircle;
              return (
                <div key={status} className={`bg-${color}-50 p-4 rounded-lg border border-${color}-200`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium text-${color}-800`}>{status.charAt(0).toUpperCase() + status.slice(1)}</p>
                      <p className={`text-2xl font-bold text-${color}-900`}>{count}</p>
                    </div>
                    <div className={`w-10 h-10 bg-${color}-200 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${color}-700`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <ErrorBoundary fallback={<div className="p-4 bg-yellow-100">Table Error</div>}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-3">Qualification</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingDoctors.map(doctor => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                        <div className="text-sm text-gray-500">{doctor.email}</div>
                      </td>
                      <td className="px-6 py-4">{doctor.qualification} - {doctor.specialty}</td>
                      <td className="px-6 py-4">{doctor.department}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                          {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button onClick={() => handleViewDetails(doctor)} className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        {doctor.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(doctor.id)} className="text-green-600 hover:text-green-900">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleReject(doctor.id)} className="text-red-600 hover:text-red-900">
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
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    </div>
  );
}
