import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Login from "./LoginPage";
import Dashboard from "./Components/Receptionist/Dashboard";
import Home from "./Components/Receptionist/Home";
import AddPatientRegistrationRecp from "./Components/Receptionist/AddPatientRegistrationRecp";
import PatientRegistrationRecp from "./Components/Receptionist/PatientRegistrationRecp";



// Manual JWT decoder without jwt-decode
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
} 

function ReceptionApp() {
 
  const Checker = ({ element }) => {
    const token = localStorage.getItem("authToken");
    if (!token) return <Login />;


    localStorage.setItem("hospital_name", 'Himalaya Multispeciality Hospital');
    localStorage.setItem("hospital_id", '2');

    const decoded = decodeJWT(token);

    // Check the correct field
    if (!decoded || decoded.roleType !== "reception") {
      localStorage.clear();
      console.log("inside Receptionist localStorage clear");
      return <Login />;
    }

    console.log("inside Receptionist access granted");

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
          path: "/add-patient-registration-recp",
          element: <AddPatientRegistrationRecp />,
        },
        {
          path: "/patient-registration-recp",
          element: <PatientRegistrationRecp />,
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

export default ReceptionApp;