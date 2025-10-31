import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Layouts
import AdminsDashboard from "./Layouts/DoctorsDashboard";

// Auth

import AdminLogin from "./LoginPage";

// Dashboard & Home
import AdminHome from "./Components/Admin/DoctorHome";
import DoctorReportDetail from "./Components/Admin/DoctorReportDetail";
import DoctorReporteditDetail from "./Components/Admin/DoctorReporteditDetail";

// Admin Management
import AdminApproval from "./Components/Admin/AdminApproval";
import AdminApprovalTest from "./Components/Admin/AdminApprovalTest";

// Department Management
import AddDept from "./Components/Admin/AddDept";
import ViewDepartment from "./Components/Admin/ViewDepartments";
import UpdateDept from "./Components/Admin/UpdateDept";
import AddSubDpt from "./Components/Admin/AddSubDept";
import ViewSubDpt from "./Components/Admin/ViewSubDept";
import UpdateSubDpt from "./Components/Admin/UpdateSubDept";

// Hospital Management
import AddHospitalType from "./Components/Admin/AddHospitalType";
import ViewHospitalType from "./Components/Admin/ViewHospitalType";
import UpdateHospitalType from "./Components/Admin/UpdateHospitalType";
import AddHospital from "./Components/Admin/AddHospital";
import ViewHospital from "./Components/Admin/ViewHospital";
import UpdateHospital from "./Components/Admin/UpdateHospital";

// Nodal Management
import AddNodal from "./Components/Admin/AddNodal";
import ViewNodal from "./Components/Admin/ViewNodal";
import UpdateNodal from "./Components/Admin/UpdateNodal";
import AddNodalHospital from "./Components/Admin/AddNodalHospital";
import ViewNodalHospital from "./Components/Admin/ViewNodalHospital";
import UpdateNodalHospital from "./Components/Admin/UpdateNodalHospital";

// Instrument Management
import AddInstrument from "./Components/Admin/AddInstrument";
import ViewInstrument from "./Components/Admin/ViewInstrument";
import UpdateInstrument from "./Components/Admin/UpdateInstrument";
import AddNodalInstrument from "./Components/Admin/AddNodalInstrument";
import ViewNodalInstrument from "./Components/Admin/ViewNodalInstruments";
import UpdateNodalInstrument from "./Components/Admin/UpdateNodalIstrument";

// Role Management
import AddRole from "./Components/Admin/AddRole";
import ViewRole from "./Components/Admin/ViewRole";
import UpdateRole from "./Components/Admin/UpdateRole";

// User Management
import AddPhlebotomist from "./Components/Admin/AddPhelobomist";
import ViewPhlebotomist from "./Components/Admin/ViewPhlebotomist";
import UpdatePhlebotomist from "./Components/Admin/UpdatePhlebotomist";
import AddReception from "./Components/Admin/AddReception";
import ViewReception from "./Components/Admin/ViewReception";
import UpdateReception from "./Components/Admin/UpdateReception";
import AddTechnician from "./Components/Admin/AddTechnician";
import ViewTechnician from "./Components/Admin/ViewTechnician";
import UpdateTechnician from "./Components/Admin/UpdateTechnician";

// Doctor Management
import AddReferalDoctor from "./Components/Admin/AddReferalDoctor";
import ViewReferalDoctor from "./Components/Admin/ViewReferalDoctor";
import UpdateReferalDoctor from "./Components/Admin/UpdateReferalDoctor";
import AddReportDoctor from "./Components/Admin/AddReportDoctor";
import ViewReportDoctor from "./Components/Admin/ViewReportDoctor";
import UpdateReportDoctor from "./Components/Admin/UpdateReportDoctor";
import DoctorRegistration from "./Components/Admin/DoctorRegistration";

// Profile & Investigation Management
import AddProfileMaster from "./Components/Admin/AddProfileMaster";
import ViewProfileMaster from "./Components/Admin/ViewProfileMaster";
import UpdateProfileMaster from "./Components/Admin/UpdateProfileMaster";
import AddProfileEntryMaster from "./Components/Admin/AddProfileEntryMaster";
import ViewProfileEntryMaster from "./Components/Admin/ViewProfileEntryMaster";
import UpdateProfileEntryMaster from "./Components/Admin/UpdateProfileEntryMaster";
import AddInvestigation from "./Components/Admin/AddInvestigation";
import ViewInvestigation from "./Components/Admin/ViewInvestigation";
import UpdateInvestigation from "./Components/Admin/UpdateInvestigation";
import AddInvestigation1 from "./Components/Admin/AddInvestigation1";
import ViewInvestigationDetails from "./Components/Admin/ViewInvestigationDetails";

// Master Data Management
import AddKitMaster from "./Components/Admin/AddKitMaster";
import ViewKitMaster from "./Components/Admin/ViewKitMaster";
import UpdateKitMaster from "./Components/Admin/UpdateKitMaster";
import AddReportTypeMaster from "./Components/Admin/AddReportTypeMaster";
import ViewReportTypeMaster from "./Components/Admin/ViewReportTypeMaster";
import UpdateReportTypeMaster from "./Components/Admin/UpdateReportTypeMaster";
import AddSpecimenType from "./Components/Admin/AddSpecimenType";
import ViewSpecimenType from "./Components/Admin/ViewSpecimenType";
import UpdateSpecimenType from "./Components/Admin/UpdateSpecimenType";
import AddColor from "./Components/Admin/AddColor";
import ViewColor from "./Components/Admin/ViewColor";
import UpdateColor from "./Components/Admin/UpdateColor";
import ViewLabToLab from "./Components/Admin/ViewLabToLab";
import AddLabToLab from "./Components/Admin/AddLabToLab";
import UpdateLabToLab from "./Components/Admin/UpdateLabToLab";
import AddPatientDetails from "./Components/Admin/AddPatientDetails";
import ViewPatientDetails from "./Components/Admin/ViewPatientDetails";
import AddUser from "./Components/Admin/AddUser";
import ViewUserDetails from "./Components/Admin/ViewUserDetails";
import AddUserMapping from "./Components/Admin/AddUserMapping";
import ViewUserMapping from "./Components/Admin/ViewUserMapping";
import AddAccessionMaster from "./Components/Admin/AddAccessionMaster";
import ViewAccessionMaster from "./Components/Admin/ViewAccessionMaster";
import UpdateAccessionMaster from "./Components/Admin/UpdateAccessionMaster";
import UpdateUserDetails from "./Components/Admin/UpdateUserDetails";
import UpdatePatientDetails from "./Components/Admin/UpdatePatientDetails";
import ViewDoctorRegistration from "./Components/Admin/ViewDoctorRegistration";
import UpdateDoctorRegistration from "./Components/Admin/UpdateDoctorRegistration";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  // Define access levels
  const hasAdminAccess = userRole === "admin";
  const hasDoctorAccess = userRole === "doctor";

  useEffect(() => {
    // Check authentication status when component mounts
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("roleType");
    setIsAuthenticated(!!token);
    setUserRole(role || "");
    setIsLoading(false);
  }, []);

  // Simple route protection
  const requireRole = (requiredRole, element) => {
    if (isLoading) return <div>Loading...</div>;
    // console.log("im here requiredRole", requiredRole);

    if (requiredRole === "admin" && !hasAdminAccess) return <Navigate to="/" />;
    if (requiredRole === "doctor" && !hasDoctorAccess && !hasAdminAccess)
      return <Navigate to="/" />;
    
    return element;
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>; // Or a loading spinner
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  // Public route component
  const PublicRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return !isAuthenticated ? children : <Navigate to="/" replace />;
  };

  // Create the router configuration
  const router = createBrowserRouter(
    [
      {
        path: "/login",
        element: (
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        ),
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <AdminsDashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: hasAdminAccess ? (
              <AdminHome />
            ) : (
              <Navigate to="/doctorreport" />
            ),
          },
          // Admin Management
          {
            path: "approval",
            element: requireRole("admin", <AdminApproval />),
          },
          {
            path: "approval-test",
            element: requireRole("admin", <AdminApprovalTest />),
          },
          {
            path: "doctorreport",
            element: requireRole("doctor", <DoctorReportDetail />),
          },
          {
            path: "doctorreportedit",
            element: requireRole("doctor", <DoctorReporteditDetail />),
          },
          // Department Management
          {
            path: "add-department",
            element: requireRole("admin", <AddDept />),
          },
          {
            path: "view-departments",
            element: requireRole("admin", <ViewDepartment />),
          },
          {
            path: "update-department/:id",
            element: requireRole("admin", <UpdateDept />),
          },
          {
            path: "add-subDpt",
            element: requireRole("admin", <AddSubDpt />),
          },
          {
            path: "view-subDpt",
            element: requireRole("admin", <ViewSubDpt />),
          },
          {
            path: "update-subDpt/:id",
            element: requireRole("admin", <UpdateSubDpt />),
          },
          // Hospital Management
          {
            path: "add-hospitaltype",
            element:
              userRole === "admin" ? <AddHospitalType /> : <Navigate to="/" />,
          },
          {
            path: "view-hospitaltype",
            element:
              userRole === "admin" ? <ViewHospitalType /> : <Navigate to="/" />,
          },
          {
            path: "update-hospitaltype/:id",
            element:
              userRole === "admin" ? (
                <UpdateHospitalType />
              ) : (
                <Navigate to="/" />
              ),
          },
          {
            path: "add-hospital",
            element:
              userRole === "admin" ? <AddHospital /> : <Navigate to="/" />,
          },
          {
            path: "view-hospital",
            element:
              userRole === "admin" ? <ViewHospital /> : <Navigate to="/" />,
          },
          {
            path: "doctor-registration",
            element:
              userRole === "admin" ? (
                <DoctorRegistration />
              ) : (
                <Navigate to="/" />
              ),
          },
{
            path: "view-doctor-registration-details",
            element:
              userRole === "admin" ? (
                <ViewDoctorRegistration />
              ) : (
                <Navigate to="/" />
              ),
          },
   
          {
            path: "update-doctor-registration/:id",
            element:
              userRole === "admin" ? <UpdateDoctorRegistration /> : <Navigate to="/" />,
          },

          {
            path: "update-hospital/:id",
            element:
              userRole === "admin" ? <UpdateHospital /> : <Navigate to="/" />,
          },
          // Nodal Management
          {
            path: "add-nodal",
            element: requireRole("admin", <AddNodal />),
          },
          {
            path: "view-nodal",
            element: requireRole("admin", <ViewNodal />),
          },
          {
            path: "update-nodal/:id",
            element: requireRole("admin", <UpdateNodal />),
          },
          {
            path: "add-nodal-hospital",
            element: requireRole("admin", <AddNodalHospital />),
          },
          {
            path: "view-nodal-hospitals",
            element: requireRole("admin", <ViewNodalHospital />),
          },
          {
            path: "update-nodal-hospital/:id",
            element: requireRole("admin", <UpdateNodalHospital />),
          },
          // Instrument Management
          {
            path: "add-instrument",
            element: requireRole("admin", <AddInstrument />),
          },
          {
            path: "view-instruments",
            element: requireRole("admin", <ViewInstrument />),
          },
          {
            path: "update-instrument/:id",
            element: requireRole("admin", <UpdateInstrument />),
          },
          {
            path: "add-nodal-instrument",
            element: requireRole("admin", <AddNodalInstrument />),
          },
          {
            path: "view-nodal-instruments",
            element: requireRole("admin", <ViewNodalInstrument />),
          },
          {
            path: "update-nodal-instrument",
            element: requireRole("admin", <UpdateNodalInstrument />),
          },
          {
            path: "view-labtolab",
            element: requireRole("admin", <ViewLabToLab />),
          },
          {
            path: "add-labtolab",
            element: requireRole("admin", <AddLabToLab />),
          },
          {
            path: "update-labtolab/:id",
            element: requireRole("admin", <UpdateLabToLab />),
          },
          // Role Management
          {
            path: "add-role",
            element: requireRole("admin", <AddRole />),
          },
          {
            path: "view-roles",
            element: requireRole("admin", <ViewRole />),
          },
          {
            path: "update-role",
            element: requireRole("admin", <UpdateRole />),
          },
          // User Management

          {
            path: "add-user",
            element: requireRole("admin", <AddUser />),
          },
          {
            path: "view-user-list",
            element: requireRole("admin", <ViewUserDetails />),
          },
          {
            path: "update-user-list/:id",
            element: requireRole("admin", <UpdateUserDetails />),
          },
          
          {
            path: "add-user-mapping",
            element: requireRole("admin", <AddUserMapping />),
          },

          {
            path: "view-user-mapping",
            element: requireRole("admin", <ViewUserMapping />),
          },
          
          {
            path: "update-role",
            element: requireRole("admin", <UpdateRole />),
          },

          {
            path: "add-phlebotomist",
            element: requireRole("admin", <AddPhlebotomist />),
          },
          {
            path: "view-phlebotomist",
            element: requireRole("admin", <ViewPhlebotomist />),
          },
          {
            path: "update-phlebotomist/:id",
            element: requireRole("admin", <UpdatePhlebotomist />),
          },
          {
            path: "add-reception",
            element: requireRole("admin", <AddReception />),
          },
          {
            path: "view-reception",
            element: requireRole("admin", <ViewReception />),
          },
          {
            path: "update-reception/:id",
            element: requireRole("admin", <UpdateReception />),
          },
          {
            path: "add-technician",
            element: requireRole("admin", <AddTechnician />),
          },
          {
            path: "view-technician",
            element: requireRole("admin", <ViewTechnician />),
          },
          {
            path: "update-technician/:id",
            element: requireRole("admin", <UpdateTechnician />),
          },
          // Doctor Management
          {
            path: "add-referal-doctor",
            element: requireRole("admin", <AddReferalDoctor />),
          },
          {
            path: "view-referal-doctor",
            element: requireRole("admin", <ViewReferalDoctor />),
          },
          {
            path: "update-referal-doctor",
            element: requireRole("admin", <UpdateReferalDoctor />),
          },
          {
            path: "add-report-doctor-master",
            element: requireRole("admin", <AddReportDoctor />),
          },
          {
            path: "view-report-doctor",
            element: requireRole("admin", <ViewReportDoctor />),
          },
          {
            path: "update-report-doctor-master",
            element: requireRole("admin", <UpdateReportDoctor />),
          },
          // Profile & Investigation Management
          {
            path: "add-profile-entry-master",
            element: requireRole("admin", <AddProfileEntryMaster />),
          },
          {
            path: "view-profile-entry-master",
            element: requireRole("admin", <ViewProfileEntryMaster />),
          },
          {
            path: "update-profile-entry-master/:id",
            element: requireRole("admin", <UpdateProfileEntryMaster />),
          },
          {
            path: "add-profile-master",
            element: requireRole("admin", <AddProfileMaster />),
          },
          {
            path: "view-profile-master",
            element: requireRole("admin", <ViewProfileMaster />),
          },
          {
            path: "update-profile-master/:id",
            element: requireRole("admin", <UpdateProfileMaster />),
          },
          {
            path: "add-investigation",
            element: requireRole("admin", <AddInvestigation />),
          },
          {
            path: "add-investigation1",
            element: requireRole("admin", <AddInvestigation1 />),
          },
          {
            path: "view-investigation",
            element: requireRole("admin", <ViewInvestigation />),
          },
          {
            path: "view-investigation-details/:id",
            element: requireRole("admin", <ViewInvestigationDetails />),
          },
          {
            path: "update-investigation/:id",
            element: requireRole("admin", <UpdateInvestigation />),
          },


          {
            path: "add-accession-master",
            element: requireRole("admin", <AddAccessionMaster />),
          },
          {
            path: "view-accession-master",
            element: requireRole("admin", <ViewAccessionMaster />),
          },
          {
            path: "update-add-accession-master/:id",
            element: requireRole("admin", <UpdateAccessionMaster />),
          },
          // Master Data Management
          {
            path: "add-report-type-master",
            element: requireRole("admin", <AddReportTypeMaster />),
          },
          {
            path: "view-report-type-master",
            element: requireRole("admin", <ViewReportTypeMaster />),
          },
          {
            path: "update-report-type-master",
            element: requireRole("admin", <UpdateReportTypeMaster />),
          },
          {
            path: "add-kit-master",
            element: requireRole("admin", <AddKitMaster />),
          },
          {
            path: "view-kit-master",
            element: requireRole("admin", <ViewKitMaster />),
          },
          {
            path: "update-kit-master/:id",
            element: requireRole("admin", <UpdateKitMaster />),
          },
          {
            path: "add-specimen-type",
            element: requireRole("admin", <AddSpecimenType />),
          },
          {
            path: "view-specimen-type",
            element: requireRole("admin", <ViewSpecimenType />),
          },
          {
            path: "update-specimen-type/:id",
            element: requireRole("admin", <UpdateSpecimenType />),
          },
          {
            path: "add-color",
            element: requireRole("admin", <AddColor />),
          },
          {
            path: "view-color",
            element: requireRole("admin", <ViewColor />),
          },
          {
            path: "update-color/:id",
            element: requireRole("admin", <UpdateColor />),
          },
          {
            path: "admin-add-patient-details",
            element: requireRole("admin", <AddPatientDetails />),
          },
          {
            path: "admin-view-patient-details",
            element: requireRole("admin", <ViewPatientDetails />),
          },
          {
            path: "admin-update-patient-details/:id",
            element: requireRole("admin", <UpdatePatientDetails />),
          },
          // Fallback route
          {
            path: "*",
            element: <Navigate to="/" replace />,
          },
        ],
      },
    ],
    {
      basename: "/",
    }
  );

  return <RouterProvider router={router} />;
}

export default App;