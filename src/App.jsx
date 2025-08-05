import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Cookies from "js-cookie";
// import { Navigate } from "react-router-dom";
import AdminLogin from "./LoginPage";
import AdminHome from "./Components/Admin/DoctorHome";
import AdminsDashboard from "./Layouts/DoctorsDashboard";



import AddDept from "./Components/Admin/AddDept";
import ViewDepartment from "./Components/Admin/ViewDepartments";
import UpdateDept from "./Components/Admin/UpdateDept";
import AddSubDpt from "./Components/Admin/AddSubDept";
import ViewSubDpt from "./Components/Admin/ViewSubDept";
import UpdateSubDpt from "./Components/Admin/UpdateSubDept";
import AddHospitalType from "./Components/Admin/AddHospitalType";
import ViewHospitalType from "./Components/Admin/ViewHospitalType";
import UpdateHospitalType from "./Components/Admin/UpdateHospitalType";
import AddHospital from "./Components/Admin/AddHospital";
import ViewHospital from "./Components/Admin/ViewHospital";
import UpdateHospital from "./Components/Admin/UpdateHospital";
import AddLabToLab from "./Components/Admin/AddLabToLab";
import ViewLabToLab from "./Components/Admin/ViewLabToLab";
import AddNodalHospital from "./Components/Admin/AddNodalHospital";
import ViewNodalHospital from "./Components/Admin/ViewNodalHospital";
import AddInstrument from "./Components/Admin/AddInstrument";
import ViewInstrument from "./Components/Admin/ViewInstrument";
import UpdateLabToLab from "./Components/Admin/UpdateLabToLab";
import UpdateInstrument from "./Components/Admin/UpdateInstrument";
import ViewNodalInstrument from "./Components/Admin/ViewNodalInstruments";
import AddNodalInstrument from "./Components/Admin/AddNodalInstrument";
import UpdateNodalInstrument from "./Components/Admin/UpdateNodalIstrument";
import AddNodal from "./Components/Admin/AddNodal";
import ViewNodal from "./Components/Admin/ViewNodal";
import UpdateNodal from "./Components/Admin/UpdateNodal";
import UpdateNodalHospital from "./Components/Admin/UpdateNodalHospital";
import AddRole from "./Components/Admin/AddRole";
import ViewRole from "./Components/Admin/ViewRole";
import UpdateRole from "./Components/Admin/UpdateRole";




import ViewPhlebotomist from "./Components/Admin/ViewPhlebotomist";
import ViewReception from "./Components/Admin/ViewReception";
import ViewTechnician from "./Components/Admin/ViewTechnician";
import ViewReferalDoctor from "./Components/Admin/ViewReferalDoctor";
import ViewReportDoctor from "./Components/Admin/ViewReportDoctor";

import ViewProfileEntryMaster from "./Components/Admin/ViewProfileEntryMaster";
import ViewProfileMaster from "./Components/Admin/ViewProfileMaster";
import ViewInvestigation from "./Components/Admin/ViewInvestigation";

import ViewReportTypeMaster from "./Components/Admin/ViewReportTypeMaster";
import ViewKitMaster from "./Components/Admin/ViewKitMaster";
import ViewSpecimenType from "./Components/Admin/ViewSpecimenType";
import ViewColor from "./Components/Admin/ViewColor";



import AddPhlebotomist from "./Components/Admin/AddPhelobomist";
import AddReception from "./Components/Admin/AddReception";
import AddTechnician from "./Components/Admin/AddTechnician";
import AddReferalDoctor from "./Components/Admin/AddReferalDoctor";
import AddReportDoctor from "./Components/Admin/AddReportDoctor";

import AddProfileEntryMaster from "./Components/Admin/AddProfileEntryMaster";
import AddInvestigation from "./Components/Admin/AddInvestigation";
import AddKitMaster from "./Components/Admin/AddKitMaster";
import AddReportTypeMaster from "./Components/Admin/AddReportTypeMaster";
import AddSpecimenType from "./Components/Admin/AddSpecimenType";
import AddColor from "./Components/Admin/AddColor";
import AddProfileMaster from "./Components/Admin/AddProfileMaster";



import UpdatePhlebotomist from "./Components/Admin/UpdatePhlebotomist";
import UpdateReception from "./Components/Admin/UpdateReception";
import UpdateTechnician from "./Components/Admin/UpdateTechnician";
import UpdateReferalDoctor from "./Components/Admin/UpdateReferalDoctor";
import UpdateReportDoctor from "./Components/Admin/UpdateReportDoctor";

import UpdateProfileEntryMaster from "./Components/Admin/UpdateProfileEntryMaster";
import UpdateInvestigation from "./Components/Admin/UpdateInvestigation";
import UpdateKitMaster from "./Components/Admin/UpdateKitMaster";
import UpdateReportTypeMaster from "./Components/Admin/UpdateReportTypeMaster";
import UpdateSpecimenType from "./Components/Admin/UpdateSpecimenType";
import UpdateColor from "./Components/Admin/UpdateColor";

import AddInvestigation1 from "./Components/Admin/AddInvestigation1";

//doctor admin approval
import AdminApproval from "./Components/Admin/AdminApproval";
import DoctorRegistration from "./Components/Admin/DoctorRegistration";
import DoctorReportDetail from "./Components/Doctor/DoctorReportDetail";
import DoctorReporteditDetail from "./Components/Doctor/DoctorReporteditDetail";






function App() {
  const AdminChecker = ({ element }) => {
    const token = localStorage.getItem("authToken");
    return token ? element : <AdminLogin />;
  };
  const router = createBrowserRouter([
    {
      path: "/",
      // element: <AdminsDashboard />,
      element: <AdminChecker element={<AdminsDashboard />} />,
      children: [
        {
          path: "",
          element: <AdminHome />,
        },
        {
          path: "add-department",
          element: <AddDept />,
        },
        {
          path: "view-departments",
          element: <ViewDepartment />,
        },
        {
          path: "update-department",
          element: <UpdateDept />,
        },
        {
          path: "add-subDpt",
          element: <AddSubDpt />,
        },
        {
          path: "view-subDpt",
          element: <ViewSubDpt />,
        },
        {
          path: "update-subDpt",
          element: <UpdateSubDpt />,
        },
        {
          path: "add-hospitaltype",
          element: <AddHospitalType />,
        },
        {
          path: "view-hospitaltype",
          element: <ViewHospitalType />,
        },
        {
          path: "update-hospitaltype",
          element: <UpdateHospitalType />,
        },
        {
          path: "add-hospital",
          element: <AddHospital />,
        },
        {
          path: "view-hospital",
          element: <ViewHospital />,
        },
        {
          path: "update-hospital",
          element: <UpdateHospital />,
        },
        {
          path: "add-labtolab",
          element: <AddLabToLab />,
        },
        {
          path: "view-labtolab",
          element: <ViewLabToLab />,
        },
        {
          path: "update-labtolab",
          element: <UpdateLabToLab />,
        },
        {
          path: "add-nodal",
          element: <AddNodal />,
        },
        {
          path: "view-nodal",
          element: <ViewNodal />,
        },
        {
          path: "update-nodal",
          element: <UpdateNodal />,
        },
        {
          path: "add-nodal-hospital",
          element: <AddNodalHospital />,
        },
        {
          path: "view-nodal-hospitals",
          element: <ViewNodalHospital />,
        },
        {
          path: "update-nodal-hospital",
          element: <UpdateNodalHospital />,
        },
        {
          path: "add-instrument",
          element: <AddInstrument />,
        },
        {
          path: "view-instruments",
          element: <ViewInstrument />,
        },
        {
          path: "update-instrument",
          element: <UpdateInstrument />,
        },
        {
          path: "add-nodal-instrument",
          element: <AddNodalInstrument />,
        },
        {
          path: "view-nodal-instruments",
          element: <ViewNodalInstrument />,
        },
        {
          path: "update-nodal-instrument",
          element: <UpdateNodalInstrument />,
        },
        {
          path: "add-role",
          element: <AddRole />,
        },
        {
          path: "view-roles",
          element: <ViewRole />,
        },
        {
          path: "update-role",
          element: <UpdateRole />,
        },




        {
          path: "add-phlebotomist",
          element: <AddPhlebotomist />,
        },
        {
          path: "view-phlebotomist",
          element: <ViewPhlebotomist />,
        },
        {
          path: "update-phlebotomist",
          element: <UpdatePhlebotomist />,
        },


        {
          path: "add-reception",
          element: <AddReception />,
        },
        {
          path: "view-reception",
          element: <ViewReception />,
        },
        {
          path: "update-reception",
          element: <UpdateReception />,
        },

        {
          path: "add-technician",
          element: <AddTechnician />,
        },
        {
          path: "view-technician",
          element: <ViewTechnician />,
        },
        {
          path: "update-technician",
          element: <UpdateTechnician />,
        },


        {
          path: "add-referal-doctor",
          element: <AddReferalDoctor />,
        },
        {
          path: "view-referal-doctor",
          element: <ViewReferalDoctor />,
        },
        {
          path: "update-referal-doctor",
          element: <UpdateReferalDoctor />,
        },
        {
          path: "add-report-doctor-master",
          element: <AddReportDoctor />,
        },
        {
          path: "view-report-doctor",
          element: <ViewReportDoctor />,
        },
        {
          path: "update-report-doctor-master",
          element: <UpdateReportDoctor />,
        },


        {
          path: "add-profile-entry-master",
          element: <AddProfileEntryMaster />,
        },
        {
          path: "view-profile-entry-master",
          element: <ViewProfileEntryMaster />,
        },
        {
          path: "update-profile-entry-master",
          element: <UpdateProfileEntryMaster />,
        },

        {
          path: "add-profile-master",
          element: <AddProfileMaster />,
        },
        {
          path: "view-profile-master",
          element: <ViewProfileMaster />,
        },

        
        {
          path: "add-investigation",
          element: <AddInvestigation />,
        },
        {
          // new design
          path: "add-investigation1",
          element: <AddInvestigation1 />,
        },
        {
          path: "view-investigation",
          element: <ViewInvestigation />,
        },
        {
          path: "update-investigation",
          element: <UpdateInvestigation />,
        },


        {
          path: "approval",
          element: <AdminApproval />,
        },
        {
          path: "doctor-registration",
          element: <DoctorRegistration />,
        },
        {
          path: "doctorreport",
          element: <DoctorReportDetail />,
        },
        {
          path: "doctorreportedit",
          element: <DoctorReporteditDetail />,
        },

        {
          path: "add-report-type-master",
          element: <AddReportTypeMaster />,
        },
        {
          path: "view-report-type-master",
          element: <ViewReportTypeMaster />,
        },
        {
          path: "update-report-type-master",
          element: <UpdateReportTypeMaster />,
        },
        
        {
          path: "add-kit-master",
          element: <AddKitMaster />,
        },
        {
          path: "view-kit-master",
          element: <ViewKitMaster />,
        },
        {
          path: "update-kit-master",
          element: <UpdateKitMaster />,
        },


        
        {
          path: "add-specimen-type",
          element: <AddSpecimenType />,
        },
        {
          path: "view-specimen-types",
          element: <ViewSpecimenType />,
        },
        {
          path: "update-specimen-type",
          element: <UpdateSpecimenType />,
        },
        {
          path: "add-color",
          element: <AddColor />,
        },
        {
          path: "view-colors",
          element: <ViewColor />,
        },
        {
          path: "update-color",
          element: <UpdateColor />,
        },


        {
          path: "*",
          element: <>Not found</>,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
     
    </>
  );
}

export default App;
