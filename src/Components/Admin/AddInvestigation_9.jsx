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
      department: data.department,
      subdepartment: data.subdepartment,
      testname: data.testName,
      aliasname: data.aliasname,
      testcode: parseInt(data.testcode),
      shortcode: parseInt(data.shortcode),
      roletype: data.roletype,
      sequencecode: data.sequencecode,
      reporttype: data.reportType,
      measuringunit: data.measuringunit,
      refrange: data.refrange,
      tat: `${data.tatHour || "0"} hour ${data.tatMin || "0"} min`,
      techtat: `${data.tatHour || "0"} hour ${data.tatMin || "0"} min`,
      diseases: data.diseases,
      testdone: data.testdone,
      specimenType: data.specimenType || 'test data',
      volume: data.volume,
      tubecolor: data.tubecolor,
      hospitaltype: Array.isArray(data.hospitaltype) ? data.hospitaltype : [data.hospitaltype],
      testcategory: data.testcategory,
      testcollectioncenter: data.testcollectioncenter,
      processingcenter: data.processingcenter,
      samplecollection: data.samplecollection || null,
      reportprint: data.reportprint || null,
      resultentryby: data.resultentryby || null,
      allowselecttestcode: data.allowselecttestcode ?? true,
      reportattachment: data.reportattachment ?? false,
      printinreport: data.printinreport ?? true,
      uploadimage: data.uploadimage ?? true,
      isactive: data.isactive ?? true,
      addbarcode: data.addbarcode ?? false,
      accreditationname: data.accreditationname || null,
      accreditationdate: data.accreditationdate || null,
    };

    try {
      await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-test",
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

  const derivedTests = [
    {
      name: "Indirect Bilirubin",
      formula: "Total Bilirubin – Direct Bilirubin",
      dependencies: ["total_bilirubin", "direct_bilirubin"],
    },
    {
      name: "LDL Cholesterol",
      formula: "Total Cholesterol – HDL – (TG / 5)",
      dependencies: ["total_cholesterol", "HDL", "TG"],
    },
    {
      name: "BMI",
      formula: "Weight / (Height × Height)",
      dependencies: ["weight", "height"],
    },
  ];

  const [selectedDerived, setSelectedDerived] = useState("");
  const [dependencyTests, setDependencyTests] = useState([]);

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
              <label className="block text-sm font-medium text-gray-700">LOINC CODE</label>
              <input {...register("loincCode")} placeholder="LOINC CODE" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CPT CODE</label>
              <input {...register("cptCode")} placeholder="CPT CODE" className="w-full border px-3 py-2 rounded" />
            </div>

            <div className="col-span-full"></div>

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
              <label className="block text-sm font-medium text-gray-700">Short Code</label>
              <input {...register("shortCode")} className="w-full border px-3 py-2 rounded" />
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
              <label className="block text-sm font-medium text-gray-700">Sub-Department</label>
              <select {...register("subdepartment")} className="w-full border px-3 py-2 rounded">
                <option value="">Select Sub-Department</option>
                {subDepartments.map((d, i) => (
                  <option key={i} value={d.subdptname}>{d.subdptname}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role Type</label>
              <select {...register("roletype")} className="w-full border px-3 py-2 rounded">
                <option value="">Select Role Type</option>
                {roleTypes.map((r, i) => (
                  <option key={i} value={r.roletype}>{r.roletype}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Report Type</label>
              <select {...register("reportType")} className="w-full border px-3 py-2 rounded">
                <option value="">Select Report Type</option>
                <option value="Range">Range</option>
                <option value="Format">Format</option>
                <option value="Positive/Negative">Positive/Negative</option>
                <option value="Reactive/Non-reactive">Reactive/Non-reactive</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sample Type</label>
              <select {...register("specimenType")} className="w-full border px-3 py-2 rounded">
                <option value="">Select Sample Type</option>
                {specimens.map((s, i) => (
                  <option key={i} value={s.specimenname}>{s.specimenname}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sample Quantity</label>
              <input {...register("sampleQuantity")} type="number" placeholder="Enter quantity" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sample Temperature</label>
              <input {...register("sampleTemperature")} type="number" placeholder="Enter temperature" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Method</label>
              <input {...register("method")} placeholder="Method" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Instrument Type</label>
              <select {...register("instrumentType")} className="w-full border px-3 py-2 rounded">
                <option value="">Select Instrument Type</option>
                {instruments.map((inst, i) => (
                  <option key={i} value={inst.instrumentname}>{inst.instrumentname}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input {...register("description")} placeholder="Description" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SAC</label>
              <input {...register("sac")} placeholder="SAC" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Order</label>
              <input {...register("order")} placeholder="100000" className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          <AddInvestigationResult />

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
