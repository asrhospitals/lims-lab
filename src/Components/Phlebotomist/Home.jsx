import { RiUserAddLine, RiFileUserLine, RiFileList2Line } from "react-icons/ri";
import {
  Calendar,
  Clock,
  Video,
  MessageSquare,
  X,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DoctorProfileCard = () => {
  const navigate = useNavigate();
  const [selectedDate] = useState("Samples List / Patients List");

  const storedUserName = localStorage.getItem('username');
  const [stats] = useState([
    {
      label: "General Registration",
      change: "Register",
      trend: "up",
    },
    {
      label: "Registration with Billing",
      change: "Register",
      trend: "up",
    },
  ]);

  const appointments = [
    {
      name: "Vikram",
      issue: "Headache, Diabetes",
      status: "Assign",
      color: "bg-rose-500 text-white",
    },
    {
      name: "Manasa",
      issue: "Chest Pain",
      status: "In Progress",
      action: "End",
      color: "text-green-600",
    },
    {
      name: "Samuel",
      issue: "Allergies",
      status: "In 30 minutes",
      color: "text-gray-500",
    },
    {
      name: "Catherine ",
      issue: "Hypertension, Asthma",
      status: "Cancelled",
      color: "text-red-500",
    },
    {
      name: "Pawan",
      issue: "Depression",
      status: "Rescheduled",
      color: "text-orange-500",
    },
    {
      name: "Jagan",
      issue: "Chest Pain",
      status: "In Progress",
      action: "End",
      color: "text-green-600",
    },
  ];

  const sections = [
    {
      title: "Patient Registration",
      icon: <RiUserAddLine className="text-3xl text-[#238781]" />,
      buttons: [{ label: "Register Patient", route: "/patient-registration" }],
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

  // const sections = [
  //   {
  //     title: "Patient Registration",
  //     icon: <RiUserAddLine className="text-3xl text-[#238781]" />,
  //     buttons: [
  //       { label: "Register Patient", route: "/patient-registration" },
  //     ],
  //   },

  // ];

  return (
    // <div className="p-4 bg-gray-50 min-h-screen">
    //   <h1 className="text-3xl font-bold text-gray-800 mb-6">Phlebotomist Dashboard</h1>
    //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    //     {sections.map((section, index) => (
    //       <div
    //         key={index}
    //         className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300"
    //       >
    //         <div className="flex items-center gap-3 mb-4">
    //           {section.icon}
    //           <h2 className="text-lg font-semibold text-gray-700">
    //             {section.title}
    //           </h2>
    //         </div>
    //         <div className="flex flex-col gap-3">
    //           {section.buttons.map((btn, i) => (
    //             <button
    //               key={i}
    //               onClick={() => navigate(btn.route)}
    //               className="w-full bg-[#238781] hover:bg-[#1a6d68] text-white py-2 rounded-md text-sm font-medium transition-colors"
    //             >
    //               {btn.label}
    //             </button>
    //           ))}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Doctor Card */}
        <div className="bg-white border border-pink-200 shadow rounded-2xl p-6 flex items-center gap-4">
          <img
            src="/doctor_assets/user.jpg"
            alt="Receptionist"
            className="w-20 h-20 rounded-full border border-pink-200"
          />
          <div>
            <h2 className="text-xl font-semibold">Hello, {storedUserName}</h2>
            <p className="text-gray-500">Welcome Back</p>
            <div className="flex items-center gap-3 text-sm text-rose-500 mt-2">
              <span className="inline-flex items-center gap-1">
                <Calendar size={16} /> Saturday, 3 August 2025
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={16} /> 10:04 AM
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming Appointment (pink border + gradient fill) */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-r from-pink-200 to-indigo-200">
          <div className="rounded-2xl bg-gradient-to-r to-pink-50 border border-pink-200 p-6">
            <h3 className="text-lg font-semibold mb-3">Register New Patient</h3>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Mithra Hospital</p>
                <p className="text-sm text-gray-500">#MITHRAHSP500021</p>
                {/* <p className="text-sm mt-1">
                <span className="font-medium">General Visit</span> • Today •
                6:30 PM
              </p> */}
              </div>
              <div className="space-y-2">
                <button className="bg-rose-500 text-white px-3 py-1 rounded-lg text-sm">
                  Click Here
                </button>
                <button className="bg-white border border-gray-300 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                  <MessageSquare size={14} /> Search Patient's Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section (subtle pink borders) */}
      <div className="max-w-[800px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white border border-pink-100 shadow rounded-2xl p-6 text-center 
        transform transition-all duration-300 ease-in-out 
        hover:-translate-y-2 hover:shadow-lg hover:shadow-pink-200/50 cursor-pointer"
            >
              <h5 className="text-2xl font-bold">{s.label}</h5>

              <button className="text-black px-3 py-1 rounded-lg text-sm">
                {s.change}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div className="bg-white border shadow rounded-2xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <select className="border rounded-lg px-3 py-1 text-sm">
                <option>Month</option>
                <option>Week</option>
                <option>Day</option>
              </select>
              <div className="flex items-center gap-4">
                <button>&lt;</button>
                <div className="flex items-center gap-2 font-medium">
                  <Calendar size={16} className="text-pink-500" />
                  August 2024
                </div>
                <button>&gt;</button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d, i) => (
                <div key={i} className="p-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 text-center text-gray-700">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`p-4 border text-sm ${
                    day === 18 ? "bg-rose-500 text-white font-semibold" : ""
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Sidebar */}
          <div className="bg-white border shadow rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{selectedDate}</h3>
              <button className="text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {appointments.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  {/* Avatar / Initial */}
                  <div className="flex items-center gap-3">
                    {i === 2 ? (
                      <img
                        src="https://i.pravatar.cc/40?img=12"
                        alt={a.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-600">
                        {a.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{a.name}</p>
                      <p className="text-xs text-gray-500">{a.issue}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {a.status === "Assign" && (
                      <button className="bg-rose-500 text-white px-3 py-1 rounded-lg text-xs">
                        Assign
                      </button>
                    )}
                    {a.status === "In Progress" && (
                      <span className="text-green-600 text-xs">
                        In Progress
                      </span>
                    )}
                    {a.action === "End" && (
                      <button className="bg-gray-100 px-3 py-1 rounded-lg text-xs">
                        End
                      </button>
                    )}
                    {a.status === "Cancelled" && (
                      <span className="text-red-500 text-xs">Cancelled</span>
                    )}
                    {a.status === "Rescheduled" && (
                      <span className="text-orange-500 text-xs">
                        Rescheduled
                      </span>
                    )}
                    {a.status === "In 30 minutes" && (
                      <span className="flex items-center text-gray-500 text-xs">
                        <Clock size={14} className="mr-1" /> In 30 minutes
                      </span>
                    )}

                    <button className="p-1 border rounded-lg">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileCard;
