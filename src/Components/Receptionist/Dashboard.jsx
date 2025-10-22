import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeroHeader from "./HeroHeader";
import Navbar from "./Navbar";

import AdminContextProvider from "../../context/AdminContextProvider";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarWidth = isCollapsed ? 74 : 256;

  return (
    <AdminContextProvider>
      <div className="flex h-screen overflow-hidden font-sans">
        {/* Sidebar */}
        <Sidebar
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
            <Navbar 
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

export default Dashboard;
