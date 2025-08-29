import {
  RiUserAddLine,
  RiFileUserLine,
  RiFileList2Line,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const DoctorProfileCard = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Patient Registration",
      icon: <RiUserAddLine className="text-3xl text-[#238781]" />,
      buttons: [
        { label: "Register Patient", route: "/patient-registration" },
      ],
    },
    // {
    //   title: "General Registration",
    //   icon: <RiUserAddLine className="text-3xl text-[#238781]" />,
    //   buttons: [
    //     { label: "Register Patient", route: "/patient-general-registration" },
    //   ],
    // },
    // {
    //   title: "Registration with Billing",
    //   icon: <RiFileUserLine className="text-3xl text-[#238781]" />,
    //   buttons: [
    //     { label: "Register with Billing", route: "/patient-registration-with-billing" },
    //   ],
    // },
    // {
    //   title: "PPP Registration",
    //   icon: <RiFileList2Line className="text-3xl text-[#238781]" />,
    //   buttons: [
    //     { label: "Register for PPP", route: "/patient-ppp-registration" },
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
