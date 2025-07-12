import { useEffect, useState, useContext } from "react"; 
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";

const UpdateInvestigation = () => {
  const { investigationToUpdate, setInvestigationToUpdate } = useContext(AdminContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nodalCenters, setNodalCenters] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [hospitalTypes, setHospitalTypes] = useState([]);
  const [specimens, setSpecimens] = useState([]);
  const [isNablAccredited, setIsNablAccredited] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      department: "",
      subdepartment: "",
      testname: "",
      aliasname: "",
      testcode: "",
      shortcode: "",
      roletype: "",
      sequesncecode: "",
      reporttype: "",
      mesuringunit: "",
      refrange: "",
      tat: "",
      techtat: "",
      specimentyepe: "",
      volume: "",
      tubecolor: "",
      testcategory: "",
      testcollectioncenter: "",
      processingcenter: "",
      samplecollection: "",
      reportprint: "",
      allowselecttestcode: true,
      reportattachment: true,
      printinreport: true,
      uploadimage: true,
      isactive: true,
      addbarcode: true,
      accredationname: "",
      accredationdate: "",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("investigationToUpdate");

    if (!investigationToUpdate && stored) {
      try {
        const parsed = JSON.parse(stored);
        setInvestigationToUpdate(parsed);
      } catch {
        console.error("Invalid investigationToUpdate in localStorage");
      }
    } else if (investigationToUpdate) {
      reset({
        department: investigationToUpdate.department || "",
        subdepartment: investigationToUpdate.subdepartment || "",
        testname: investigationToUpdate.testname || "",
        aliasname: investigationToUpdate.aliasname || "",
        testcode: investigationToUpdate.testcode || "",
        shortcode: investigationToUpdate.shortcode || "",
        roletype: investigationToUpdate.roletype || "",
        sequesncecode: investigationToUpdate.sequesncecode || "",
        reporttype: investigationToUpdate.reporttype || "",
        mesuringunit: investigationToUpdate.mesuringunit || "",
        refrange: investigationToUpdate.refrange || "",
        tat: investigationToUpdate.tat || "",
        techtat: investigationToUpdate.techtat || "",
        specimentyepe: investigationToUpdate.specimentyepe || "",
        volume: investigationToUpdate.volume || "",
        tubecolor: investigationToUpdate.tubecolor || "",
        testcategory: investigationToUpdate.testcategory || "",
        testcollectioncenter: investigationToUpdate.testcollectioncenter || "",
        processingcenter: investigationToUpdate.processingcenter || "",
        samplecollection: investigationToUpdate.samplecollection || "",
        reportprint: investigationToUpdate.reportprint || "",
        allowselecttestcode: investigationToUpdate.allowselecttestcode ?? true,
        reportattachment: investigationToUpdate.reportattachment ?? true,
        printinreport: investigationToUpdate.printinreport ?? true,
        uploadimage: investigationToUpdate.uploadimage ?? true,
        isactive: String(investigationToUpdate.isactive ?? true),
        addbarcode: investigationToUpdate.addbarcode ?? true,
        accredationname: investigationToUpdate.accredationname || "",
        accredationdate: investigationToUpdate.accredationdate || "",
      });
    }
  }, [investigationToUpdate, reset, setInvestigationToUpdate]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    const fetchData = async () => {
      try {
        const [dept, subDept, role, nodal, instr, hosp, spec] = await Promise.all([
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-department", { headers: { Authorization: `Bearer ${authToken}` } }),
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-subdepartment", { headers: { Authorization: `Bearer ${authToken}` } }),
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-role", { headers: { Authorization: `Bearer ${authToken}` } }),
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-nodal", { headers: { Authorization: `Bearer ${authToken}` } }),
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-instrument", { headers: { Authorization: `Bearer ${authToken}` } }),
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-hsptltype", { headers: { Authorization: `Bearer ${authToken}` } }),
          axios.get("https://asrlab-production.up.railway.app/lims/master/get-specimen", { headers: { Authorization: `Bearer ${authToken}` } }),
        ]);

        setDepartments(dept.data.filter((d) => d.isActive));
        setSubDepartments(subDept.data.filter((d) => d.isActive));
        setRoleTypes(role.data.filter((r) => r.isactive));
        setNodalCenters(nodal.data.filter((n) => n.isactive));
        setInstruments(instr.data.filter((i) => i.isactive));
        setHospitalTypes(hosp.data.filter((h) => h.isActive));
        setSpecimens(spec.data.filter((s) => s.isactive));
      } catch (error) {
        toast.error("❌ Failed to fetch master data.");
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    if (!investigationToUpdate?.investigation_id) {
      toast.error("❌ Investigation ID not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const payload = {
        department: data.department,
        subdepartment: data.subdepartment,
        testname: data.testname,
        aliasname: data.aliasname,
        testcode: Number(data.testcode),
        shortcode: Number(data.shortcode),
        roletype: data.roletype,
        sequesncecode: data.sequesncecode,
        reporttype: data.reporttype,
        mesuringunit: data.mesuringunit,
        refrange: data.refrange,
        tat: data.tat,
        techtat: data.techtat,
        specimentyepe: data.specimentyepe,
        volume: data.volume,
        tubecolor: data.tubecolor,
        hospitaltype: ["DH", "CHC", "PHC"], // Example, adjust as needed
        testcategory: data.testcategory,
        testcollectioncenter: data.testcollectioncenter,
        processingcenter: data.processingcenter,
        samplecollection: data.samplecollection,
        reportprint: data.reportprint,
        allowselecttestcode: data.allowselecttestcode,
        reportattachment: data.reportattachment,
        printinreport: data.printinreport,
        uploadimage: data.uploadimage,
        isactive: data.isactive === "true",
        addbarcode: data.addbarcode,
        accredationname: data.accredationname,
        accredationdate: data.accredationdate,
      };

      await axios.put(
        `https://asrlab-production.up.railway.app/lims/master/update-test/${investigationToUpdate.investigation_id}`,
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("Investigation updated successfully!", { autoClose: 2000 });

      setTimeout(() => {
        setInvestigationToUpdate(null);
        localStorage.removeItem("investigationToUpdate");
        navigate("/view-investigation");
      }, 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to update investigation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!investigationToUpdate) {
    return <div className="text-center py-10 text-gray-500">No investigation selected for update.</div>;
  }



   const yesNoOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];



  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li><Link to="/" className="text-gray-700 hover:text-teal-600">🏠︎ Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-investigation" className="text-gray-700 hover:text-teal-600">Investigation</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Investigation</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Investigation</h4>
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
                  <option key={i} value={d.dptName} selected={investigationToUpdate.department === d.dptName ? true : false} >{d.dptName}</option>
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
                  <option key={i} value={s.subDptName}  selected={investigationToUpdate.subdepartment === s.subDptName ? true : false}  >{s.subDptName}</option>
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
                  <option key={i} value={r.roleType}  selected={investigationToUpdate.roletype === r.roleType ? true : false}  >{r.roleType}</option>
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

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/view-investigation")}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Investigation"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
  
};

export default UpdateInvestigation;
