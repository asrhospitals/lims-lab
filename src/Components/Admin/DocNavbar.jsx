import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { RiSearchLine } from "react-icons/ri";

const DocNavbar = ({ isCollapsed, isHovered, sidebarWidth }) => {
  const [showDropdown, setShowDropdown] = useState(null);
  const navigate = useNavigate();

  const sidebarExpanded = !isCollapsed || isHovered;

  const handleToggle = (index) => {
    if (transitioning) return;
    setTransitioning(true);
    setExpandedItem(expandedItem === index ? null : index);
    setTimeout(() => setTransitioning(false), 300);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userid");
    localStorage.removeItem("role");

    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const toggleDropdown = (menu) => {
    setShowDropdown((prev) => (prev === menu ? null : menu));
  };

  return (
    <header
      className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b shadow-lg fixed top-0 right-0 "
      style={{
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth}px)`,
        transition: "left 0.3s ease, width 0.3s ease",
        height: "64px",
        
      }}
    >
      {/* Search */}
      <div className="flex-grow max-w-md relative">
        <input
          type="text"
          placeholder="Type here to search..."
          className="w-full pl-10 pr-4 py-2 text-gray-700 border rounded-lg focus:outline-none bg-[#CEEBEE]"
        />
        <RiSearchLine className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-4">
        {/* Country Dropdown */}
        {/* <div className="relative">
          <button
            onClick={() => toggleDropdown("country")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaGlobe className="text-lg" />
          </button>
          {showDropdown === "country" && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md p-2">
              {["fr", "us", "in", "br", "gb"].map((code) => (
                <a href="/" key={code} className="block p-1 hover:bg-gray-100">
                  <img
                    src={`https://flagcdn.com/w40/${code}.png`}
                    className="h-5 w-5"
                    alt={code}
                  />
                </a>
              ))}
            </div>
          )}
        </div> */}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("notifications")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaBell className="text-lg" />
          </button>
          {showDropdown === "notifications" && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white shadow-md rounded-md p-4">
              <h5 className="text-blue-500 font-semibold mb-2">Activity</h5>
              <ul className="space-y-4 text-sm">
                <li>
                  <strong>New Massage:</strong> 23
                  <p className="text-xs text-gray-400">10:20 AM Today</p>
                </li>
                <li>
                  <strong>New Massage:</strong> 28
                  <p className="text-xs text-gray-400">04:30 PM Today</p>
                </li>
              </ul>
              <a
                href="/"
                className="block text-center mt-3 text-blue-600 hover:underline"
              >
                View all
              </a>
            </div>
          )}
        </div>

        {/* Messages */}
        {/* <div className="relative">
          <button
            onClick={() => toggleDropdown("messages")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaEnvelope className="text-lg" />
          </button>
          {showDropdown === "messages" && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white shadow-md rounded-md p-4">
              <h5 className="text-blue-500 font-semibold mb-2">Messages</h5>
              <div className="space-y-3 text-sm">
                {["Albert Winters", "Van Robinson", "Mara Coffey"].map(
                  (name, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <img
                        src={`/assets/images/doctor${i + 1}.png`}
                        alt={name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-xs text-gray-600">
                          Today, {7 + i}:30PM
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
              <a
                href="/"
                className="block text-center mt-3 text-blue-600 hover:underline"
              >
                View all
              </a>
            </div>
          )}
        </div> */}

        {/* User Profile */}
        <div className="relative" >
          <button
            onClick={() => toggleDropdown("user")}
            className="relative flex items-center space-x-2"
          >
            <img
              // src="https://i.pravatar.cc/40"
              src="/user.jpg"
              alt="User"
              className="h-10 w-10 rounded-full"
            />
            <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
          </button>
          {showDropdown === "user" && (
            <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-48 p-3" >
              <p className="text-sm text-gray-500">Admin</p>
              <h6 className="font-semibold">DrReddy</h6>
              <button onClick={handleLogout}>
                <IoIosLogOut className="text-lg mr-1" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DocNavbar;
