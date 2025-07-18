import { useEffect, useState, useContext } from "react"; 
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";

const UpdateInvestigation = () => {
  const { investigationToUpdate, setInvestigationToUpdate } = useContext(AdminContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nodalCenters, setNodalCenters] = useState([]);
  const [roleTypes, setRoleTypes] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      department: "",
      subdepartment: "",
      testname: "",
      aliasname: "",
      testcode: "",
      shortcode: "",
      roletype: "",
      sequesncecode: "",
      reporttype: "",
      mesuringunit: "",
      refrange: "",
      tat: "",
      techtat: "",
      specimentyepe: "",
      volume: "",
      tubecolor: "",
      testcategory: "",
      testcollectioncenter: "",
      processingcenter: "",
      samplecollection: "",
      reportprint: "",
      allowselecttestcode: true,
      reportattachment: true,
      printinreport: true,
      uploadimage: true,
      isactive: true,
      addbarcode: true,
      accredationname: "",
      accredationdate: "",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("investigationToUpdate");

    if (!investigationToUpdate && stored) {
      try {
        const parsed = JSON.parse(stored);
        setInvestigationToUpdate(parsed);
      } catch {
        console.error("Invalid investigationToUpdate in localStorage");
      }
    } else if (investigationToUpdate) {
      reset({
        department: investigationToUpdate.department || "",
        subdepartment: investigationToUpdate.subdepartment || "",
        testname: investigationToUpdate.testname || "",
        aliasname: investigationToUpdate.aliasname || "",
        testcode: investigationToUpdate.testcode || "",
        shortcode: investigationToUpdate.shortcode || "",
        roletype: investigationToUpdate.roletype || "",
        sequesncecode: investigationToUpdate.sequesncecode || "",
        reporttype: investigationToUpdate.reporttype || "",
        mesuringunit: investigationToUpdate.mesuringunit || "",
        refrange: investigationToUpdate.refrange || "",
        tat: investigationToUpdate.tat || "",
        techtat: investigationToUpdate.techtat || "",
        specimentyepe: investigationToUpdate.specimentyepe || "",
        volume: investigationToUpdate.volume || "",
        tubecolor: investigationToUpdate.tubecolor || "",
        testcategory: investigationToUpdate.testcategory || "",
        testcollectioncenter: investigationToUpdate.testcollectioncenter || "",
        processingcenter: investigationToUpdate.processingcenter || "",
        samplecollection: investigationToUpdate.samplecollection || "",
        reportprint: investigationToUpdate.reportprint || "",
        allowselecttestcode: investigationToUpdate.allowselecttestcode ?? true,
        reportattachment: investigationToUpdate.reportattachment ?? true,
        printinreport: investigationToUpdate.printinreport ?? true,
        uploadimage: investigationToUpdate.uploadimage ?? true,
        isactive: String(investigationToUpdate.isactive ?? true),
        addbarcode: investigationToUpdate.addbarcode ?? true,
        accredationname: investigationToUpdate.accredationname || "",
        accredationdate: investigationToUpdate.accredationdate || "",
      });
    }
  }, [investigationToUpdate, reset, setInvestigationToUpdate]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    const fetchData = async () => {
      try {
        const [nodalRes, roleRes, instrRes] = await Promise.all([
          axios.get("http://srv913743.hstgr.cloud:2000/lims/master/get-nodal", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get("http://srv913743.hstgr.cloud:2000/lims/master/get-role", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get("http://srv913743.hstgr.cloud:2000/lims/master/get-instrument", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        setNodalCenters(nodalRes.data || []);
        setRoleTypes(roleRes.data.filter((r) => r.isactive));
        setInstruments(instrRes.data.filter((i) => i.isactive));
      } catch (error) {
        toast.error("❌ Failed to fetch master data.");
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    if (!investigationToUpdate?.investigation_id) {
      toast.error("❌ Investigation ID not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const payload = {
        department: data.department,
        subdepartment: data.subdepartment,
        testname: data.testname,
        aliasname: data.aliasname,
        testcode: Number(data.testcode),
        shortcode: Number(data.shortcode),
        roletype: data.roletype,
        sequesncecode: data.sequesncecode,
        reporttype: data.reporttype,
        mesuringunit: data.mesuringunit,
        refrange: data.refrange,
        tat: data.tat,
        techtat: data.techtat,
        specimentyepe: data.specimentyepe,
        volume: data.volume,
        tubecolor: data.tubecolor,
        hospitaltype: ["DH", "CHC", "PHC"], // Example, adjust as needed
        testcategory: data.testcategory,
        testcollectioncenter: data.testcollectioncenter,
        processingcenter: data.processingcenter,
        samplecollection: data.samplecollection,
        reportprint: data.reportprint,
        allowselecttestcode: data.allowselecttestcode,
        reportattachment: data.reportattachment,
        printinreport: data.printinreport,
        uploadimage: data.uploadimage,
        isactive: data.isactive === "true",
        addbarcode: data.addbarcode,
        accredationname: data.accredationname,
        accredationdate: data.accredationdate,
      };

      await axios.put(
        `http://srv913743.hstgr.cloud:2000/lims/master/update-test/${investigationToUpdate.investigation_id}`,
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("Investigation updated successfully!", { autoClose: 2000 });

      setTimeout(() => {
        setInvestigationToUpdate(null);
        localStorage.removeItem("investigationToUpdate");
        navigate("/view-investigation");
      }, 2000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to update investigation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!investigationToUpdate) {
    return <div className="text-center py-10 text-gray-500">No investigation selected for update.</div>;
  }

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-semivold font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li><Link to="/" className="text-gray-700 hover:text-teal-600">🏠︎ Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/view-investigation" className="text-gray-700 hover:text-teal-600">Investigation</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Investigation</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Investigation</h4>
        </div>

        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Investigation Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Investigation Name</label>
                <input
                type="text"
                {...register("testname", { required: "Investigation Name is required" })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
                />
            </div>

            {/* Alias Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Alias Name</label>
                <input
                type="text"
                {...register("aliasname")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Test Code */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Test Code</label>
                <input
                type="number"
                {...register("testcode")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Short Code */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Short Code</label>
                <input
                type="number"
                {...register("shortcode")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Role Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Role Type</label>
                <input
                type="text"
                {...register("roletype")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Sequence Code */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Sequence Code</label>
                <input
                type="text"
                {...register("sequesncecode")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Report Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Report Type</label>
                <input
                type="text"
                {...register("reporttype")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Measuring Unit */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Measuring Unit</label>
                <input
                type="text"
                {...register("mesuringunit")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Reference Range */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Reference Range</label>
                <input
                type="text"
                {...register("refrange")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* TAT */}
            <div>
                <label className="block text-sm font-medium text-gray-700">TAT</label>
                <input
                type="text"
                {...register("tat")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Tech TAT */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Technical TAT</label>
                <input
                type="text"
                {...register("techtat")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Specimen Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Specimen Type</label>
                <input
                type="text"
                {...register("specimentyepe")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Volume */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Volume</label>
                <input
                type="text"
                {...register("volume")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Tube Color */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Tube Color</label>
                <input
                type="text"
                {...register("tubecolor")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Hospital Type - Multi-select or checkboxes */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Hospital Type</label>
                {["DH", "CHC", "PHC"].map((type) => (
                <label key={type} className="block">
                    <input
                    type="checkbox"
                    value={type}
                    {...register("hospitaltype")}
                    className="mr-2"
                    />
                    {type}
                </label>
                ))}
            </div>

            {/* Test Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Test Category</label>
                <input
                type="text"
                {...register("testcategory")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Test Collection Center */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Test Collection Center</label>
                <select {...register("testcollectioncenter")} className="w-full px-4 py-2 rounded-lg border border-gray-300">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                </select>
            </div>

            {/* Processing Center */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Processing Center</label>
                <input
                type="text"
                {...register("processingcenter")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Sample Collection */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Sample Collection</label>
                <input
                type="text"
                {...register("samplecollection")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Report Print */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Report Print</label>
                <input
                type="text"
                {...register("reportprint")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Boolean Fields - Checkboxes */}
            {[
                { label: "Allow Select Test Code", key: "allowselecttestcode" },
                { label: "Report Attachment", key: "reportattachment" },
                { label: "Print In Report", key: "printinreport" },
                { label: "Upload Image", key: "uploadimage" },
                { label: "Is Active", key: "isactive" },
                { label: "Add Barcode", key: "addbarcode" },
            ].map(({ label, key }) => (
                <div key={key}>
                <label className="inline-flex items-center mt-2">
                    <input type="checkbox" {...register(key)} className="form-checkbox h-5 w-5 text-teal-600" />
                    <span className="ml-2 text-gray-700">{label}</span>
                </label>
                </div>
            ))}

            {/* Accreditation Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Accreditation Name</label>
                <input
                type="text"
                {...register("accredationname")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            {/* Accreditation Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Accreditation Date</label>
                <input
                type="date"
                {...register("accredationdate")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
            </div>

            </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-4">
            <button
            type="button"
            onClick={() => navigate("/view-investigation")}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
            Cancel
            </button>
            <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-60"
            >
            {isSubmitting ? "Updating..." : "Update Investigation"}
            </button>
        </div>
        </form>

      </div>
    </>
  );
};

export default UpdateInvestigation;
