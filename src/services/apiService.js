import axios from "./axiosService";
// import { environment } from "../../environments/environment";

const authToken = localStorage.getItem("authToken");

const httpOptions = {
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    Authorization: `Bearer ${authToken}`,
  },
};

const API_ROOT_URL = "https://asrlabs.asrhospitalindia.in/lims";
const API_ROOT_Phlebotomist_URL = "https://asrphleb.asrhospitalindia.in/api/v1/phleb";




export const addDepartment = async (departmentData) => {
  // no try/catch here
  return await axios.post(`${API_ROOT_URL}/master/add-department`, departmentData);
};






export const viewDepartments = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-department${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const viewDepartment = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-department/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateDepartment = async (id, departmentData) => {
  try {
    await axios.put(
      `${API_ROOT_URL}/master/update-department/${id}`,
      departmentData
    );
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};

export const viewSubDepartments = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-subdepartment${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const viewSubDepartment = async (id) => {
  try {
    const res = await axios.get(
      `${API_ROOT_URL}/master/get-subdepartment/${id}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addSubDepartments = async (subDepartmentData) => {
  try {
    return await axios.post(
      `${API_ROOT_URL}/master/add-subdepartment`,
      subDepartmentData
    );
  } catch (error) {
    console.error("Error adding sub-department:", error);
    throw error;
  }
};


export const addAccessionMaster = async (payload) => {
  try {
    return await axios.post(
      `${API_ROOT_URL}/master/add-accession`,
      payload
    );
  } catch (error) {
    console.error("Error adding add-accession:", error);
    throw error;
  }
};




export const updateSubDepartment = async (id, subDepartmentData) => {
  try {
    await axios.put(
      `${API_ROOT_URL}/master/update-subdepartment/${id}`,
      subDepartmentData
    );
  } catch (error) {
    console.error("Error updating sub-department:", error);
    throw error;
  }
};

export const viewHospitalTypes = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-hsptltype${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addHospitalType = async (hospitalTypeData) => {
  try {
    await axios.post(`${API_ROOT_URL}/master/add-hsptltype`, hospitalTypeData);
  } catch (error) {
    console.error("Error adding hospital type:", error);
    throw error;
  }
};

export const viewHospitalType = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-hsptltype/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateHospitalType = async (id, hospitalTypeData) => {
  try {
    await axios.put(
      `${API_ROOT_URL}/master/update-hsptltype/${id}`,
      hospitalTypeData
    );
  } catch (error) {
    console.error("Error updating hospital type:", error);
    throw error;
  }
};

export const viewHospitals = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-hospital${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addHospital = async (hospitalData) => {
  try {
    await axios.post(`${API_ROOT_URL}/master/add-hospital`, hospitalData);
  } catch (error) {
    console.error("Error adding hospital:", error);
    throw error;
  }
};

export const viewHospital = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-hospital/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateHospital = async (id, hospitalData) => {
  try {
    await axios.put(
      `${API_ROOT_URL}/master/update-hospital/${id}`,
      hospitalData
    );
  } catch (error) {
    console.error("Error updating hospital:", error);
    throw error;
  }
};

// Nodal API functions
export const viewNodals = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-nodal${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const viewNodal = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-nodal/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addNodal = async (nodalData) => {
  try {
    await axios.post(`${API_ROOT_URL}/master/add-nodal`, nodalData);
  } catch (error) {
    console.error("Error adding nodal:", error);
    throw error;
  }
};

export const updateNodal = async (id, nodalData) => {
  try {
    await axios.put(`${API_ROOT_URL}/master/update-nodal/${id}`, nodalData);
  } catch (error) {
    console.error("Error updating nodal:", error);
    throw error;
  }
};

// Nodal Hospital API functions
export const viewNodalHospitals = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-nodalhospital${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const viewNodalHospital = async (id) => {
  try {
    const res = await axios.get(
      `${API_ROOT_URL}/master/get-nodalhospital/${id}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addNodalHospital = async (nodalHospitalData) => {
  try {
    await axios.post(
      `${API_ROOT_URL}/master/add-nodalhospital`,
      nodalHospitalData
    );
  } catch (error) {
    console.error("Error adding nodal hospital:", error);
    throw error;
  }
};

export const updateNodalHospital = async (id, nodalHospitalData) => {
  try {
    await axios.put(
      `${API_ROOT_URL}/master/update-nodalhospital/${id}`,
      nodalHospitalData
    );
  } catch (error) {
    console.error("Error updating nodal hospital:", error);
    throw error;
  }
};

// Instrument API functions
// export const viewInstruments = async () => {
//   try {
//     const res = await axios.get(`${API_ROOT_URL}/master/get-instrument`);
//     return res.data;
//   } catch (error) {
//     throw error;
//   }
// };
// Fetch all instruments (list)
export const viewInstruments = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-instrument${queryString ? `?${queryString}` : ""}`;
    const res = await axios.get(url);

    // Make sure backend returns { data: [...], meta: {...} }
    return {
      data: res.data.data || [],
      meta: res.data.meta || { totalItems: res.data.data.length, totalPages: 1 }
    };
  } catch (error) {
    throw error;
  }
};


// https://asrlabs.asrhospitalindia.in/lims/master/get-hospital?page=1&limit=10


export const getHospitalList = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-hospital`);
    return res.data;
  } catch (error) {
    throw error;
  }
};


// export const viewInstrument = async (id) => {
//   try {
//     const res = await axios.get(`${API_ROOT_URL}/master/get-instrument/${id}`);
//     return res.data;
//   } catch (error) {
//     throw error;
//   }
// };
// Fetch a single instrument by ID
export const viewInstrument = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-instrument/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addInstrument = async (instrumentData) => {
  try {
    const response = await axios.post(   // ✅ save the result
      `${API_ROOT_URL}/master/add-instrument`,
      instrumentData
    );
    return response;   // ✅ now defined correctly
  } catch (error) {
    console.error("Error adding instrument:", error);
    throw error;
  }
};


export const updateInstrument = async (id, instrumentData) => {
  try {
    await axios.put(
      `${API_ROOT_URL}/master/update-instrument/${id}`,
      instrumentData
    );
  } catch (error) {
    console.error("Error updating instrument:", error);
    throw error;
  }
};

// Nodal Instrument API functions
export const viewNodalInstruments = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-nodalinstrument${queryString ? `?${queryString}` : ""}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const viewNodalInstrument = async (id) => {
  try {
    const res = await axios.get(
      `${API_ROOT_URL}/master/get-nodalinstrument/${id}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addNodalInstrument = async (nodalInstrumentData) => {
  try {
    await axios.post(
      `${API_ROOT_URL}/master/add-nodalinstrument`,
      nodalInstrumentData
    );
  } catch (error) {
    console.error("Error adding nodal instrument:", error);
    throw error;
  }
};

export const updateNodalInstrument = async (id, nodalInstrumentData) => {
  try {
    await axios.put(
      `${API_ROOT_URL}/master/update-nodalinstrument/${id}`,
      nodalInstrumentData
    );
  } catch (error) {
    console.error("Error updating nodal instrument:", error);
    throw error;
  }
};

// Role API functions
export const viewRoles = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-role${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const viewRole = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-role/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addRole = async (roleData) => {
  try {
    await axios.post(`${API_ROOT_URL}/master/add-role`, roleData);
  } catch (error) {
    console.error("Error adding role:", error);
    throw error;
  }
};

export const updateRole = async (id, roleData) => {
  try {
    await axios.put(`${API_ROOT_URL}/master/update-role/${id}`, roleData);
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

// Phlebotomist API functions
export const viewPhlebotomists = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-phlebo${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const viewPhlebotomist = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-phlebo/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addPhlebotomist = async (phlebotomistData) => {
  try {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) throw new Error("Auth token missing");

    const res = await axios.post(`${API_ROOT_URL}/master/add-phlebo`, phlebotomistData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return res.data;
  } catch (error) {
    console.error("Error adding phlebotomist:", error.response || error);
    throw error;
  }
};


export const updatePhlebotomist = async (id, phlebotomistData) => {
  try {
    await axios.put(
      `${API_ROOT_URL}/master/update-phlebo/${id}`,
      phlebotomistData
    );
  } catch (error) {
    console.error("Error updating phlebotomist:", error);
    throw error;
  }
};

// Reception API functions
export const viewReceptions = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-recep${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const viewReception = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-recep/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addReception = async (receptionData) => {
  try {
    await axios.post(`${API_ROOT_URL}/master/add-recep`, receptionData);
  } catch (error) {
    console.error("Error adding reception:", error);
    throw error;
  }
};

export const updateReception = async (id, receptionData) => {
  try {
    await axios.put(`${API_ROOT_URL}/master/update-recep/${id}`, receptionData);
  } catch (error) {
    console.error("Error updating reception:", error);
    throw error;
  }
};

// Technician API functions
export const viewTechnicians = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-tech${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const viewTechnician = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-tech/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addTechnician = async (technicianData) => {
  try {
    await axios.post(`${API_ROOT_URL}/master/add-tech`, technicianData);
  } catch (error) {
    console.error("Error adding technician:", error);
    throw error;
  }
};

export const updateTechnician = async (id, technicianData) => {
  try {
    await axios.put(`${API_ROOT_URL}/master/update-tech/${id}`, technicianData);
  } catch (error) {
    console.error("Error updating technician:", error);
    throw error;
  }
};

// LabToLab API functions
export const viewLabToLabs = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-labtolab${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const viewLabToLab = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-labtolab/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addLabToLab = async (labToLabData) => {
  try {
    await axios.post(`${API_ROOT_URL}/master/add-labtolab`, labToLabData);
  } catch (error) {
    console.error("Error adding lab to lab:", error);
    throw error;
  }
};

export const updateLabToLab = async (id, labToLabData) => {
  try {
    await axios.put(
      `${API_ROOT_URL}/master/update-labtolab/${id}`,
      labToLabData
    );
  } catch (error) {
    console.error("Error updating lab to lab:", error);
    throw error;
  }
};

// Specimen Type API functions
export const viewSpecimenTypes = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-specimen${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};






export const viewSpecimenType = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-specimen/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addSpecimenType = async (specimenTypeData) => {
  try {
    await axios.post(`${API_ROOT_URL}/master/add-specimen`, specimenTypeData);
  } catch (error) {
    console.error("Error adding specimen type:", error);
    throw error;
  }
};

export const updateSpecimenType = async (id, specimenTypeData) => {
  try {
    await axios.put(
      `${API_ROOT_URL}/master/update-specimen/${id}`,
      specimenTypeData
    );
  } catch (error) {
    console.error("Error updating specimen type:", error);
    throw error;
  }
};

// Investigation API functions
export const viewInvestigations = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-test${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const viewInvestigation = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-test/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addInvestigation = async (investigationData) => {
  try {
    await axios.post(`${API_ROOT_URL}/master/add-test`, investigationData);
  } catch (error) {
    console.error("Error adding investigation:", error);
    throw error;
  }
};

export const updateInvestigation = async (id, investigationData) => {
  try {
    await axios.put(
      `${API_ROOT_URL}/master/update-investigations/${id}`,
      investigationData
    );
  } catch (error) {
    console.error("Error updating investigation:", error);
    throw error;
  }
};





// Profile API functions
// Add Profile
export const addProfile = async (profileData) => {
  try {
    const authToken = localStorage.getItem("authToken");
    const res = await axios.post(
      `${API_ROOT_URL}/master/add-profile`,
      profileData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error adding profile:", error.response || error);
    throw error;
  }
};

// View Profiles
export const viewProfiles = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ROOT_URL}/master/get-profile${
      queryString ? `?${queryString}` : ""
    }`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Update Profile
export const updateProfile = async (id, profileData) => {
  try {
    const authToken = localStorage.getItem("authToken");
    const res = await axios.put(
      `${API_ROOT_URL}/master/update-profile/${id}`,
      profileData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating profile:", error.response || error);
    throw error;
  }
};




export const viewAllSpecimenType = async () => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-all-specimen`);
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const viewAllDepartmentDetails = async () => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-all-departments`);
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const viewAllSubDepartmentDetails = async () => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-all-subdpt`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const viewAllROles = async () => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-all-roles`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const viewAllInstrument = async () => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-all-instrument`);
    return res.data;
  } catch (error) {
    throw error;
  }
};



export const fetchPatientReportData = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_Phlebotomist_URL}/report/patient-report/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const viewAllHospitalType = async () => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-all-hospitaltype`);
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const viewAllHosiptalList = async () => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-all-hospital`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllNodals = async () => {
  try {
    const res = await axios.get(`${API_ROOT_URL}/master/get-all-nodals`);
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const fetchPhebotomistPatientData = async (id) => {
  try {
    const res = await axios.get(`${API_ROOT_Phlebotomist_URL}/get-patient-data/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};




