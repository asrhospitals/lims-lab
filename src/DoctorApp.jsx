import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState } from 'react';
import DoctorReport from './Components/Doctor/DoctorReportDetail';
import DoctorReportEdit from './Components/Doctor/DoctorReporteditDetail';
import DoctorSidebar from './Components/Admin/DoctorSidebar';
import DoctorNavbar from './Components/Doctor/DoctorNavbar';
import AdminContextProvider from './context/AdminContextProvider';

function DoctorLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sidebarExpanded = !isCollapsed || isHovered;
  const sidebarWidth = sidebarExpanded ? 256 : 74;

  return (
    <AdminContextProvider>
      <div className="flex h-screen overflow-hidden font-sans">
        <DoctorSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
        />

        <div
          className="flex flex-col flex-grow"
          style={{
            marginLeft: sidebarWidth,
            transition: "margin-left 0.3s ease",
          }}
        >
          <div
            className="fixed top-0 left-0 right-0 z-20"
            style={{ marginLeft: sidebarWidth }}
          >
            <DoctorNavbar
              sidebarWidth={sidebarWidth}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isHovered={isHovered}
            />
          </div>

          <main className="flex-1 overflow-auto mt-16">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminContextProvider>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <DoctorLayout />,
    errorElement: <div>Page not found</div>,
    children: [
      {
        path: "doctorreport",
        element: <DoctorReport />,
      },
      {
        path: "doctorreportedit",
        element: <DoctorReportEdit />,
      },
      {
        index: true,
        element: <DoctorReport />,
      },
    ],
  },
]);

export default function DoctorApp() {
  return <RouterProvider router={router} />;
}
