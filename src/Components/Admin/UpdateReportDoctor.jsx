import { useForm } from "react-hook-form"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AdminContext from "../../context/adminContext";

const UpdateReportDoctor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { reportDoctorToUpdate, setReportDoctorToUpdate } = useContext(AdminContext);

  const [departments, setDepartments] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  // Fetch departments on mount
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://srv913743.hstgr.cloud:2000/lims/master/get-department",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setDepartments(response.data.filter((d) => d.isActive));
      } catch (error) {
        toast.error("❌ Failed to fetch departments.");
      }
    };

    fetchDepartments();
  }, []);

  // Prefill form when reportDoctorToUpdate is set
  useEffect(() => {
    if (reportDoctorToUpdate) {
      reset({
        doctorName: reportDoctorToUpdate.doctorName || "",
        gender: reportDoctorToUpdate.gender || "",
        dob: reportDoctorToUpdate.dob ? reportDoctorToUpdate.dob.slice(0, 10) : "", // format YYYY-MM-DD
        phoneNo: reportDoctorToUpdate.phoneNo || "",
        addressLine1: reportDoctorToUpdate.addressLine1 || "",
        city: reportDoctorToUpdate.city || "",
        state: reportDoctorToUpdate.state || "",
        pin: reportDoctorToUpdate.pin || "",
        email: reportDoctorToUpdate.email || "",
        aptNo: reportDoctorToUpdate.aptNo || "",
        department: reportDoctorToUpdate.department || "", 
        medicalRegNo: reportDoctorToUpdate.medicalRegNo || "",
        isactive: String(reportDoctorToUpdate.isactive ?? "true"),
        digitalSignature: reportDoctorToUpdate.digitalSignature || "",
      });
    } else {
      toast.error("Report doctor data not found.");
      navigate("/view-report-doctor");
    }
  }, [reportDoctorToUpdate, reset, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);



    const payload = {
      doctorName: data.doctorName,
      gender: data.gender,
      dob: data.dob,
      phoneNo: data.phoneNo,
      addressLine1: data.addressLine1,
      city: data.city,
      state: data.state,
      pin: Number(data.pin),
      email: data.email,
      aptNo: data.aptNo,
      department: data.department,
      medicalRegNo: data.medicalRegNo,
      isactive: data.isactive === "true",
      digitalSignature: data.digitalSignature,
    };

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.put(
        `http://srv913743.hstgr.cloud:2000/lims/master/update-reportdoctor/${reportDoctorToUpdate?.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success("Report Doctor updated successfully!");
      setTimeout(() => {
        setReportDoctorToUpdate(null);
        navigate("/view-report-doctor");
      }, 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const fields = [
    {
      name: "doctorName",
      label: "Doctor Name",
      placeholder: "Enter Doctor Name",
      validation: { required: "Doctor name is required" },
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      validation: { required: "Date of birth is required" },
    },
    {
      name: "department",
      label: "Department",
      type: "select",
      options: departments.map((dept) => ({
        value: dept.dptName || dept.id, 
        label: dept.dptName || dept.id,
      })),
      validation: { required: "Department is required" },
    },
    
    {
      name: "phoneNo",
      label: "Phone Number",
      type: "number",
      placeholder: "Enter Phone Number",
      validation: {
        required: "Phone number is required",
        pattern: { value: /^\d{10}$/, message: "Must be 10 digits" },
      },
    },
    {
      name: "addressLine1",
      label: "Address Line 1",
      placeholder: "Enter Address",
      validation: { required: "Address is required" },
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter City",
      validation: { required: "City is required" },
    },
    {
      name: "state",
      label: "State",
      placeholder: "Enter State",
      validation: { required: "State is required" },
    },
    {
      name: "pin",
      label: "PIN Code",
      type: "number",
      placeholder: "Enter PIN Code",
      validation: {
        required: "PIN code is required",
        pattern: {
          value: /^\d{6}$/,
          message: "PIN code must be 6 digits",
        },
      },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter Email",
      validation: {
        required: "Email is required",
        pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
      },
    },
    {
      name: "aptNo",
      label: "Apartment No",
      placeholder: "Enter Apartment No",
      validation: { required: "Apartment number is required" },
    },
    {
      name: "medicalRegNo",
      label: "Medical Registration No",
      placeholder: "Enter Medical Registration No",
      validation: { required: "Medical registration number is required" },
    },
    {
      name: "digitalSignature",
      label: "Digital Signature URL",
      placeholder: "Enter Digital Signature URL",
      validation: {
        required: "Digital signature URL is required",
        pattern: {
          value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg))$/i,
          message: "Enter a valid image URL",
        },
      },
    },
    {
      name: "gender",
      label: "Gender",
      type: "radio",
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
      ],
      validation: { required: "Gender is required" },
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      validation: { required: "Status is required" },
    },
  ];

  return (
    <>
      <ToastContainer />
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center text-sm font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/view-report-doctor" className="text-gray-700 hover:text-teal-600">
                Report Doctor
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Report Doctor</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-2 space-y-4 text-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-xl border border-gray-200">
          <div className="border-b px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Report Doctor</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(({ name, label, placeholder, type = "text", options, validation }) => (
                <div key={name}>
                  <label className="block mb-1 font-medium text-gray-700">{label}</label>
                  {type === "select" ? (
                    <select
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                      } focus:ring-2 transition`}
                      defaultValue={reportDoctorToUpdate ? reportDoctorToUpdate[name] || "" : ""}
                    >
                      <option value="">Select {label}</option>
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value} selected={ opt.value ===opt.value ? true : false} >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : type === "radio" ? (
                    <div className="flex gap-4">
                      {options.map(({ value, label: radioLabel }) => (
                        <label key={value} className="inline-flex items-center space-x-2">
                          <input
                            type="radio"
                            value={value}
                            {...register(name, validation)}
                            onBlur={() => trigger(name)}
                            defaultChecked={reportDoctorToUpdate && reportDoctorToUpdate[name] === value}
                            className="form-radio text-teal-600"
                          />
                          <span>{radioLabel}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={type}
                      {...register(name, validation)}
                      onBlur={() => trigger(name)}
                      placeholder={placeholder}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"
                      } focus:ring-2 transition`}
                      defaultValue={reportDoctorToUpdate ? reportDoctorToUpdate[name] || "" : ""}
                    />
                  )}
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                </div>
              ))}
            </div>

            <div className="px-6 py-4  flex justify-end gap-4">
              <button
                type="button"
                className="btn-cancel px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                onClick={() => navigate("/view-report-doctor")}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-submit px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>  

            
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateReportDoctor;
