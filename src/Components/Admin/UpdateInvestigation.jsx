import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import InvestigationDetails from "./InvestigationDetails";
import UpdateInvestigationResult from "./UpdateInvestigationResult";
import {
  updateInvestigation,
  viewInvestigation,
  viewAllDepartmentDetails,
  viewAllSubDepartmentDetails,
  viewAllROles,
  viewSpecimenTypes,
  viewAllInstrument,
} from "../../services/apiService";
import AddInvestigationResult from "./AddInvestigationResult";

const UpdateInvestigation = () => {
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [specimens, setSpecimens] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [derivedtests, setDerivedtests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [investigation, setInvestigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  // console.log("Results state:", results);

  // Rich text editor states
  const [instruction, setInstruction] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [remark, setRemarks] = useState("");
  const [investigationData, setInvestigationData] = useState(null);
  const [showModalNormalValues, setShowModalNormalValues] = useState(false);

  const [normalValues, setNormalValues] = useState([]); // Existing values from API
  const [selectedIndex, setSelectedIndex] = useState(null); // Index of value being edited


  const [formData, setFormData] = useState({
    type: "",
    ageMinYear: "",
    ageMinMonth: "",
    ageMinDay: "",
    ageMaxYear: "",
    ageMaxMonth: "",
    ageMaxDay: "",
    rangeMin: "",
    rangeMax: "",
    rangeAbnormal: false,
    avoidRangeInReport: false,
    validRangeMin: "",
    validRangeMax: "",
    criticalRangeLow: "",
    criticalRangeHigh: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const navigate = useNavigate();
  const { id } = useParams();

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

  // Fetch master data (departments, roles, etc.)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dept, subDept, role, spec, instruments] = await Promise.all([
          viewAllDepartmentDetails(),
          viewAllSubDepartmentDetails(),
          viewAllROles(),
          viewSpecimenTypes(),
          viewAllInstrument(),
        ]);
        setDepartments(
          Array.from(dept?.data || dept || []).filter((d) => d.isactive)
        );
        setSubDepartments(
          Array.from(subDept?.data || subDept || []).filter((d) => d.isactive)
        );
        setRoleTypes(
          Array.from(role?.data || role || []).filter((r) => r.isactive)
        );
        setSpecimens(
          Array.from(spec?.data || spec || []).filter((s) => s.isactive)
        );
        setInstruments(
          Array.from(instruments?.data || instruments || []).filter(
            (i) => i.isactive
          )
        );
      } catch (err) {
        toast.error("❌ Failed to load master data");
        console.error(err);
      }
    };

    fetchData();
  }, []);
  // state for investigation data

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

      setInvestigationData(data); // store raw investigation data
      setInvestigation(data);
      setResults(data.results || []);

      // Set rich text editor values
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

  // Populate main form
  useEffect(() => {
    if (!investigationData) return;

    const res = investigationData.results?.[0] || {};

    reset({
      loniccode: investigationData.loniccode || "",
      cptcode: investigationData.cptcode || "",
      testname: investigationData.testname || "",
      testcategory: investigationData.testcategory || "",
      shortname: investigationData.shortname || "",
      shortcode: investigationData.shortcode || "",
      department: investigationData.departmentId || "",
      subdepartment: investigationData.subdepartment || "",
      roletype: investigationData.roletype || "",
      reporttype: investigationData.reporttype || "",
      sampletype: investigationData.sampletype || "",
      sampleqty: investigationData.sampleqty || "",
      sampletemp: investigationData.sampletemp || "",
      testmethod: investigationData.testmethod || "",
      instrumenttype: investigationData.instrumenttype || "",
      description: investigationData.description || "",
      sac: investigationData.sac || "",
      order: investigationData.order || "",
      derivedtest: investigationData.derivedtest || "",
      extranaltest: investigationData.extranaltest || "",
      containertype: investigationData.containertype || "",
      seperateprint: investigationData.seperateprint || false,
      qrcode: investigationData.qrcode || false,
      labreg: investigationData.labreg || false,
      noheader: investigationData.noheader || false,
      enableautoemail: investigationData.enableautoemail || false,
      enaautosms: investigationData.enaautosms || false,
      enableautowhatsap: investigationData.enableautowhatsap || false,
      enableintermidiate: investigationData.enableintermidiate || false,
      enablestags: investigationData.enablestags || false,
      showtext: investigationData.showtext || false,
      walkinprice: investigationData.walkinprice || "",
      b2bprice: investigationData.b2bprice || "",
      ppprice: investigationData.ppprice || "",
      govtprice: investigationData.govtprice || "",
      normalprice: investigationData.normalprice || "",
      checkimage: investigationData.checkimage || false,
      template: investigationData.template || "",
      checkoutsrc: investigationData.checkoutsrc || false,
      barcodelngt: investigationData.barcodelngt || "",
      barcode: investigationData.barcode || "",
      spbarcode: investigationData.spbarcode || "",
      suffbarcode: investigationData.suffbarcode || "",
      tat: investigationData.tat || "",
      tatunit: investigationData.tatunit || "",
      stat: investigationData.stat || "",
      statunit: investigationData.statunit || "",
      status: investigationData.status || "",
      acreeditionname: investigationData.acreeditionname || "",

      // Result-specific
      resultname: res.resultname || "",
      unit: res.unit || "",
      valueType: res.valueType || "",
      formula: res.formula || "",
      order: res.order || "",
      roundOff: res.roundOff || "",
      showTrends: res.showTrends || false,
      defaultValue: res.defaultValue || "",
      investigationId: res.investigationId || "",
    });
  }, [investigationData, reset]);

  // Populate normal values for modal
  useEffect(() => {
    const res = investigationData?.results?.[0];
    if (!res?.normalValues) return;

    const mappedValues = res.normalValues.map((nv) => ({
      id: nv.id,
      type: nv.gender || "Both",
      ageMinYear: nv.ageMin || 0,
      ageMaxYear: nv.ageMax || 0,
      ageMinMonth: 0,
      ageMaxMonth: 0,
      ageMinDay: 0,
      ageMaxDay: 0,
      rangeMin: nv.rangeMin || 0,
      rangeMax: nv.rangeMax || 0,
      rangeAbnormal: nv.isRangeAbnormal || false,
      avoidRangeInReport: nv.avoidInReport || false,
      validRangeMin: nv.validRangeMin || 0,
      validRangeMax: nv.validRangeMax || 0,
      criticalRangeLow: nv.criticalLow || 0,
      criticalRangeHigh: nv.criticalHigh || 0,
    }));

    setNormalValues(mappedValues);
  }, [investigationData]);

  // Fetch when id changes
  useEffect(() => {
    if (!id) return;
    fetchInvestigationData();
    console.log("Fetching investigation data for ID:", id);
  }, [id]);

  const [inputs, setInputs] = useState({
    accreditation: { name: "", date: "" },
    consumable: { name: "", qty: "" },
    labConsumable: { name: "", qty: "" },
  });

  // State for stored items
  const [items, setItems] = useState({
    accreditation: [],
    consumable: [],
    labConsumable: [],
  });
  // Editing state
  const [editing, setEditing] = useState({
    type: null,
    index: null,
  });

  // Handle input changes for all types
  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [name]: value,
      },
    }));
  };

  // Add or Update item
  const handleAddItem = (type, e) => {
    e.preventDefault();
    const currentInput = inputs[type];

    // Validate required fields
    if (
      !currentInput.name ||
      (type === "accreditation" ? !currentInput.date : !currentInput.qty)
    ) {
      return;
    }

    if (editing.type === type && editing.index !== null) {
      // Update existing item
      const updatedItems = [...items[type]];
      updatedItems[editing.index] = currentInput;
      setItems((prev) => ({
        ...prev,
        [type]: updatedItems,
      }));
      setEditing({ type: null, index: null });
    } else {
      // Add new item
      setItems((prev) => ({
        ...prev,
        [type]: [...prev[type], currentInput],
      }));
    }

    // Clear inputs
    const [inputs, setInputs] = useState({
      accreditation: { name: "", date: "" },
      consumable: { name: "", qty: "" },
      labConsumable: { name: "", qty: "" },
    });
  };

  // Edit item
  const handleEdit = (type, index, e) => {
    e.preventDefault();
    const itemToEdit = items[type][index];
    setInputs((prev) => ({
      ...prev,
      [type]: { ...itemToEdit },
    }));
    setEditing({ type, index });
  };

  useEffect(() => {
    if (investigationData) {
      setItems((prev) => ({
        ...prev,
        accreditation: investigationData.acreeditionname.map((name, idx) => ({
          name,
          date: investigationData.acreeditiondate[idx] || "",
        })),
      }));
    }
  }, [investigationData]);

  // Remove item
  const handleRemove = (type, index, e) => {
    e.preventDefault();
    const updatedItems = items[type].filter((_, i) => i !== index);
    setItems((prev) => ({
      ...prev,
      [type]: updatedItems,
    }));

    // If editing this item, cancel edit
    if (editing.type === type && editing.index === index) {
      setEditing({ type: null, index: null });
      setInputs((prev) => ({
        ...prev,
        [type]:
          type === "accreditation"
            ? { name: "", date: "" }
            : { name: "", qty: "" },
      }));
    } else if (editing.index > index) {
      // Adjust editing index if needed
      setEditing((prev) => ({ ...prev, index: prev.index - 1 }));
    }
  };

  // Render rows for all types
  const renderRows = (type) => {
    return items[type].map((item, index) => (
      <tr key={`${type}-${index}`} className="text-sm hover:bg-gray-50">
        <td className="border px-2 py-1">{item.name}</td>
        <td className="border px-2 py-1">
          {type === "accreditation" ? item.date : item.qty}
        </td>
        <td className="border px-2 py-1">
          <button
            onClick={(e) => handleEdit(type, index, e)}
            className="text-blue-600 hover:underline mr-3"
          >
            Edit
          </button>
        </td>
        <td className="border px-2 py-1">
          <button
            onClick={(e) => handleRemove(type, index, e)}
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        </td>
      </tr>
    ));
  };

  // Form fields for all types
  const renderFormFields = (type) => (
    <tr>
      <td className="border px-2 py-1">
        <input
          name="name"
          value={inputs[type].name}
          onChange={(e) => handleInputChange(e, type)}
          placeholder={
            type === "accreditation" ? "Accreditation Name" : "Product Name"
          }
          className="w-full border px-2 py-1"
        />
      </td>
      <td className="border px-2 py-1">
        {type === "accreditation" ? (
          <input
            name="date"
            value={inputs[type].date}
            type="date"
            onChange={(e) => handleInputChange(e, type)}
            className="w-full border px-2 py-1"
          />
        ) : (
          <input
            name="qty"
            value={inputs[type].qty}
            onChange={(e) => handleInputChange(e, type)}
            placeholder="Quantity"
            className="w-full border px-2 py-1"
          />
        )}
      </td>
      <td className="border px-2 py-1" colSpan="2">
        <button
          onClick={(e) => handleAddItem(type, e)}
          className={`px-3 py-1 rounded ${
            editing.type === type
              ? "bg-yellow-100 text-yellow-700 border-yellow-700"
              : "bg-purple-100 text-purple-700 border-purple-700"
          } border hover:opacity-90`}
        >
          {editing.type === type ? "Update" : "Add"}
        </button>
      </td>
    </tr>
  );

  const handleEditChange = (e, index, field, type) => {
    const value = e.target.value;
    setItems((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  useEffect(() => {
    if (investigationData?.results?.length) {
      const fetchedNormalValues =
        investigationData.results[0].normalValues?.map((nv) => ({
          type: nv.gender,
          ageMinYear: nv.ageMin || 0,
          ageMinMonth: 0,
          ageMinDay: 0,
          ageMaxYear: nv.ageMax || 0,
          ageMaxMonth: 0,
          ageMaxDay: 0,
          rangeMin: nv.rangeMin || 0,
          rangeMax: nv.rangeMax || 0,
          rangeAbnormal: nv.isRangeAbnormal || false,
          avoidRangeInReport: nv.avoidInReport || false,
          validRangeMin: nv.validRangeMin || 0,
          validRangeMax: nv.validRangeMax || 0,
          criticalRangeLow: nv.criticalLow || 0,
          criticalRangeHigh: nv.criticalHigh || 0,
        }));
      setNormalValues(fetchedNormalValues || []);
    }
  }, [investigationData]);

  const handleEditNormalValues = (index) => {
    const value = normalValues[index];
    setFormData({
      type: value.type,
      ageMinYear: value.ageMinYear,
      ageMinMonth: value.ageMinMonth,
      ageMinDay: value.ageMinDay,
      ageMaxYear: value.ageMaxYear,
      ageMaxMonth: value.ageMaxMonth,
      ageMaxDay: value.ageMaxDay,
      rangeMin: value.rangeMin,
      rangeMax: value.rangeMax,
      rangeAbnormal: value.rangeAbnormal,
      avoidRangeInReport: value.avoidRangeInReport,
      validRangeMin: value.validRangeMin,
      validRangeMax: value.validRangeMax,
      criticalRangeLow: value.criticalRangeLow,
      criticalRangeHigh: value.criticalRangeHigh,
    });
    setSelectedIndex(index); // mark which entry is being edited
    // setShowModalNormalValues(true);
    
  };

  const handleRemoveNormalValues = (index) => {
    const updated = [...normalValues];
    updated.splice(index, 1);
    setNormalValues(updated);
  };

  const handleCloseNormalValue = (e) => {
    e.preventDefault();
    setShowModalNormalValues(false);
  };

  
  const handleAddNormalValues = () => {
    const newValue = { ...formData };

    if (selectedIndex !== null) {
      // Update existing
      const updatedValues = [...normalValues];
      updatedValues[selectedIndex] = newValue;
      setNormalValues(updatedValues);
    } else {
      // Add new
      setNormalValues([...normalValues, newValue]);
    }

    // Clear form & reset edit state
    setFormData({});
    setSelectedIndex(null);
    handleSubmitNormalValues();
  };

  const handleSubmitNormalValues = () => {
    setNormalValues([...normalValues, formData]);
    setFormData({
      type: "",
      ageMinYear: "",
      ageMinMonth: "",
      ageMinDay: "",
      ageMaxYear: "",
      ageMaxMonth: "",
      ageMaxDay: "",
      rangeMin: "",
      rangeMax: "",
      validRangeMin: "",
      validRangeMax: "",
      criticalRangeLow: "",
      criticalRangeHigh: "",
      rangeAbnormal: false,
      avoidRangeInReport: false,
    });
  };





  const handleShowNormalValue = () => {
    setShowModalNormalValues(true); // Opens the modal
    console.log("im hereee");
    
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      loniccode: data.loniccode || null,
      cptcode: data.cptcode || null,
      testname: data.testname,
      testcategory: data.testcategory,
      shortname: data.shortname || null,
      shortcode: data.shortcode || null,
      departmentId: parseInt(data.department) || null,
      subdepartment: data.subdepartment || null,
      roletype: data.roletype || null,
      reporttype: data.reporttype || null,
      sampletype: data.sampletype || null,
      sampleqty: data.sampleqty || null,
      sampletemp: data.sampletemp || null,
      testmethod: data.testmethod || null,
      instrumenttype: data.instrumenttype || null,
      description: data.description || null,
      sac: data.sac || null,
      order: data.order || null,
      derivedtest: data.derivedtest || null,
      extranaltest: data.extranaltest || null,
      containertype: data.containertype || null,
      seperateprint: data.seperateprint || false,
      qrcode: data.qrcode || false,
      labreg: data.labreg || false,
      noheader: data.noheader || false,
      enableautoemail: data.enableautoemail || false,
      enaautosms: data.enaautosms || false,
      enableautowhatsap: data.enableautowhatsap || false,
      enableintermidiate: data.enableintermidiate || false,
      enablestags: data.enablestags || false,
      showtext: data.showtext || false,
      walkinprice: parseFloat(data.walkinprice) || null,
      b2bprice: parseFloat(data.b2bprice) || null,
      ppprice: parseFloat(data.ppprice) || null,
      govtprice: parseFloat(data.govtprice) || null,
      normalprice: parseFloat(data.normalprice) || null,
      checkimage: data.checkimage || false,
      template: data.template || null,
      checkoutsrc: data.checkoutsrc || false,
      barcodelngt: parseInt(data.barcodelngt) || null,
      barcode: data.barcode || null,
      spbarcode: data.spbarcode || null,
      suffbarcode: data.suffbarcode || null,
      tat: data.tat,
      tatunit: data.tatunit || null,
      stat: data.stat || null,
      statunit: data.statunit || null,
      status: data.status || "Active",
      instruction: instruction || null,
      interpretation: interpretation || null,
      remark: remark || null,
      results: results || [],
    };

    console.log("Submitting payload:", payload);

    try {
      await updateInvestigation(investigation.id, payload);
      toast.success(" Investigation updated successfully");
      fetchInvestigationData();
      // reset();

      setTimeout(() => {
        //  navigate("/view-investigation");
      }, 500);
    } catch (err) {
      toast.error("❌ Failed to update investigation");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [newResult, setNewResult] = useState({
    name: "",
    otherLanguageName: "",
    extResultId: "",
    order: "",
    unit: "",
    formula: "",
    valueType: "",
    defaultValue: "",
    roundOff: "",
    normalValues: [],
    mandatoryConditions: [],
    reflexTests: [],
    showTrends: false,
  });

  const handleSaveNormalValues = (normalValues) => {
    setNewResult(prev => ({
      ...prev,
      normalValues: normalValues
    }));
  };


  const handleAddResult = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate required fields
    // if (!newResult.name.trim()) {
    //   alert("Result Name is required");
    //   return;
    // }
    
    // if (!newResult.valueType) {
    //   alert("Value Type is required");
    //   return;
    // }
    
    setResults([...results, newResult]);

    setNewResult({
      name: "",
      otherLanguageName: "",
      extResultId: "",
      order: "",
      unit: "",
      formula: "",
      valueType: "",
      defaultValue: "",
      roundOff: "",
      normalValues: [],
      mandatoryConditions: [],
      reflexTests: [],
      showTrends: false,
    });
  };

  const handleResultChange = (e, idx) => {
    const { name, value } = e.target;
  
    const updatedResults = [...results];
    updatedResults[idx] = { ...updatedResults[idx], [name]: value };
    setResults(updatedResults);
  };
  
  
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
            <li className="text-gray-500">Update Investigation</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-16 px-4 space-y-4 text-sm">
        <ToastContainer />

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                Loading investigation data...
              </p>
            </div>
          </div>
        ) : !investigation ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600">Investigation not found</p>
              <Link
                to="/view-investigation"
                className="text-teal-600 hover:text-teal-700 mt-2 inline-block"
              >
                Back to Investigations
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
          >
            <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
              <h4 className="font-semibold text-white">Update Investigation</h4>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  LOINC CODE
                </label>
                <input
                  {...register("loniccode")}
                  placeholder="LOINC CODE"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CPT CODE
                </label>
                <input
                  {...register("cptcode")}
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
                  {...register("testname", { required: true })}
                  placeholder="Test Name"
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.testname && (
                  <p className="text-red-600 text-xs mt-1">
                    Test Name is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Test Category<span className="text-red-500">*</span>
                </label>
                <input
                  {...register("testcategory", { required: true })}
                  placeholder="Test Category"
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.testcategory && (
                  <p className="text-red-600 text-xs mt-1">
                    Test Category is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Short Name
                </label>
                <input
                  {...register("shortname")}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Short Code
                </label>
                <input
                  {...register("shortcode")}
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  {...register("department")}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value={""}>Select Department</option>
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
                  {...register("subdepartment")}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Sub-Department</option>
                  {subDepartments.map((d, i) => (
                    <option key={i} value={d.id}>
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
                  {...register("roletype")}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Role Type</option>
                  {roleTypes.map((r, i) => (
                    <option key={i} value={r.roletype}>
                      {r.roletype}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Specimen Type
                </label>
                <select
                  {...register("sampletype")}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Sample Type</option>
                  {specimens.map((s, i) => (
                    <option key={i} value={s.specimenname}>
                      {s.specimenname}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sample Quantity
                </label>
                <input
                  {...register("sampleqty")}
                  type="number"
                  placeholder="Enter quantity"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sample Temperature
                </label>
                <input
                  {...register("sampletemp")}
                  type="number"
                  placeholder="Enter temperature"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Test Method
                </label>
                <input
                  {...register("testmethod")}
                  placeholder="Test method"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instrument Type
                </label>
                <select
                  {...register("instrumenttype")}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Instrument Type</option>
                  {instruments.map((inst, i) => (
                    <option key={i} value={inst.id}>
                      {inst.instrumentname}
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
                  {...register("derivedtest")}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Derived Test</option>
                  <option value="Derived Test 1">Derived Test 1</option>
                  <option value="Derived Test 2">Derived Test 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  External Test ID
                </label>
                <input
                  {...register("extranaltest")}
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
                        {...register("containertype", { required: true })}
                        className="form-radio text-indigo-600"
                      />
                      <div className="flex items-center space-x-3">
                        <div className="relative w-4 h-8 rounded-b-full border-2 border-gray-300 overflow-hidden shadow-inner bg-white">
                          <div
                            className="absolute bottom-0 w-full"
                            style={{
                              height: "70%",
                              backgroundColor: color.hex,
                            }}
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
                      {...register("containertype", { required: true })}
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
                      {...register("containertype", { required: true })}
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
                {errors.containertype && (
                  <p className="text-red-600 text-xs mt-1">
                    Please select a container type or color
                  </p>
                )}
              </div>
            </div>

            <div className="mx-10 p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { id: "seperateprint", label: "Separate Print" },
                { id: "qrcode", label: "QR Code" },
                { id: "labreg", label: "Lab Reg No" },
                { id: "noheader", label: "No Header Report" },
                {
                  id: "enableautoemail",
                  label: "Enable Auto Email At Approval",
                },
                { id: "enaautosms", label: "Enable Auto SMS at Approval" },
                {
                  id: "enableautowhatsap",
                  label: "Enable Auto Whatsapp at Approval",
                },
                {
                  id: "enableintermidiate",
                  label: "Enable Intermediate Result",
                },
                { id: "enablestags", label: "Enable Stages" },
                { id: "showtext", label: "Show Test Docs" },
              ].map((option) => (
                <div
                  key={option.id}
                  className="mb-4 flex items-center space-x-2"
                >
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
                { label: "Normal Price", name: "normalprice" },
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

            {/* <AddInvestigationResult results={results} setResults={setResults} /> */}

            <div className="p-6">
              <div className="col-span-full p-4 overflow-auto">
                <h2 className="font-bold mb-2">Results</h2>
                <div className="col-span-full border-b mb-4 border-gray-300"></div>
                <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
                  <thead className="bg-gray-100 text-orange-600">
                    <tr>
                      <th className="border px-2 py-1">Result Name</th>
                      <th className="border px-2 py-1">
                        Other Language Result Name
                      </th>
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
                      <th className="border px-2 py-1 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="bg-white hover:bg-gray-50">
                        <td className="border px-2 py-1">{result.name}</td>
                        <td className="border px-2 py-1">
                          {result.otherLanguageName}
                        </td>
                        <td className="border px-2 py-1">
                          {result.extResultId}
                        </td>
                        <td className="border px-2 py-1">{result.order}</td>
                        <td className="border px-2 py-1">{result.unit}</td>
                        <td className="border px-2 py-1">{result.formula}</td>
                        <td className="border px-2 py-1">{result.valueType}</td>
                        <td className="border px-2 py-1">
                          {result.defaultValue}
                        </td>
                        <td className="border px-2 py-1">{result.roundOff}</td>
                        <td className="border px-2 py-1">
                          {Array.isArray(result.normalValues)
                            ? result.normalValues.length > 0
                              ? `${result.normalValues.length} normal value(s)`
                              : "None"
                            : "None"}
                        </td>
                        <td className="border px-2 py-1">
                          {Array.isArray(result.mandatoryConditions)
                            ? result.mandatoryConditions.length > 0
                              ? `${result.mandatoryConditions.length} condition(s)`
                              : "None"
                            : "None"}
                        </td>
                        <td className="border px-2 py-1">
                          {Array.isArray(result.reflexTests)
                            ? result.reflexTests.length > 0
                              ? `${result.reflexTests.length} test(s)`
                              : "None"
                            : "None"}
                        </td>
                        <td className="border px-2 py-1">
                          {result.showTrends ? "Yes" : "No"}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800 text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const updatedResults = results.filter(
                                (_, i) => i !== index
                              );
                              setResults(updatedResults);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="font-bold mb-4 mx-4">Update Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4 mx-4">
                {results.map((res, idx) => (
                  <React.Fragment key={idx}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Result Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="resultname"
                        value={res.resultname}
                        onChange={(e) => handleResultChange(e, idx)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Result Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Other Language Result Name
                      </label>
                      <input
                        type="text"
                        name="otherLanguageName"
                        value={res.otherLanguageName || ""}
                        onChange={(e) => handleResultChange(e, idx)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Other Language"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ext Result Id
                      </label>
                      <input
                        type="text"
                        name="extResultId"
                        value={res.extResultId || ""}
                        onChange={(e) => handleResultChange(e, idx)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="ExtResultId"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Order
                      </label>
                      <input
                        type="number"
                        name="order"
                        value={res.order || ""}
                        onChange={(e) => handleResultChange(e, idx)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Order"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Unit
                      </label>
                      <input
                        type="text"
                        name="unit"
                        value={res.unit || ""}
                        onChange={(e) => handleResultChange(e, idx)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Unit"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Formula
                      </label>
                      <input
                        type="text"
                        name="formula"
                        value={res.formula || ""}
                        onChange={(e) => handleResultChange(e, idx)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Formula"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Value Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="valueType"
                        value={res.valueType || ""}
                        onChange={(e) => handleResultChange(e, idx)}
                        className="w-full border px-3 py-2 rounded"
                      >
                        <option value="">Select Type</option>
                        <option value="number">Number</option>
                        <option value="text">Text</option>
                        <option value="boolean">Boolean</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Default
                      </label>
                      <input
                        type="text"
                        name="defaultValue"
                        value={res.defaultValue || ""}
                        onChange={(e) => handleResultChange(e, idx)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Default"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Round Off
                      </label>
                      <input
                        type="number"
                        name="roundOff"
                        value={res.roundOff || ""}
                        onChange={(e) => handleResultChange(e, idx)}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Round Off"
                      />
                    </div>

                    {/* Add Normal Values Button */}

                    <div>
                      <input
                        type="checkbox"
                        name="showTrends"
                        checked={res.showTrends}
                        className="mx-4 mt-4"
                        id="showTrends"
                      />
                      <label
                        className="inline-block text-sm font-medium text-gray-700 "
                        htmlFor="showTrends"
                      >
                        Show Trends
                      </label>
                    </div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div className="">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleShowNormalValue(); // This now exists
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mt-5 w-full"
                      >
                        Update Normal Values
                      </button>

                      {/* <AddInvestigationResultNormalValueModal
                        showModal={showNormalValueModal}
                        handleClose={handleCloseNormalValue}
                        onDataUpdate={handleNormalValuesUpdate}
                      /> */}

                      {/* AddInvestigation starts */}
                      <div
                        className={`${
                          showModalNormalValues ? "block" : "hidden"
                        } fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75`}
                      >
                        <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-6xl p-1">
                          <div className="border bottom-5 border-green-400 p-3">
                            <h2 className="text-xl font-semibold text-center">
                              Update Normal Values - New
                            </h2>
                          </div>
                          <div className="p-6 overflow-auto max-h-90">
                            <form
                            // onClick={handleAddNormalValues}
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleAddNormalValues();
                              }}
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                <div>
                                  {/* Type */}
                                  <div className="mb-4">
                                    <label className="block text-gray-700">
                                      Type
                                    </label>
                                    <select
                                      name="type"
                                      className="mt-2 block w-full p-2 border border-gray-300 rounded"
                                      value={formData.type}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          type: e.target.value,
                                        })
                                      }
                                      required
                                    >
                                      <option value="">Select Type</option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                      <option value="Child">Child</option>
                                      <option value="Adult">Adult</option>
                                      <option value="Elderly">Elderly</option>
                                      <option value="General">General</option>
                                    </select>
                                    <p className="text-gray-500 text-sm">
                                      Leave blank if range does not depend on
                                      type
                                    </p>
                                  </div>

                                  {/* Age Min / Max */}
                                  {["Min", "Max"].map((label) => (
                                    <div className="mb-4" key={label}>
                                      <label className="block text-gray-700">
                                        Age {label}
                                      </label>
                                      <div className="grid grid-cols-3 gap-4">
                                        {["Year", "Month", "Day"].map(
                                          (unit) => (
                                            <input
                                              key={unit}
                                              name={`age${label}${unit}`}
                                              type="number"
                                              placeholder={unit}
                                              className="block w-full p-2 border border-gray-300 rounded"
                                              value={
                                                formData[`age${label}${unit}`]
                                              }
                                              onChange={(e) =>
                                                setFormData({
                                                  ...formData,
                                                  [`age${label}${unit}`]:
                                                    e.target.value,
                                                })
                                              }
                                            />
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div>
                                  {/* Range */}
                                  <div className="mb-4">
                                    <label className="block text-gray-700">
                                      Range
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                      <input
                                        name="rangeMin"
                                        type="number"
                                        placeholder="Min"
                                        className="block w-full p-2 border border-gray-300 rounded"
                                        value={formData.rangeMin}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            rangeMin: e.target.value,
                                          })
                                        }
                                      />
                                      <input
                                        name="rangeMax"
                                        type="number"
                                        placeholder="Max"
                                        className="block w-full p-2 border border-gray-300 rounded"
                                        value={formData.rangeMax}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            rangeMax: e.target.value,
                                          })
                                        }
                                      />
                                    </div>

                                    <div className="mt-2 space-y-2">
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          className="form-checkbox"
                                          checked={formData.rangeAbnormal}
                                          onChange={(e) =>
                                            setFormData({
                                              ...formData,
                                              rangeAbnormal: e.target.checked,
                                            })
                                          }
                                        />
                                        <span className="ml-2">
                                          Check if the range is abnormal
                                        </span>
                                      </label>
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          className="form-checkbox"
                                          checked={formData.avoidRangeInReport}
                                          onChange={(e) =>
                                            setFormData({
                                              ...formData,
                                              avoidRangeInReport:
                                                e.target.checked,
                                            })
                                          }
                                        />
                                        <span className="ml-2">
                                          Check to avoid this range in report
                                        </span>
                                      </label>
                                    </div>
                                  </div>

                                  {/* Valid Range */}
                                  <div className="mb-4">
                                    <label className="block text-gray-700">
                                      Valid Range
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                      <input
                                        name="validRangeMin"
                                        type="number"
                                        placeholder="Min"
                                        className="block w-full p-2 border border-gray-300 rounded"
                                        value={formData.validRangeMin}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            validRangeMin: e.target.value,
                                          })
                                        }
                                      />
                                      <input
                                        name="validRangeMax"
                                        type="number"
                                        placeholder="Max"
                                        className="block w-full p-2 border border-gray-300 rounded"
                                        value={formData.validRangeMax}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            validRangeMax: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>

                                  {/* Critical Range */}
                                  <div className="mb-4">
                                    <label className="block text-gray-700">
                                      Critical Range
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                      <input
                                        name="criticalRangeLow"
                                        placeholder="Low (<)"
                                        className="block w-full p-2 border border-gray-300 rounded"
                                        value={formData.criticalRangeLow}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            criticalRangeLow: e.target.value,
                                          })
                                        }
                                      />
                                      <input
                                        name="criticalRangeHigh"
                                        placeholder="High (>)"
                                        className="block w-full p-2 border border-gray-300 rounded"
                                        value={formData.criticalRangeHigh}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            criticalRangeHigh: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-center mt-4">
                                <button
                                  type="submit"
                                  className="bg-orange-500 text-white rounded-lg py-2 px-8 hover:bg-orange-600"
                                  onClick={handleAddNormalValues}
                                >
                                  {selectedIndex !== null ? "Update" : "Add"}
                                </button>
                              </div>
                            </form>
                          </div>

                          {/* Display Table */}
                          <div className="border-t border-gray-400 p-4 max-h-96 overflow-auto">
                            <h3 className="text-lg font-semibold">
                              Edited Normal Value List
                            </h3>
                            <table className="min-w-full mt-2">
                              <thead>
                                <tr>
                                  <th className="border px-4 py-2">Type</th>
                                  <th className="border px-4 py-2">
                                    Age (Min)
                                  </th>
                                  <th className="border px-4 py-2">
                                    Age (Max)
                                  </th>
                                  <th className="border px-4 py-2">
                                    Range (Min)
                                  </th>
                                  <th className="border px-4 py-2">
                                    Range (Max)
                                  </th>
                                  <th className="border px-4 py-2">
                                    Range is Abnormal
                                  </th>
                                  <th className="border px-4 py-2">
                                    Avoid Range in Report
                                  </th>
                                  <th className="border px-4 py-2">
                                    Valid Range (Min)
                                  </th>
                                  <th className="border px-4 py-2">
                                    Valid Range (Max)
                                  </th>
                                  <th className="border px-4 py-2">
                                    Critical Range (Low)
                                  </th>
                                  <th className="border px-4 py-2">
                                    Critical Range (High)
                                  </th>
                                  <th className="border px-4 py-2">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {normalValues.map((value, index) => (
                                  <tr key={index}>
                                    <td className="border px-4 py-2">
                                      {value.type}
                                    </td>
                                    <td className="border px-4 py-2">{`${value.ageMinYear}Y ${value.ageMinMonth}M ${value.ageMinDay}D`}</td>
                                    <td className="border px-4 py-2">{`${value.ageMaxYear}Y ${value.ageMaxMonth}M ${value.ageMaxDay}D`}</td>
                                    <td className="border px-4 py-2">
                                      {value.rangeMin}
                                    </td>
                                    <td className="border px-4 py-2">
                                      {value.rangeMax}
                                    </td>
                                    <td className="border px-4 py-2">
                                      {value.rangeAbnormal ? "Yes" : "No"}
                                    </td>
                                    <td className="border px-4 py-2">
                                      {value.avoidRangeInReport ? "Yes" : "No"}
                                    </td>
                                    <td className="border px-4 py-2">
                                      {value.validRangeMin}
                                    </td>
                                    <td className="border px-4 py-2">
                                      {value.validRangeMax}
                                    </td>
                                    <td className="border px-4 py-2">
                                      {value.criticalRangeLow}
                                    </td>
                                    <td className="border px-4 py-2">
                                      {value.criticalRangeHigh}
                                    </td>
                                    <td className="border px-4 py-2 space-x-2">
                                      <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() =>
                                          handleEditNormalValues(index)
                                        }
                                      >
                                        Edit
                                      </button>
                                      <button
                                        className="text-red-500 hover:underline"
                                        onClick={() =>
                                          handleRemoveNormalValues(index)
                                        }
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Footer */}
                          <div className="p-4 bg-gray-200 space-x-2 flex justify-between">
                            <button
                            type="button"  
                              className="bg-gray-500 text-white rounded-lg w-1/2 py-2 hover:bg-gray-600"
                              onClick={handleCloseNormalValue}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="bg-green-500 text-white rounded-lg w-1/2 py-2 hover:bg-green-600"
                              onClick={handleSaveNormalValues}
                            >
                              Submit123
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* AddInvestigation ends */}
                    </div>

                    {/* <div className="">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleShowMandatoryConditions();
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mt-5 w-full"
                      >
                        Add Mandatory Conditions
                      </button>
                      <AddInvestigationResultMandatoryConditions
                        showModal={showMandatoryConditionsModal}
                        handleClose={handleCloseMandatoryConditions}
                        onDataUpdate={handleMandatoryConditionsUpdate}
                      />
                    </div>

                    <div className="">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleShowReflexTests();
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mt-5 w-full"
                      >
                        Add Reflex Tests
                      </button>
                      <AddInvestigationResultReflexTests
                        showModal={showReflexTestsModal}
                        handleClose={handleCloseReflexTests}
                        onDataUpdate={handleReflexTestsUpdate}
                      />
                    </div> */}
                    <div className="col-span-full text-center">
                      <button
                        type="button"
                        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                        onClick={handleAddResult}
                      >
                        Add Result
                      </button>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="col-span-full">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Output Template
                </h2>
                <div className="col-span-full border-b border-gray-300 mb-4"></div>

                <div className="flex items-center mb-4">
                  <input
                    {...register("checkimage")}
                    type="checkbox"
                    id="showImagesSide"
                    className="mr-2"
                    defaultChecked={investigation?.checkimage || false}
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
                    defaultValue={investigation?.template || ""}
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
                    {...register("checkoutsrc")}
                    type="checkbox"
                    id="checkoutsrc"
                    className="mr-2"
                    defaultChecked={investigation?.checkoutsrc || false}
                  />
                  <label
                    htmlFor="checkoutsrc"
                    className="text-sm text-gray-700"
                  >
                    Check if this is an outsourced test
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <h2 className="font-bold ">General Information</h2>
              <div className="col-span-full border-b mb-4 border-gray-300"></div>

              <div className="col-span-full grid grid-cols-4 items-start gap-4 mb-4">
                {/* TAT (Turnaround Time) */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TAT (Turnaround Time)<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-0">
                    <input
                      {...register("tat")}
                      type="number"
                      placeholder="Enter value"
                      className="w-1/2 border px-3 py-2 rounded"
                    />
                    <select
                      {...register("tatunit")}
                      className="w-1/2 border px-3 py-2 rounded"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    STAT
                  </label>
                  <div className="flex gap-0">
                    <input
                      {...register("stat")}
                      type="number"
                      placeholder="Enter value"
                      className="w-1/2 border px-3 py-2 rounded"
                    />
                    <select
                      {...register("statunit")}
                      className="w-1/2 border px-3 py-2 rounded"
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

            {/* Embed the InvestigationDetails component */}
            {/* <InvestigationDetails /> */}
            {/* <InvestigationDetails
  investigationData={investigationData}
  handleEditAccreditation={handleEditAccreditation}
  handleRemoveAccreditation={handleRemoveAccreditation}
/> */}

            <div className="p-6 grid gap-6">
              {/* Accreditation Section */}
              <div className="col-span-full">
                <h3 className="font-bold mb-2">Add Accreditation</h3>
                <table className="mb-4 w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-orange-600">Name</th>
                      <th className="border px-2 py-1 text-orange-600">Date</th>
                      <th className="border px-2 py-1" colSpan="2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.accreditation.map((item, index) => (
                      <tr key={index} className="text-sm hover:bg-gray-50">
                        <td className="border px-2 py-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleEditChange(
                                e,
                                index,
                                "name",
                                "accreditation"
                              )
                            }
                            className="w-full border px-2 py-1"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="date"
                            value={item.date.split("T")[0] || ""}
                            onChange={(e) =>
                              handleEditChange(
                                e,
                                index,
                                "date",
                                "accreditation"
                              )
                            }
                            className="w-full border px-2 py-1"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleRemove("accreditation", index)}
                          >
                            Remove
                          </button>
                        </td>
                        <td className="border px-2 py-1">
                          {/* Optional extra actions */}
                        </td>
                      </tr>
                    ))}

                    {/* Form row to add new accreditation */}
                    {renderFormFields("accreditation")}
                  </tbody>
                </table>
              </div>

              {/* Consumables Section */}
              <div className="col-span-full">
                <h3 className="font-bold mb-2">Add Consumables</h3>
                <table className="mb-4 w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-orange-600">
                        Product
                      </th>
                      <th className="border px-2 py-1 text-orange-600">Qty</th>
                      <th className="border px-2 py-1" colSpan="2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderFormFields("consumable")}
                    {renderRows("consumable")}
                  </tbody>
                </table>
              </div>

              {/* Lab Consumables Section */}
              <div className="col-span-full">
                <h3 className="font-bold mb-2">Lab Consumables</h3>
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-orange-600">
                        Product
                      </th>
                      <th className="border px-2 py-1 text-orange-600">Qty</th>
                      <th className="border px-2 py-1" colSpan="2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderFormFields("labConsumable")}
                    {renderRows("labConsumable")}
                  </tbody>
                </table>
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
                  value={instruction || investigation?.instruction || ""}
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
                  value={interpretation || investigation?.interpretation || ""}
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
                  value={remark || investigation?.remark || ""}
                  onChange={setRemarks}
                  theme="snow"
                  className="mt-2 bg-white"
                  modules={modules}
                  formats={formats}
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
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
              >
                {isSubmitting ? "Updating..." : "Update Investigation"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default UpdateInvestigation;
