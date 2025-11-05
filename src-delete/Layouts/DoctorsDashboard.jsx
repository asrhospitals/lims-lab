import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import DoctorSidebar from "../Components/Admin/DoctorSidebar";
import DocHeroHeader from "../Components/Admin/DocHeroHeader";
import DocNavbar from "../Components/Admin/DocNavbar";

import AdminContextProvider from "../context/AdminContextProvider";

const DoctorsDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const sidebarWidth = isCollapsed ? 74 : 256;

  return (
    <AdminContextProvider>
      <div className="flex h-screen overflow-hidden font-sans">
        {/* Sidebar */}
        <DoctorSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Main Section */}
        <div
          className="flex flex-col flex-grow"
          style={{
            marginLeft: sidebarWidth,
            transition: "margin-left 0.3s ease",
          }}
        >
          {/* Fixed Navbar + HeroHeader */}
          <div
            className="fixed top-0 left-0 right-0 z-20"
            style={{ marginLeft: sidebarWidth }}
          >
            <DocNavbar 
              isCollapsed={isCollapsed}
              sidebarWidth={sidebarWidth}
              setIsCollapsed={setIsCollapsed}
            />
            {/* <DocHeroHeader sidebarWidth={sidebarWidth} /> */}
          </div>

          {/* Main Content */}
          <main
            className="overflow-y-auto bg-[#EFF7F8] py-6"
            style={{
              marginTop: "40px",
              height: "calc(100vh - 40px)",
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </AdminContextProvider>
  );
};

export default DoctorsDashboard;
