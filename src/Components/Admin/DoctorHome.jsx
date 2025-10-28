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
  RiFileList2Line 
} from "react-icons/ri";

import { FaUserDoctor } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

const DoctorProfileCard = () => {
  const navigate = useNavigate();



const sections = [
  {
    title: "Departments",
    icon: <RiBuildingLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Department", route: "/add-department" },
      { label: "View Departments", route: "/view-departments" },
    ],
  },
  {
    title: "Sub Departments",
    icon: <RiFolderAddLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Sub Dept", route: "/add-subDpt" },
      { label: "View Sub Dept", route: "/view-subDpt" },
    ],
  },
  {
    title: "Hospital Types",
    icon: <RiHomeHeartLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Hospital Type", route: "/add-hospitaltype" },
      { label: "View Hospital Types", route: "/view-hospitaltype" },
    ],
  },
  {
    title: "Hospitals",
    icon: <RiHomeHeartLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Hospital", route: "/add-hospital" },
      { label: "View Hospitals", route: "/view-hospital" },
    ],
  },
  {
    title: "Nodal",
    icon: <RiHospitalLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Nodal", route: "/add-nodal" },
      { label: "View Nodal", route: "/view-nodal" },
    ],
  },
  {
    title: "Nodal Hospital",
    icon: <RiHospitalLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Nodal Hospital", route: "/add-nodal-hospital" },
      { label: "View Nodal Hospitals", route: "/view-nodal-hospitals" },
    ],
  },
  {
    title: "Instruments",
    icon: <RiMicroscopeLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Instrument", route: "/add-instrument" },
      { label: "View Instruments", route: "/view-instruments" },
    ],
  },
  {
    title: "Nodal Instruments",
    icon: <RiStethoscopeLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Nodal Instrument", route: "/add-nodal-instrument" },
      { label: "View Nodal Instruments", route: "/view-nodal-instruments" },
    ],
  },
  {
    title: "Lab to Lab",
    icon: <RiTestTubeLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Lab", route: "/add-labtolab" },
      { label: "View Labs", route: "/view-labtolab" },
    ],
  },
  {
    title: "Roles",
    icon: <RiGroupLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Role", route: "/add-role" },
      { label: "View Roles", route: "/view-roles" },
    ],
  },
  {
    title: "User Creation",
    icon: <RiGroupLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add User", route: "/add-user" },
      { label: "View User", route: "/view-user-list" },
    ],
  },
  {
    title: "User Mapping",
    icon: <RiGroupLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add User", route: "/add-user-mapping" },
      { label: "View User", route: "/view-user-mapping" },
    ],
  },
  {
    title: "Phlebotomist",
    icon: <RiUserAddLine className="text-3xl text-[#238781]" />,
    buttons: [
      // { label: "Add Phlebotomist", route: "/add-phlebotomist" },
      { label: "Add Phlebotomist", route: "/add-user" },
      { label: "View Phlebotomists", route: "/view-phlebotomist" },
    ],
  },
  {
    title: "Receptionist",
    icon: <RiUserSearchLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Receptionist", route: "/add-user" },
      // { label: "Add Receptionist", route: "/add-reception" },
      { label: "View Receptionists", route: "/view-reception" },
    ],
  },
  {
    title: "Technician",
    icon: <RiUserSettingsLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Technician", route: "/add-user" },
      // { label: "Add Technician", route: "/add-technician" },
      { label: "View Technicians", route: "/view-technician" },
    ],
  },
  {
    title: "Investigation",
    icon: <RiFileSearchLine  className="text-3xl text-[#238781]" />,
    // inProgress: true,

    buttons: [
      { label: "Add Investigation", route: "/add-investigation" },
      { label: "View Investigations", route: "/view-investigation" },
    ],
  },
  {
    title: "Profile Entry",
    icon: <RiFileList2Line className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Profile Entry", route: "/add-profile-entry-master" },
      { label: "View Profile Entry", route: "/view-profile-entry-master" },
    ],
  },
  {
    title: "Profile ",
    icon: <RiFileUserLine className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Profile ", route: "/add-profile-master" },
      { label: "View Profiles", route: "/view-profile-master" },
    ],
  },


  {
    title: "Accession Master",
    icon: <RiFileList2Line className="text-3xl text-[#238781]" />,
    inProgress: true,
    buttons: [
      { label: "Add Accession", route: "/add-accession-master" },
      { label: "View Accession", route: "/view-accession-master" },
    ],
  },
  

  {
    title: "Patient Registration",
    icon: <RiFileSearchLine  className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Patient Details", route: "/admin-add-patient-details" },
      { label: "View Patient Details", route: "/admin-view-patient-details" },
    ],
  },
  {
    title: "Report Type",
    icon: <RiFileSearchLine  className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Report Type", route: "/add-report-type-master" },
      { label: "View Report Type", route: "/view-report-type-master" },
    ],
  },
  {
    title: "Kit Master",
    icon: <RiFileSearchLine  className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Kit Master", route: "/add-kit-master" },
      { label: "View Kit Master", route: "/view-kit-master" },
    ],
  },
  {
    title: "Specimen Type",
    icon: <RiFileSearchLine  className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Specimen Type", route: "/add-specimen-type" },
      { label: "View Specimen Type", route: "/view-specimen-type" },
    ],
  },
  {
    title: "Color Master",
    icon: <RiFileSearchLine  className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Add Color Master", route: "/add-color" },
      { label: "View Color Master", route: "/view-color" },
    ],
  },
    {
    title: "Referal Doctor",
    icon: <FaUserDoctor  className="text-3xl text-[#238781]" />,
    buttons: [
      { label: "Referal Doctor Registration", route: "/add-referal-doctor" },
     
    ],
  },
  {
    title: "Doctor Registration",
    icon: <FaUserDoctor  className="text-3xl text-[#238781]" />,

    buttons: [
      { label: "Doctor Registration", route: "/doctor-registration" },
      { label: "View Doctor Details", route: "/view-doctor-registration-details" },
     
    ],
  },
];


  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
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
                {section.inProgress && <span className="ml-2 mr-2 text-red-500">*</span>}
                {section.inProgress && <span className="text-red-500">*</span>}
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
