import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Login from "./LoginPage";
import Dashboard from "./Components/Phlebotomist/Dashboard";
import Home from "./Components/Phlebotomist/Home";

import PatientRegistration from "./Components/Phlebotomist/PatientRegistration";
import PatientRegistrationAdd from "./Components/Phlebotomist/PatientRegistrationAdd";
import PatientReportEntry from "./Components/Phlebotomist/PatientReportEntry";
import PatientReportPrintSection from "./Components/Phlebotomist/Report/PatientReportPrintSection";
import PendingReportRegister from "./Components/Phlebotomist/Report/PendingReportRegister";
import DailyPatientRegister from "./Components/Phlebotomist/Report/DailyPatientRegister";
import DailyCriticalReportRegister from "./Components/Phlebotomist/Report/DailyCriticalReportRegister";
import DailyPatientReportRegister from "./Components/Phlebotomist/Report/DailyPatientReportRegister";
import RegistrationDetails from "./Components/Phlebotomist/Details/RegistrationDetails";
import TestDetails from "./Components/Phlebotomist/Details/TestDetails";
import RejectedSampleCollections from "./Components/Phlebotomist/RejectedSampleCollections";
import EditReportEntryData from "./Components/Phlebotomist/Report/EditReportEntryData";


// Manual JWT decoder without jwt-decode
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
} 

function PhlebotomistApp() {
  // const Checker = ({ element }) => {
  //   const token = localStorage.getItem("authToken");
  //   if (!token) return <Login />;
  //   console.log("inside PhlebotomistApp", token);

  //   const decoded = decodeJWT(token);
  //   if (!decoded || decoded.role !== "phlebotomist") {
  //     localStorage.clear();
  //   console.log("inside PhlebotomistApp localStorage clear");

  //     return <Login />;
  //   }
  //   console.log("inside PhlebotomistApp localStorage clear111111111");

  //   return element;
  // };

  const Checker = ({ element }) => {
    const token = localStorage.getItem("authToken");
    // if (!token) return <Login />;

    const decoded = decodeJWT(token);

    // Check the correct field
    if (!decoded || decoded.roleType !== "phlebotomist") {
      localStorage.clear();
      console.log("inside PhlebotomistApp localStorage clear");
      return <Login />;
    }

    console.log("inside PhlebotomistApp access granted");

    return element;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Checker element={<Dashboard />} />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/patient-registration",
          element: <PatientRegistration />,
        },
        {
          path: "/patient-registration-add",
          element: <PatientRegistrationAdd />,
        },
        {
          path: "/patient-report-entry",
          element: <PatientReportEntry />,
        },
        {
          path: "/patient-report-print-section",
          element: <PatientReportPrintSection />,
        },
        {
          path: "/pending-report-registration",
          element: <PendingReportRegister />,
        },
        {
          path: "/daily-patient-register",
          element: <DailyPatientRegister />,
        },
        {
          path: "/daily-critical-report-register",
          element: <DailyCriticalReportRegister />,
        },
        {
          path: "/daily-patient-report-register",
          element: <DailyPatientReportRegister />,
        },
        {
          path: "/patient-registartion-details",
          element: <RegistrationDetails />,
        },
        {
          path: "/test-details",
          element: <TestDetails />,
        },
        {
          path: "/rejected-sample-collections",
          element: <RejectedSampleCollections />,
        },
        {
          path: "/edit-report-entry/:id",
          element: <EditReportEntryData />,
        },
        {
          path: "*",
          element: <>Not found</>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default PhlebotomistApp;