import { useEffect, useState } from "react";
import { RiUserAddLine } from "react-icons/ri";
import { Calendar, Clock, MessageSquare, MoreVertical, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const patientData = {
  labels: ["Registered", "Rejected", "Pending"],
  datasets: [
    {
      label: "Patients Survey",
      data: [120, 30, 50], // example numbers
      backgroundColor: ["#4ade80", "#f87171", "#60a5fa"],
      borderWidth: 1,
    },
  ],
};

const DoctorProfileCard = () => {
  const navigate = useNavigate();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [selectedDate] = useState("Samples List / Patients List");
  const storedUserName = localStorage.getItem("username");
  const storedHospitalName = localStorage.getItem("hospital_name");

  const stats = [
    { label: "General Registration", change: "Register", trend: "up" },
    { label: "Registration with Billing", change: "Register", trend: "up" },
  ];

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
      name: "Catherine",
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
  ];

  // Auto-close modal after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcomeModal(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  const doctors = [
    {
      name: "Smith",
      specialty: "Cardiology",
      qualification: "MBBS, Ph.D",
      experience: "4 yrs Exp",
    },
    {
      name: "Johnson",
      specialty: "Orthopedics",
      qualification: "MBBS, MD, DM",
      experience: "6 yrs Exp",
    },
    {
      name: "Rickle Smtin",
      specialty: "Orthopedics",
      qualification: "MBBS, MD, DM",
      experience: "6 yrs Exp",
    },
    {
      name: "Angle",
      specialty: "Gynecologist",
      qualification: "MBBS, MD, Ph.D",
      experience: "10 yrs Exp",
    },
    {
      name: "Mary",
      specialty: "Neurosurgeon",
      qualification: "MBBS, MD, Ph.D",
      experience: "3 yrs Exp",
    },
    {
      name: "Laytoya Thoma",
      specialty: "Dermatologists",
      qualification: "MBBS, MD, Ph.D",
      experience: "5 yrs Exp",
    },
  ];
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6 relative">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-[90%] max-w-lg rounded-xl p-6">
            {/* Background Image */}
            <div className="relative">
              <img
                src="./welcome-Phlebotomist-bg.png"
                alt="background"
                className="w-full rounded-t-[20px] rounded-tr-[16px]"
              />
              {/* Rocket Image */}
              <img
                src="./welcome-Phlebotomist-rocket.png"
                alt="rocket"
                className="absolute w-[225px] -top-6 left-1/2 -translate-x-1/2"
              />
              {/* Close Button */}
              <div
                className="absolute top-3 right-3 cursor-pointer"
                onClick={() => setShowWelcomeModal(false)}
              >
                <X size={20} />
              </div>
            </div>

            {/* Modal Content */}
            <div className="text-center p-8  bg-white relative z-10">
              <h2 className="text-2xl font-extrabold uppercase tracking-wide text-[#238781]">
                {storedHospitalName}
              </h2>
              <h6 className="text-sm text-gray-700 mt-2">
                Welcome ! {storedUserName} 👋
              </h6>

              <ul className="flex flex-wrap items-center justify-between gap-4 py-4">
                <li className="relative w-40 px-3 py-2 rounded-[var(--app-border-radius)] text-[#0f626a] bg-[#0f626a1a] font-medium text-sm text-center">
                  Patient Registration
                </li>
                <li className="relative w-40 px-3 py-2 rounded-[var(--app-border-radius)] text-[#0f626a] bg-[#0f626a1a] font-medium text-sm text-center">
                  Report Section
                </li>
                <li className="relative w-40 px-3 py-2 rounded-[var(--app-border-radius)] text-[#0f626a] bg-[#0f626a1a] font-medium text-sm text-center">
                  Details Module
                </li>
                <li className="relative w-40 px-3 py-2 rounded-[var(--app-border-radius)] text-[#0f626a] bg-[#0f626a1a] font-medium text-sm text-center">
                  Rejected Samples
                </li>
              </ul>

              <div className="mt-4">
                <button
                  className="bg-[#238781] hover:bg-[#1a6d68] text-white px-6 py-2 rounded-lg font-medium"
                  onClick={() => setShowWelcomeModal(false)}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Card & Other Components */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="min-h-screen space-y-6">
          {/* Banner */}
          <div className="flex gap-4">
            {/* Welcome Card - 60% width */}
            <div
              className="w-3/5 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between text-white"
              style={{
                background: "#156b73",
              }}
            >
              {" "}
              <div className="md:w-full">
                <h2 className="text-2xl font-bold">
                  <span>{storedHospitalName}</span>
                </h2>
                <p className="mt-2 text-sm opacity-80">
                  Welcome to your hospital dashboard! Quickly access patient
                  registrations, track rejected samples, and review test
                  details—all in one place.
                </p>
              </div>
            </div>

            {/* Stats Grid - 40% width */}
            <div className="w-2/5 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">12,457</h3>
                  <p className="text-gray-500 text-sm">Total Patients </p>
                </div>
                <div className="bg-purple-100 rounded-full p-2">
                  <FaEye className="text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">2,987</h3>
                  <p className="text-gray-500 text-sm">Report Entry </p>
                </div>
                <div className="bg-pink-100 rounded-full p-2">
                  <FaEye className="text-pink-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">35,324</h3>
                  <p className="text-gray-500 text-sm">Total Appointments </p>
                </div>
                <div className="bg-blue-100 rounded-full p-2">
                  <FaEye className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">5,478</h3>
                  <p className="text-gray-500 text-sm">Rejected Samples </p>
                </div>
                <div className="bg-orange-100 rounded-full p-2">
                  <FaEye className="text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Patients Survey</h4>
              </div>

              {/* Full-width Doughnut Chart */}
              <div className="w-full h-80">
                <Doughnut
                  data={{
                    labels: [
                      "Registered Patient",
                      "Rejected Samples",
                      "Pending",
                    ],
                    datasets: [
                      {
                        label: "Patients Survey",
                        data: [120, 30, 50], // example numbers
                        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56"],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false, // fill container
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                  }}
                />
              </div>
            </div>
            {/* Doctors List */}
            <div className="bg-white rounded-xl p-4 shadow col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Today's Patient List</h4>
                <Link
                  to="/patient-registration"
                  className="text-sm text-blue-500 hover:underline"
                >
                  View All →
                </Link>
              </div>
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="text-gray-500 text-sm">
                    <th className="py-2">Patient Name</th>
                    <th className="py-2">Patient Code</th>
                    <th className="py-2">Department</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc, idx) => (
                    <tr key={idx} className="border-t text-sm">
                      <td className="py-2">
                        {doc.name}{" "}
                        <span className="block text-gray-400 text-xs">
                          {doc.specialty}
                        </span>
                      </td>
                      <td className="py-2">{doc.qualification}</td>
                      <td className="py-2">{doc.experience}</td>
                      <td className="py-2 flex gap-2">
                        <button className="p-2 bg-blue-100 rounded-full hover:bg-blue-200">
                          <FaEye className="text-blue-600" />
                        </button>

                        <button className="p-2 bg-yellow-100 rounded-full hover:bg-yellow-200">
                          <FaEdit className="text-yellow-600" />
                        </button>

                        {/* <button className="p-2 bg-red-100 rounded-full hover:bg-red-200">
                          <FaTrash className="text-red-500" />
                        </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* <div className="bg-white border border-pink-200 shadow rounded-2xl p-6 flex items-center gap-4">
          <img
            src="/doctor_assets/user.jpg"
            alt="Doctor"
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

        <div className="rounded-2xl p-[1px] bg-gradient-to-r from-pink-200 to-indigo-200">
          <div className="rounded-2xl bg-gradient-to-r to-pink-50 border border-pink-200 p-6">
            <h3 className="text-lg font-semibold mb-3">Register New Patient</h3>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Mithra Hospital</p>
                <p className="text-sm text-gray-500">#MITHRAHSP500021</p>
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
        </div> */}
      </div>
      {/* Remaining stats, calendar, appointments… */}
    </div>
  );
};

export default DoctorProfileCard;