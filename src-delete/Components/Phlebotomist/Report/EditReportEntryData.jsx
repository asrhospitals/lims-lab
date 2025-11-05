import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditReportEntryData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedItem = location.state?.reportItem; // Get data from navigate

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(true);
  const [filePreview, setFilePreview] = useState(""); // For previous file preview
  const [selectedFile, setSelectedFile] = useState(null); // For new uploaded file

  // 🔹 Load data into form
  useEffect(() => {
    if (passedItem) {
      console.log("passedItem==", passedItem);

      setValue("patientName", passedItem.patientname || "");
      setValue("patientCode", passedItem.patientcode || "");
      setValue("hospitalName", passedItem.hospitalname || "");
      setValue("barcode", passedItem.tests[0].pbarcode || "");
      setValue(
        "testname",
        passedItem.patientTests[0].investigation.testname || ""
      );
      setValue(
        "testmethod",
        passedItem.patientTests[0].investigation.testmethod || ""
      );
      setValue(
        "departmentName",
        passedItem.patientTests[0].investigation.department.dptname || ""
      );
      setValue(
        "units",
        passedItem.patientTests[0].investigation.results[0].unit || ""
      );
      setValue(
        "sampletype",
        passedItem.patientTests[0].investigation.results[0].sampletype || ""
      );
      setValue("dateofregistration", passedItem.dateofregistration || "");
      setValue(
        "test_collection",
        passedItem.patientTests[0].investigation.test_collection || ""
      );
      setValue("test_result", passedItem.patientTests[0].test_result || "");
      setValue("test_id", passedItem.patientTests[0].test_id || "");

      // Set previous file preview
      setFilePreview(passedItem.tests[0].attatchfile || "");

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [passedItem, setValue]);

  // 🔹 Handle new file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      let imageBase64 = "";
      if (selectedFile) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = (error) => reject(error);
        });
      }
  
      const payload = {
        test_result: data.test_result || "",
        test_image: selectedFile ? selectedFile.name : "", // just name, not Base64
        h_l_flag: "N",
        units: data.units || "",
        reference_range: data.reference_range || "1-200",
        critical_range: data.critical_range || "",
        method: data.testmethod?.slice(0, 255) || "", // truncate if too long
        sample_type: data.sampletype?.slice(0, 255) || "",
        test_id: data.test_id || "",
      };
      
      const authToken = localStorage.getItem("authToken");
  
      const response = await fetch(
        `https://asrphleb.asrhospitalindia.in/api/v1/phleb/report/report-entry/${data.test_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update report");
      }
  
      toast.success("Report updated successfully!");
      navigate("/patient-report-entry");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Something went wrong!");
    }
  };
  
  if (isLoading) {
    return <p className="text-center py-10">Loading report data...</p>;
  }

  return (
    <>
      <ToastContainer />

      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl border border-gray-200"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Report Entry</h4>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Patient ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Patient ID
                </label>
                <input
                  type="text"
                  {...register("patientCode")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  disabled
                />
              </div>

              {/* Patient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Patient Name
                </label>
                <input
                  type="text"
                  {...register("patientName")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  disabled
                />
              </div>

              {/* Hospital */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hospital
                </label>
                <input
                  type="text"
                  {...register("hospitalName")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  disabled
                />
              </div>

              {/* Barcode */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Barcode
                </label>
                <input
                  type="text"
                  {...register("barcode")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  disabled
                />
              </div>
            </div>

            {/* Test & Investigation fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Test Name
                </label>
                <input
                  type="text"
                  {...register("testname")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department Name
                </label>
                <input
                  type="text"
                  {...register("departmentName")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Units
                </label>
                <input
                  type="text"
                  {...register("units")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sample Type
                </label>
                <input
                  type="text"
                  {...register("sampletype")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Registration
                </label>
                <input
                  type="text"
                  {...register("dateofregistration")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  disabled
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Attatchfile
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  accept="image/*,.pdf,.doc,.docx"
                />
                {filePreview && (
                  <div className="mt-2">
                    {/\.(pdf|doc|docx)$/i.test(filePreview) ? (
                      <a
                        href={filePreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Previous File
                      </a>
                    ) : (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover border mt-2 rounded"
                      />
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Test Collection
                </label>
                <input
                  type="text"
                  {...register("test_collection")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Test Method
                </label>
                <input
                  type="text"
                  {...register("testmethod")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Test Result
                </label>
                <input
                  type="text"
                  {...register("test_result")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Test Id
                </label>
                <input
                  type="text"
                  {...register("test_id")}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/edit-report-entry")}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Update Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditReportEntryData;
