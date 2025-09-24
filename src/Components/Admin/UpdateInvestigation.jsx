import { useEffect, useState } from "react"; 
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import InvestigationDetails from './InvestigationDetails';
// import AddInvestigationResult from './AddInvestigationResult';
import UpdateInvestigationResult from './UpdateInvestigationResult';
import { 
  updateInvestigation, 
  viewInvestigation,
  viewDepartments, 
  viewSubDepartments, 
  viewRoles, 
  viewSpecimenTypes, 
  viewInstruments 
} from "../../services/apiService";

const UpdateInvestigation = () => {
    const [departments, setDepartments] = useState([]);
    const [subDepartments, setSubDepartments] = useState([]);
    const [roleTypes, setRoleTypes] = useState([]);
    const [specimens, setSpecimens] = useState([]);
    const [instruments, setInstruments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [investigation, setInvestigation] = useState(null);
    const [loading, setLoading] = useState(true);

    const [results, setResults] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm();

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dept, subDept, role, spec, instruments] = await Promise.all([
                    viewDepartments(),
                    viewSubDepartments(),
                    viewRoles(),
                    viewSpecimenTypes(),
                    viewInstruments(),
                ]);
                
                setDepartments((dept?.data || dept || []).filter((d) => d.isactive));
                setSubDepartments((subDept?.data || subDept || []).filter((d) => d.isactive));
                setRoleTypes((role?.data || role || []).filter((r) => r.isactive));
                setSpecimens((spec || []).filter((s) => s.isactive));
                setInstruments((instruments?.data || instruments || []).filter((i) => i.isactive));
            } catch (err) {
                toast.error("❌ Failed to load master data");
                console.error(err);
            }
        };

        fetchData();
    }, []);

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
                setResults(data.results || []);
                
                // Populate the form with the investigation data
                reset({
                    loniccode: data.loniccode || "",
                    cptcode: data.cptcode || "",
                    testname: data.testname || "",
                    testcategory: data.testcategory || "",
                    shortname: data.shortname || "",
                    shortcode: data.shortcode || "",
                    department: data.department || "",
                    subdepartment: data.subdepartment || "",
                    roletype: data.roletype || "",
                    reporttype: data.reporttype || "",
                    sampletype: data.sampletype || "",
                    sampleqty: data.sampleqty || "",
                    sampletemp: data.sampletemp || "",
                    testmethod: data.testmethod || "",
                    instrumenttype: data.instrumenttype || "",
                    description: data.description || "",
                    sac: data.sac || "",
                    order: data.order || "",
                    derivedtest: data.derivedtest || "",
                    extranaltest: data.extranaltest || "",
                    containertype: data.containertype || "",
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
                    walkinprice: data.walkinprice || "",
                    b2bprice: data.b2bprice || "",
                    ppprice: data.ppprice || "",
                    govtprice: data.govtprice || "",
                    normalprice: data.normalprice || "",
                    checkimage: data.checkimage || false,
                    template: data.template || "",
                    checkoutsrc: data.checkoutsrc || false,
                    barcodelngt: data.barcodelngt || "",
                    barcode: data.barcode || "",
                    spbarcode: data.spbarcode || "",
                    suffbarcode: data.suffbarcode || "",
                    tat: data.tat || "",
                    tatunit: data.tatunit || "",
                    stat: data.stat || "",
                    statunit: data.statunit || "",
                    status: data.status || "Active"
                });

                // Set the rich text editor values
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
    }, [id, reset, navigate]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        const payload = {
            loniccode: data.loniccode || null,
            cptcode: data.cptcode || null,
            testname: data.testname,
            testcategory: data.testcategory,
            shortname: data.shortname || null,
            shortcode: data.shortcode || null,
            department: data.department || null,
            subdepartment: data.subdepartment || null,
            roletype: data.roletype || null,
            reporttype: data.reportType || null,
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
            govtprice: parseFloat(data.govtPrice) || null,
            normalprice: parseFloat(data.normalPrice) || null,
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
        };

        
        try {
            await updateInvestigation(investigation.id, payload);
            toast.success("✅ Investigation updated successfully");
           
            setTimeout(() => {
                reset();
                navigate("/view-investigation");
            }, 2500);
            
        } catch (err) {
            toast.error("❌ Failed to update investigation");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };



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
        const [remark, setRemarks] = useState("");

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
                        <p className="mt-4 text-gray-600">Loading investigation data...</p>
                    </div>
                </div>
            ) : !investigation ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-red-600">Investigation not found</p>
                        <Link to="/view-investigation" className="text-teal-600 hover:text-teal-700 mt-2 inline-block">
                            Back to Investigations
                        </Link>
                    </div>
                </div>
            ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
                    <h4 className="font-semibold text-white">Update Investigation</h4>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">LOINC CODE</label>
                        <input {...register("loniccode")} placeholder="LOINC CODE" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">CPT CODE</label>
                        <input {...register("cptcode")} placeholder="CPT CODE" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div className="col-span-full"></div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Test Name <span className="text-red-500">*</span></label>
                        <input {...register("testname", { required: true })} placeholder="Test Name" className="w-full border px-3 py-2 rounded" />
                        {errors.testname && <p className="text-red-600 text-xs mt-1">Test Name is required</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Test Category<span className="text-red-500">*</span></label>
                        <input {...register("testcategory", { required: true })} placeholder="Test Category" className="w-full border px-3 py-2 rounded" />
                        {errors.testcategory && <p className="text-red-600 text-xs mt-1">Test Category is required</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Short Name</label>
                        <input {...register("shortname")} className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Short Code</label>
                        <input {...register("shortcode")} type="number" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select {...register("department")} className="w-full border px-3 py-2 rounded">
                            <option value={""}>Select Department</option>
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
                            <select {...register("reporttype")} className="w-full border px-3 py-2 rounded">
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
                        <select {...register("sampletype")} className="w-full border px-3 py-2 rounded">
                            <option value="">Select Sample Type</option>
                            {specimens.map((s, i) => (
                                <option key={i} value={s.specimenname}>{s.specimenname}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sample Quantity</label>
                        <input {...register("sampleqty")} type="number" placeholder="Enter quantity" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sample Temperature</label>
                        <input {...register("sampletemp")} type="number" placeholder="Enter temperature" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Test Method</label>
                        <input {...register("testmethod")} placeholder="Test method" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Instrument Type</label>
                        <select {...register("instrumenttype")} className="w-full border px-3 py-2 rounded">
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Derived Test</label>
                        <input {...register("derivedtest")} placeholder="Derived Test" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">External Test ID</label>
                        <input {...register("extranaltest")} placeholder="External Test ID" className="w-full border px-3 py-2 rounded" />
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
                                        {...register("containertype", { required: true })}
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
                                    {...register("containertype", { required: true })}
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
                                    {...register("containertype", { required: true })}
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
                        {errors.containertype && (
                            <p className="text-red-600 text-xs mt-1">Please select a container type or color</p>
                        )}
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
                                {...register(option.id)}
                                className="h-4 w-4 text-teal-600"
                            />
                            <label htmlFor={option.id} className="text-sm font-medium text-gray-700 cursor-pointer">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>


                {/* <AddInvestigationResult setResults={setResults} /> */}
                               {/* <AddInvestigationResult results={results} setResults={setResults} /> */}
               {/* <UpdateInvestigationResult investigationId={investigation.id} results={results} setResults={setResults} /> */}


                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div className="col-span-full">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Test Price</h2>
                            <div className="col-span-full border-b border-gray-300"></div>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Walk-in Price", name: "walkinprice", defaultValue: investigation?.walkinprice || "" },
                            { label: "B2B Price", name: "b2bprice", defaultValue: investigation?.b2bprice || "" },
                            { label: "PPP Price", name: "ppprice", defaultValue: investigation?.ppprice || "" },
                            { label: "Govt. Price", name: "govtprice", defaultValue: investigation?.govtprice || "" },
                            { label: "Normal Price", name: "normalprice", defaultValue: investigation?.normalprice || "" },
                        ].map((price) => (
                            <div key={price.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{price.label}</label>
                                <input
                                    {...register(price.name)}
                                    type="number"
                                    placeholder={`Enter ${price.label}`}
                                    defaultValue={price.defaultValue}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>
                        ))}
                    </div>


                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div className="col-span-full">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Output Template</h2>
                            <div className="col-span-full border-b border-gray-300 mb-4"></div>

                            <div className="flex items-center mb-4">
                                <input 
                                    {...register("checkimage")} 
                                    type="checkbox" 
                                    id="showImagesSide" 
                                    className="mr-2" 
                                    defaultChecked={investigation?.checkimage || false} 
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
                            <h2 className="text-lg font-semibold text-gray-800">Outsourcing Information</h2>
                            <div className="col-span-full border-b border-gray-300 mb-4"></div>

                            <div className="flex items-center">
                                <input 
                                    {...register("checkoutsrc")}  
                                    type="checkbox" 
                                    id="checkoutsrc" 
                                    className="mr-2" 
                                    defaultChecked={investigation?.checkoutsrc || false} 
                                />
                                <label htmlFor="checkoutsrc" className="text-sm text-gray-700">
                                    Check if this is an outsourced test
                                </label>
                            </div>
                        </div>
                    </div>



                    
               




                <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <h2 className="font-bold ">General Information</h2>
                    <div className="col-span-full border-b mb-4 border-gray-300"></div>

                    <div className="col-span-full grid grid-cols-4 items-start gap-4 mb-4">
                        {/* Barcode Length */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">Barcode Length<span className="text-red-500">*</span></label>
                            <input type="number" {...register("barcodelngt")} placeholder="Enter length" className="w-full border px-3 py-2 rounded" />
                        </div>

                        {/* Barcodes */}   
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Barcode <span className="text-red-500">*</span></label>
                            <input {...register("barcode")} type="number" placeholder="Enter Barcode" className="w-full border px-3 py-2 rounded" />
                        </div>

                        {/* Separate Barcodes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Separate Barcode </label>
                            <input {...register("spbarcode")} type="number" placeholder="Enter Separate Barcode" className="w-full border px-3 py-2 rounded" />
                        </div>

                        {/* Suffixed Barcodes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Suffixed Barcode</label>
                            <input
                                {...register("suffbarcode")}
                                placeholder="e.g., -A, -B"
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>

                        {/* TAT (Turnaround Time) */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">TAT (Turnaround Time)<span className="text-red-500">*</span></label>
                            <div className="flex gap-0">
                                <input
                                    {...register("tat")}
                                    type="number"
                                    placeholder="Enter value"
                                    className="w-1/2 border px-3 py-2 rounded"
                                />
                                <select {...register("tatunit")} className="w-1/2 border px-3 py-2 rounded">
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
                                    {...register("stat")}
                                    type="number"
                                    placeholder="Enter value"
                                    className="w-1/2 border px-3 py-2 rounded"
                                />
                                <select {...register("statunit")} className="w-1/2 border px-3 py-2 rounded">
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
                            <select {...register("status")} className="w-full border px-3 py-2 rounded">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                    </div>
                </div>

                  {/* Embed the InvestigationDetails component */}
                 <InvestigationDetails />


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
                    <button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">
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