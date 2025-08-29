import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Login from "./LoginPage";
import Dashboard from "./Components/Phlebotomist/Dashboard";
import Home from "./Components/Phlebotomist/Home";

import PatientRegistration from "./Components/Phlebotomist/PatientRegistration";
import PatientRegistrationAdd from "./Components/Phlebotomist/PatientRegistrationAdd";

// import PatientGeneralRegistration from "./Components/Phlebotomist/PatientGeneralRegistration";
// import PatientGeneralRegistrationAdd from "./Components/Phlebotomist/PatientGeneralRegistrationAdd";
// import PatientGeneralRegistrationUpdate from "./Components/Phlebotomist/PatientGeneralRegistrationAdd";

// import PatientRegistrationWithBilling from "./Components/Phlebotomist/PatientRegistrationWithBilling";
// import PatientRegistrationWithBillingAdd from "./Components/Phlebotomist/PatientRegistrationWithBillingAdd";
// import PatientRegistrationWithBillingUpdate from "./Components/Phlebotomist/PatientRegistrationWithBillingAdd";

// import PatientPPPRegistration from "./Components/Phlebotomist/PatientPPPRegistration";
// import PatientPPPRegistrationAdd from "./Components/Phlebotomist/PatientPPPRegistrationAdd";
// import PatientPPPRegistrationUpdate from "./Components/Phlebotomist/PatientPPPRegistrationAdd";




// Manual JWT decoder without jwt-decode
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

function PhlebotomistApp() {
  const Checker = ({ element }) => {
    const token = localStorage.getItem("authToken");
    if (!token) return <Login />;

    const decoded = decodeJWT(token);
    if (!decoded || decoded.role !== "phlebotomist") {
      localStorage.clear();
      return <Login />;
    }

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
        // {
        //   path: "/patient-general-registration",
        //   element: <PatientGeneralRegistration />,
        // },
        // {
        //   path: "/patient-general-registration-add",
        //   element: <PatientGeneralRegistrationAdd />,
        // },
        // {
        //   path: "/patient-general-registration-update",
        //   element: <PatientGeneralRegistrationUpdate />,
        // },
              
        // {
        //   path: "/patient-registration-with-billing",
        //   element: <PatientRegistrationWithBilling />,
        // },
        // {
        //   path: "/patient-registration-with-billing-add",
        //   element: <PatientRegistrationWithBillingAdd />,
        // },{
        //   path: "/patient-registration-with-billing-update",
        //   element: <PatientRegistrationWithBillingUpdate />,
        // },

        
        // {
        //   path: "/patient-ppp-registration",
        //   element: <PatientPPPRegistration />,
        // },
        // {
        //   path: "/patient-ppp-registration-add",
        //   element: <PatientPPPRegistrationAdd />,
        // },
        // {
        //   path: "/patient-ppp-registration-update",
        //   element: <PatientPPPRegistrationUpdate />,
        // },
  
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
