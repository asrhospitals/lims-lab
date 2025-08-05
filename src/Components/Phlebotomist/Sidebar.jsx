import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FaChevronDown, FaChevronRight, FaHome, FaCog } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { RiCellphoneLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa";

import { FaUserDoctor } from "react-icons/fa6";

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isHovered,
  setIsHovered,
}) => {
  const [expandedItem, setExpandedItem] = useState(null);

  const user = {
    name: "DrReddy",
    shortName: "DrReddy",
    department: "Phlebotomist",
    shortDept: "Phlebotomist",
    avatar: "/doctor_assets/user.jpg",
  };

  const menuItems = [
    { type: "label", label: "Phlebotomist Panel" },
    { name: "Dashboard", icon: <FaHome />, link: "" },
    // {
    //   name: "Appointments",
    //   icon: <IoCalendarOutline />,
    //   children: [
    //     { name: "View Appointments", link: "view-appointments" },
    //     { name: "Schedule Appointments", link: "schedule-appointments" },
    //   ],
    // },
    {
      name: "Master",
      icon: <FaUserDoctor />,
      children: [

        { name: "Patient", link: "view-patient" },

        
        // { name: "Hospital", link: "view-hospital" },
        // { name: "Nodal", link: "view-nodal" },
        
        // { name: "Nodal Hospital", link: "/view-nodal-hospitals" },
        // { name: "Instrument", link: "/view-instruments" },
        // { name: "Nodal Instrument", link: "/view-nodal-instruments" },

        // { name: "Lab", link: "/view-labtolab" },
        // { name: "Role", link: "/view-roles" },


      


        



      ],
    },





    // {
    //   name: "Color Master",
    //   icon: <FaUserDoctor />,
    //   children: [
    //     { name: "Add Color", link: "add-color" },
    //     { name: "View Colors", link: "view-colors" },
    //   ],
    // },

    // {
    //   name: "Specimen Type Master",
    //   icon: <FaUserDoctor />,
    //   children: [
    //     { name: "Add Specimen Type", link: "add-specimen-type" },
    //     { name: "View Specimen Types", link: "view-specimen-types" },
    //   ],
    // },

    // { name: "Settings", icon: <FaCog />, link: "settings" },
    
  ];

  const handleToggle = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const sidebarExpanded = !isCollapsed || isHovered;
  const transitionClass = "transition-all duration-300 ease-in-out";

  // ScrollbarStyles component for reusable scrollbar styling
  // ScrollbarStyles component for reusable scrollbar styling
  // const ScrollbarStyles = () => (
  //   <style jsx>{`

  //     .custom-scrollbar {
  //       overflow-y: auto;
  //       max-height: 100vh; /* Allow full viewport height scroll */
  //     }

  //     .custom-scrollbar::-webkit-scrollbar {
  //       width: 8px; /* Overall scrollbar width */
  //       height: 8px; /* Overall scrollbar height (for horizontal scrollbars) */
  //     }

  //     /* Track styling */
  //     .custom-scrollbar::-webkit-scrollbar-track {
  //       background: transparent;
  //       border-radius: 10px;
  //       margin: 4px 0; /* Creates space at top/bottom of track */
  //       width: 6px; /* Track width */
  //     }

  //     /* Thumb styling */
  //     .custom-scrollbar::-webkit-scrollbar-thumb {
  //       background: transparent;
  //       border-radius: 10px;
  //       min-height: 40px; /* Minimum thumb height */
  //       width: 6px; /* Thumb width */
  //     }

  //     /* Hover states */
  //     .custom-scrollbar:hover::-webkit-scrollbar-thumb {
  //       background: #cbd5e1;
  //       height: 60px; /* You can set specific height on hover if needed */
  //     }

  //     .custom-scrollbar:hover::-webkit-scrollbar-track {
  //       background: #f1f5f9;
  //     }
  //   `}
    
    
    
    
    
  //   </style>



    
  // );




  const ScrollbarStyles = () => (
  <style jsx>{`
    .custom-scrollbar {
      overflow-y: auto;
      max-height: 100vh; /* Allow full viewport height scroll */
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 8px; /* Overall scrollbar width */
      height: 8px; /* Overall scrollbar height (for horizontal scrollbars) */
    }

    /* Track styling */
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 10px;
      margin: 4px 0; /* Creates space at top/bottom of track */
      width: 6px; /* Track width */
    }

    /* Thumb styling */
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 10px;
      min-height: 40px; /* Minimum thumb height */
      width: 6px; /* Thumb width */
    }

    /* Hover states */
    .custom-scrollbar:hover::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      height: 60px; /* You can set specific height on hover if needed */
    }

    .custom-scrollbar:hover::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .sidebar-scroll-container {
      height: 100vh;       /* full viewport height */
      display: flex;
      flex-direction: column;
      overflow-y: auto;    /* enable scroll */
      scrollbar-width: thin;
      scrollbar-color: #238781 #e0e0e0;
    }

    /* Nested scrollable master section */
    .master-scroll-section {
      max-height: 400px;   /* or any height you want */
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #238781 #e0e0e0;
      margin-top: 10px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
  `}</style>
);


  return (
    <nav
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-sm z-40 flex flex-col
      ${transitionClass} ${sidebarExpanded ? "w-64" : "w-20"}`}

    >
      {/* Header Section */}
      <div className="flex flex-col">
        <div
          className={`flex items-center ${
            sidebarExpanded ? "justify-between" : "justify-center"
          } py-3 px-4 border-b ${transitionClass}`}
        >
          {sidebarExpanded ? (
            <>
              <div className="flex items-center gap-3">
                <img
                  src="/img/Reddy.jpeg"
                  className="w-10 h-10 rounded-lg"
                  alt="Logo"
                />
                <span className="text-lg font-bold whitespace-nowrap text-gray-800">
                  ASR Hospitals
                </span>
              </div>
              <button
                onClick={() => setIsCollapsed((prev) => !prev)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <HiOutlineMenuAlt3 className="text-xl text-gray-600 hover:rotate-90 ${transitionClass}" />
              </button>
            </>
          ) : (
            <img
              src="/img/favicon.jpeg"
              className="w-10 h-10 rounded-lg"
              alt="Logo"
            />
          )}
        </div>

        {/* User Info */}
        <div
          className={`flex items-center border-b ${
            sidebarExpanded ? "flex-col p-4" : "flex-col justify-center p-3"
          } ${transitionClass}`}
        >
          <img
            src={user.avatar}
            alt="User"
            className={`rounded-full border-2 border-gray-300 object-cover ${
              sidebarExpanded ? "w-14 h-14" : "w-14 h-14"
            }`}
          />
          {sidebarExpanded ? (
            <div className="mt-2 text-center">
              <h6 className="font-semibold text-sm text-gray-800">
                {user.name}
              </h6>
              <p className="text-gray-500 text-sm mt-1">{user.department}</p>
            </div>
          ) : (
            <div className=" mt-2 text-center">
              <h6 className="font-semibold text-sm text-gray-800">
                {user.shortName}
              </h6>
              <p className="text-gray-500 text-sm mt-1">{user.shortDept}</p>
            </div>
          )}
        </div>
      </div>
      {/* Navigation Items */}
      <ScrollbarStyles />
      <div className="sidebar-scroll-container custom-scrollbar flex-1 min-h-0 overflow-y-auto py-3 px-2">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-1">
            {item.type === "label" ? (
              sidebarExpanded && (
                <div className="text-xs uppercase text-gray-500 px-3 py-2 font-medium">
                  {item.label}
                </div>
              )
            ) : item.children ? (
              <div>
                <button
                  onClick={() => handleToggle(index)}
                  className={`flex items-center w-full p-2 rounded-lg ${transitionClass} ${
                    sidebarExpanded
                      ? "justify-between px-3"
                      : "justify-center px-2"
                  } ${
                    expandedItem === index
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`text-lg ${sidebarExpanded ? "mr-3" : ""}`}
                    >
                      {item.icon}
                    </span>
                    {sidebarExpanded && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </div>
                  {sidebarExpanded && (
                    <span className="text-xs text-gray-500">
                      {expandedItem === index ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </span>
                  )}
                </button>

                <div
                  className={`${transitionClass} master-scroll-section overflow-hidden ${
                    expandedItem === index ? "mt-1" : ""
                  }`}
                  style={{
                    maxHeight: expandedItem === index ? "500px" : "0px",
                    opacity: expandedItem === index ? 1 : 0,
                  }}
                >
                  {item.children.map((child, childIndex) => (
                    <NavLink
                      key={childIndex}
                      to={child.link}
                      className={({ isActive }) =>
                        `block p-2 mx-1 text-sm rounded-lg ${transitionClass} ${
                          sidebarExpanded
                            ? "text-left px-3"
                            : "text-center px-2"
                        } ${
                          isActive
                            ? "bg-teal-700 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                      }
                    >
                      {sidebarExpanded ? (
                        <div className="flex flex-row align-middle gap-2 text-md">
                          <FaRegCircle className="text-xl" />
                          {child.name}
                        </div>
                      ) : (
                        child.name.charAt(0)
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${transitionClass} ${
                    sidebarExpanded
                      ? "px-3"
                      : "justify-center items-center px-3"
                  } ${
                    isActive
                      ? "bg-[#E5F5F4] text-[#238781]"
                      : "text-gray-900 hover:bg-[#E5F5F4]"
                  }`
                }
              >
                <span className={`text-lg ${sidebarExpanded ? "mr-3" : ""}`}>
                  {item.icon}
                </span>
                {sidebarExpanded && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </NavLink>
            )}
          </div>
        ))}
      </div>
      <ScrollbarStyles />

      {/* Footer Section */}
      {sidebarExpanded && (
        <div className={`p-3 border-t text-sm ${transitionClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-700">0987654321</h5>
              <p className="text-xs text-gray-500 mt-1">Customer Support</p>
            </div>
            <RiCellphoneLine className="text-lg text-blue-500" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;

