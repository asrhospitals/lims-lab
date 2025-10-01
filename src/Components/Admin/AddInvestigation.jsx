import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

import AddInvestigationResult from "./AddInvestigationResult";
import AccrediationDetails from "./AccrediationDetails";
import {
  addInvestigation,
  viewDepartments,
  viewSubDepartments,
  viewRoles,
  viewSpecimenTypes,
  viewInstruments,
} from "../../services/apiService";

const AddInvestigation = () => {
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [specimens, setSpecimens] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);

  // Rich text editor states - moved to top
  const [instruction, setInstruction] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [remarks, setRemarks] = useState("");

  // Child component states
  const [results, setResults] = useState([]);
  const [accreditationItems, setAccreditationItems] = useState([]);
  const [consumableItems, setConsumableItems] = useState([]);
  const [labConsumableItems, setLabConsumableItems] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const navigate = useNavigate();

  // Rich text editor configuration
  const modules = {
    toolbar: [
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "super" }, { script: "sub" }],
      [{ size: [] }],
      [{ color: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ background: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["link"],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "header",
    "link",
    "blockquote",
    "code-block",
    "clean",
  ];

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const deptResponse = await viewDepartments();
        console.log("Departments:", deptResponse?.data || []);
        setDepartments(deptResponse?.data || []);
      } catch (err) {
        console.error("Departments API failed:", err);
        toast.error("❌ Failed to load Departments");
      }
    };
    fetchDepartments();
  }, []);

  // Fetch Specimens
  useEffect(() => {
    const fetchSpecimens = async () => {
      try {
        const res = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-all-specimen"
        );
        console.log("Specimens API Response:", res.data);
        setSpecimens(res.data || []);
      } catch (err) {
        console.error("Failed to fetch specimens:", err);
        toast.error("❌ Failed to load Specimens");
      }
    };
    fetchSpecimens();
  }, []);
  
  // Fetch SubDepartments
  useEffect(() => {
    const fetchSubDepartments = async () => {
      try {
        const subDeptResponse = await viewSubDepartments();
        console.log("SubDepartments:", subDeptResponse?.data || []);
        setSubDepartments(subDeptResponse?.data || []);
      } catch (err) {
        console.error("SubDepartments API failed:", err);
        toast.error("❌ Failed to load SubDepartments");
      }
    };
    fetchSubDepartments();
  }, []);

  // Fetch Roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roleResponse = await viewRoles();
        console.log("🔍 Raw API response:", roleResponse);
        setRoles(
          Array.isArray(roleResponse) ? roleResponse : roleResponse?.data || []
        );
      } catch (err) {
        console.error("Roles API failed:", err);
        toast.error("❌ Failed to load Roles");
      }
    };
    fetchRoles();
  }, []);

  // Fetch Instruments
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const instrumentResponse = await viewInstruments();
        console.log("Instruments:", instrumentResponse?.data || []);
        setInstruments(instrumentResponse?.data || []);
      } catch (err) {
        console.error("Instruments API failed:", err);
        toast.error("❌ Failed to load Instruments");
      }
    };
    fetchInstruments();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Validate required fields before submission
    if (!data.testName) {
      toast.error("❌ Test Name is required");
      setIsSubmitting(false);
      return;
    }
    if (!data.testCategory) {
      toast.error("❌ Test Category is required");
      setIsSubmitting(false);
      return;
    }
    if (!data.barcodeLength) {
      toast.error("❌ Barcode Length is required");
      setIsSubmitting(false);
      return;
    }
    if (!data.tatValue) {
      toast.error("❌ TAT Value is required");
      setIsSubmitting(false);
      return;
    }
    if (!data.container_selection) {
      toast.error("❌ Container selection is required");
      setIsSubmitting(false);
      return;
    }

    // Validate that at least one result is added
    if (results.length === 0) {
      toast.error("❌ Please add at least one result");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      loniccode: data.loincCode || null,
      cptcode: data.cptCode || null,
      testname: data.testName,
      testcategory: data.testCategory,
      shortname: data.shortName || null,
      shortcode: data.shortCode ? parseInt(data.shortCode) : null,
      departmentId: data.department ? parseInt(data.department) : null,
      subdepartment: data.subDepartment || null,
      roletype: data.roleType || null,
      reporttype: data.reportType || null,
      sampletype: data.specimenType || null,
      sampleqty: data.sampleQuantity || null,
      sampletemp: data.sampleTemperature || null,
      testmethod: data.method || null,
      instrumenttype: data.instrumentType || null,
      description: data.description || null,
      sac: data.sac || null,
      order: data.order || null,
      derivedtest: data.derivedTest || null,
      extranaltest: data.externalTestId || null,
      containertype: data.container_selection || null,
      seperateprint: data.separatePrint || false,
      qrcode: data.qrCode || false,
      labreg: data.labRegNo || false,
      noheader: data.noHeaderReport || false,
      enableautoemail: data.enableAutoEmailAtApproval || false,
      enaautosms: data.enableAutoSMSAtApproval || false,
      enableautowhatsap: data.enableAutoWhatsappAtApproval || false,
      enableintermidiate: data.enableIntermediateResult || false,
      enablestags: data.enableStages || false,
      showtext: data.showTestDocs || false,
      walkinprice: data.walkInPrice ? parseFloat(data.walkInPrice) : null,
      b2bprice: data.b2bPrice ? parseFloat(data.b2bPrice) : null,
      ppprice: data.pppPrice ? parseFloat(data.pppPrice) : null,
      govtprice: data.govtPrice ? parseFloat(data.govtPrice) : null,
      normalprice: data.normalPrice ? parseFloat(data.normalPrice) : null,
      checkimage: data.showImagesSide || false,
      template: data.template || null,
      checkoutsrc: data.isOutsourced || false,
      barcodelngt: parseInt(data.barcodeLength),
      barcode: data.barcode ? parseInt(data.barcode) : null,
      spbarcode: data.separateBarcode || null,
      suffbarcode: data.suffixedBarcodes || null,
      tat: data.tatValue,
      tatunit: data.tatUnit || null,
      stat: data.statValue || null,
      statunit: data.statUnit || null,
      status: data.status || "Active",
      instruction: instruction || null,
      interpretation: interpretation || null,
      remark: remarks || null,
      results: results.map((result) => ({
        resultname: result.name,
        unit: result.unit,
        valueType: result.valueType,
        formula: result.formula,
        order: result.order ? parseInt(result.order) : null,
        roundOff: result.roundOff ? parseInt(result.roundOff) : null,
        showTrends: result.showTrends || false,
        defaultValue: result.defaultValue ? parseInt(result.defaultValue) : null,
        normalValues: result.normalValues.map((nv) => ({
          gender: nv.type || null,
          ageMin: nv.ageMinYear ? parseInt(nv.ageMinYear) : null,
          ageMax: nv.ageMaxYear ? parseInt(nv.ageMaxYear) : null,
          rangeMin: nv.rangeMin ? parseFloat(nv.rangeMin) : null,
          rangeMax: nv.rangeMax ? parseFloat(nv.rangeMax) : null,
          validRangeMin: nv.validRangeMin ? parseFloat(nv.validRangeMin) : null,
          validRangeMax: nv.validRangeMax ? parseFloat(nv.validRangeMax) : null,
          criticalLow: nv.criticalRangeLow ? parseFloat(nv.criticalRangeLow) : null,
          criticalHigh: nv.criticalRangeHigh ? parseFloat(nv.criticalRangeHigh) : null,
          isRangeAbnormal: nv.rangeAbnormal || false,
          avoidInReport: nv.avoidRangeInReport || false,
        })),
        mandatoryConditions: result.mandatoryConditions || [],
        reflexTests: result.reflexTests || [],
      })),
      accreditationItems: accreditationItems,
      consumableItems: consumableItems,
      labConsumableItems: labConsumableItems,
      test_collection: "Yes", // Adding required field based on model
    };

    console.log("Complete payload being sent to API:", payload);

    try {
      await addInvestigation(payload);
      toast.success("✅ Investigation added successfully");
      reset();
      // Reset child component states
      setResults([]);
      setAccreditationItems([]);
      setConsumableItems([]);
      setLabConsumableItems([]);
      setInstruction("");
      setInterpretation("");
      setRemarks("");
      navigate("/view-investigation");
    } catch (err) {
      toast.error("❌ Failed to add investigation");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    if (window.confirm("Are you sure you want to clear all form data?")) {
      reset();
      setResults([]);
      setAccreditationItems([]);
      setConsumableItems([]);
      setLabConsumableItems([]);
      setInstruction("");
      setInterpretation("");
      setRemarks("");
      toast.info("✨ Form cleared successfully");
    }
  };

  const derivedTests = [
    { name: "Derived Test 1" },
    { name: "Derived Test 2" },
  ];

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-sm font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-investigation"
                className="text-gray-700 hover:text-teal-600"
              >
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

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                LOINC CODE
              </label>
              <input
                {...register("loincCode")}
                placeholder="LOINC CODE"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CPT CODE
              </label>
              <input
                {...register("cptCode")}
                placeholder="CPT CODE"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="col-span-full"></div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Test Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("testName", {
                  required: "Test Name is required",
                })}
                placeholder="Test Name"
                className="w-full border px-3 py-2 rounded"
              />
              {errors.testName && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.testName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Test Category<span className="text-red-500">*</span>
              </label>
              <input
                {...register("testCategory", {
                  required: "Test Category is required",
                })}
                placeholder="Test Category"
                className="w-full border px-3 py-2 rounded"
              />
              {errors.testCategory && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.testCategory.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Short Name
              </label>
              <input
                {...register("shortName")}
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Short Code
              </label>
              <input
                {...register("shortCode", {
                  validate: (value) => {
                    if (value && isNaN(parseInt(value))) {
                      return "Short Code must be a valid number";
                    }
                    return true;
                  },
                })}
                type="number"
                placeholder="Enter unique short code"
                className="w-full border px-3 py-2 rounded"
              />
              {errors.shortCode && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.shortCode.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                {...register("department")}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Department</option>
                {departments.map((d, i) => (
                  <option key={i} value={d.id}>
                    {d.dptname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sub-Department
              </label>
              <select
                {...register("subDepartment")}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Sub-Department</option>
                {subDepartments.map((d, i) => (
                  <option key={i} value={d.subdptname}>
                    {d.subdptname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role Type
              </label>
              <select
                {...register("roleType")}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Role Type</option>
                {roles.map((d) => (
                  <option key={d.id} value={d.roletype}>
                    {d.roletype}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Report Type
              </label>
              <select
                {...register("reportType")}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Report Type</option>
                <option value="Range">Range</option>
                <option value="Format">Format</option>
                <option value="Positive/Negative">Positive/Negative</option>
                <option value="Reactive/Non-reactive">Reactive/Non-reactive</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Specimen Type
              </label>
              <select
                {...register("specimenType")}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Specimen Type</option>
                {specimens.map((d, i) => (
                  <option key={i} value={d.specimenname}>
                    {d.specimenname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sample Quantity
              </label>
              <input
                {...register("sampleQuantity", {
                  validate: (value) => {
                    if (value && isNaN(parseFloat(value))) {
                      return "Sample quantity must be a valid number";
                    }
                    return true;
                  },
                })}
                type="number"
                step="0.01"
                placeholder="Enter quantity"
                className="w-full border px-3 py-2 rounded"
              />
              {errors.sampleQuantity && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.sampleQuantity.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sample Temperature
              </label>
              <input
                {...register("sampleTemperature", {
                  validate: (value) => {
                    if (value && isNaN(parseFloat(value))) {
                      return "Sample temperature must be a valid number";
                    }
                    return true;
                  },
                })}
                type="number"
                step="0.1"
                placeholder="Enter temperature"
                className="w-full border px-3 py-2 rounded"
              />
              {errors.sampleTemperature && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.sampleTemperature.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Test Method
              </label>
              <input
                {...register("method")}
                placeholder="Method"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instrument Type
              </label>
              <select
                {...register("instrumentType")}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Instrument Type</option>
                {instruments.map((d) => (
                  <option key={d.id} value={d.instrumentname}>
                    {d.instrumentname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                {...register("description")}
                placeholder="Description"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                SAC
              </label>
              <input
                {...register("sac")}
                placeholder="SAC"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order
              </label>
              <input
                {...register("order")}
                placeholder="100000"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Derived Test
              </label>
              <select
                {...register("derivedTest")}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Derived Test</option>
                {derivedTests.map((test) => (
                  <option key={test.name} value={test.name}>
                    {test.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                External Test ID
              </label>
              <input
                {...register("externalTestId")}
                placeholder="External Test ID"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Container Type & Color
              </label>
              <button
                type="button"
                onClick={() => setValue("container_selection", null)}
                className="my-2 text-gray-600 border border-orange-500 hover:border-orange-600 hover:text-orange-600 rounded px-3 py-1 text-sm"
              >
                Clear Selection
              </button>

              <div className="mx-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  { name: "Red", hex: "#a6121d" },
                  { name: "Blue", hex: "#02B4E5" },
                  { name: "Yellow", hex: "#DBB634" },
                  { name: "Gold", hex: "#FFD700" },
                  { name: "Green", hex: "#21443a" },
                  { name: "Pink", hex: "#E342AD" },
                  { name: "Purple", hex: "#8D82CF" },
                  { name: "Dark Blue", hex: "#224E98" },
                ].map((color) => (
                  <label
                    key={`Tube_${color.name}`}
                    className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:shadow-lg transition-all duration-200"
                  >
                    <input
                      type="radio"
                      value={`Tube_${color.name}`}
                      {...register("container_selection", {
                        required: "Please select a container type or color",
                      })}
                      className="form-radio text-indigo-600"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="relative w-4 h-8 rounded-b-full border-2 border-gray-300 overflow-hidden shadow-inner bg-white">
                        <div
                          className="absolute bottom-0 w-full"
                          style={{ height: "70%", backgroundColor: color.hex }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/10 pointer-events-none" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {color.name}
                      </span>
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
                    {...register("container_selection", {
                      required: "Please select a container type or color",
                    })}
                    className="form-radio text-indigo-600"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-400 border-2 border-gray-300 rounded-sm shadow-inner"></div>
                    <span className="text-sm font-medium text-gray-800">
                      Block
                    </span>
                  </div>
                </label>

                <label
                  key="Slide"
                  className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:shadow-lg transition-all duration-200"
                >
                  <input
                    type="radio"
                    value="Slide"
                    {...register("container_selection", {
                      required: "Please select a container type or color",
                    })}
                    className="form-radio text-indigo-600"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-4 bg-gray-200 border-2 border-gray-300 rounded-sm shadow-inner relative">
                      <div className="absolute inset-1 bg-gray-300 rounded-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      Slide
                    </span>
                  </div>
                </label>
              </div>

              {errors.container_selection && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.container_selection.message}
                </p>
              )}
            </div>
          </div>

          <div className="mx-10 p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { id: "separatePrint", label: "Separate Print" },
              { id: "qrCode", label: "QR Code" },
              { id: "labRegNo", label: "Lab Reg No" },
              { id: "noHeaderReport", label: "No Header Report" },
              {
                id: "enableAutoEmailAtApproval",
                label: "Enable Auto Email At Approval",
              },
              {
                id: "enableAutoSMSAtApproval",
                label: "Enable Auto SMS at Approval",
              },
              {
                id: "enableAutoWhatsappAtApproval",
                label: "Enable Auto Whatsapp at Approval",
              },
              {
                id: "enableIntermediateResult",
                label: "Enable Intermediate Result",
              },
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
                <label
                  htmlFor={option.id}
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>

          {/* Test Price for Different Categories */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Test Price
              </h2>
              <div className="col-span-full border-b border-gray-300"></div>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              // { label: "Walk-in Price", name: "walkInPrice" },
              // { label: "B2B Price", name: "b2bPrice" },
              // { label: "PPP Price", name: "pppPrice" },
              // { label: "Govt. Price", name: "govtPrice" },
              { label: "Normal Price", name: "normalPrice" },
            ].map((price) => (
              <div key={price.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {price.label}
                </label>
                <input
                  {...register(price.name, {
                    validate: (value) => {
                      if (
                        value &&
                        (isNaN(parseFloat(value)) || parseFloat(value) < 0)
                      ) {
                        return `${price.label} must be a valid positive number`;
                      }
                      return true;
                    },
                  })}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={`Enter ${price.label}`}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors[price.name] && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors[price.name].message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Investigation Results Component */}
          <AddInvestigationResult results={results} setResults={setResults} />

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Output Template
              </h2>
              <div className="col-span-full border-b border-gray-300 mb-4"></div>

              <div className="flex items-center mb-4">
                <input
                  {...register("showImagesSide")}
                  type="checkbox"
                  id="showImagesSide"
                  className="mr-2"
                />
                <label
                  htmlFor="showImagesSide"
                  className="text-sm text-gray-700"
                >
                  Check if images need to be shown on the side of test data
                  instead of below
                </label>
              </div>

              <div className="flex items-center gap-4 w-full max-w-md">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap w-40">
                  Choose Template
                </label>
                <select
                  {...register("template")}
                  className="flex-1 border px-3 py-2 rounded"
                >
                  <option value="">Select Template</option>
                  <option value="template1">Template 1</option>
                  <option value="template2">Template 2</option>
                </select>
              </div>
            </div>

            <div className="col-span-full mt-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Outsourcing Information
              </h2>
              <div className="col-span-full border-b border-gray-300 mb-4"></div>

              <div className="flex items-center">
                <input
                  {...register("isOutsourced")}
                  type="checkbox"
                  id="isOutsourced"
                  className="mr-2"
                />
                <label htmlFor="isOutsourced" className="text-sm text-gray-700">
                  Check if this is an outsourced test
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <h2 className="font-bold ">General Information</h2>
            <div className="col-span-full border-b mb-4  border-gray-300"></div>

            <div className="col-span-full grid grid-cols-4 items-start gap-4 mb-4">
              {/* Barcode Length */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Barcode Length<span className="text-red-500">*</span>
                </label>
                <input
                  {...register("barcodeLength", {
                    required: "Barcode Length is required",
                    validate: (value) => {
                      if (
                        !value ||
                        isNaN(parseInt(value)) ||
                        parseInt(value) <= 0
                      ) {
                        return "Barcode Length must be a valid positive number";
                      }
                      return true;
                    },
                  })}
                  type="number"
                  placeholder="Enter length"
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.barcodeLength && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.barcodeLength.message}
                  </p>
                )}
              </div>

              {/* Barcodes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Barcode <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("barcode", {
                    required: "Barcode is required",
                    validate: (value) => {
                      if (!value || isNaN(parseInt(value))) {
                        return "Barcode must be a valid number";
                      }
                      return true;
                    },
                  })}
                  type="number"
                  placeholder="Enter Barcode"
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.barcode && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.barcode.message}
                  </p>
                )}
              </div>

              {/* Separate Barcodes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Separate Barcode{" "}
                </label>
                <input
                  {...register("separateBarcode", {
                    validate: (value) => {
                      if (value && isNaN(parseInt(value))) {
                        return "Separate Barcode must be a valid number";
                      }
                      return true;
                    },
                  })}
                  type="number"
                  placeholder="Enter Separate Barcode"
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.separateBarcode && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.separateBarcode.message}
                  </p>
                )}
              </div>

              {/* Suffixed Barcodes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Suffixed Barcode
                </label>
                <input
                  {...register("suffixedBarcodes")}
                  placeholder="e.g., -A, -B"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* TAT (Turnaround Time) */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  TAT (Turnaround Time)<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-0">
                  <input
                    {...register("tatValue", {
                      required: "TAT value is required",
                      validate: (value) => {
                        if (!value || isNaN(parseInt(value))) {
                          return "TAT value must be a valid number";
                        }
                        return true;
                      },
                    })}
                    type="number"
                    placeholder="Enter value"
                    className="w-1/2 border px-3 py-2 rounded"
                  />
                  <select
                    {...register("tatUnit", {
                      required: "TAT unit is required",
                    })}
                    className="w-1/2 border px-3 py-2 rounded"
                  >
                    <option value="">Select Unit</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
                {(errors.tatValue || errors.tatUnit) && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.tatValue?.message || errors.tatUnit?.message}
                  </p>
                )}
              </div>

              {/* STAT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  STAT
                </label>
                <div className="flex gap-0">
                  <input
                    {...register("statValue", {
                      validate: (value) => {
                        if (value && isNaN(parseInt(value))) {
                          return "STAT value must be a valid number";
                        }
                        return true;
                      },
                    })}
                    type="number"
                    placeholder="Enter value"
                    className="w-1/2 border px-3 py-2 rounded"
                  />
                  <select
                    {...register("statUnit")}
                    className="w-1/2 border px-3 py-2 rounded"
                  >
                    <option value="">Select Unit</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
                {errors.statValue && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.statValue.message}
                  </p>
                )}
              </div>

              {/* Status (Active/Inactive) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>
          </div>

          {/* Accreditation Details Component */}
          <AccrediationDetails
            accreditationItems={accreditationItems}
            setAccreditationItems={setAccreditationItems}
            consumableItems={consumableItems}
            setConsumableItems={setConsumableItems}
            labConsumableItems={labConsumableItems}
            setLabConsumableItems={setLabConsumableItems}
          />
          
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

          {/* Editor styling */}
          <style>
            {`
              .ql-container {
                min-height: 100px;
              }
            `}
          </style>

          <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
            <button
              type="button"
              onClick={handleClearForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddInvestigation;