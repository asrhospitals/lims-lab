import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        const [dept, subDept, role, hosp, spec] = await Promise.all([
          axios.get("http://srv913743.hstgr.cloud:2000/lims/master/get-department", { headers }),
          axios.get("http://srv913743.hstgr.cloud:2000/lims/master/get-subdepartment", { headers }),
          axios.get("http://srv913743.hstgr.cloud:2000/lims/master/get-role", { headers }),
          axios.get("http://srv913743.hstgr.cloud:2000/lims/master/get-hsptltype", { headers }),
          axios.get("http://srv913743.hstgr.cloud:2000/lims/master/get-specimen", { headers })
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
        "http://srv913743.hstgr.cloud:2000/lims/master/add-test",
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





// 🔸 Full toolbar modules
const modules = {
  toolbar: [
    [{ 'font': [] }],                            // Font family
    ['bold', 'italic', 'underline', 'strike'],   // Text styling
    [{ 'script': 'super' }, { 'script': 'sub' }],// Superscript/Subscript
    [{ 'size': [] }],                            // Font size
    [{ 'color': [] }],                           // Text color
    [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
    [{ 'align': [] }],                           // Text align
    [{ 'background': [] }],                      // Background color
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],    // Headers
    ['link'],                                    // Hyperlink
    ['blockquote', 'code-block'],                // Blockquote, code
    ['clean']                                    // Remove formatting
  ]
};

// 🔸 Formats allowed
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


  
  // Accreditation
  const [accreditation, setAccreditation] = useState({ name: "", date: "" });
  const [accreditationList, setAccreditationList] = useState([]);

  // Consumables
  const [consumable, setConsumable] = useState({ name: "", qty: "" });
  const [consumablesList, setConsumablesList] = useState([]);

  // Lab Consumables
  const [labConsumable, setLabConsumable] = useState({ name: "", qty: "" });
  const [labConsumablesList, setLabConsumablesList] = useState([]);

  // Add handlers
  const addItem = (type) => {
    if (type === "accreditation" && accreditation.name && accreditation.date) {
      setAccreditationList([...accreditationList, accreditation]);
      setAccreditation({ name: "", date: "" });
    } else if (type === "consumable" && consumable.name && consumable.qty) {
      setConsumablesList([...consumablesList, consumable]);
      setConsumable({ name: "", qty: "" });
    } else if (type === "lab" && labConsumable.name && labConsumable.qty) {
      setLabConsumablesList([...labConsumablesList, labConsumable]);
      setLabConsumable({ name: "", qty: "" });
    }
  };

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "accreditation") {
      setAccreditation({ ...accreditation, [name]: value });
    } else if (type === "consumable") {
      setConsumable({ ...consumable, [name]: value });
    } else if (type === "lab") {
      setLabConsumable({ ...labConsumable, [name]: value });
    }
  };


   // Table row generator
  const renderRows = (list, type) => {
    return list.map((item, index) => (
      <tr key={index} className="text-sm">
        <td className="border px-2 py-1">{item.name}</td>
        <td className="border px-2 py-1">{item.date || item.qty}</td>
      </tr>
    ));
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
              <input placeholder="LOINC CODE" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CPT CODE</label>
              <input placeholder="CPT CODE" className="w-full border px-3 py-2 rounded" />
            </div>

            <div className="col-span-full"></div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Category<span className="text-red-500">*</span></label>
              <input placeholder="Test Category" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Name <span className="text-red-500">*</span></label>
              <input placeholder="Test Name" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Short Code </label>
              <input type="number" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department </label>
              <select className="w-full border px-3 py-2 rounded">
                <option value="">Select Department</option>
                {departments.map((d, i) => (
                  <option key={i} value={d.dptName}>{d.dptName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Specimen Type </label>
              <select className="w-full border px-3 py-2 rounded">
                <option value="">Select Specimen Type</option>
                {specimens.map((d) => (
                  <option key={d.specimenname} value={d.specimenname}>{d.specimenname}</option>
                ))}
              </select>
            </div>



            {/* <div>
              <label className="block text-sm font-medium text-gray-700">Sample Quantity *</label>
              <select className="w-full border px-3 py-2 rounded">
                <option value="">Select Sample Quantity</option>
                {specimens.map((d) => (
                  <option key={d.specimenname} value={d.specimenname}>{d.specimenname}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sample Temperature</label>
              <select className="w-full border px-3 py-2 rounded">
                <option value="">Select Sample Temperature</option>
                {specimens.map((d) => (
                  <option key={d.specimenname} value={d.specimenname}>{d.specimenname}</option>
                ))}
              </select>
            </div> */}


            {/* Sample Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sample Quantity</label>
              <div className="flex gap-0">
                <input
                  type="number"
                  placeholder="Enter quantity"
                  className="w-1/2 border px-3 py-2 rounded"
                />
                <select className="w-1/2 border px-3 py-2 rounded">
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
                <input
                  type="number"
                  placeholder="Enter temperature"
                  className="w-1/2 border px-3 py-2 rounded"
                />
                <select className="w-1/2 border px-3 py-2 rounded">
                  <option value="">Select Unit</option>
                  <option value="°C">°C</option>
                  <option value="°F">°F</option>
                  <option value="K">Kelvin</option>
                </select>
              </div>
            </div>





            <div>
              <label className="block text-sm font-medium text-gray-700">Method</label>
              <input placeholder="Method" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Instrument Type </label>
              <select className="w-full border px-3 py-2 rounded">
                <option value="">Select Instrument Type</option>
                {specimens.map((d) => (
                  <option key={d.specimenname} value={d.specimenname}>{d.specimenname}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input placeholder="Description" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SAC</label>
              <input placeholder="SAC" className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Order</label>
              <input placeholder="100000" className="w-full border px-3 py-2 rounded" />
              <p className="text-xs text-gray-500">Order of display in the printout for the Test</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">External Test ID</label>
              <input placeholder="External Test ID" className="w-full border px-3 py-2 rounded" />
              <p className="text-xs text-gray-500">External ID for Test</p>
            </div>

            

            
          </div>







          <div className=" p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">


            
              <div className="col-span-full "></div>



            


              {/* Container Type & Color */}
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Container Type & Color</label>
                <button
                  type="button"
                  onClick={() => setValue("container_selection", null)}
                  className="my-2  text-gray-600 border border-orange-500 hover:border-orange-600 hover:text-orange-600 rounded px-3 py-1 text-sm"
                >
                  Clear Selection
                </button>


                <div className="mx-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {/* 8 Tube colors */}
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
                        {/* Tube Icon with color liquid */}
                        <div className="relative w-4 h-8 rounded-b-full border-2 border-gray-300 overflow-hidden shadow-inner bg-white">
                          {/* Colored liquid */}
                          <div
                            className="absolute bottom-0 w-full"
                            style={{ height: '70%', backgroundColor: color.hex }}
                          ></div>
                          {/* Glass reflection */}
                          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/10 pointer-events-none" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{color.name}</span>
                      </div>
                    </label>
                  ))}

                  {/* Block option */}
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
                      {/* Block Icon */}
                      <div className="w-6 h-6 bg-gray-400 border-2 border-gray-300 rounded-sm shadow-inner"></div>
                      <span className="text-sm font-medium text-gray-800">Block</span>
                    </div>
                  </label>

                  {/* Slide option */}
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
                      {/* Slide Icon */}
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

              {/* 1. Separate Print */}
              <div className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="separatePrint"
                  {...register("separatePrint")}
                  className="h-4 w-4 text-teal-600"
                />
                <label htmlFor="separatePrint" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Separate Print 
                </label>
              </div>
              {errors.separatePrint && (
                <p className="text-red-600 text-xs mt-1">Separate Print is required</p>
              )}

              {/* 2. QR Code */}
              <div className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="qrCode"
                  {...register("qrCode")}
                  className="h-4 w-4 text-teal-600"
                />
                <label htmlFor="qrCode" className="text-sm font-medium text-gray-700 cursor-pointer">
                  QR Code 
                </label>
              </div>
              {errors.qrCode && (
                <p className="text-red-600 text-xs mt-1">QR Code is required</p>
              )}

              {/* 3. Lab Reg No */}
              <div className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="labRegNo"
                  {...register("labRegNo")}
                  className="h-4 w-4 text-teal-600"
                />
                <label htmlFor="labRegNo" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Lab Reg No 
                </label>
              </div>
              {errors.labRegNo && (
                <p className="text-red-600 text-xs mt-1">Lab Reg No is required</p>
              )}

              {/* 4. No Header Report */}
              <div className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="noHeaderReport"
                  {...register("noHeaderReport")}
                  className="h-4 w-4 text-teal-600"
                />
                <label htmlFor="noHeaderReport" className="text-sm font-medium text-gray-700 cursor-pointer">
                  No Header Report 
                </label>
              </div>
              {errors.noHeaderReport && (
                <p className="text-red-600 text-xs mt-1">No Header Report is required</p>
              )}

              {/* 5. Enable Auto Email At Approval */}
              <div className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableAutoEmailAtApproval"
                  {...register("enableAutoEmailAtApproval")}
                  className="h-4 w-4 text-teal-600"
                />
                <label htmlFor="enableAutoEmailAtApproval" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Enable Auto Email At Approval 
                </label>
              </div>
              {errors.enableAutoEmailAtApproval && (
                <p className="text-red-600 text-xs mt-1">Enable Auto Email At Approval is required</p>
              )}

              {/* 6. Enable Auto SMS at Approval */}
              <div className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableAutoSMSAtApproval"
                  {...register("enableAutoSMSAtApproval")}
                  className="h-4 w-4 text-teal-600"
                />
                <label htmlFor="enableAutoSMSAtApproval" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Enable Auto SMS at Approval 
                </label>
              </div>
              {errors.enableAutoSMSAtApproval && (
                <p className="text-red-600 text-xs mt-1">Enable Auto SMS at Approval is required</p>
              )}

              {/* 7. Enable Auto Whatsapp at Approval */}
              <div className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableAutoWhatsappAtApproval"
                  {...register("enableAutoWhatsappAtApproval")}
                  className="h-4 w-4 text-teal-600"
                />
                <label htmlFor="enableAutoWhatsappAtApproval" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Enable Auto Whatsapp at Approval 
                </label>
              </div>
              {errors.enableAutoWhatsappAtApproval && (
                <p className="text-red-600 text-xs mt-1">Enable Auto Whatsapp at Approval is required</p>
              )}

              {/* 8. Enable Intermediate Result */}
              <div className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableIntermediateResult"
                  {...register("enableIntermediateResult")}
                  className="h-4 w-4 text-teal-600"
                />
                <label htmlFor="enableIntermediateResult" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Enable Intermediate Result 
                </label>
              </div>
              {errors.enableIntermediateResult && (
                <p className="text-red-600 text-xs mt-1">Enable Intermediate Result is required</p>
              )}

              {/* 9. Enable Stages */}
              <div className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableStages"
                  {...register("enableStages")}
                  className="h-4 w-4 text-teal-600"
                />
                <label htmlFor="enableStages" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Enable Stages 
                </label>
              </div>
              {errors.enableStages && (
                <p className="text-red-600 text-xs mt-1">Enable Stages is required</p>
              )}

              {/* 10. Show Test Docs */}
              <div className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showTestDocs"
                  {...register("showTestDocs")}
                  className="h-4 w-4 text-teal-600"
                />
                <label htmlFor="showTestDocs" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Show Test Docs 
                </label>
              </div>
              {errors.showTestDocs && (
                <p className="text-red-600 text-xs mt-1">Show Test Docs is required</p>
              )}


          </div>





        {/* Test Price for Different Categories */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="col-span-full ">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Test Price</h2>
              <div className="col-span-full border-b border-gray-300 " ></div>
        </div> 
        </div>     
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
            {/* Walk-in Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Walk-in Price</label>
              <input
                type="number"
                placeholder="Enter Walk-in Price"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* B2B Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">B2B Price</label>
              <input
                type="number"
                placeholder="Enter B2B Price"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* PPP Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PPP Price</label>
              <input
                type="number"
                placeholder="Enter PPP Price"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* Govt. Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Govt. Price</label>
              <input
                type="number"
                placeholder="Enter Govt. Price"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* Normal Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Normal Price</label>
              <input
                type="number"
                placeholder="Enter Normal Price"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          
        </div>





          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">


            <div class="col-span-full p-4 overflow-auto">
              <h2 className="font-bold mb-2">Results</h2>
              <div className="col-span-full border-b mb-4 border-gray-300"></div>
              <table class="min-w-full table-auto border border-gray-300 text-sm text-left">
                <thead class="bg-gray-100 text-orange-600">
                  <tr>
                    <th class="border px-2 py-1">Result Name</th>
                    <th class="border px-2 py-1">Other Language Result Name</th>
                    <th class="border px-2 py-1">ExtResultId</th>
                    <th class="border px-2 py-1">Order</th>
                    <th class="border px-2 py-1">Unit</th>
                    <th class="border px-2 py-1">Formula</th>
                    <th class="border px-2 py-1">Value Type</th>
                    <th class="border px-2 py-1">Default</th>
                    <th class="border px-2 py-1">RoundOff</th>
                    <th class="border px-2 py-1">Normal Values</th>
                    <th class="border px-2 py-1">Mandatory Conditions</th>
                    <th class="border px-2 py-1">Reflex Tests</th>
                    <th class="border px-2 py-1">Show Trends</th>
                    <th class="border px-2 py-1 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-white hover:bg-gray-50">
                    <td class="border px-2 py-1"><input type="text" class="w-full text-xs border rounded px-1 py-1" placeholder="Result Name" /></td>
                    <td class="border px-2 py-1"><input type="text" class="w-full text-xs border rounded px-1 py-1" placeholder="Other Language" /></td>
                    <td class="border px-2 py-1"><input type="text" class="w-full text-xs border rounded px-1 py-1" placeholder="ExtResultId" /></td>
                    <td class="border px-2 py-1"><input type="number" class="w-full text-xs border rounded px-1 py-1" placeholder="Order" /></td>
                    <td class="border px-2 py-1"><input type="text" class="w-full text-xs border rounded px-1 py-1" placeholder="Unit" /></td>
                    <td class="border px-2 py-1"><input type="text" class="w-full text-xs border rounded px-1 py-1" placeholder="Formula" /></td>
                    <td class="border px-2 py-1">
                      <select class="w-full text-xs border rounded px-1 py-1">
                        <option value="">Select</option>
                        <option value="number">Number</option>
                        <option value="text">Text</option>
                        <option value="boolean">Boolean</option>
                      </select>
                    </td>
                    <td class="border px-2 py-1"><input type="text" class="w-full text-xs border rounded px-1 py-1" placeholder="Default" /></td>
                    <td class="border px-2 py-1"><input type="number" step="0.01" class="w-full text-xs border rounded px-1 py-1" placeholder="RoundOff" /></td>
                    <td class="border px-2 py-1"><input type="text" class="w-full text-xs border rounded px-1 py-1" placeholder="Normal Values" /></td>
                    <td class="border px-2 py-1"><input type="text" class="w-full text-xs border rounded px-1 py-1" placeholder="Mandatory" /></td>
                    <td class="border px-2 py-1"><input type="text" class="w-full text-xs border rounded px-1 py-1" placeholder="Reflex Tests" /></td>
                    <td class="border px-2 py-1"><input type="text" class="w-full text-xs border rounded px-1 py-1" placeholder="Show Trends" /></td>
                    <td class="border px-2 py-1 text-center">
                      <button class="text-red-600 hover:text-red-800 text-xs">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="mt-4">
                <button class="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm">
                  + Add New Row
                </button>
              </div>
            </div>

            <div className="col-span-full my-4 "></div>

            
          </div>

              







          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {/* Output Template */}
            <div className="col-span-full ">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Output Template</h2>
              <div className="col-span-full border-b border-gray-300 mb-4" ></div>

              {/* Checkbox: Show images on side */}
              <div className="flex items-center mb-4">
                <input type="checkbox" id="showImagesSide" className="mr-2" />
                <label htmlFor="showImagesSide" className="text-sm text-gray-700">
                  Check if images need to be shown on the side of test data instead of below
                </label>
              </div>

              {/* Choose Template */}
              {/* Choose Template - Label and Text Input side by side */}
                <div className="flex items-center gap-4 w-full max-w-md mx-10">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap w-40">
                    Choose Template
                  </label>
                  <input
                    type="text"
                    placeholder="Enter template name"
                    className="flex-1 border px-3 py-2 rounded"
                  />
                </div>


              {/* Choose Template - Label and Select side by side */}
              {/* <div className="flex items-center gap-4 w-full max-w-md">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap w-40">
                  Choose Template
                </label>
                <select className="flex-1 border px-3 py-2 rounded">
                  <option value="">Select Template</option>
                  <option value="template1">Template 1</option>
                  <option value="template2">Template 2</option>
                </select>
              </div> */}

            </div>

            {/* Outsourcing Information */}
            <div className="col-span-full mt-6">
              <h2 className="text-lg font-semibold text-gray-800">Outsourcing Information</h2>
              <div className="col-span-full border-b border-gray-300 mb-4" ></div>

              <div className="flex items-center">
                <input type="checkbox" id="isOutsourced" className="mr-2" />
                <label htmlFor="isOutsourced" className="text-sm text-gray-700">
                  Check if this is an outsourced test
                </label>
              </div>
            </div>


      
              {/* Section: Accreditation */}
              <div className="col-span-full" >
                <h3 className="font-bold mb-2">Add Accreditation</h3>
                <table className=" mb-4 w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-orange-600">Name</th>
                      <th className="border px-2 py-1 text-orange-600">Date</th>
                      <th className="border px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1">
                        <input
                          name="name"
                          value={accreditation.name}
                          onChange={(e) => handleChange(e, "accreditation")}
                          placeholder="Accreditation Name"
                          className="w-full border px-2 py-1"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          name="date"
                          value={accreditation.date}
                          type="date"
                          onChange={(e) => handleChange(e, "accreditation")}
                          className="w-full border px-2 py-1"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <button
                          onClick={() => addItem("accreditation")}
                          className="bg-white border text-purple-700 border-purple-700 px-3 py-1 rounded hover:bg-purple-100"
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                    {renderRows(accreditationList, "accreditation")}
                  </tbody>
                </table>
              </div>

              {/* Section: Consumables */}
              <div className="col-span-full" >
                <h3 className="font-bold mb-2">Add Consumables</h3>
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-orange-600">Product Name</th>
                      <th className="border px-2 py-1 text-orange-600">Qty</th>
                      <th className="border px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1">
                        <input
                          name="name"
                          value={consumable.name}
                          onChange={(e) => handleChange(e, "consumable")}
                          placeholder="Product Name"
                          className="w-full border px-2 py-1"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          name="qty"
                          value={consumable.qty}
                          onChange={(e) => handleChange(e, "consumable")}
                          placeholder="Quantity"
                          className="w-full border px-2 py-1"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <button
                          onClick={() => addItem("consumable")}
                          className="bg-white border text-purple-700 border-purple-700 px-3 py-1 rounded hover:bg-purple-100"
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                    {renderRows(consumablesList, "consumable")}
                  </tbody>
                </table>
              </div>

              {/* Section: Lab Consumables */}
              <div className="col-span-full">
                <h3 className="font-bold mb-2">Lab Consumables</h3>
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-orange-600">Product Name</th>
                      <th className="border px-2 py-1 text-orange-600">Qty</th>
                      <th className="border px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1">
                        <input
                          name="name"
                          value={labConsumable.name}
                          onChange={(e) => handleChange(e, "lab")}
                          placeholder="Product Name"
                          className="w-full border px-2 py-1"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          name="qty"
                          value={labConsumable.qty}
                          onChange={(e) => handleChange(e, "lab")}
                          placeholder="Quantity"
                          className="w-full border px-2 py-1"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <button
                          onClick={() => addItem("lab")}
                          className="bg-white border text-purple-700 border-purple-700 px-3 py-1 rounded hover:bg-purple-100"
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                    {renderRows(labConsumablesList, "lab")}
                  </tbody>
                </table>
              </div>




          </div>




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













// <div className="mb-4 flex items-center space-x-2">
//   <label htmlFor="separatePrint" className="text-sm font-medium text-gray-700 cursor-pointer">
//     Separate Print :
//   </label>
//   <input
//     type="checkbox"
//     id="separatePrint"
//     {...register("separatePrint")}
//     className="h-4 w-4 text-teal-600"
//   />
// </div>
// {errors.separatePrint && (
//   <p className="text-red-600 text-xs mt-1">Separate Print is required</p>
// )}

// <div className="mb-4 flex items-center space-x-2">
//   <label htmlFor="qrCode" className="text-sm font-medium text-gray-700 cursor-pointer">
//     QR Code :
//   </label>
//   <input
//     type="checkbox"
//     id="qrCode"
//     {...register("qrCode")}
//     className="h-4 w-4 text-teal-600"
//   />
// </div>
// {errors.qrCode && (
//   <p className="text-red-600 text-xs mt-1">QR Code is required</p>
// )}

// <div className="mb-4 flex items-center space-x-2">
//   <label htmlFor="labRegNo" className="text-sm font-medium text-gray-700 cursor-pointer">
//     Lab Reg No :
//   </label>
//   <input
//     type="checkbox"
//     id="labRegNo"
//     {...register("labRegNo")}
//     className="h-4 w-4 text-teal-600"
//   />
// </div>
// {errors.labRegNo && (
//   <p className="text-red-600 text-xs mt-1">Lab Reg No is required</p>
// )}

// <div className="mb-4 flex items-center space-x-2">
//   <label htmlFor="noHeaderReport" className="text-sm font-medium text-gray-700 cursor-pointer">
//     No Header Report :
//   </label>
//   <input
//     type="checkbox"
//     id="noHeaderReport"
//     {...register("noHeaderReport")}
//     className="h-4 w-4 text-teal-600"
//   />
// </div>
// {errors.noHeaderReport && (
//   <p className="text-red-600 text-xs mt-1">No Header Report is required</p>
// )}

// <div className="mb-4 flex items-center space-x-2">
//   <label htmlFor="enableAutoEmailAtApproval" className="text-sm font-medium text-gray-700 cursor-pointer">
//     Enable Auto Email At Approval :
//   </label>
//   <input
//     type="checkbox"
//     id="enableAutoEmailAtApproval"
//     {...register("enableAutoEmailAtApproval")}
//     className="h-4 w-4 text-teal-600"
//   />
// </div>
// {errors.enableAutoEmailAtApproval && (
//   <p className="text-red-600 text-xs mt-1">Enable Auto Email At Approval is required</p>
// )}

// <div className="mb-4 flex items-center space-x-2">
//   <label htmlFor="enableAutoSMSAtApproval" className="text-sm font-medium text-gray-700 cursor-pointer">
//     Enable Auto SMS at Approval :
//   </label>
//   <input
//     type="checkbox"
//     id="enableAutoSMSAtApproval"
//     {...register("enableAutoSMSAtApproval")}
//     className="h-4 w-4 text-teal-600"
//   />
// </div>
// {errors.enableAutoSMSAtApproval && (
//   <p className="text-red-600 text-xs mt-1">Enable Auto SMS at Approval is required</p>
// )}

// <div className="mb-4 flex items-center space-x-2">
//   <label htmlFor="enableAutoWhatsappAtApproval" className="text-sm font-medium text-gray-700 cursor-pointer">
//     Enable Auto Whatsapp at Approval :
//   </label>
//   <input
//     type="checkbox"
//     id="enableAutoWhatsappAtApproval"
//     {...register("enableAutoWhatsappAtApproval")}
//     className="h-4 w-4 text-teal-600"
//   />
// </div>
// {errors.enableAutoWhatsappAtApproval && (
//   <p className="text-red-600 text-xs mt-1">Enable Auto Whatsapp at Approval is required</p>
// )}

// <div className="mb-4 flex items-center space-x-2">
//   <label htmlFor="enableIntermediateResult" className="text-sm font-medium text-gray-700 cursor-pointer">
//     Enable Intermediate Result :
//   </label>
//   <input
//     type="checkbox"
//     id="enableIntermediateResult"
//     {...register("enableIntermediateResult")}
//     className="h-4 w-4 text-teal-600"
//   />
// </div>
// {errors.enableIntermediateResult && (
//   <p className="text-red-600 text-xs mt-1">Enable Intermediate Result is required</p>
// )}

// <div className="mb-4 flex items-center space-x-2">
//   <label htmlFor="enableStages" className="text-sm font-medium text-gray-700 cursor-pointer">
//     Enable Stages :
//   </label>
//   <input
//     type="checkbox"
//     id="enableStages"
//     {...register("enableStages")}
//     className="h-4 w-4 text-teal-600"
//   />
// </div>
// {errors.enableStages && (
//   <p className="text-red-600 text-xs mt-1">Enable Stages is required</p>
// )}

// <div className="mb-4 flex items-center space-x-2">
//   <label htmlFor="showTestDocs" className="text-sm font-medium text-gray-700 cursor-pointer">
//     Show Test Docs :
//   </label>
//   <input
//     type="checkbox"
//     id="showTestDocs"
//     {...register("showTestDocs")}
//     className="h-4 w-4 text-teal-600"
//   />
// </div>
// {errors.showTestDocs && (
//   <p className="text-red-600 text-xs mt-1">Show Test Docs is required</p>
// )}




 {/* Container (Tube) Color */}
        // <div className="col-span-full">
        //   <label className="block text-sm font-medium text-gray-700 mb-2">Container Color</label>
        //   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        //     {[
        //       { name: "Red", hex: "#FF0000" },
        //       { name: "Blue", hex: "#007BFF" },
        //       { name: "Green", hex: "#28a745" },
        //       { name: "Yellow", hex: "#ffc107" },
        //       { name: "Purple", hex: "#6f42c1" },
        //       { name: "Pink", hex: "#e83e8c" },
        //       { name: "Orange", hex: "#fd7e14" },
        //       { name: "Teal", hex: "#20c997" },
        //     ].map((color) => (
        //       <label
        //         key={color.name}
        //         className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:shadow-lg transition-all duration-200"
        //       >
        //         <input
        //           type="radio"
        //           value={color.name}
        //           {...register("tubecolor", { required: true })}
        //           className="form-radio text-indigo-600"
        //         />
        //         <div className="flex items-center space-x-3">
                  
        //           <div className="relative w-4 h-8 rounded-b-full border-2 border-gray-300 overflow-hidden shadow-inner bg-white">
        //             <div
        //               className="absolute bottom-0 w-full"
        //               style={{ height: '70%', backgroundColor: color.hex }}
        //             ></div>

        //             <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/10 pointer-events-none" />
        //           </div>
        //           <span className="text-sm font-medium text-gray-800">{color.name}</span>

        //         </div>
        //       </label>
        //     ))}
        //   </div>

        //   {errors.tubecolor && (
        //     <p className="text-red-600 text-xs mt-1">Container Color is required</p>
        //   )}
        // </div>



{/* Tube Color */}
{/* <div className="col-span-full">
  <label className="block text-sm font-medium text-gray-700 mb-2">Tube Color</label>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    {[
      { name: "Red", hex: "#FF0000", bg: "#FFE5E5" },
      { name: "Blue", hex: "#00BFFF", bg: "#E5F6FF" },
      { name: "Yellow", hex: "#FFFF00", bg: "#FFFFE5" },
      { name: "Gold", hex: "#FFD700", bg: "#FFF8DC" },
      { name: "Green", hex: "#00FF00", bg: "#E5FFE5" },
      { name: "Pink", hex: "#FF69B4", bg: "#FFE5F0" },
      { name: "Purple", hex: "#800080", bg: "#F0E5FF" },
      { name: "Dark Blue", hex: "#00008B", bg: "#E5E5FF" },
    ].map((color) => (
      <label
        key={color.name}
        className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:shadow-md"
      >
        <input
          type="radio"
          value={color.name}
          {...register("tubecolor", { required: true })}
          className="form-radio text-indigo-600"
        />
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded" style={{ backgroundColor: color.hex }}></div>
          <span className="text-sm font-medium text-gray-800">{color.name}</span>
        </div>
      </label>
    ))}
  </div>

  {errors.tubecolor && (
    <p className="text-red-600 text-xs mt-1">Tube Color is required</p>
  )}
</div> */}
