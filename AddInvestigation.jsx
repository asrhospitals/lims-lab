import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const AddInvestigation = () => {
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [hospitalTypes, setHospitalTypes] = useState([]);
  const [specimens, setSpecimens] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        const [dept, subDept, role, hosp, spec] = await Promise.all([
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-department", { headers }),
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-subdepartment", { headers }),
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-role", { headers }),
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-hsptltype", { headers }),
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-specimen", { headers })
        ]);

        setDepartments(dept.data.filter((d) => d.isActive));
        setSubDepartments(subDept.data.filter((d) => d.isActive));
        setRoleTypes(role.data.filter((r) => r.isactive));
        setHospitalTypes(hosp.data.filter((h) => h.isActive));
        setSpecimens(spec.data.filter((s) => s.isactive));
      } catch (err) {
        toast.error("❌ Failed to load master data");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    setIsSubmitting(true);

const payload = {
  department: data.department,
  subdepartment: data.subdepartment,
  testname: data.testname,
  aliasname: data.aliasname,
  testcode: parseInt(data.testcode),
  shortcode: parseInt(data.shortcode),
  roletype: data.roletype,
  sequesncecode: data.sequencecode,   
  reporttype: data.reporttype,
  mesuringunit: data.mesuringunit,
  refrange: data.refrange,
  tat: `${data.tatHour || "0"} hour ${data.tatMin || "0"} min`,
  techtat: `${data.tatHour || "0"} hour ${data.tatMin || "0"} min`,
  dieases: data.dieases,
  testdone: data.testdone,
  specimentyepe: data.specimentyepe || 'test data',
  volume: data.volume,
  tubecolor: data.tubecolor,
  hospitaltype: Array.isArray(data.hospitaltype) ? data.hospitaltype : [data.hospitaltype],
  testcategory: data.testcategory,
  testcollectioncenter: data.testcollectioncenter,
  processingcenter: data.processingcenter,

  // Optional fields (if used)
  samplecollection: data.samplecollection || null,
  reportprint: data.reportprint || null,
  resultentryby: data.resultentryby || null,
  allowselecttestcode: data.allowselecttestcode ?? true,
  reportattachment: data.reportattachment ?? false,
  printinreport: data.printinreport ?? true,
  uploadimage: data.uploadimage ?? true,
  isactive: data.isactive ?? true,
  addbarcode: data.addbarcode ?? false,
  accredationname: data.accredationname || null,
  accredationdate: data.accredationdate || null,
};


    try {
      await axios.post(
        "https://asrlab-production.up.railway.app/lims/master/add-test",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Investigation added successfully");
      reset();
      navigate("/view-investigation");
    } catch (err) {
      toast.error("❌ Failed to add investigation");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  const yesNoOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];


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
              <Link to="/view-investigation" className="text-gray-700 hover:text-teal-600">Investigations</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Add Investigation</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-16 px-4 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Investigation</h4>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


            {/* Test Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Name *</label>
              <input {...register("testname", { required: true })} placeholder="Test Name" className="w-full border px-3 py-2 rounded" />
              {errors.testname && <p className="text-red-600 text-xs mt-1">Required</p>}
            </div>
            

            {/* Alias Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Alias Name</label>
              <input {...register("aliasname")} placeholder="Alias Name" className="w-full border px-3 py-2 rounded" />
            </div>

            {/* Test Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Code *</label>
              <input type="number" {...register("testcode", { required: true })} className="w-full border px-3 py-2 rounded" />
              {errors.testcode && <p className="text-red-600 text-xs mt-1">Required</p>}
            </div>

            {/* Short Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Short Code *</label>
              <input type="number" {...register("shortcode", { required: true })} className="w-full border px-3 py-2 rounded" />
              {errors.shortcode && <p className="text-red-600 text-xs mt-1">Required</p>}
            </div>

            


            {/* Department */}
            <div >
              <label className="block text-sm font-medium text-gray-700">Department *</label>
              <select {...register("department", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select Department</option>
                {departments.map((d, i) => (
                  <option key={i} value={d.dptName}>{d.dptName}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-600 text-xs mt-1">Required</p>}
            </div>
                 
            {/* Sub-Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Sub-Department *</label>
              <select {...register("subdepartment", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select Sub-Department</option>
                {subDepartments.map((s, i) => (
                  <option key={i} value={s.subDptName}>{s.subDptName}</option>
                ))}
              </select>
              {errors.subdepartment && <p className="text-red-600 text-xs mt-1">Required</p>}
            </div>


            {/* Role Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Role Type *</label>
              <select {...register("roletype", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select Role Type</option>
                {roleTypes.map((r, i) => (
                  <option key={i} value={r.roleType}>{r.roleType}</option>
                ))}
              </select>
              {errors.roletype && <p className="text-red-600 text-xs mt-1">Required</p>}
            </div>

            {/* Sequence Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Sequence Code</label>
              <input {...register("sequencecode")} className="w-full border px-3 py-2 rounded" />
            </div>


            

            <div className="col-span-full border-b border-gray-300 my-4"></div>


            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Report Type *</label>
              <select {...register("reporttype", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select Report Type</option>
                <option value="Document">Document</option>
                <option value="Data">Data</option>
                <option value="Text">Text</option>
                <option value="Number">Number</option>
                <option value="Image">Image</option>
                <option value="Other">Other</option>
              </select>
              {errors.reporttype && <p className="text-red-600 text-xs mt-1">Required</p>}
            </div>



            






            {/* Measuring Unit */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Measuring Unit</label>
                <input {...register("mesuringunit")} placeholder="Measuring Unit" className="w-full border px-3 py-2 rounded" />
                </div>
               

               {/* Reference Range */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Reference Range</label>
                <textarea
                    {...register("refrange")}
                    placeholder="Enter reference range / Note ..."
                    className="w-full border px-3 py-2 rounded"
                    rows={3}
                ></textarea>
                </div>              
                     

              <div className="col-span-full border-b border-gray-300 my-4"></div>

               {/* TAT Hour */}
                <div>
                <label className="block text-sm font-medium text-gray-700">TAT Hour</label>
                <input
                    type="number"
                    {...register("tatHour")}
                    placeholder="Hours"
                    className="w-full border px-3 py-2 rounded"
                    min={0}
                />
                </div>

                {/* TAT Minute */}
                <div>
                <label className="block text-sm font-medium text-gray-700">TAT Minute</label>
                <input
                    type="number"
                    {...register("tatMin")}
                    placeholder="Minutes"
                    className="w-full border px-3 py-2 rounded"
                    min={0}
                    max={59}
                />
                </div>


                {/* Disease */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Disease</label>
                <select
                    {...register("dieases", { required: true })}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">Select Disease</option>
                    <option value="Contaminated">Contaminated</option>
                    <option value="Infectious">Infectious</option>
                    <option value="Chronic">Chronic</option>
                    <option value="Other">Other</option>
                </select>
                {errors.dieases && (
                    <p className="text-red-600 text-xs mt-1">Disease is required</p>
                )}
                </div>

                {/* Test Done */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Test Done</label>
                <select
                    {...register("testdone", { required: true })}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">Select Test Done</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="Pending">Pending</option>
                    <option value="Other">Other</option>
                </select>
                {errors.testdone && (
                    <p className="text-red-600 text-xs mt-1">Test Done is required</p>
                )}
                </div>



                {/* Specimen Type */}

                <div>
                <label className="block text-sm font-medium text-gray-700">Specimen Type *</label>
                <select {...register("specimentyepe", { required: true })} className="w-full border px-3 py-2 rounded">
                    <option value="">Select Specimen Type</option>
                    {specimens.map((d) => (
                    <option key={d.specimenname} value={d.specimenname}>{d.specimenname}</option>
                    ))}
                </select>
                {errors.specimen && <p className="text-red-600 text-xs mt-1">Specimen is required</p>}
                </div>
                     

                {/* Volume */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Volume</label>
                <input {...register("volume")} placeholder="Volume" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Tube Color */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Tube Color</label>
                <select
                    {...register("tubecolor", { required: true })}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">Select Tube Color</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Purple">Purple</option>
                    <option value="Other">Other</option>
                </select>
                {errors.tubecolor && (
                    <p className="text-red-600 text-xs mt-1">Tube Color is required</p>
                )}
                </div>


            <div className="col-span-full border-b border-gray-300 my-4"></div>


                {/* Hospital Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hospital Type *</label>
                    <select
                      {...register("hospitaltype", { required: true })}
                      multiple
                      className="w-full border px-3 py-2 rounded h-32"
                    >
                      {hospitalTypes.map((d) => (
                        <option key={d.hsptltype} value={d.hsptltype}>
                          {d.hsptltype}
                        </option>
                      ))}
                    </select>
                    {errors.hospitaltype && (
                      <p className="text-red-600 text-xs mt-1">Hospital Type is required</p>
                    )}
                  </div>


                {/* Test Category */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Test Category</label>
                <input {...register("testcategory")} placeholder="Test Category" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Test Collection Center */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Test Collection Center</label>
                <input {...register("testcollectioncenter")} placeholder="Test Collection Center" className="w-full border px-3 py-2 rounded" />
                </div>

                

                {/* Processing Center */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Processing Center</label>
                <select
                    {...register("processingcenter", { required: true })}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">Select Processing Center</option>
                    <option value="Motherlab">Motherlab</option>
                    <option value="LabCorp">LabCorp</option>
                    <option value="Quest Diagnostics">Quest Diagnostics</option>
                    <option value="BioReference">BioReference</option>
                    <option value="Other">Other</option>
                </select>
                {errors.processingcenter && (
                    <p className="text-red-600 text-xs mt-1">Processing Center is required</p>
                )}
                </div>





                {/* Sample Collection */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Sample Collection</label>
                <input {...register("samplecollection")} placeholder="Sample Collection" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Report Print */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Report Print</label>
                <input {...register("reportprint")} placeholder="Report Print" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Result Entry By */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Result Entry By</label>
                <input {...register("resultentryby")} placeholder="Result Entry By" className="w-full border px-3 py-2 rounded" />
                </div>

               

                {/* Accreditation Name */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Accreditation Name</label>
                <input {...register("accredationname")} placeholder="Accreditation Name" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Accreditation Date */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Accreditation Date</label>
                <input type="date" {...register("accredationdate")} className="w-full border px-3 py-2 rounded" />
                </div>

                                


                 {/* Radio button fields */}
                {[
                    { label: "Allow Select Test Code", name: "allowselecttestcode" },
                    { label: "Report Attachment", name: "reportattachment" },
                    { label: "Print In Report", name: "printinreport" },
                    { label: "Upload Image", name: "uploadimage" },
                    { label: "Is Active", name: "isactive" },
                    { label: "Add Barcode", name: "addbarcode" },
                ].map(({ label, name }) => (
                    <div key={name} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">{label} *</label>
                    <div className="flex space-x-4 pt-2">
                        {yesNoOptions.map((opt) => (
                        <label key={opt.value.toString()} className="inline-flex items-center">
                            <input
                            type="radio"
                            {...register(name, { required: true })}
                            value={opt.value.toString()}
                            className="h-4 w-4 text-teal-600"
                            />
                            <span className="ml-2">{opt.label}</span>
                        </label>
                        ))}
                    </div>
                    {errors[name] && (
                        <p className="text-red-600 text-xs mt-1">{label} is required</p>
                    )}
                    </div>
                ))}


                




          </div>

          <div className="px-6 py-4 border-t bg-gray-50 text-right">
            <button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddInvestigation;
