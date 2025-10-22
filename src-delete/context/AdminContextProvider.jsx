import React, { useEffect, useState } from "react";
import AdminContext from "./adminContext";
import axios from "axios";

const AdminContextProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentToUpdate, setDepartmentToUpdate] = useState(null);
  const [subDptToUpdate, setsubDptToUpdate] = useState(null);
  const [hospitalTypes, setHospitalTypes] = useState([]);
  const [hospitalTypeToUpdate, setHospitalTypeToUpdate] = useState(null);
  const [hospitalToUpdate, setHospitalToUpdate] = useState(null);
  const [labToUpdate, setLabToUpdate] = useState(null);
  const [nodalToUpdate, setNodalToUpdate] = useState(null);
  const [instrumentToUpdate, setInstrumentToUpdate] = useState(null);
  const [nodalInstrumentToUpdate, setNodalInstrumentToUpdate] = useState(null);
  const [nodalHospitalToUpdate, setNodalHospitalToUpdate] = useState(null);
  const [roleToUpdate, setRoleToUpdate] = useState(null);




  const [phlebotomistToUpdate, setPhlebotomistToUpdate] = useState(null);
  const [receptionToUpdate, setReceptionToUpdate] = useState(null);
  const [technicianToUpdate, setTechnicianToUpdate] = useState(null);
  const [referalDoctorToUpdate, setReferalDoctorToUpdate] = useState(null);
  const [reportDoctorToUpdate, setReportDoctorToUpdate] = useState(null);


  const [investigationToUpdate, setInvestigationToUpdate] = useState(null);
  const [profileEntryMasterToUpdate, setProfileEntryMasterToUpdate] = useState(null);
  const [profileMasterToUpdate, setProfileMasterToUpdate] = useState(null);

  const [reportTypeMasterToUpdate, setReportTypeMasterToUpdate] = useState(null);
  const [kitMasterToUpdate, setKitMasterToUpdate] = useState(null);
  

  const [colors, setColors] = useState([]);
  const [colorToUpdate, setColorToUpdate] = useState(null);
  const [specimenTypeToUpdate, setSpecimenTypeToUpdate] = useState(null);

  



  return (
    <AdminContext.Provider
      value={{
        articles,
        setArticles,
        departments,
        setDepartments,
        departmentToUpdate,
        setDepartmentToUpdate,
        subDptToUpdate,
        setsubDptToUpdate,
        hospitalTypeToUpdate,
        setHospitalTypeToUpdate,
        hospitalTypes,
        setHospitalTypes,
        hospitalToUpdate,
        setHospitalToUpdate,
        labToUpdate,
        setLabToUpdate,
        instrumentToUpdate,
        setInstrumentToUpdate,
        nodalInstrumentToUpdate,
        setNodalInstrumentToUpdate,
        nodalToUpdate,
        setNodalToUpdate,
        nodalHospitalToUpdate,
        setNodalHospitalToUpdate,
        roleToUpdate,
        setRoleToUpdate,


        phlebotomistToUpdate,
        setPhlebotomistToUpdate,
        receptionToUpdate,
        setReceptionToUpdate,
        technicianToUpdate,
        setTechnicianToUpdate,
        referalDoctorToUpdate,
        setReferalDoctorToUpdate,
        reportDoctorToUpdate,
        setReportDoctorToUpdate,
        investigationToUpdate,
        setInvestigationToUpdate,
        profileEntryMasterToUpdate,
        setProfileEntryMasterToUpdate,
        profileMasterToUpdate,
        setProfileMasterToUpdate,

        reportTypeMasterToUpdate,
        setReportTypeMasterToUpdate,
        kitMasterToUpdate,
        setKitMasterToUpdate,
        //Color Master
        colors,
        setColors,
        colorToUpdate,
        setColorToUpdate,
        specimenTypeToUpdate,
        setSpecimenTypeToUpdate,       

        
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
