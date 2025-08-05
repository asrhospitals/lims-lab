import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import AdminLogin from "./LoginPage";
import AdminsDashboard from "./Components/Phlebotomist/Dashboard";
import AdminHome from "./Components/Phlebotomist/Home";

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
  const AdminChecker = ({ element }) => {
    const token = localStorage.getItem("authToken");
    if (!token) return <AdminLogin />;

    const decoded = decodeJWT(token);
    if (!decoded || decoded.role !== "phlebotomist") {
      localStorage.clear();
      return <AdminLogin />;
    }

    return element;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AdminChecker element={<AdminsDashboard />} />,
      children: [
        {
          path: "",
          element: <AdminHome />,
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
