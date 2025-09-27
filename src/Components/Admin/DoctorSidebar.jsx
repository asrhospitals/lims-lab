import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FaChevronDown, FaChevronRight, FaHome } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { RiCellphoneLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";

const DoctorSidebar = ({
  isCollapsed,
  setIsCollapsed,
  isHovered,
  setIsHovered,
}) => {
  const [expandedItem, setExpandedItem] = useState(null);
  
  // Get user role from localStorage
  const userRole = localStorage.getItem("roleType") || "";
  
  const user = {
    name: "DrReddy",
    shortName: "DrReddy",
    department: "Doctor",
    shortDept: "Doctor",
    avatar: "/doctor_assets/user.jpg",
    role: userRole
  };

  // Define all possible menu items with their required roles
  const allMenuItems = [
    { type: "label", label: "Admin Panel" },
    { name: "Dashboard", icon: <FaHome />, link: "", roles: ["admin", "doctor"] },
    { 
      name: "Doctor Approval", 
      icon: <FaUserDoctor />, 
      link: "/approval",
      roles: ["admin"] 
    },
    {
      name: "Doctor Master",
      icon: <FaUserDoctor />,
      roles: ["admin", "doctor"],
      children: [
        { name: "Doctor Report", link: "/doctorreport", roles: ["admin", "doctor"] }
      ]
    },
    {
      name: "Master",
      icon: <FaUserDoctor />,
      roles: ["admin"],
      children: [
        { name: "Department", link: "view-departments" },
        { name: "Sub-Department", link: "view-subdpt" },
        { name: "Hospital Type", link: "view-hospitaltype" },
        { name: "Hospital", link: "view-hospital" },
        { name: "Nodal", link: "view-nodal" },
        { name: "Nodal Hospital", link: "/view-nodal-hospitals" },
        { name: "Instrument", link: "/view-instruments" },
        { name: "Nodal Instrument", link: "/view-nodal-instruments" },
        { name: "Lab", link: "/view-labtolab" },
        { name: "Role", link: "/view-roles" },
        { name: "Phelobomist", link: "/view-phlebotomist" },
        { name: "Reception Master", link: "/view-reception" },
        { name: "Technician Master", link: "/view-technician" },
        { name: "Referal Doctor", link: "/view-referal-doctor" },
        { name: "Report Doctor", link: "/view-report-doctor" },
        { name: "Profile Entry Master", link: "/view-profile-entry-master" },
        { name: "Profile Master", link: "/view-profile-master" },
        { name: "Investigation Master", link: "/view-investigation" },
        { name: "Patient Registration", link: "/admin-view-patient-details" },
        { name: "Report Type Master", link: "/view-report-type-master" },
        { name: "Kit Master", link: "/view-kit-master" },
        { name: "Specimen Type Master", link: "/view-specimen-types" },
        { name: "Color Master", link: "/view-colors" },
        { name: "Doctor Registration", link: "/doctor-registration" },
      ],
    },
    {
      name: "Patient Registration",
      icon: <FaUserDoctor />,
      roles: ["admin", "doctor"],
      link: "/admin-add-patient-details",
    },
  ];

  // Filter menu items based on user role
  const filterMenuItems = (items) => {
    return items.filter(item => {
      if (item.roles && !item.roles.includes(user.role)) {
        return false;
      }
      if (item.children) {
        item.children = filterMenuItems(item.children);
        return item.children.length > 0; // Only show parent if it has visible children
      }
      return true;
    });
  };

  const menuItems = filterMenuItems(allMenuItems);

  const handleToggle = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const sidebarExpanded = !isCollapsed || isHovered;
  const transitionClass = "transition-all duration-300 ease-in-out";

  // Reset expandedItem when sidebar is collapsed
  if (isCollapsed && expandedItem !== null) {
    setExpandedItem(null);
  }

  return (
    <nav
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-sm z-40 flex flex-col ${transitionClass} ${
        sidebarExpanded ? "w-64" : "w-20"
      }`}
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
            <div className="mt-2 text-center">
              <h6 className="font-semibold text-sm text-gray-800">
                {user.shortName}
              </h6>
              <p className="text-gray-500 text-sm mt-1">{user.shortDept}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 min-h-0 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-track-rounded-full hover:scrollbar-thumb-gray-400">
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

                {/* Scrollable Master Section */}
                <div
                  className={`overflow-hidden ${transitionClass} ${
                    expandedItem === index
                      ? "max-h-[500px] opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="max-h-[400px] overflow-y-auto pl-4 border-l border-gray-200 scrollbar-thin scrollbar-thumb-teal-700 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                    {item.children.map((child, childIndex) => (
                      <NavLink
                        key={childIndex}
                        to={child.link}
                        className={({ isActive }) =>
                          `block p-2 mx-1 text-sm rounded-lg ${transitionClass} ${
                            sidebarExpanded ? "text-left px-3" : "text-center px-2"
                          } ${
                            isActive
                              ? "bg-teal-700 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`
                        }
                      >
                        {sidebarExpanded ? (
                          <div className="flex flex-row items-center gap-2 text-md">
                            <FaRegCircle className="text-xs" />
                            <span>{child.name}</span>
                          </div>
                        ) : (
                          <span className="flex justify-center">{child.name.charAt(0)}</span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${transitionClass} ${
                    sidebarExpanded ? "px-3" : "justify-center items-center px-3"
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

export default DoctorSidebar;