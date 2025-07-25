import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import InvestigationDetails from './InvestigationDetails';
import AddInvestigationResult from './AddInvestigationResult';


const AddInvestigation1 = () => {
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
    setValue,
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
      sequencecode: data.sequencecode,   
      reporttype: data.reporttype,
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
              <label className="block text-sm font-medium text-gray-700">LOINC CODE</label>
              <input {...register("loincCode")} placeholder="LOINC CODE" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CPT CODE</label>
              <input {...register("cptCode")} placeholder="CPT CODE" className="w-full border px-3 py-2 rounded" />
            </div>

            <div className="col-span-full"></div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Category<span className="text-red-500">*</span></label>
              <input {...register("testCategory", { required: true })} placeholder="Test Category" className="w-full border px-3 py-2 rounded" />
              {errors.testCategory && <p className="text-red-600 text-xs mt-1">Test Category is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Name <span className="text-red-500">*</span></label>
              <input {...register("testName", { required: true })} placeholder="Test Name" className="w-full border px-3 py-2 rounded" />
              {errors.testName && <p className="text-red-600 text-xs mt-1">Test Name is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Short Code</label>
              <input {...register("shortCode")} type="number" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select {...register("department")} className="w-full border px-3 py-2 rounded">
                <option value="">Select Department</option>
                {departments.map((d, i) => (
                  <option key={i} value={d.dptName}>{d.dptName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Specimen Type</label>
              <select {...register("specimenType")} className="w-full border px-3 py-2 rounded">
                <option value="">Select Specimen Type</option>
                {specimens.map((d) => (
                  <option key={d.specimenname} value={d.specimenname}>{d.specimenname}</option>
                ))}
              </select>
            </div>

            {/* Sample Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sample Quantity</label>
              <div className="flex gap-0">
                <input {...register("sampleQuantity")} type="number" placeholder="Enter quantity" className="w-1/2 border px-3 py-2 rounded" />
                <select {...register("sampleQuantityUnit")} className="w-1/2 border px-3 py-2 rounded">
                  <option value="">Select Unit</option>
                  <option value="ml">ml</option>
                  <option value="l">liters</option>
                  <option value="g">grams</option>
                </select>
              </div>
            </div>

            {/* Sample Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sample Temperature</label>
              <div className="flex gap-0">
                <input {...register("sampleTemperature")} type="number" placeholder="Enter temperature" className="w-1/2 border px-3 py-2 rounded" />
                <select {...register("temperatureUnit")} className="w-1/2 border px-3 py-2 rounded">
                  <option value="">Select Unit</option>
                  <option value="°C">°C</option>
                  <option value="°F">°F</option>
                  <option value="K">Kelvin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Method</label>
              <input {...register("method")} placeholder="Method" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Instrument Type</label>
              <select {...register("instrumentType")} className="w-full border px-3 py-2 rounded">
                <option value="">Select Instrument Type</option>
                {specimens.map((d) => (
                  <option key={d.specimenname} value={d.specimenname}>{d.specimenname}</option>
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
              <p className="text-xs text-gray-500">Order of display in the printout for the Test</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">External Test ID</label>
              <input {...register("externalTestId")} placeholder="External Test ID" className="w-full border px-3 py-2 rounded" />
              <p className="text-xs text-gray-500">External ID for Test</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Container Type & Color</label>
              <button
                type="button"
                onClick={() => setValue("container_selection", null)}
                className="my-2 text-gray-600 border border-orange-500 hover:border-orange-600 hover:text-orange-600 rounded px-3 py-1 text-sm"
              >
                Clear Selection
              </button>

              <div className="mx-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  { name: "Red", hex: "#FF0000" },
                  { name: "Blue", hex: "#007BFF" },
                  { name: "Yellow", hex: "#FFC107" },
                  { name: "Gold", hex: "#FD7E14" },
                  { name: "Green", hex: "#28A745" },
                  { name: "Pink", hex: "#E83E8C" },
                  { name: "Purple", hex: "#6F42C1" },
                  { name: "Dark Blue", hex: "#004085" }
                ].map((color) => (
                  <label
                    key={`Tube_${color.name}`}
                    className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:shadow-lg transition-all duration-200"
                  >
                    <input
                      type="radio"
                      value={`Tube_${color.name}`}
                      {...register("container_selection", { required: true })}
                      className="form-radio text-indigo-600"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="relative w-4 h-8 rounded-b-full border-2 border-gray-300 overflow-hidden shadow-inner bg-white">
                        <div
                          className="absolute bottom-0 w-full"
                          style={{ height: '70%', backgroundColor: color.hex }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/10 pointer-events-none" />
                      </div>
                      <span> <img src="iconred.png" alt="icon" style={{ width: '20px', height: '30px' }} /></span>
                      <span className="text-sm font-medium text-gray-800">{color.name}</span>
                    </div>
                  </label>
                ))}

                

                <label
                  key="Block"
                  className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:shadow-lg transition-all duration-200"
                >
                  <input
                    type="radio"
                    value="Block"
                    {...register("container_selection", { required: true })}
                    className="form-radio text-indigo-600"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-400 border-2 border-gray-300 rounded-sm shadow-inner"></div>
                    <span className="text-sm font-medium text-gray-800">Block</span>
                  </div>
                </label>

                <label
                  key="Slide"
                  className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:shadow-lg transition-all duration-200"
                >
                  <input
                    type="radio"
                    value="Slide"
                    {...register("container_selection", { required: true })}
                    className="form-radio text-indigo-600"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-4 bg-gray-200 border-2 border-gray-300 rounded-sm shadow-inner relative">
                      <div className="absolute inset-1 bg-gray-300 rounded-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">Slide</span>
                  </div>
                </label>
              </div>

              {errors.container_selection && (
                <p className="text-red-600 text-xs mt-1">Please select a container type or color</p>
              )}
            </div>
          </div>

          <div className="mx-10 p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { id: "separatePrint", label: "Separate Print" },
              { id: "qrCode", label: "QR Code" },
              { id: "labRegNo", label: "Lab Reg No" },
              { id: "noHeaderReport", label: "No Header Report" },
              { id: "enableAutoEmailAtApproval", label: "Enable Auto Email At Approval" },
              { id: "enableAutoSMSAtApproval", label: "Enable Auto SMS at Approval" },
              { id: "enableAutoWhatsappAtApproval", label: "Enable Auto Whatsapp at Approval" },
              { id: "enableIntermediateResult", label: "Enable Intermediate Result" },
              { id: "enableStages", label: "Enable Stages" },
              { id: "showTestDocs", label: "Show Test Docs" },
            ].map((option) => (
              <div key={option.id} className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={option.id}
                  {...register(option.id)}
                  className="h-4 w-4 text-teal-600"
                />
                <label htmlFor={option.id} className="text-sm font-medium text-gray-700 cursor-pointer">
                  {option.label}
                </label>
                {errors[option.id] && (
                  <p className="text-red-600 text-xs mt-1">{option.label} is required</p>
                )}
              </div>
            ))}
          </div>




          {/* Test Price for Different Categories */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Test Price</h2>
              <div className="col-span-full border-b border-gray-300"></div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { label: "Walk-in Price", name: "walkInPrice" },
              { label: "B2B Price", name: "b2bPrice" },
              { label: "PPP Price", name: "pppPrice" },
              { label: "Govt. Price", name: "govtPrice" },
              { label: "Normal Price", name: "normalPrice" },
            ].map((price) => (
              <div key={price.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{price.label}</label>
                <input
                  {...register(price.name)}
                  type="number"
                  placeholder={`Enter ${price.label}`}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            ))}
          </div>


 



          <AddInvestigationResult />

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Output Template</h2>
              <div className="col-span-full border-b border-gray-300 mb-4"></div>

              <div className="flex items-center mb-4">
                <input type="checkbox" id="showImagesSide" className="mr-2" />
                <label htmlFor="showImagesSide" className="text-sm text-gray-700">
                  Check if images need to be shown on the side of test data instead of below
                </label>
              </div>

              <div className="flex items-center gap-4 w-full max-w-md">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap w-40">
                  Choose Template
                </label>
                <select className="flex-1 border px-3 py-2 rounded">
                  <option value="">Select Template</option>
                  <option value="template1">Template 1</option>
                  <option value="template2">Template 2</option>
                </select>
              </div>
            </div>

            <div className="col-span-full mt-6">
              <h2 className="text-lg font-semibold text-gray-800">Outsourcing Information</h2>
              <div className="col-span-full border-b border-gray-300 mb-4"></div>

              <div className="flex items-center">
                <input type="checkbox" id="isOutsourced" className="mr-2" />
                <label htmlFor="isOutsourced" className="text-sm text-gray-700">
                  Check if this is an outsourced test
                </label>
              </div>
            </div>
          </div>

          {/* Embed the InvestigationDetails component */}
            <InvestigationDetails />
          
             

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <h2 className="font-bold ">General Information</h2>
              <div className="col-span-full border-b mb-4  border-gray-300"></div>


            
            <div className="col-span-full grid grid-cols-4 items-start gap-4 mb-4">
              {/* Barcode Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Barcode Length<span className="text-red-500">*</span></label>
                  <input type="number" placeholder="Enter length" className="w-full border px-3 py-2 rounded" />
                </div>

               {/* TAT (Turnaround Time) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TAT (Turnaround Time)<span className="text-red-500">*</span></label>
                  <div className="flex gap-0">
                    <input
                      type="number"
                      placeholder="Enter value"
                      className="w-1/2 border px-3 py-2 rounded"
                    />
                    <select className="w-1/2 border px-3 py-2 rounded">
                      <option value="">Select Unit</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>

                {/* STAT */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">STAT</label>
                  <div className="flex gap-0">
                    <input
                      type="number"
                      placeholder="Enter value"
                      className="w-1/2 border px-3 py-2 rounded"
                    />
                    <select className="w-1/2 border px-3 py-2 rounded">
                      <option value="">Select Unit</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>




                {/* Status (Active/Inactive) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select className="w-full border px-3 py-2 rounded">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

            </div>


            
           {/* Instruction */}
            <div className="col-span-full grid grid-cols-6 items-start gap-4 mx-20">
              <div className="col-span-1 font-bold mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                  Instruction :
                </label>
              </div>
              <div className="col-span-5">
                <ReactQuill
                  value={instruction}
                  onChange={setInstruction}
                  theme="snow"
                  className="mt-2 bg-white"
                  modules={modules}
                  formats={formats}
                />
              </div>
            </div>

            {/* Interpretation */}
            <div className="col-span-full grid grid-cols-6 items-start gap-4 mx-20">
              <div className="col-span-1 font-bold mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                  Interpretation :
                </label>
              </div>
              <div className="col-span-5">
                <ReactQuill
                  value={interpretation}
                  onChange={setInterpretation}
                  theme="snow"
                  className="mt-2 bg-white"
                  modules={modules}
                  formats={formats}
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="col-span-full grid grid-cols-6 items-start gap-4 mx-20">
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

            {/* Editor styling */}
            <style jsx>{`
              .ql-editor {
                min-height: 100px;
              }
            `}</style>





              


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

export default AddInvestigation1;
