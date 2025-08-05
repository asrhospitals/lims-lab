import {
  RiTestTubeLine,
  RiHospitalLine,
  RiMicroscopeLine,
  RiStethoscopeLine,
  RiHomeHeartLine,
  RiBuildingLine,
  RiUserAddLine,
  RiUserSearchLine,
  RiUserSettingsLine,
  RiGroupLine,
  RiFolderAddLine,
  RiFileSearchLine ,
  RiFileUserLine ,
  RiFileList2Line ,
  
} from "react-icons/ri";

 

import { useNavigate } from "react-router-dom";

const DoctorProfileCard = () => {
  const navigate = useNavigate();



const sections = [
  // {
  //   title: "Departments",
  //   icon: <RiBuildingLine className="text-3xl text-[#238781]" />,
  //   buttons: [
  //     { label: "Add Department", route: "/add-department" },
  //     { label: "View Departments", route: "/view-departments" },
  //   ],
  // },
  // {
  //   title: "Sub Departments",
  //   icon: <RiFolderAddLine className="text-3xl text-[#238781]" />,
  //   buttons: [
  //     { label: "Add Sub Dept", route: "/add-subDpt" },
  //     { label: "View Sub Dept", route: "/view-subDpt" },
  //   ],
  // },
  // {
  //   title: "Hospital Types",
  //   icon: <RiHomeHeartLine className="text-3xl text-[#238781]" />,
  //   buttons: [
  //     { label: "Add Hospital Type", route: "/add-hospitaltype" },
  //     { label: "View Hospital Types", route: "/view-hospitaltype" },
  //   ],
  // },
  // {
  //   title: "Hospitals",
  //   icon: <RiHomeHeartLine className="text-3xl text-[#238781]" />,
  //   buttons: [
  //     { label: "Add Hospital", route: "/add-hospital" },
  //     { label: "View Hospitals", route: "/view-hospital" },
  //   ],
  // },
  
  
];


  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Phlebotomist Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              {section.icon}
              <h2 className="text-lg font-semibold text-gray-700">
                {section.title}
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {section.buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => navigate(btn.route)}
                  className="w-full bg-[#238781] hover:bg-[#1a6d68] text-white py-2 rounded-md text-sm font-medium transition-colors"
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
