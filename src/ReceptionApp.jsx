import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminLogin from "./LoginPage";
import AdminsDashboard from "./Layouts/DoctorsDashboard";
import AdminHome from "./Components/Admin/DoctorHome";


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
