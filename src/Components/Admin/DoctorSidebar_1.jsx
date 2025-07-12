import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FaChevronDown, FaChevronRight, FaHome, FaCog } from "react-icons/fa";
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

  const user = {
    name: "DrReddy",
    shortName: "DrReddy",
    department: "Doctor",
    shortDept: "Doctor",
    avatar: "/doctor_assets/user.jpg",
  };

  const menuItems = [
    { type: "label", label: "Doctor Panel" },
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
        // { name: "Add Department", link: "add-department" },
        { name: "Department", link: "view-departments" },
        // { name: "Add Sub-Department", link: "add-subdpt" },
        { name: "Sub-Department", link: "view-subdpt" },
        // { name: "Add Hos. Type", link: "add-hospitaltype" },
        { name: "Hospital Type", link: "view-hospitaltype" },
        // { name: "Add Hospital", link: "add-hospital" },
        { name: "Hospital", link: "view-hospital" },
        { name: "Nodal", link: "view-nodal" },
        { name: "Lab", link: "/view-labtolab" },
        { name: "Nodal Hospital", link: "/view-nodal-hospitals" },
        { name: "Instrument", link: "/view-instruments" },
        { name: "Nodal Instrument", link: "/view-nodal-instruments" },
        { name: "Role", link: "/view-roles" },
        { name: "Phelobomist", link: "/view-phelobotomist" },
      ],
    },

    // {
    //   name: "Hospital",
    //   icon: <RiEmpathizeLine />,
    //   children: [
    //     { name: "Add Hospital", link: "add-hospital" },
    //     { name: "View Hospital", link: "view-hospital" },
    //   ],
    // },
    // {
    //   name: "Blogs",
    //   icon: <RiEmpathizeLine />,
    //   children: [
    //     { name: "Publish Blogs", link: "publish-blogs" },
    //     { name: "View Blogs", link: "view-blogs" },
    //   ],
    // },
    // {
    //   name: "Videos",
    //   icon: <RiEmpathizeLine />,
    //   children: [
    //     { name: "Publish Video", link: "publish-video" },
    //     { name: "View videos", link: "view-videos" },
    //   ],
    // },
    // {
    //   name: "Books",
    //   icon: <RiEmpathizeLine />,
    //   children: [
    //     { name: "Publish Book", link: "publish-book" },
    //     { name: "View Books", link: "view-books" },
    //   ],
    // },
    // {
    //   name: "Meditation",
    //   icon: <RiEmpathizeLine />,
    //   children: [
    //     { name: "Add Meditation", link: "publish-meditation" },
    //     { name: "View Meditations", link: "view-meditations" },
    //   ],
    // },
    // {
    //   name: "Reports",
    //   icon: <RiEmpathizeLine />,
    //   children: [
    //     { name: "Generate Report", link: "generate-report" },
    //     { name: "View Reports", link: "view-reports" },
    //   ],
    // },
    { name: "Settings", icon: <FaCog />, link: "settings" },
  ];

  const handleToggle = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const sidebarExpanded = !isCollapsed || isHovered;
  const transitionClass = "transition-all duration-300 ease-in-out";

  // ScrollbarStyles component for reusable scrollbar styling
  // ScrollbarStyles component for reusable scrollbar styling
  const ScrollbarStyles = () => (
    <style jsx>{`
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
    `}</style>
  );

  return (
    <nav
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm z-40 flex flex-col
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
      <div className="custom-scrollbar flex-1 overflow-y-auto py-3 px-2">
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
                  className={`${transitionClass} overflow-hidden ${
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

export default DoctorSidebar;

// import React, { useState, useRef } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { HiOutlineMenuAlt3 } from "react-icons/hi";
// import { FaChevronDown, FaChevronRight, FaHome, FaCog } from "react-icons/fa";
// import { IoCalendarOutline } from "react-icons/io5";
// import { RiEmpathizeLine } from "react-icons/ri";
// import { FaUserDoctor } from "react-icons/fa6";

// import { RiCellphoneLine } from "react-icons/ri";

// const DoctorSidebar = ({
//   isCollapsed,
//   setIsCollapsed,
//   isHovered,
//   setIsHovered,
// }) => {
//   const [expandedItem] = useState(null);
//   const contentRef = useRef();

//   // User data
//   const user = {
//     name: "DrReddy",
//     shortName: "DrReddy",
//     department: "Doctor",
//     shortDept: "Dr",
//     avatar: "/doctor_assets/default user.jpg",
//   };

//   const menuItems = [
//     { type: "label", label: "Doctor Panel" },
//     {
//       name: "Dashboard",
//       icon: <FaHome className="text-lg" />,
//       link: "dashboard",
//     },
//     {
//       name: "Appointments",
//       icon: <IoCalendarOutline className="text-lg" />,
//       children: [
//         { name: "View Appointments", link: "view-appointments" },
//         { name: "Schedule Appointments", link: "schedule-appointments" },
//       ],
//     },
//     {
//       name: "Patients",
//       icon: <FaUserDoctor className="text-lg" />,
//       children: [
//         { name: "View Patients", link: "view-patients" },
//         { name: "Add Patient", link: "add-patient" },
//       ],
//     },
//     {
//       name: "Articles",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Articles", link: "publish-article" },
//         { name: "View Articles", link: "view-articles" },
//       ],
//     },
//     {
//       name: "Blogs",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Blogs", link: "publish-blogs" },
//         { name: "View Blogs", link: "view-blogs" },
//       ],
//     },
//     {
//       name: "Videos",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Video", link: "publish-video" },
//         { name: "View videos", link: "view-videos" },
//       ],
//     },
//     {
//       name: "Books",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Book", link: "publish-book" },
//         { name: "View Books", link: "view-books" },
//       ],
//     },
//     {
//       name: "Meditation",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Add Meditation", link: "publish-meditation" },
//         { name: "View Meditations", link: "view-meditations" },
//       ],
//     },
//     {
//       name: "Reports",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Generate Report", link: "generate-report" },
//         { name: "View Reports", link: "view-reports" },
//       ],
//     },
//     { name: "Settings", icon: <FaCog className="text-lg" />, link: "settings" },
//   ];

//   const sidebarExpanded = !isCollapsed || isHovered;
//   const transitionClass = "transition-all duration-300 ease-in-out";

//   return (
//     <nav
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm z-40 flex flex-col
//         ${transitionClass} ${sidebarExpanded ? "w-64" : "w-20"}`}
//     >
//       {/* Header Section */}
//       <div className="flex flex-col">
//         <div
//           className={`flex items-center ${
//             sidebarExpanded ? "justify-between" : "justify-center"
//           } p-4 border-b ${transitionClass}`}
//         >
//           {sidebarExpanded ? (
//             <>
//               <div className="flex items-center gap-3">
//                 <img
//                   src="/img/favicon.png"
//                   className="w-8 h-8 rounded-lg"
//                   alt="Logo"
//                 />
//                 <span className="text-lg font-bold whitespace-nowrap text-gray-800">
//                   ASR Hospitals
//                 </span>
//               </div>
//               <button
//                 onClick={() => setIsCollapsed((prev) => !prev)}
//                 className="p-1 rounded-md hover:bg-gray-100"
//               >
//                 <HiOutlineMenuAlt3 className="text-xl text-gray-600 hover:rotate-90 ${transitionClass}" />
//               </button>
//             </>
//           ) : (
//             <img
//               src="/img/favicon.png"
//               className="w-8 h-8 rounded-lg"
//               alt="Logo"
//             />
//           )}
//         </div>

//         {/* User Info - Shows differently based on sidebar state */}
//         <div
//           className={`flex items-center border-b ${
//             sidebarExpanded ? "flex-col p-4" : "justify-center p-3"
//           } ${transitionClass}`}
//         >
//           <img
//             src={user.avatar}
//             alt="User"
//             className={`rounded-full border-2 border-gray-300 object-cover ${
//               sidebarExpanded ? "w-14 h-14" : "w-10 h-10"
//             }`}
//           />
//           {sidebarExpanded ? (
//             <div className="mt-3 text-center">
//               <h6 className="font-semibold text-sm text-gray-800 truncate max-w-[180px]">
//                 {user.name}
//               </h6>
//               <p className="text-gray-500 text-xs mt-1">{user.department}</p>
//             </div>
//           ) : (
//             <div className="ml-2 text-center">
//               <h6 className="font-semibold text-xs text-gray-800">
//                 {user.shortName}
//               </h6>
//               <p className="text-gray-500 text-xxs mt-0.5">{user.shortDept}</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Navigation Items */}
//       <div className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//         {menuItems.map((item, index) => (
//           <div key={index} className="mb-1">
//             {item.type === "label" ? (
//               sidebarExpanded && (
//                 <div className="text-xs uppercase text-gray-500 px-3 py-2 font-medium">
//                   {item.label}
//                 </div>
//               )
//             ) : item.children ? (
//               <div>
//                 <button
//                   onClick={() => handleToggle(index)}
//                   className={`flex items-center w-full p-3 rounded-lg ${transitionClass} ${
//                     sidebarExpanded ? "justify-between" : "justify-center"
//                   } ${
//                     expandedItem === index
//                       ? "bg-blue-50 text-blue-600"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   <div className="flex items-center">
//                     <span className={`${sidebarExpanded ? "mr-3" : ""}`}>
//                       {item.icon}
//                     </span>
//                     {sidebarExpanded && (
//                       <span className="text-sm font-medium">{item.name}</span>
//                     )}
//                   </div>
//                   {sidebarExpanded && (
//                     <span className="text-xs text-gray-500">
//                       {expandedItem === index ? (
//                         <FaChevronDown className="text-xs" />
//                       ) : (
//                         <FaChevronRight className="text-xs" />
//                       )}
//                     </span>
//                   )}
//                 </button>

//                 <div
//                   ref={contentRef}
//                   className={`${transitionClass} overflow-hidden ${
//                     expandedItem === index ? "mt-1" : ""
//                   }`}
//                   style={{
//                     maxHeight: expandedItem === index ? "500px" : "0px",
//                     opacity: expandedItem === index ? 1 : 0,
//                   }}
//                 >
//                   {item.children.map((child, childIndex) => (
//                     <NavLink
//                       key={childIndex}
//                       to={child.link}
//                       className={({ isActive }) =>
//                         `block p-3 mx-2 text-sm rounded-lg ${transitionClass} ${
//                           sidebarExpanded ? "text-left" : "text-center"
//                         } ${
//                           isActive
//                             ? "bg-blue-100 text-blue-600"
//                             : "text-gray-600 hover:bg-gray-100"
//                         }`
//                       }
//                     >
//                       {sidebarExpanded ? child.name : child.name.charAt(0)}
//                     </NavLink>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <NavLink
//                 to={item.link}
//                 className={({ isActive }) =>
//                   `flex items-center p-3 rounded-lg ${transitionClass} ${
//                     sidebarExpanded ? "" : "justify-center"
//                   } ${
//                     isActive
//                       ? "bg-blue-50 text-blue-600"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`
//                 }
//               >
//                 <span className={`${sidebarExpanded ? "mr-3" : ""}`}>
//                   {item.icon}
//                 </span>
//                 {sidebarExpanded && (
//                   <span className="text-sm font-medium">{item.name}</span>
//                 )}
//               </NavLink>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Footer Section */}
//       <div className="flex flex-col mt-auto border-t border-gray-200">
//         {/* <button
//           onClick={handleLogout}
//           className={`flex items-center p-3 mx-2 my-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 ${transitionClass} ${
//             sidebarExpanded ? "" : "justify-center"
//           }`}
//         >
//           <IoIosLogOut className="text-lg" />
//           {sidebarExpanded && <span>Logout</span>}
//         </button> */}

//         {sidebarExpanded && (
//           <div className={`p-3 border-t text-sm ${transitionClass}`}>
//             <div className="flex items-center justify-between">
//               <div>
//                 <h5 className="font-medium text-gray-700">0987654321</h5>
//                 <p className="text-xs text-gray-500 mt-1">Customer Support</p>
//               </div>
//               <RiCellphoneLine className="text-lg text-blue-500" />
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default DoctorSidebar;

// import React, { useState, useRef } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { HiOutlineMenuAlt3 } from "react-icons/hi";
// import { FaChevronDown, FaChevronRight, FaHome, FaCog } from "react-icons/fa";
// import { IoCalendarOutline } from "react-icons/io5";
// import { RiEmpathizeLine } from "react-icons/ri";
// import { FaUserDoctor } from "react-icons/fa6";
// import { IoIosLogOut } from "react-icons/io";
// import { RiCellphoneLine } from "react-icons/ri";

// const DoctorSidebar = ({ isCollapsed, setIsCollapsed, isHovered, setIsHovered }) => {
//   const navigate = useNavigate();
//   const [expandedItem, setExpandedItem] = useState(null);
//   const [transitioning, setTransitioning] = useState(false);
//   const contentRef = useRef();

// const menuItems = [
//   { type: "label", label: "Doctor Panel" },
//   { name: "Dashboard", icon: <FaHome className="text-lg" />, link: "dashboard" },
//   {
//     name: "Appointments",
//     icon: <IoCalendarOutline className="text-lg" />,
//     children: [
//       { name: "View Appointments", link: "view-appointments" },
//       { name: "Schedule Appointments", link: "schedule-appointments" },
//     ],
//   },
//   {
//     name: "Patients",
//     icon: <FaUserDoctor className="text-lg" />,
//     children: [
//       { name: "View Patients", link: "view-patients" },
//       { name: "Add Patient", link: "add-patient" },
//     ],
//   },
//   {
//     name: "Articles",
//     icon: <RiEmpathizeLine className="text-lg" />,
//     children: [
//       { name: "Publish Articles", link: "publish-article" },
//       { name: "View Articles", link: "view-articles" },
//     ],
//   },
//   {
//     name: "Blogs",
//     icon: <RiEmpathizeLine className="text-lg" />,
//     children: [
//       { name: "Publish Blogs", link: "publish-blogs" },
//       { name: "View Blogs", link: "view-blogs" },
//     ],
//   },
//   {
//     name: "Videos",
//     icon: <RiEmpathizeLine className="text-lg" />,
//     children: [
//       { name: "Publish Video", link: "publish-video" },
//       { name: "View videos", link: "view-videos" },
//     ],
//   },
//   {
//     name: "Books",
//     icon: <RiEmpathizeLine className="text-lg" />,
//     children: [
//       { name: "Publish Book", link: "publish-book" },
//       { name: "View Books", link: "view-books" },
//     ],
//   },
//   {
//     name: "Meditation",
//     icon: <RiEmpathizeLine className="text-lg" />,
//     children: [
//       { name: "Add Meditation", link: "publish-meditation" },
//       { name: "View Meditations", link: "view-meditations" },
//     ],
//   },
//   {
//     name: "Reports",
//     icon: <RiEmpathizeLine className="text-lg" />,
//     children: [
//       { name: "Generate Report", link: "generate-report" },
//       { name: "View Reports", link: "view-reports" },
//     ],
//   },
//   { name: "Settings", icon: <FaCog className="text-lg" />, link: "settings" },
// ];

//   const handleToggle = (index) => {
//     if (transitioning) return;
//     setTransitioning(true);
//     setExpandedItem(expandedItem === index ? null : index);
//     setTimeout(() => setTransitioning(false), 300);
//   };

//   const handleLogout = () => navigate("/");

//   const sidebarExpanded = !isCollapsed || isHovered;
//   const transitionClass = "transition-all duration-300 ease-in-out";

//   return (
//     <nav
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm z-40 flex flex-col
//         ${transitionClass} ${sidebarExpanded ? "w-64" : "w-20"}`}
//     >
//       {/* Header Section */}
//       <div className="flex flex-col">
//         <div className={`flex items-center ${sidebarExpanded ? 'justify-between' : 'justify-center'} p-4 border-b ${transitionClass}`}>
//           {sidebarExpanded ? (
//             <>
//               <div className="flex items-center gap-3">
//                 <img
//                   src="/img/favicon.png"
//                   className="w-8 h-8 rounded-lg"
//                   alt="Logo"
//                 />
//                 <span className="text-lg font-bold whitespace-nowrap text-gray-800">
//                   ASR Hospitals
//                 </span>
//               </div>
//               <button
//                 onClick={() => setIsCollapsed(prev => !prev)}
//                 className="p-1 rounded-md hover:bg-gray-100"
//               >
//                 <HiOutlineMenuAlt3 className="text-xl text-gray-600 hover:rotate-90 ${transitionClass}" />
//               </button>
//             </>
//           ) : (
//             <img
//               src="/img/favicon.png"
//               className="w-8 h-8 rounded-lg"
//               alt="Logo"
//             />
//           )}
//         </div>

//         {sidebarExpanded && (
//           <div className={`flex flex-col items-center border-b p-4 ${transitionClass}`}>
//             <img
//               src="/doctor_assets/default user.jpg"
//               alt="User"
//               className="rounded-full w-14 h-14 border-2 border-gray-300 object-cover"
//             />
//             <div className="mt-3 text-center">
//               <h6 className="font-semibold text-sm text-gray-800 truncate max-w-[180px]">
//                 DrReddy
//               </h6>
//               <p className="text-gray-500 text-xs mt-1">Doctor</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Navigation Items */}
// <div className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//   {menuItems.map((item, index) => (
//     <div key={index} className="mb-1">
//       {item.type === "label" ? (
//         sidebarExpanded && (
//           <div className="text-xs uppercase text-gray-500 px-3 py-2 font-medium">
//             {item.label}
//           </div>
//         )
//       ) : item.children ? (
//         <div>
//           <button
//             onClick={() => handleToggle(index)}
//             className={`flex items-center w-full p-3 rounded-lg ${transitionClass} ${
//               sidebarExpanded ? "justify-between" : "justify-center"
//             } ${
//               expandedItem === index
//                 ? "bg-blue-50 text-blue-600"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             <div className="flex items-center">
//               <span className={`${sidebarExpanded ? "mr-3" : ""}`}>
//                 {item.icon}
//               </span>
//               {sidebarExpanded && (
//                 <span className="text-sm font-medium">{item.name}</span>
//               )}
//             </div>
//             {sidebarExpanded && (
//               <span className="text-xs text-gray-500">
//                 {expandedItem === index ? (
//                   <FaChevronDown className="text-xs" />
//                 ) : (
//                   <FaChevronRight className="text-xs" />
//                 )}
//               </span>
//             )}
//           </button>

//           <div
//             ref={contentRef}
//             className={`${transitionClass} overflow-hidden ${
//               expandedItem === index ? "mt-1" : ""
//             }`}
//             style={{
//               maxHeight: expandedItem === index ? "500px" : "0px",
//               opacity: expandedItem === index ? 1 : 0,
//             }}
//           >
//             {item.children.map((child, childIndex) => (
//               <NavLink
//                 key={childIndex}
//                 to={child.link}
//                 className={({ isActive }) =>
//                   `block p-3 mx-2 text-sm rounded-lg ${transitionClass} ${
//                     sidebarExpanded ? "text-left" : "text-center"
//                   } ${
//                     isActive
//                       ? "bg-blue-100 text-blue-600"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`
//                 }
//               >
//                 {sidebarExpanded ? child.name : child.name.charAt(0)}
//               </NavLink>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <NavLink
//           to={item.link}
//           className={({ isActive }) =>
//             `flex items-center p-3 rounded-lg ${transitionClass} ${
//               sidebarExpanded ? "" : "justify-center"
//             } ${
//               isActive
//                 ? "bg-blue-50 text-blue-600"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`
//           }
//         >
//           <span className={`${sidebarExpanded ? "mr-3" : ""}`}>
//             {item.icon}
//           </span>
//           {sidebarExpanded && (
//             <span className="text-sm font-medium">{item.name}</span>
//           )}
//         </NavLink>
//       )}
//     </div>
//   ))}
// </div>

//       {/* Footer Section */}
// <div className="flex flex-col mt-auto border-t border-gray-200">
//   <button
//     onClick={handleLogout}
//     className={`flex items-center p-3 mx-2 my-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 ${transitionClass} ${
//       sidebarExpanded ? "" : "justify-center"
//     }`}
//   >
//     <IoIosLogOut className="text-lg" />
//     {sidebarExpanded && <span>Logout</span>}
//   </button>

//   {sidebarExpanded && (
//     <div className={`p-3 border-t text-sm ${transitionClass}`}>
//       <div className="flex items-center justify-between">
//         <div>
//           <h5 className="font-medium text-gray-700">0987654321</h5>
//           <p className="text-xs text-gray-500 mt-1">Customer Support</p>
//         </div>
//         <RiCellphoneLine className="text-lg text-blue-500" />
//       </div>
//     </div>
//   )}
// </div>
//     </nav>
//   );
// };

// export default DoctorSidebar;

// import React, { useState, useRef } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { HiOutlineMenuAlt3 } from "react-icons/hi";
// import { FaChevronDown, FaChevronRight, FaHome, FaCog } from "react-icons/fa";
// import { IoCalendarOutline } from "react-icons/io5";
// import { RiEmpathizeLine, RiCellphoneLine } from "react-icons/ri";
// import { FaUserDoctor } from "react-icons/fa6";
// import { IoIosLogOut } from "react-icons/io";

// const DoctorSidebar = ({ isCollapsed, setIsCollapsed, isHovered, setIsHovered }) => {
//   const navigate = useNavigate();
//   const [expandedItem, setExpandedItem] = useState(null);
//   const [transitioning, setTransitioning] = useState(false);

//   const sidebarExpanded = !isCollapsed || isHovered;

//   const items = [
//     { type: "label", label: "Doctor Panel" },
//     { name: "Dashboard", icon: <FaHome className="text-lg" />, link: "dashboard" },
//     {
//       name: "Appointments",
//       icon: <IoCalendarOutline className="text-lg" />,
//       children: [
//         { name: "View Appointments", link: "view-appointments" },
//         { name: "Schedule Appointments", link: "schedule-appointments" },
//       ],
//     },
//     {
//       name: "Patients",
//       icon: <FaUserDoctor className="text-lg" />,
//       children: [
//         { name: "View Patients", link: "view-patients" },
//         { name: "Add Patient", link: "add-patient" },
//       ],
//     },
//     {
//       name: "Articles",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Articles", link: "publish-article" },
//         { name: "View Articles", link: "view-articles" },
//       ],
//     },
//     {
//       name: "Blogs",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Blogs", link: "publish-blogs" },
//         { name: "View Blogs", link: "view-blogs" },
//       ],
//     },
//     {
//       name: "Videos",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Video", link: "publish-video" },
//         { name: "View videos", link: "view-videos" },
//       ],
//     },
//     {
//       name: "Books",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Book", link: "publish-book" },
//         { name: "View Books", link: "view-books" },
//       ],
//     },
//     {
//       name: "Meditation",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Add Meditation", link: "publish-meditation" },
//         { name: "View Meditations", link: "view-meditations" },
//       ],
//     },
//     {
//       name: "Reports",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Generate Report", link: "generate-report" },
//         { name: "View Reports", link: "view-reports" },
//       ],
//     },
//     { name: "Settings", icon: <FaCog className="text-lg" />, link: "settings" },
//   ];

//   const handleToggle = (index) => {
//     if (transitioning) return;
//     setTransitioning(true);
//     setTimeout(() => {
//       setExpandedItem(expandedItem === index ? null : index);
//       setTransitioning(false);
//     }, 300);
//   };

//   const handleLogout = () => navigate("/");

//   return (
//     <nav
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm z-40 flex flex-col transition-all duration-300 ease-in-out
//         ${sidebarExpanded ? "w-64" : "w-20"}`}
//     >
//       {/* Header */}
//       <div className="flex flex-col">
//         <div className={`flex items-center ${sidebarExpanded ? 'justify-between' : 'justify-center'} p-4 border-b`}>
//           <img src="/img/favicon.png" className="w-8 h-8 rounded-lg" alt="Logo" />
//           {sidebarExpanded && (
//             <>
//               <span className="text-lg font-bold text-gray-800">ASR Hospitals</span>
//               <button onClick={() => setIsCollapsed(prev => !prev)} className="p-1 hover:bg-gray-100 rounded-md">
//                 <HiOutlineMenuAlt3 className="text-xl text-gray-600 hover:rotate-90 transition-transform duration-300" />
//               </button>
//             </>
//           )}
//         </div>

//         {/* User Info */}
//         {sidebarExpanded && (
//           <div className="flex flex-col items-center p-4 border-b">
//             <img src="/doctor_assets/default user.jpg" alt="User" className="w-14 h-14 rounded-full border-2 border-gray-300" />
//             <div className="mt-2 text-center">
//               <h6 className="font-semibold text-sm text-gray-800 truncate max-w-[180px]">DrReddy</h6>
//               <p className="text-xs text-gray-500">Doctor</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Menu Items */}
//       <div className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-gray-300">
//         {items.map((item, index) => (
//           <div key={index} className="mb-1">
//             {item.type === "label" ? (
//               sidebarExpanded && <div className="text-xs uppercase text-gray-500 px-3 py-2 font-medium">{item.label}</div>
//             ) : item.children ? (
//               <>
//                 <button
//                   onClick={() => handleToggle(index)}
//                   className={`flex items-center w-full rounded-lg transition-all duration-300 px-3 py-2
//                     ${sidebarExpanded ? "justify-between" : "justify-center"}
//                     ${expandedItem === index ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
//                 >
//                   <div className="flex items-center">
//                     <span className="text-lg">{item.icon}</span>
//                     {sidebarExpanded && <span className="ml-3 text-sm font-medium">{item.name}</span>}
//                   </div>
//                   {sidebarExpanded && (expandedItem === index ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />)}
//                 </button>
//                 <div
//                   className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedItem === index ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
//                 >
//                   {item.children.map((child, childIndex) => (
//                     <NavLink
//                       key={childIndex}
//                       to={child.link}
//                       className={({ isActive }) =>
//                         `block rounded-lg transition-all duration-200 px-4 py-2 mx-2 text-sm ${
//                           sidebarExpanded ? "text-left" : "text-center"
//                         } ${
//                           isActive
//                             ? "bg-blue-100 text-blue-600"
//                             : "text-gray-600 hover:bg-gray-100"
//                         }`
//                       }
//                     >
//                       {sidebarExpanded ? child.name : child.name.charAt(0)}
//                     </NavLink>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <NavLink
//                 to={item.link}
//                 className={({ isActive }) =>
//                   `flex items-center rounded-lg transition-all duration-300 px-3 py-2 ${
//                     sidebarExpanded ? "" : "justify-center"
//                   } ${
//                     isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
//                   }`
//                 }
//               >
//                 <span className="text-lg">{item.icon}</span>
//                 {sidebarExpanded && <span className="ml-3 text-sm font-medium">{item.name}</span>}
//               </NavLink>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="mt-auto border-t">
//         <button
//           onClick={handleLogout}
//           className={`flex items-center gap-3 text-sm font-medium text-red-500 p-3 mx-2 my-2 rounded-lg hover:bg-red-50 transition-colors ${
//             sidebarExpanded ? "" : "justify-center"
//           }`}
//         >
//           <IoIosLogOut className="text-lg" />
//           {sidebarExpanded && <span>Logout</span>}
//         </button>

//         {sidebarExpanded && (
//           <div className="p-3 border-t text-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h5 className="font-medium text-gray-700">0987654321</h5>
//                 <p className="text-xs text-gray-500 mt-1">Customer Support</p>
//               </div>
//               <RiCellphoneLine className="text-lg text-blue-500" />
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default DoctorSidebar;

// import React, { useState, useRef } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { HiOutlineMenuAlt3 } from "react-icons/hi";
// import { FaChevronDown, FaChevronRight, FaHome, FaCog } from "react-icons/fa";
// import { IoCalendarOutline } from "react-icons/io5";
// import { RiEmpathizeLine } from "react-icons/ri";
// import { FaUserDoctor } from "react-icons/fa6";
// import { IoIosLogOut } from "react-icons/io";
// import { RiCellphoneLine } from "react-icons/ri";

// const DoctorSidebar = ({ isCollapsed, setIsCollapsed, isHovered, setIsHovered }) => {
//   const navigate = useNavigate();
//   const items = [
//     { type: "label", label: "Doctor Panel" },
//     { name: "Dashboard", icon: <FaHome className="text-lg" />, link: "dashboard" },
//     {
//       name: "Appointments",
//       icon: <IoCalendarOutline className="text-lg" />,
//       children: [
//         { name: "View Appointments", link: "view-appointments" },
//         { name: "Schedule Appointments", link: "schedule-appointments" },
//       ],
//     },
//     {
//       name: "Patients",
//       icon: <FaUserDoctor className="text-lg" />,
//       children: [
//         { name: "View Patients", link: "view-patients" },
//         { name: "Add Patient", link: "add-patient" },
//       ],
//     },
//     {
//       name: "Articles",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Articles", link: "publish-article" },
//         { name: "View Articles", link: "view-articles" },
//       ],
//     },
//     {
//       name: "Blogs",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Blogs", link: "publish-blogs" },
//         { name: "View Blogs", link: "view-blogs" },
//       ],
//     },
//     {
//       name: "Videos",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Video", link: "publish-video" },
//         { name: "View videos", link: "view-videos" },
//       ],
//     },
//     {
//       name: "Books",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Book", link: "publish-book" },
//         { name: "View Books", link: "view-books" },
//       ],
//     },
//     {
//       name: "Meditation",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Add Meditation", link: "publish-meditation" },
//         { name: "View Meditations", link: "view-meditations" },
//       ],
//     },
//     {
//       name: "Reports",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Generate Report", link: "generate-report" },
//         { name: "View Reports", link: "view-reports" },
//       ],
//     },
//     { name: "Settings", icon: <FaCog className="text-lg" />, link: "settings" },
//   ];

//   const [expandedItem, setExpandedItem] = useState(null);
//   const [transitioning, setTransitioning] = useState(false);
//   const contentRef = useRef();

//   const handleToggle = (index) => {
//     if (transitioning) return;
//     setTransitioning(true);

//     setTimeout(() => {
//       setExpandedItem(expandedItem === index ? null : index);
//       setTransitioning(false);
//     }, 300);
//   };

//   const handleLogout = () => {
//     navigate("/");
//   };

//   const sidebarExpanded = !isCollapsed || isHovered;

//   return (
//     <nav
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm z-40 flex flex-col
//         transition-all duration-300 ease-in-out
//         ${sidebarExpanded ? "w-64" : "w-20"}`}
//     >
//       {/* Header Section */}
//       <div className="flex flex-col">
//         {/* Logo and Collapse Button */}
//         <div className={`flex items-center ${sidebarExpanded ? 'justify-between' : 'justify-center'} p-4 border-b transition-all duration-300`}>
//           {sidebarExpanded ? (
//             <>
//               <div className="flex items-center gap-3">
//                 <img
//                   src="/img/favicon.png"
//                   className="w-8 h-8 transition-all duration-300 rounded-lg"
//                   alt="Logo"
//                 />
//                 <span className="text-lg font-bold whitespace-nowrap text-gray-800">
//                   ASR Hospitals
//                 </span>
//               </div>
//               <button
//                 onClick={() => setIsCollapsed((prev) => !prev)}
//                 className="p-1 rounded-md hover:bg-gray-100"
//               >
//                 <HiOutlineMenuAlt3
//                   className="text-xl text-gray-600 transition-transform duration-300 hover:rotate-90"
//                   title="Collapse sidebar"
//                 />
//               </button>
//             </>
//           ) : (
//             <img
//               src="/img/favicon.png"
//               className="w-8 h-8 transition-all duration-300 rounded-lg"
//               alt="Logo"
//             />
//           )}
//         </div>

//         {/* User Info - Only shown when expanded */}
//         {sidebarExpanded && (
//           <div className="flex flex-col items-center border-b p-4 transition-all duration-300">
//             <img
//               src="/doctor_assets/default user.jpg"
//               alt="User"
//               className="rounded-full w-14 h-14 border-2 border-gray-300 object-cover"
//             />
//             <div className="mt-3 text-center">
//               <h6 className="font-semibold text-sm text-gray-800 truncate max-w-[180px]">
//                 DrReddy
//               </h6>
//               <p className="text-gray-500 text-xs mt-1">
//                 Doctor
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Scrollable Navigation Items */}
//       <div className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//         {items.map((item, index) => (
//           <div key={index} className="mb-1">
//             {item.type === "label" ? (
//               sidebarExpanded && (
//                 <div className="text-xs uppercase text-gray-500 px-3 py-2 font-medium">
//                   {item.label}
//                 </div>
//               )
//             ) : item.children ? (
//               <div>
//                 <button
//                   onClick={() => handleToggle(index)}
//                   className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-colors duration-200 ${
//                     sidebarExpanded ? "justify-between" : "justify-center"
//                   } ${
//                     expandedItem === index
//                       ? "bg-blue-50 text-blue-600"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   <div className="flex items-center">
//                     <span className={`${sidebarExpanded ? "mr-3" : ""}`}>
//                       {item.icon}
//                     </span>
//                     {sidebarExpanded && (
//                       <span className="text-sm font-medium">{item.name}</span>
//                     )}
//                   </div>
//                   {sidebarExpanded && (
//                     <span className="text-xs text-gray-500">
//                       {expandedItem === index ? (
//                         <FaChevronDown className="text-xs" />
//                       ) : (
//                         <FaChevronRight className="text-xs" />
//                       )}
//                     </span>
//                   )}
//                 </button>

//                 {/* Submenu Items */}
//                 <div
//                   ref={contentRef}
//                   className={`overflow-hidden transition-all duration-300 ease-in-out ${
//                     expandedItem === index ? "mt-1" : ""
//                   }`}
//                   style={{
//                     maxHeight: expandedItem === index ? "500px" : "0px",
//                     opacity: expandedItem === index ? 1 : 0,
//                   }}
//                 >
//                   {item.children.map((child, childIndex) => (
//                     <NavLink
//                       key={childIndex}
//                       to={child.link}
//                       className={({ isActive }) =>
//                         `block px-4 py-2.5 mx-2 text-sm rounded-lg transition-colors duration-200 ${
//                           sidebarExpanded ? "text-left" : "text-center"
//                         } ${
//                           isActive
//                             ? "bg-blue-100 text-blue-600"
//                             : "text-gray-600 hover:bg-gray-100"
//                         }`
//                       }
//                     >
//                       {sidebarExpanded ? child.name : child.name.charAt(0)}
//                     </NavLink>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <NavLink
//                 to={item.link}
//                 className={({ isActive }) =>
//                   `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 ${
//                     sidebarExpanded ? "" : "justify-center"
//                   } ${
//                     isActive
//                       ? "bg-blue-50 text-blue-600"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`
//                 }
//               >
//                 <span className={`${sidebarExpanded ? "mr-3" : ""}`}>
//                   {item.icon}
//                 </span>
//                 {sidebarExpanded && (
//                   <span className="text-sm font-medium">{item.name}</span>
//                 )}
//               </NavLink>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Footer Section */}
//       <div className="flex flex-col mt-auto border-t border-gray-200">
//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className={`flex items-center gap-3 p-3 mx-2 my-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-300 ${
//             sidebarExpanded ? "" : "justify-center"
//           }`}
//         >
//           <IoIosLogOut className="text-lg" />
//           {sidebarExpanded && <span>Logout</span>}
//         </button>

//         {/* Support Info - Only shown when expanded */}
//         {sidebarExpanded && (
//           <div className="p-3 border-t text-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h5 className="font-medium text-gray-700">0987654321</h5>
//                 <p className="text-xs text-gray-500 mt-1">Customer Support</p>
//               </div>
//               <RiCellphoneLine className="text-lg text-blue-500" />
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default DoctorSidebar;

// import React, { useState, useRef } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { HiOutlineMenuAlt3 } from "react-icons/hi";
// import { FaChevronDown, FaChevronRight, FaHome, FaCog } from "react-icons/fa";
// import { IoCalendarOutline } from "react-icons/io5";
// import { RiEmpathizeLine } from "react-icons/ri";
// import { FaUserDoctor } from "react-icons/fa6";
// import { IoIosLogOut } from "react-icons/io";
// import { RiCellphoneLine } from "react-icons/ri";

// const DoctorSidebar = ({ isCollapsed, setIsCollapsed, isHovered, setIsHovered }) => {

// const navigate = useNavigate();
//   const items = [
//     { type: "label", label: "Doctor Panel" },
//     { name: "Dashboard", icon: <FaHome className="text-lg" />, link: "dashboard" },
//     {
//       name: "Appointments",
//       icon: <IoCalendarOutline className="text-lg" />,
//       children: [
//         { name: "View Appointments", link: "view-appointments" },
//         { name: "Schedule Appointments", link: "schedule-appointments" },
//       ],
//     },
//     {
//       name: "Patients",
//       icon: <FaUserDoctor className="text-lg" />,
//       children: [
//         { name: "View Patients", link: "view-patients" },
//         { name: "Add Patient", link: "add-patient" },
//       ],
//     },
//     {
//       name: "Articles",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Articles", link: "publish-article" },
//         { name: "View Articles", link: "view-articles" },
//       ],
//     },
//     {
//       name: "Blogs",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Blogs", link: "publish-blogs" },
//         { name: "View Blogs", link: "view-blogs" },
//       ],
//     },
//     {
//       name: "Videos",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Video", link: "publish-video" },
//         { name: "View videos", link: "view-videos" },
//       ],
//     },
//     {
//       name: "Books",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Publish Book", link: "publish-book" },
//         { name: "View Books", link: "view-books" },
//       ],
//     },
//     {
//       name: "Meditation",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Add Meditation", link: "publish-meditation" },
//         { name: "View Meditations", link: "view-meditations" },
//       ],
//     },
//     {
//       name: "Reports",
//       icon: <RiEmpathizeLine className="text-lg" />,
//       children: [
//         { name: "Generate Report", link: "generate-report" },
//         { name: "View Reports", link: "view-reports" },
//       ],
//     },
//     { name: "Settings", icon: <FaCog className="text-lg" />, link: "settings" },
//   ];

//   const [expandedItem, setExpandedItem] = useState(null);
//   const [transitioning, setTransitioning] = useState(false);
//   const contentRef = useRef();

//   const handleToggle = (index) => {
//     if (transitioning) return;
//     setTransitioning(true);

//     setTimeout(() => {
//       setExpandedItem(expandedItem === index ? null : index);
//       setTransitioning(false);
//     }, 500);
//   };

//   const handleLogout = () => {
//     // Add your logout logic here
//     navigate("/");
//   };

//   const sidebarExpanded = !isCollapsed || isHovered;
//   const userInfoHeight = "h-34";

//   return (
//     <nav
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className={`fixed top-0 left-0 h-full bg-gray-100 border-r shadow-md z-40 flex flex-col
//         transition-[width] duration-300 ease-in-out
//         ${sidebarExpanded ? "w-64" : "w-[74px]"}`}
//     >
//       {/* Header Section - UPDATED FOR COLLAPSED STATE */}
//       <div className="flex flex-col">
//         {/* Logo and Collapse Button */}
//         <div className={`flex items-center ${sidebarExpanded ? 'justify-between' : 'justify-center'} p-3 border-b transition-all duration-300`}>
//           {sidebarExpanded ? (
//             <>
//               <div className="flex items-center gap-2">
//                 <img
//                   src="../../../public/img/favicon.png"
//                   className="w-10 h-10 transition-all duration-300 rounded-lg"
//                   alt="Logo"
//                 />
//                 <span className="text-lg font-bold whitespace-nowrap">
//                   ASR Hospitals
//                 </span>
//               </div>
//               <button onClick={() => setIsCollapsed((prev) => !prev)}>
//                 <HiOutlineMenuAlt3
//                   className="text-xl text-gray-600 transition-transform duration-300 hover:rotate-90"
//                   title="Collapse sidebar"
//                 />
//               </button>
//             </>
//           ) : (
//             <img
//               src="../../../public/img/favicon.png"
//               className="w-10 h-10 transition-all duration-300 rounded-lg"
//               alt="Logo"
//             />
//           )}
//         </div>

//         {/* User Info - HIDDEN WHEN COLLAPSED */}
//         {sidebarExpanded && (
//           <div
//             className={`flex flex-col gap-2 items-center border-b p-4 ${userInfoHeight} transition-all duration-300 w-full`}
//           >
//             <img
//               src="../../../public/doctor_assets/default user.jpg"
//               alt="User"
//               className="rounded-full w-16 h-16 border border-gray-400 transition-all duration-300 flex-shrink-0"
//             />
//             <div className="mt-1 text-center">
//               <h6 className="font-semibold text-sm text-gray-900 truncate w-32">
//                 DrReddy
//               </h6>
//               <p className="text-gray-500 text-sm truncate w-28">
//                 Doctor
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Scrollable Navigation Items */}
//       <div className="flex-1 overflow-y-auto py-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-w-1">
//         {items.map((item, index) => (
//           <div key={index} className="mb-1">
//             {item.type === "label" ? (
//               sidebarExpanded && (
//                 <div className="text-xs uppercase text-gray-500 px-3 py-2">
//                   {item.label}
//                 </div>
//               )
//             ) : item.children ? (
//               <div>
//                 <button
//                   onClick={() => handleToggle(index)}
//                   className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${
//                     sidebarExpanded ? "justify-between" : "justify-center"
//                   } ${
//                     expandedItem === index
//                       ? "bg-[#a6e5ec] text-gray-700"
//                       : "text-gray-700 hover:bg-blue-200 hover:text-black"
//                   }`}
//                 >
//                   <div className="flex items-center">
//                     <span className={`${sidebarExpanded ? "mr-1" : ""}`}>
//                       {item.icon}
//                     </span>
//                     {sidebarExpanded && item.name}
//                   </div>
//                   {sidebarExpanded && (
//                     <span className="text-xs">
//                       {expandedItem === index ? (
//                         <FaChevronDown />
//                       ) : (
//                         <FaChevronRight />
//                       )}
//                     </span>
//                   )}
//                 </button>

//                 {/* Submenu Items */}
//                 <div
//                   ref={contentRef}
//                   className={`ml-7 text-center space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${
//                     expandedItem === index ? "mt-2" : ""
//                   }`}
//                   style={{
//                     maxHeight: expandedItem === index ? "500px" : "0px",
//                     opacity: expandedItem === index ? 1 : 0,
//                   }}
//                 >
//                   {item.children.map((child, childIndex) => (
//                     <NavLink
//                       key={childIndex}
//                       to={child.link}
//                       className={({ isActive }) =>
//                         `block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
//                           sidebarExpanded ? "" : "text-center"
//                         } ${
//                           isActive
//                             ? "bg-[#a6e5ec] text-gray-700"
//                             : "text-gray-700 hover:bg-blue-200 hover:text-black"
//                         }`
//                       }
//                     >
//                       {sidebarExpanded ? child.name : child.name.charAt(0)}
//                     </NavLink>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <NavLink
//                 to={item.link}
//                 className={({ isActive }) =>
//                   `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
//                     sidebarExpanded ? "" : "justify-center"
//                   } ${
//                     isActive
//                       ? "bg-[#a6e5ec] text-gray-700"
//                       : "text-gray-700 hover:bg-blue-200 hover:text-black"
//                   }`
//                 }
//               >
//                 <span className={`${sidebarExpanded ? "mr-3" : ""}`}>
//                   {item.icon}
//                 </span>
//                 {sidebarExpanded && item.name}
//               </NavLink>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Footer Section (Non-scrollable) */}
//       <div className="flex flex-col mt-auto">
//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className={`flex items-center gap-4 p-2 rounded-lg text-sm font-medium text-red-600 mx-4 mb-4 hover:bg-red-100 transition-colors duration-300 ${
//             sidebarExpanded ? "" : "justify-center"
//           }`}
//         >
//           <IoIosLogOut className="text-lg font-extrabold" />
//           {sidebarExpanded && <span>Logout</span>}
//         </button>

//         {/* Support Info */}
//         {sidebarExpanded && (
//           <div className="p-4 border-t text-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h5 className="font-semibold text-gray-900 truncate">
//                   0987654321
//                 </h5>
//                 <p className="text-xs text-gray-500">Customer Support</p>
//               </div>
//               <RiCellphoneLine className="text-lg text-blue-700" />
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default DoctorSidebar;

// ! old code start
// import React, { useState, useRef } from "react";
// import { FaChevronDown, FaChevronRight } from "react-icons/fa";
// import { NavLink } from "react-router-dom";

// const DoctorSidebar = () => {
// const items = [
//   { type: "label", label: "Doctor Panel" },
//   { name: "Dashboard", icon: "🏠", link: "dashboard" },
//   {
//     name: "Appointments",
//     icon: "📅",
//     children: [
//       { name: "View Appointments", link: "view-appointments" },
//       { name: "Schedule Appointments", link: "schedule-appointments" },
//     ],
//   },
//   {
//     name: "Patients",
//     icon: "🩺",
//     children: [
//       { name: "View Patients", link: "view-patients" },
//       { name: "Add Patient", link: "add-patient" },
//     ],
//   },
//   {
//     name: "Articles",
//     icon: "📅",
//     children: [
//       { name: "Publish Articles", link: "publish-article" },
//       { name: "View Articles", link: "view-articles" },
//     ],
//   },
//   {
//     name: "Blogs",
//     icon: "📅",
//     children: [
//       { name: "Publish Blogs", link: "publish-blogs" },
//       { name: "View Blogs", link: "view-blogs" },
//     ],
//   },
//   {
//     name: "Videos",
//     icon: "📅",
//     children: [
//       { name: "Publish Video", link: "publish-video" },
//       { name: "View videos", link: "view-videos" },
//     ],
//   },
//   {
//     name: "Books",
//     icon: "📅",
//     children: [
//       { name: "Publish Book", link: "publish-book" },
//       { name: "View Books", link: "view-books" },
//     ],
//   },
//   {
//     name: "Meditation",
//     icon: "📅",
//     children: [
//       { name: "Add Meditation", link: "publish-meditation" },
//       { name: "View Meditations", link: "view-meditations" },
//     ],
//   },

//   {
//     name: "Reports",
//     icon: "📊",
//     children: [
//       { name: "Generate Report", link: "generate-report" },
//       { name: "View Reports", link: "view-reports" },
//     ],
//   },
//   { name: "Settings", icon: "⚙️", link: "settings" },
//   { type: "label", label: "External Links" },
//   { name: "Documentation", icon: "📚", link: "documentation" },
//   { name: "Support", icon: "💬", link: "support" },
// ];

// const [expandedItem, setExpandedItem] = useState(null);
// const [transitioning, setTransitioning] = useState(false);
// const contentRef = useRef();

// const handleToggle = (index) => {
//   if (transitioning) return;
//   setTransitioning(true);

//   setTimeout(() => {
//     setExpandedItem(expandedItem === index ? null : index);
//     setTransitioning(false);
//   }, 500);
// };

//   return (
//     <div
//       className="w-64  h-[91vh] overflow-y-scroll text-gray-200"
//       style={{
//         background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
//       }}
//     >
//       {/* Sidebar Header */}
//       <div className="p-4 text-xl font-bold text-center bg-blue-900">
//         Doctor Panel
//       </div>

//       {/* Navigation Items */}
//       <div className="p-4 space-y-2">
//         {items.map((item, index) => (
//           <div key={index}>
//             {item.type === "label" ? (
//               <div className="text-sm uppercase text-gray-300 mb-2">
//                 {item.label}
//               </div>
//             ) : item.children ? (
//               <div>
//                 <button
//                   onClick={() => handleToggle(index)}
//                   className="flex items-center justify-between  w-full px-4 py-2 text-left rounded-lg hover:bg-blue-700 focus:outline-none"
//                 >
//                   <div className="flex items-center">
//                     {item.icon && <span className="mr-3">{item.icon}</span>}
//                     {item.name}
//                   </div>
//                   <span>
//                     {expandedItem === index ? (
//                       <FaChevronDown />
//                     ) : (
//                       <FaChevronRight />
//                     )}
//                   </span>
//                 </button>

//                 {/* Expandable Submenu */}
//                 <div
//                   ref={contentRef}
//                   className={`ml-6 mt-2 space-y-1 overflow-hidden transition-all duration-500 ease-in-out`}
//                   style={{
//                     maxHeight: expandedItem === index ? "500px" : "0px",
//                     opacity: expandedItem === index ? 1 : 0,
//                   }}
//                 >
//                   {expandedItem === index &&
//                     item.children.map((child, childIndex) => (
//                       <NavLink
//                         key={childIndex}
//                         to={child.link}
//                         className="block px-4 py-2 text-sm rounded-lg hover:bg-blue-600 focus:outline-none"
//                       >
//                         {child.name}
//                       </NavLink>
//                     ))}
//                 </div>
//               </div>
//             ) : (
//               <NavLink
//                 to={item.link}
//                 className="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-blue-700 focus:outline-none"
//               >
//                 {item.icon && <span className="mr-3">{item.icon}</span>}
//                 {item.name}
//               </NavLink>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DoctorSidebar;
// ! old code end
