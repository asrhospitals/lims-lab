import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import InvestigationDetails from './InvestigationDetails';
import { viewInvestigation } from "../../services/apiService";

import 'react-quill/dist/quill.snow.css';

const ViewInvestigationDetails = () => {
  const [investigation, setInvestigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [instruction, setInstruction] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [remarks, setRemarks] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchInvestigationData = async () => {
      if (!id) {
        toast.error("❌ No investigation ID provided");
        navigate("/view-investigation");
        return;
      }

      try {
        setLoading(true);
        const data = await viewInvestigation(id);
        console.log("Investigation data:", data);
        
        setInvestigation(data);
        setInstruction(data.instruction || "");
        setInterpretation(data.interpretation || "");
        setRemarks(data.remark || "");
        
      } catch (err) {
        toast.error("❌ Failed to load investigation data");
        console.error(err);
        navigate("/view-investigation");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestigationData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading investigation details...</p>
        </div>
      </div>
    );
  }

  if (!investigation) {
    return (
      <div className="flex justify-center items-center min-h-[400px] mt-16">
        <div className="text-center">
          <p className="text-red-600">Investigation not found</p>
          <Link to="/view-investigation" className="text-teal-600 hover:text-teal-700 mt-2 inline-block">
            Back to Investigations
          </Link>
        </div>
      </div>
    );
  }

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
            <li className="text-gray-500">View Investigation Details</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-16 px-4 space-y-4 text-sm">
        <ToastContainer />
        <form className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">View Investigation Details</h4>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">LOINC CODE</label>
              <input value={investigation.loniccode || ''} placeholder="LOINC CODE" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CPT CODE</label>
              <input value={investigation.cptcode || ''} placeholder="CPT CODE" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div className="col-span-full"></div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Name <span className="text-red-500">*</span></label>
              <input value={investigation.testname || ''} placeholder="Test Name" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Category <span className="text-red-500">*</span></label>
              <input value={investigation.testcategory || ''} placeholder="Test Category" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Short Name</label>
              <input value={investigation.shortname || ''} className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Short Code</label>
              <input value={investigation.shortcode || ''} type="number" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input value={investigation.department || ''} type="text" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sub-Department</label>
              <input value={investigation.subdepartment || ''} type="text" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role Type</label>
              <input value={investigation.roletype || ''} type="text" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Report Type</label>
              <input value={investigation.reporttype || ''} type="text" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sample Type</label>
              <input value={investigation.sampletype || ''} type="text" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sample Quantity</label>
              <input value={investigation.sampleqty || ''} type="number" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sample Temperature</label>
              <input value={investigation.sampletemp || ''} type="number" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Test Method</label>
              <input value={investigation.testmethod || ''} placeholder="Method" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Instrument Type</label>
              <input value={investigation.instrumenttype || ''} type="text" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input value={investigation.description || ''} placeholder="Description" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SAC</label>
              <input value={investigation.sac || ''} placeholder="SAC" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Order</label>
              <input value={investigation.order || ''} placeholder="100000" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Derived Test</label>
              <input value={investigation.derivedtest || ''} placeholder="Derived Test" className="w-full border px-3 py-2 rounded" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">External Test ID</label>
              <input value={investigation.extranaltest || ''} placeholder="External Test ID" className="w-full border px-3 py-2 rounded" readOnly />
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Container Type & Color</label>
              
              <div className="mx-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  { name: "Red", hex: "#a6121d" },
                  { name: "Blue", hex: "#02B4E5" },
                  { name: "Yellow", hex: "#DBB634" },
                  { name: "Gold", hex: "#FFD700" },
                  { name: "Green", hex: "#21443a" },
                  { name: "Pink", hex: "#E342AD" },
                  { name: "Purple", hex: "#8D82CF" },
                  { name: "Dark Blue", hex: "#224E98" }
                ].map((color) => (
                  <label
                    key={`Tube_${color.name}`}
                    className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:shadow-lg transition-all duration-200"
                  >
                    <input
                      type="radio"
                      value={`Tube_${color.name}`}
                      checked={investigation.containertype === `Tube_${color.name}`} // Check if this color is selected
                      className="form-radio text-indigo-600"
                      readOnly // Make the input read-only
                    />
                    <div className="flex items-center space-x-3">
                      <div className="relative w-4 h-8 rounded-b-full border-2 border-gray-300 overflow-hidden shadow-inner bg-white">
                        <div
                          className="absolute bottom-0 w-full"
                          style={{ height: '70%', backgroundColor: color.hex }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/10 pointer-events-none" />
                      </div>
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
                    checked={investigation.containertype === "Block"} // Check if Block is selected
                    className="form-radio text-indigo-600"
                    readOnly // Make the input read-only
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
                    checked={investigation.containertype === "Slide"} // Check if Slide is selected
                    className="form-radio text-indigo-600"
                    readOnly // Make the input read-only
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-4 bg-gray-200 border-2 border-gray-300 rounded-sm shadow-inner relative">
                      <div className="absolute inset-1 bg-gray-300 rounded-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">Slide</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="mx-10 p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { id: "seperateprint", label: "Separate Print" },
              { id: "qrcode", label: "QR Code" },
              { id: "labreg", label: "Lab Reg No" },
              { id: "noheader", label: "No Header Report" },
              { id: "enableautoemail", label: "Enable Auto Email At Approval" },
              { id: "enaautosms", label: "Enable Auto SMS at Approval" },
              { id: "enableautowhatsap", label: "Enable Auto Whatsapp at Approval" },
              { id: "enableintermidiate", label: "Enable Intermediate Result" },
              { id: "enablestags", label: "Enable Stages" },
              { id: "showtext", label: "Show Test Docs" },
            ].map((option) => (
              <div key={option.id} className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={option.id}
                  checked={investigation[option.id] || false} // Check if this option is selected
                  className="h-4 w-4 text-teal-600"
                  readOnly // Make the input read-only
                />
                <label htmlFor={option.id} className="text-sm font-medium text-gray-700 cursor-pointer">
                  {option.label}
                </label>
              </div>
            ))}
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Test Price</h2>
              <div className="col-span-full border-b border-gray-300"></div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { label: "Walk-in Price", name: "walkinprice" },
              { label: "B2B Price", name: "b2bprice" },
              { label: "PPP Price", name: "ppprice" },
              { label: "Govt. Price", name: "govtprice" },
              { label: "Normal Price", name: "normalprice" },
            ].map((price) => (
              <div key={price.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{price.label}</label>
                <input
                  value={investigation[price.name] || ''} // Display the price from the investigation object
                  type="number"
                  placeholder={`Enter ${price.label}`}
                  className="w-full border px-3 py-2 rounded"
                  readOnly // Make the input read-only
                />
              </div>
            ))}
          </div>

          
                          
            {/* Results Table */}
            <div className="col-span-full p-4 overflow-auto">
            <h2 className="font-bold mb-2">Results</h2>
            <div className="col-span-full border-b mb-4 border-gray-300"></div>
            <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
                <thead className="bg-gray-100 text-orange-600">
                <tr>
                    <th className="border px-2 py-1">Result Name</th>
                    <th className="border px-2 py-1">Other Language Result Name</th>
                    <th className="border px-2 py-1">ExtResultId</th>
                    <th className="border px-2 py-1">Order</th>
                    <th className="border px-2 py-1">Unit</th>
                    <th className="border px-2 py-1">Formula</th>
                    <th className="border px-2 py-1">Value Type</th>
                    <th className="border px-2 py-1">Default</th>
                    <th className="border px-2 py-1">RoundOff</th>
                    <th className="border px-2 py-1">Normal Values</th>
                    <th className="border px-2 py-1">Mandatory Conditions</th>
                    <th className="border px-2 py-1">Reflex Tests</th>
                    <th className="border px-2 py-1">Show Trends</th>
                </tr>
                </thead>
                <tbody>
                {investigation.results && investigation.results.length > 0 ? (
                  investigation.results.map((result) => (
                    <tr key={result.id} className="bg-white hover:bg-gray-50">
                    <td className="border px-2 py-1">{result.resultname}</td>
                    <td className="border px-2 py-1"></td>
                    <td className="border px-2 py-1"></td>
                    <td className="border px-2 py-1">{result.order}</td>
                    <td className="border px-2 py-1">{result.unit}</td>
                    <td className="border px-2 py-1">{result.formula}</td>
                    <td className="border px-2 py-1">{result.valueType}</td>
                    <td className="border px-2 py-1">{result.defaultValue}</td>
                    <td className="border px-2 py-1">{result.roundOff}</td>    
                    <td className="border px-2 py-1">
                      {result.normalValues && result.normalValues.length > 0 ? 
                        `${result.normalValues.length} normal value(s)` : 
                        "None"
                      }
                    </td>    
                    <td className="border px-2 py-1">
                      {result.mandatoryConditions && result.mandatoryConditions.length > 0 ? 
                        `${result.mandatoryConditions.length} condition(s)` : 
                        "None"
                      }
                    </td>   
                    <td className="border px-2 py-1">
                      {result.reflexTests && result.reflexTests.length > 0 ? 
                        `${result.reflexTests.length} test(s)` : 
                        "None"
                      }
                    </td>     
                    <td className="border px-2 py-1">{result.showTrends ? 'Yes' : 'No'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="border px-2 py-4 text-center text-gray-500">
                      No results found for this investigation
                    </td>
                  </tr>
                )}
                </tbody>
            </table>
            </div>



          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Output Template</h2>
              <div className="col-span-full border-b border-gray-300 mb-4"></div>

              <div className="flex items-center mb-4">
                <input 
                  type="checkbox" 
                  id="showImagesSide" 
                  checked={investigation.checkimage || false} // Check if this option is selected
                  className="mr-2" 
                  readOnly // Make the input read-only
                />
                <label htmlFor="showImagesSide" className="text-sm text-gray-700">
                  Check if images need to be shown on the side of test data instead of below
                </label>
              </div>

              <div className="flex items-center gap-4 w-full max-w-md">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap w-40">
                  Choose Template
                </label>
                <select 
                  value={investigation.template || ''} // Display the selected template
                  className="flex-1 border px-3 py-2 rounded" 
                  readOnly // Make the input read-only
                >
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
                <input 
                  type="checkbox" 
                  id="isOutsourced" 
                  checked={investigation.checkoutsrc || false} // Check if this option is selected
                  className="mr-2" 
                  readOnly // Make the input read-only
                />
                <label htmlFor="isOutsourced" className="text-sm text-gray-700">
                  Check if this is an outsourced test
                </label>
              </div>
            </div>
          </div>


            <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <h2 className="font-bold">General Information</h2>
            <div className="col-span-full border-b mb-4 border-gray-300"></div>

            <div className="col-span-full grid grid-cols-4 items-start gap-4 mb-4">
                {/* Barcode Length */}
                <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Barcode Length<span className="text-red-500">*</span></label>
                <input 
                    type="number" 
                    value={investigation.barcodelngt || ''} // Display the barcode length
                    placeholder="Enter length" 
                    className="w-full border px-3 py-2 rounded" 
                    readOnly // Make the input read-only
                />
                </div>

                {/* Barcodes */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Barcode <span className="text-red-500">*</span></label>
                <input 
                    type="number" 
                    value={investigation.barcode || ''} // Display the barcode
                    placeholder="Enter Barcode" 
                    className="w-full border px-3 py-2 rounded" 
                    readOnly // Make the input read-only
                />
                </div>

                {/* Separate Barcodes */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Separate Barcode</label>
                <input 
                    type="number" 
                    value={investigation.spbarcode || ''} // Display the separate barcode
                    placeholder="Enter Separate Barcode" 
                    className="w-full border px-3 py-2 rounded" 
                    readOnly // Make the input read-only
                />
                </div>

                {/* Suffixed Barcodes */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Suffixed Barcode</label>
                <input
                    value={investigation.suffbarcode || ''} // Display the suffixed barcodes
                    placeholder="e.g., -A, -B"
                    className="w-full border px-3 py-2 rounded"
                    readOnly // Make the input read-only
                />
                </div>

                {/* TAT (Turnaround Time) */}
                <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">TAT (Turnaround Time)<span className="text-red-500">*</span></label>
                <div className="flex gap-0">
                    <input
                    type="number"
                    value={investigation.tat || ''} // Display the TAT value
                    placeholder="Enter value"
                    className="w-1/2 border px-3 py-2 rounded"
                    readOnly // Make the input read-only
                    />
                    <select 
                    value={investigation.tatunit || ''} // Display the TAT unit
                    className="w-1/2 border px-3 py-2 rounded"
                    readOnly // Make the input read-only
                    >
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
                    value={investigation.stat || ''} // Display the STAT value
                    placeholder="Enter value"
                    className="w-1/2 border px-3 py-2 rounded"
                    readOnly // Make the input read-only
                    />
                    <select 
                    value={investigation.statunit || ''} // Display the STAT unit
                    className="w-1/2 border px-3 py-2 rounded"
                    readOnly // Make the input read-only
                    >
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
                <select 
                    value={investigation.status || ''} // Display the status
                    className="w-full border px-3 py-2 rounded"
                    readOnly // Make the input read-only
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                </div>
            </div>
            </div>

            {/* Embed the InvestigationDetails component */}
                {/* <InvestigationDetails /> */}


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
                readOnly // Make the editor read-only
                theme="snow"
                className="mt-2 bg-white"
                modules={{ toolbar: false }} // Disable the toolbar for read-only
                formats={[]} // Disable formats for read-only
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
                readOnly // Make the editor read-only
                theme="snow"
                className="mt-2 bg-white"
                modules={{ toolbar: false }} // Disable the toolbar for read-only
                formats={[]} // Disable formats for read-only
                />
            </div>
            </div>

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
                readOnly // Make the editor read-only
                theme="snow"
                className="mt-2 bg-white"
                modules={{ toolbar: false }} // Disable the toolbar for read-only
                formats={[]} // Disable formats for read-only
                />
                
            </div>
            </div>

            <style>
            {`
                .ql-container {
                min-height: 100px; /* Change this value as needed */
                }
            `}
            </style>


                

          <div className="px-6 py-4 border-t bg-gray-50 text-right">
            <button 
              onClick={() => navigate("/view-investigation")} 
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
              Back to Investigations
            </button>
          </div>

        </form>
      </div>
    </>
  );
};

export default ViewInvestigationDetails;
