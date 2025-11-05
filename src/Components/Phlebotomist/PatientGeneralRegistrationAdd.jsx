import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const PatientGeneralRegistrationAdd = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("https://your-api-endpoint/patient", data);
      toast.success("Patient registered successfully!");
      reset();
      navigate("/patient-general-registration"); // Redirect to the patient list
    } catch (error) {
      toast.error("Failed to register patient.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-sm font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">🏠 Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/patient-general-registration" className="text-gray-700 hover:text-teal-600">Patients</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Add Patient (General Registration) </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-16 px-4 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Patient (General Registration)</h4>
          </div>


          <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">ABHA Creation Interface</h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Mode of Creation:</label>
              <select {...register("creationMode", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select Mode</option>
                <option value="aadhaar">Aadhaar Number</option>
                <option value="mobile">Mobile Number</option>
              </select>
              {errors.creationMode && <p className="text-red-600 text-xs mt-1">You must select one mode of creation.</p>}
            </div>

          </div>

          <div className="px-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-0">ABHA Verification Interface</h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Verify Using:</label>
              <div className="flex flex-col space-y-2">
                <div>
                  <input
                    type="radio"
                    {...register("verificationMethod", { required: true })}
                    value="mobile"
                    id="mobile"
                    className="mr-2"
                  />
                  <label htmlFor="mobile" className="text-sm text-gray-700">Mobile Number (10-digit)</label>
                </div>
                <div>
                  <input
                    type="radio"
                    {...register("verificationMethod", { required: true })}
                    value="abhaId"
                    id="abhaId"
                    className="mr-2"
                  />
                  <label htmlFor="abhaId" className="text-sm text-gray-700">ABHA ID (14-digit)</label>
                </div>
                <div>
                  <input
                    type="radio"
                    {...register("verificationMethod", { required: true })}
                    value="aadhaar"
                    id="aadhaar"
                    className="mr-2"
                  />
                  <label htmlFor="aadhaar" className="text-sm text-gray-700">Aadhaar Number (12-digit)</label>
                </div>
              </div>
              {errors.verificationMethod && <p className="text-red-600 text-xs mt-1">You must select a verification method.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Centre Name:</label>
              <input
                type="text"
                {...register("centreName", { required: true, maxLength: 100 })}    
                className="w-full border px-3 py-2 rounded"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Source Type:</label>
              <select {...register("patientSourceType", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select Source Type</option>
                <option value="walk-in">Walk-in</option>
                <option value="in-house">In-house</option>
                <option value="b2b">B2B</option>
                <option value="referral">Referral</option>
              </select>
              {errors.patientSourceType && <p className="text-red-600 text-xs mt-1">Patient source type is required.</p>}
            </div>

          </div>


          <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">Basic Information </h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input {...register("country", { required: true })} defaultValue="India" className="w-full border px-3 py-2 rounded" />
              {errors.country && <p className="text-red-600 text-xs mt-1">Country is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Referral Source</label>
              <select {...register("referralSource", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select Referral Source</option>
                <option value="Banner">Banner</option>
                <option value="Google">Google</option>
                <option value="SMS">SMS</option>
                <option value="Doctor">Doctor</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
              {errors.referralSource && <p className="text-red-600 text-xs mt-1">Referral source is required</p>}
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700">Reference Details</label>
              <input {...register("referenceDetails", { required: true, maxLength: 50 })} className="w-full border px-3 py-2 rounded" />
              {errors.referenceDetails && <p className="text-red-600 text-xs mt-1">Reference details are required (max 50 chars)</p>}
            </div>

          </div>


         
          <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">Contact and Identity</h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input {...register("mobileNumber", { required: true, pattern: /^[0-9]{10}$/ })} className="w-full border px-3 py-2 rounded" />
              {errors.mobileNumber && <p className="text-red-600 text-xs mt-1">Must be 10 digits</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <select {...register("title", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Dr">Dr</option>
                <option value="Baby">Baby</option>
              </select>
              {errors.title && <p className="text-red-600 text-xs mt-1">Title is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <input {...register("patientName", { required: true, pattern: /^[A-Za-z\s.]+$/ })} className="w-full border px-3 py-2 rounded" />
              {errors.patientName && <p className="text-red-600 text-xs mt-1">Patient name is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input {...register("lastName")} className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select {...register("gender", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="TS">TS</option>
                <option value="TG">TG</option>
              </select>
              {errors.gender && <p className="text-red-600 text-xs mt-1">Gender is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" {...register("dob", { required: true })} className="w-full border px-3 py-2 rounded" />
              {errors.dob && <p className="text-red-600 text-xs mt-1">Date of Birth is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Group</label>
              <select {...register("bloodGroup", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
              {errors.bloodGroup && <p className="text-red-600 text-xs mt-1">Blood group is required</p>}
            </div>

          </div>





          <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">ID Proof Details</h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Type</label>
              <select {...register("idType", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select ID Type</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
              </select>
              {errors.idType && <p className="text-red-600 text-xs mt-1">ID Type is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ID Number</label>
              <input {...register("idNumber", { required: true, pattern: /^[A-Za-z0-9]+$/ })} className="w-full border px-3 py-2 rounded" />
              {errors.idNumber && <p className="text-red-600 text-xs mt-1">ID Number is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input {...register("email", { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })} className="w-full border px-3 py-2 rounded" />
              {errors.email && <p className="text-red-600 text-xs mt-1">Invalid email format</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
              <input {...register("whatsappNumber", { pattern: /^[0-9]{10}$/ })} className="w-full border px-3 py-2 rounded" />
              {errors.whatsappNumber && <p className="text-red-600 text-xs mt-1">Must be 10 digits</p>}
            </div>

          </div>



          
          <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">Guardian Information<span className="ml-2 text-sm font-normal text-gray-400">(required if patient is minor or elderly)</span></h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                {...register("guardianName", { required: true, pattern: /^[A-Za-z\s]+$/ })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter Guardian Name"
              />
              {errors.guardianName && (
                <p className="text-red-600 text-xs mt-1">Name must contain alphabets only</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile</label>
              <input
                {...register("guardianMobile", { required: true, pattern: /^[0-9]{10}$/ })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter 10-digit Mobile Number"
              />
              {errors.guardianMobile && (
                <p className="text-red-600 text-xs mt-1">Must be 10 digits</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address (Optional)</label>
              <input
                {...register("street")}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Relation</label>
              <select {...register("relation")} className="w-full border px-3 py-2 rounded">
                <option value="">Select Relation</option>
                <option value="Parent">Parent</option>
                <option value="Guardian">Guardian</option>
                <option value="Relative">Relative</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
 


          <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">Address Details</h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        

            <div>
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input {...register("street")} className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Landmark</label>
              <input {...register("Landmark")} className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input {...register("city", { required: true })} className="w-full border px-3 py-2 rounded" />
              {errors.city && <p className="text-red-600 text-xs mt-1">City is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select {...register("state", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
              </select>
              {errors.state && <p className="text-red-600 text-xs mt-1">State is required</p>}
            </div>
          
          </div>    


          <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">Communication Preferences</h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              <div className="mb-2">
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailAlerts"
                    {...register("emailAlerts")}
                    className="mr-2 focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                  />
                  <label htmlFor="emailAlerts" className="block text-sm font-medium text-gray-700">
                    Email Alerts
                  </label>
                </div>

              </div>

              <div className="mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="whatsappAlerts"
                    {...register("whatsappAlerts")}
                    className="mr-2 focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                  />
                  <label htmlFor="whatsappAlerts" className="block text-sm font-medium text-gray-700">
                    WhatsApp Alerts
                  </label>
                </div>

              </div>
          </div>





          <div className="px-6 pt-6">
            <h3 className=" text-lg font-medium text-gray-900 mb-0">Hospital / Scheme Information</h3>
            <div className="mt-1 border-b border-gray-100"></div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Number Type</label>
                <select id="numberType" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="OP">OP Number</option>
                    <option value="IP">IP Number</option>
                </select>
            </div>
           
            

            <div>
              <label className="block text-sm font-medium text-gray-700">OP/IP Number</label>
              <input {...register("opNumber")} className="w-full border px-3 py-2 rounded" />
            </div>

           

            <div>
              <label className="block text-sm font-medium text-gray-700">Scheme Type</label>
              <select {...register("schemeType")} className="w-full border px-3 py-2 rounded">
                <option value="">Select Scheme Type</option>
                <option value="MJAY">MJAY</option>
                <option value="PMJAY">PMJAY</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input {...register("registrationNumber")} className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Referral Doctor Name</label>
              <input {...register("referralDoctorName")} className="w-full border px-3 py-2 rounded" />
            </div>


           <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barcode No</label>
                <input 
                    name="barcodeNo" 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TRF Number</label>
                <input 
                    name="trfNumber" 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea 
                    name="remarks" 
                    rows="3" 
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                ></textarea>
            </div>
            

          </div>
         
          



          



          <div className="px-6 py-4 border-t bg-gray-50 text-right">
            <button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">
              {isSubmitting ? "Saving..." : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PatientGeneralRegistrationAdd;
