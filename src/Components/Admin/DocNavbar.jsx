import React, { useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { RiSearchLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const navigation = [];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DocNavbar({ isCollapsed, isHovered, sidebarWidth, setIsCollapsed }) {
  const [showDropdown, setShowDropdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Sidebar is now ${isCollapsed ? "collapsed" : "expanded"}`);
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userid");
    localStorage.removeItem("role");
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <Disclosure
      as="nav"
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 shadow-md fixed top-0 right-0 z-50"
      style={{
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth}px)`,
        transition: "left 0.3s ease, width 0.3s ease",
        height: "64px",
      }}
    >
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left side */}
          <div className="flex items-center gap-3 flex-1">
            {/* Sidebar toggle */}
            <DisclosureButton
              onClick={toggleSidebar}
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300"
            >
              <Bars3Icon className="block size-5" />
              <XMarkIcon className="hidden size-5" />
            </DisclosureButton>

            <button
              onClick={toggleSidebar}
              className="hidden sm:flex p-2 rounded-md hover:bg-blue-100 text-gray-700 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <Bars3Icon className={`size-5 ${isCollapsed ? "rotate-90" : "rotate-0"} transition-transform`} />
            </button>

            {/* Search bar */}
            <div className="hidden sm:flex relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-10 pl-8 pr-2 text-sm text-gray-800 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
              />
              <RiSearchLine className="absolute top-2.5 left-2.5 text-gray-500 size-4" />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notification button */}
            <button
              onClick={() => setShowDropdown(showDropdown === "notifications" ? null : "notifications")}
              className="relative p-2 rounded-full text-gray-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <BellIcon className="w-5 h-5" />
            </button>

            {showDropdown === "notifications" && (
              <div className="absolute top-16 right-4 bg-white shadow-xl rounded-xl w-72 max-h-80 overflow-auto p-4 z-20">
                <h5 className="text-blue-600 font-semibold text-sm mb-2">Notifications</h5>
                <ul className="space-y-3 text-sm">
                  <li className="border-b pb-1.5">
                    <strong className="text-gray-800">New Message:</strong> Document #23
                    <p className="text-xs text-gray-500">10:20 AM Today</p>
                  </li>
                  <li className="border-b pb-1.5">
                    <strong className="text-gray-800">New Message:</strong> Document #28
                    <p className="text-xs text-gray-500">04:30 PM Today</p>
                  </li>
                </ul>
                <a
                  href="/"
                  className="block text-center mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all
                </a>
              </div>
            )}

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="relative flex items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                <img
                  src="/lims-lab/doctor_assets/default user.jpg"
                  alt="User"
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-green-400 border-2 border-white rounded-full" />
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-20 focus:outline-none">
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-600 font-medium">Admin</p>
                  <h6 className="text-base font-semibold text-gray-800">Dr. Reddy</h6>
                </div>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`block px-3 py-1.5 text-sm ${active ? "bg-blue-100" : "text-gray-700"}`}
                    >
                      Your Profile
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      className={`block px-3 py-1.5 text-sm ${active ? "bg-blue-100" : "text-gray-700"}`}
                    >
                      Settings
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full px-3 py-1.5 text-sm ${
                        active ? "bg-blue-100" : "text-red-600"
                      }`}
                    >
                      <IoIosLogOut className="mr-2 text-base" />
                      Logout
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile Search & Nav */}
      <DisclosurePanel className="sm:hidden bg-white shadow-lg">
        <div className="px-4 py-2">
          {/* Mobile search */}
          <div className="relative w-full mb-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-10 pl-8 pr-2 text-sm text-gray-800 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
            <RiSearchLine className="absolute top-2.5 left-2.5 text-gray-500 size-4" />
          </div>

          {/* Mobile nav links */}
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-blue-100 text-blue-900"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-900",
                "block rounded-md px-2 py-1.5 text-sm font-medium transition-colors duration-200"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
