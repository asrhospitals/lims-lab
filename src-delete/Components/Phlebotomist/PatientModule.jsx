import { useState } from "react";
import PatientRegistrationAdd from "./PatientRegistrationAdd";
import ProfileTestBilling from "./ProfileTestBilling";

const PatientModule = () => {
  const [patientData, setPatientData] = useState({});
  const [billingData, setBillingData] = useState([]);

  return (
    <div className="space-y-6">
      <PatientRegistrationAdd
        onPatientSubmit={(data) => setPatientData(data)}
      />
      {patientData.p_name && (
        <ProfileTestBilling
          patient={patientData}
          onBillingChange={(billing) => setBillingData(billing)}
        />
      )}
    </div>
  );
};

export default PatientModule;
