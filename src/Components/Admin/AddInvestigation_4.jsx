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
  const [isNablAccredited, setIsNablAccredited] = useState(false);

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
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-department", { headers }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-subdepartment", { headers }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-role", { headers }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-hsptltype", { headers }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-specimen", { headers })
        ]);

        setDepartments(dept.data.filter((d) => d.isActive));
        setSubDepartments(subDept.data.filter((d) => d.isActive));
        setRoleTypes(role.data.filter((r) => r.isactive));
        setHospitalTypes(hosp.data.filter((h) => h.isActive));
        setSpecimens(spec.data.filter((s) => s.isactive));
      } catch (err) {
        toast.error("❌ Failed to load master data");
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("authToken");

    // For file upload you need FormData - this example sends JSON only without file upload.
    // You can extend with FormData if backend supports it.

    const payload = {
      department: data.department,
      subdepartment: data.subdepartment,
      testname: data.testname,
      aliasname: data.aliasname,
      testcode: parseInt(data.testcode),
      shortcode: parseInt(data.shortcode),
      roletype: data.roletype,
      sequesncecode: data.sequesncecode,
      reporttype: data.reporttype,
      mesuringunit: data.mesuringunit,
      refrange: data.refrange,
      tat: `${data.tatHour} hour ${data.tatMin} min`,
      techtat: `${data.tatHour} hour ${data.tatMin} min`,
      dieases: data.dieases,
      testdone: data.testdone,
      specimentyepe: data.specimentyepe,
      volume: data.volume,
      tubecolor: data.tubecolor,
      hospitaltype: data.hospitaltype,
      testcategory: data.testcategory,
      testcollectioncenter: data.testcollectioncenter,
      processingcenter: data.processingcenter,
      samplecollection: data.samplecollection,
      reportprint: data.reportprint,
      resultentryby: data.resultentryby,
      allowselecttestcode: true,
      reportattachment: true,
      printinreport: true,
      uploadimage: true,
      isactive: true,
      addbarcode: true,
      accredationname: data.accredationname,
      accredationdate: data.accredationdate,
      // New NABL accreditation fields
      isNablAccredited: isNablAccredited,
      nablAccreditationNumber: data.nablAccreditationNumber || "",
      // Note: file upload is not handled here yet
    };

    try {
      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-test",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Investigation added successfully");
      reset();
      setIsNablAccredited(false);
      navigate("/view-investigation");
    } catch (err) {
      toast.error("❌ Failed to add investigation");
    }
  };

  return (
    <>
        {/* Breadcrumb */}
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-sm font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-investigation" className="text-gray-700 hover:text-teal-600">
                Investigations
              </Link>
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
                {/* Department */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Department *</label>
                <select {...register("department", { required: true })} className="w-full border px-3 py-2 rounded">
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                    <option key={d.dptName} value={d.dptName}>{d.dptName}</option>
                    ))}
                </select>
                {errors.department && <p className="text-red-600 text-xs mt-1">Department is required</p>}
                </div>

                {/* Sub-Department */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Sub-Department *</label>
                <select {...register("subdepartment", { required: true })} className="w-full border px-3 py-2 rounded">
                    <option value="">Select Sub-Department</option>
                    {subDepartments.map((s) => (
                    <option key={s.subDptName} value={s.subDptName}>{s.subDptName}</option>
                    ))}
                </select>
                {errors.subdepartment && <p className="text-red-600 text-xs mt-1">Sub-Department is required</p>}
                </div>

                {/* Test Name */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Test Name *</label>
                <input {...register("testname", { required: true })} placeholder="Test Name" className="w-full border px-3 py-2 rounded" />
                {errors.testname && <p className="text-red-600 text-xs mt-1">Test Name is required</p>}
                </div>

                {/* Alias Name */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Alias Name</label>
                <input {...register("aliasname")} placeholder="Alias Name" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Test Code */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Test Code *</label>
                <input type="number" {...register("testcode", { required: true })} placeholder="Test Code" className="w-full border px-3 py-2 rounded" />
                {errors.testcode && <p className="text-red-600 text-xs mt-1">Test Code is required</p>}
                </div>

                {/* Short Code */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Short Code *</label>
                <input type="number" {...register("shortcode", { required: true })} placeholder="Short Code" className="w-full border px-3 py-2 rounded" />
                {errors.shortcode && <p className="text-red-600 text-xs mt-1">Short Code is required</p>}
                </div>

                {/* Role Type */}

                <div>
                <label className="block text-sm font-medium text-gray-700">Role Type *</label>
                <select {...register("roletype", { required: true })} className="w-full border px-3 py-2 rounded">
                    <option value="">Select Role Type</option>
                    {roleTypes.map((d) => (
                    <option key={d.roleType} value={d.roleType}>{d.roleType}</option>
                    ))}
                </select>
                {errors.department && <p className="text-red-600 text-xs mt-1">Department is required</p>}
                </div>

                {/* Sequence Code */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Sequence Code</label>
                <input {...register("sequesncecode")} placeholder="Sequence Code" className="w-full border px-3 py-2 rounded" />
                </div>


                <div></div>
                <div></div>
                <div></div>
                <div></div>
                

                {/* Cost of Test Section */}
                <div className="w-full border-t border-b border-gray-300 py-4 px-4 bg-white">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">Cost of Test :</label>

                    <div className="grid grid-cols-4 gap-4">
                        
                        {/* PPP Patient */}
                        <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700 font-medium whitespace-nowrap w-28">PPP Patient</label>
                        <input
                            type="text"
                            {...register("ppp_patient")}
                            placeholder="PPP Patient"
                            className="border px-2 py-1 flex-1 rounded bg-gray-100"
                        />
                        </div>

                        {/* Dr. Ref */}
                        <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700 font-medium whitespace-nowrap w-24">Dr. Ref :</label>
                        <input
                            type="text"
                            {...register("dr_ref")}
                            placeholder="0.00"
                            className="border px-2 py-1 flex-1 rounded bg-gray-100 text-right"
                        />
                        </div>

                        {/* Lab to Lab */}
                        <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700 font-medium whitespace-nowrap w-28">Lab to Lab :</label>
                        <input
                            type="text"
                            {...register("lab_to_lab")}
                            placeholder="0.00"
                            className="border px-2 py-1 flex-1 rounded bg-gray-100 text-right"
                        />
                        </div>

                        {/* Walk In */}
                        <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700 font-medium whitespace-nowrap w-24">Walk In :</label>
                        <input
                            type="text"
                            {...register("walk_in")}
                            placeholder="0.00"
                            className="border px-2 py-1 flex-1 rounded bg-gray-100 text-right"
                        />
                        </div>

                    </div>
                </div>


                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>






                

                {/* Report Type */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Report Type</label>
                <input {...register("reporttype")} placeholder="Report Type" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Measuring Unit */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Measuring Unit</label>
                <input {...register("mesuringunit")} placeholder="Measuring Unit" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Reference Range */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Reference Range</label>
                <input {...register("refrange")} placeholder="Reference Range" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* TAT Hour */}
                <div>
                <label className="block text-sm font-medium text-gray-700">TAT Hour</label>
                <input type="number" {...register("tatHour")} placeholder="Hours" className="w-full border px-3 py-2 rounded" min={0} />
                </div>

                {/* TAT Minute */}
                <div>
                <label className="block text-sm font-medium text-gray-700">TAT Minute</label>
                <input type="number" {...register("tatMin")} placeholder="Minutes" className="w-full border px-3 py-2 rounded" min={0} max={59} />
                </div>

                {/* Disease */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Disease</label>
                <input {...register("dieases")} placeholder="Disease" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Test Done */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Test Done</label>
                <input {...register("testdone")} placeholder="Test Done" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Specimen Type */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Specimen Type</label>
                <input {...register("specimentyepe")} placeholder="Specimen Type" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Volume */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Volume</label>
                <input {...register("volume")} placeholder="Volume" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Tube Color */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Tube Color</label>
                <input {...register("tubecolor")} placeholder="Tube Color" className="w-full border px-3 py-2 rounded" />
                </div>

                {/* Hospital Type */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Hospital Type</label>
                <input {...register("hospitaltype")} placeholder="Hospital Type" className="w-full border px-3 py-2 rounded" />
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
                <input {...register("processingcenter")} placeholder="Processing Center" className="w-full border px-3 py-2 rounded" />
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

                {/* NABL Accredited Checkbox */}
                <div className="col-span-full">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                    type="checkbox"
                    onChange={(e) => setIsNablAccredited(e.target.checked)}
                    checked={isNablAccredited}
                    className="w-4 h-4"
                    />
                    Is NABL Accredited?
                </label>
                </div>

                {/* NABL Accreditation Number */}
                {isNablAccredited && (
                <>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">NABL Accreditation Number</label>
                    <input
                        {...register("nablAccreditationNumber")}
                        placeholder="Enter NABL Accreditation Number"
                        className="w-full border px-3 py-2 rounded"
                    />
                    </div>

                    {/* NABL Certificate Upload */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Upload NABL Certificate</label>
                    <input
                        type="file"
                        {...register("nablCertificate")}
                        className="w-full border px-3 py-2 rounded"
                    />
                    </div>
                </>
                )}

                {/* Submit Button */}
                <div className="col-span-full flex justify-end mt-4">
                <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg shadow"
                >
                    Submit
                </button>
                </div>
            </div>
        </form>
      </div>
    </>
  );
};

export default AddInvestigation;
