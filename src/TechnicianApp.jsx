
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Login from "./LoginPage";
import DashboardTechnician from "./Components/Technician/DashboardTechnician";

import TechnicianDashboard from "./Components/Technician/TechnicianDashboard";




// Manual JWT decoder without jwt-decode
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

function TechnicianApp() {
  const Checker = ({ element }) => {
    const token = localStorage.getItem("authToken");
    if (!token) return <Login />;

    const decoded = decodeJWT(token);
    if (!decoded || decoded.role !== "technician") {
      localStorage.clear();
      return <Login />;
    }

    return element;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Checker element={<DashboardTechnician />} />,
      children: [
        {
          path: "",
          element: <TechnicianDashboard />,
        },
        {
          path: "/technician-dashboard",
          element: <TechnicianDashboard />,
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

export default TechnicianApp;
