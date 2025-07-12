import React from "react";
import {
  RiCircleFill,
  RiEmpathizeLine,
  RiStethoscopeLine,
  RiMoneyDollarCircleLine,
  RiCloseFill,
  RiCheckFill,
  RiStarFill,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const DoctorProfileCard = () => {
  const navigate = useNavigate();
 

  const sections = [
    {
      title: "Lab to Lab",
      buttons: [
        { label: "Add Lab", route: "/add-lab" },
        { label: "View Labs", route: "/view-labs" },
      ],
    },
    {
      title: "Nodal Hospital",
      buttons: [
        { label: "Add Nodal Hospital", route: "/add-nodal-hospital" },
        { label: "View Nodal Hospitals", route: "/view-nodal-hospitals" },
      ],
    },
    {
      title: "Instruments",
      buttons: [
        { label: "Add Instrument", route: "/add-instrument" },
        { label: "View Instruments", route: "/view-instruments" },
      ],
    },
    {
      title: "Nodal Instruments",
      buttons: [
        { label: "Add Nodal Instrument", route: "/add-noal-instrument" },
        { label: "View Nodal Instruments", route: "/view-nodal-instruments" },
      ],
    },
  ];

  return (
    <div className="w-full px-0 sm:px-2 space-y-4 text-[14.4px] sm:text-[14.4px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-3"
          >
            <h2 className="text-base font-semibold text-gray-800">
              {section.title}
            </h2>
            <div className="flex flex-col gap-2">
              {section.buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => navigate(btn.route)}
                  className="text-sm text-white bg-[#238781] hover:bg-[#1a6d68] px-4 py-2 rounded-md transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorProfileCard;
