import React from "react";
import { RiHome3Line, RiCalendar2Line } from "react-icons/ri";

const HeroHeader = ({ sidebarWidth }) => {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b shadow-lg mt-16"
      style={{
        left: sidebarWidth,
        width: `calc(100vw - ${sidebarWidth}px)`,
        transition: "left 0.3s ease, width 0.3s ease",
      }}
    >
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <a href="#">
            <RiHome3Line />
          </a>
        </li>
        <li className="text-primary">/ Dashboard</li>
      </ol>
    </div>
  );
};

export default HeroHeader;
