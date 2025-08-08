import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import InvestigationDetails from './InvestigationDetails';
import AddInvestigationResult from './AddInvestigationResult';


const AddInvestigation = () => {
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [hospitalTypes, setHospitalTypes] = useState([]);
  const [specimens, setSpecimens] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState([]); // State to hold results from AddInvestigationResult

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        const [dept, subDept, role, hosp, spec, instrument] = await Promise.all([
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-department", { headers }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-subdepartment", { headers }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-role", { headers }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-hsptltype", { headers }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-specimen", { headers }),
          axios.get("https://asrlabs.asrhospitalindia.in/lims/master/get-instrument", { headers })
        ]);

        setDepartments(dept.data.filter((d) => d.isactive));
        setSubDepartments(subDept.data.filter((d) => d.isactive));
        setRoleTypes(role.data.filter((r) => r.isactive));
        setHospitalTypes(hosp.data.filter((h) => h.isactive));
        setSpecimens(spec.data.filter((s) => s.isactive));
        setInstruments(instrument.data.filter((i) => i.isactive));
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
      testname: data.testName,
      testcategory: data.testCategory,
      department: data.department,
      shortname: data.shortName,
      unit: data.unit,
      reportType: data.reportType,
      remarks: data.remarks,
      status: data.isactive ? "Active" : "Inactive",
      barcodelngt: parseInt(data.barcodelngt),
      tat: `${data.tatHour || "0"} ${data.tatUnit || "hours"}`,
      results: results, // Use the results collected from AddInvestigationResult
    };

    try {
      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-test",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Investigation added successfully");
      reset();
      setResults([]); // Clear results after submission
      navigate("/view-investigation");
    } catch (err) {
      toast.error("❌ Failed to add investigation");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toolbar and formats for ReactQuill
  const modules = {
    toolbar: [
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'script': 'super' }, { 'script': 'sub' }],
      [{ 'size': [] }],
      [{ 'color': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      [{ 'background': [] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link'],
      ['blockquote', 'code-block'],
      ['clean']
    ]
  };

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'script',
    'color', 'background',
    'list', 'bullet', 'align',
    'header',
    'link',
    'blockquote', 'code-block',
    'clean'
  ];

  const [instruction, setInstruction] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [remarks, setRemarks] = useState("");

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

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Name <span className="text-red-500">*</span></label>
              <input {...register("testName", { required: true })} placeholder="Test Name" className="w-full border px-3 py-2 rounded" />
              {errors.testName && <p className="text-red-600 text-xs mt-1">Test Name is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Category<span className="text-red-500">*</span></label>
              <input {...register("testCategory", { required: true })} placeholder="Test Category" className="w-full border px-3 py-2 rounded" />
              {errors.testCategory && <p className="text-red-600 text-xs mt-1">Test Category is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Short Name</label>
              <input {...register("shortName")} className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select {...register("department")} className="w-full border px-3 py-2 rounded">
                <option value="">Select Department</option>
                {departments.map((d, i) => (
                  <option key={i} value={d.dptname}>{d.dptname}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Units</label>
              <input {...register("unit")} placeholder="Units" className="w-full border px-3 py-2 rounded" />
            </div>

            {/* Barcode Length */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Barcode Length<span className="text-red-500">*</span></label>
              <input {...register("barcodelngt", { required: true })} type="number" placeholder="Enter length" className="w-full border px-3 py-2 rounded" />
              {errors.barcodelngt && <p className="text-red-600 text-xs mt-1">Barcode Length is required</p>}
            </div>

            {/* TAT (Turnaround Time) */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">TAT (Turnaround Time)<span className="text-red-500">*</span></label>
              <div className="flex gap-0">
                <input
                  {...register("tatHour", { required: true })}
                  type="number"
                  placeholder="Enter value"
                  className="w-1/2 border px-3 py-2 rounded"
                />
                <select {...register("tatUnit")} className="w-1/2 border px-3 py-2 rounded">
                  <option value="">Select Unit</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
              {errors.tatHour && <p className="text-red-600 text-xs mt-1">TAT is required</p>}
            </div>
          </div>

          <AddInvestigationResult setResults={setResults} /> {/* Pass setResults to AddInvestigationResult */}

          {/* Remarks */}
          <div className="col-span-full grid grid-cols-6 items-start gap-4 mx-20 mb-4">
            <div className="col-span-1 font-bold mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                Remarks :
              </label>
            </div>
            <div className="col-span-5">
              <ReactQuill
                value={remarks}
                onChange={setRemarks}
                theme="snow"
                className="mt-2 bg-white"
                modules={modules}
                formats={formats}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50 text-right">
            <button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">
              {isSubmitting ? "Saving..." : "Add Investigation"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddInvestigation;
