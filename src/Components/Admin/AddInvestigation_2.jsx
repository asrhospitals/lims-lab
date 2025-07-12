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
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("authToken");

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
    };

    try {
      await axios.post(
        "https://asrlab-production.up.railway.app/lims/master/add-test",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Investigation added successfully");
      reset();
      navigate("/investigation-list");
    } catch (err) {
      toast.error("❌ Failed to add investigation");
    }
  };

  return (
    <>
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
              <Link to="/investigation-list" className="text-gray-700 hover:text-teal-600">
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Investigation</h4>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Department *</label>
              <select {...register("department", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.dptName} value={d.dptName}>{d.dptName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sub-Department *</label>
              <select {...register("subdepartment", { required: true })} className="w-full border px-3 py-2 rounded">
                <option value="">Select Sub-Department</option>
                {subDepartments.map((s) => (
                  <option key={s.subDptName} value={s.subDptName}>{s.subDptName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Name *</label>
              <input {...register("testname", { required: true })} placeholder="Test Name" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Alias Name</label>
              <input {...register("aliasname")} placeholder="Alias Name" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Code *</label>
              <input type="number" {...register("testcode", { required: true })} placeholder="Test Code" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Short Code *</label>
              <input type="number" {...register("shortcode", { required: true })} placeholder="Short Code" className="w-full border px-3 py-2 rounded" />
            </div>

            {/* Add other fields in similar layout below */}

            <div className="col-span-full flex justify-end mt-4">
              <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg shadow">
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
