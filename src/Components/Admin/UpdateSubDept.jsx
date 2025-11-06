import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  updateSubDepartment,
  viewAllDepartmentDetails,
  viewSubDepartment,
  viewSubDepartments,
} from "../../services/apiService";

const UpdateSubDpt = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [allSubDepartments, setAllSubDepartments] = useState([]);
  const [subDptToUpdate, setSubDptToUpdate] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      dptname: "",
      subdptname: "",
      isactive: "true",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("No sub-department ID provided");
        navigate("/view-subDpt");
        return;
      }

      setIsLoading(true);
      try {
        const [departmentsResponse, subDeptResponse, subDeptsResponse] =
          await Promise.all([
            viewAllDepartmentDetails(),
            viewSubDepartment(id),
            viewSubDepartments(),
          ]);

        // Normalize departments for dropdown
        const deptList = Array.isArray(departmentsResponse?.data)
          ? departmentsResponse.data
          : Array.isArray(departmentsResponse)
          ? departmentsResponse
          : [];
        setDepartments(deptList);

        const allSubs = Array.isArray(subDeptsResponse?.data)
          ? subDeptsResponse.data
          : Array.isArray(subDeptsResponse)
          ? subDeptsResponse
          : [];
        setAllSubDepartments(allSubs);

        setSubDptToUpdate(subDeptResponse);

        reset({
          dptname: subDeptResponse.department_id || "",
          subdptname: subDeptResponse.subdptname || "",
          isactive: String(subDeptResponse.isactive),
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to fetch sub-department data. Please try again."
        );
        navigate("/view-subDpt");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    if (!id) return;
    setIsSubmitting(true);

    try {
      await updateSubDepartment(id, {
        department_id: parseInt(data.dptname),
        subdptname: data.subdptname.trim(),
        isactive: data.isactive === "true",
      });

      toast.success(" Sub-department updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/view-subDpt");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to update sub-department. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Loading sub-department data...</p>
      </div>
    );
  }

  if (!subDptToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Sub-department not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600"
              >
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-subDpt"
                className="text-gray-700 hover:text-teal-600"
              >
                Sub Department
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Update Sub Department
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 mt-20">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Sub-Department</h4>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Department Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("dptname", {
                    required: "Department is required",
                  })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.dptname ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.dptname}
                    </option>
                  ))}
                </select>
                {errors.dptname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dptname.message}
                  </p>
                )}
              </div>

              {/* Sub-Department Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sub Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("subdptname", {
                    required: "Sub-department name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                    maxLength: { value: 50, message: "Maximum 50 characters" },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only letters and spaces are allowed",
                    },
                    validate: (value) => {
                      const cleaned = value.trim();
                      const duplicate = allSubDepartments.find(
                        (sub) =>
                          sub.subdptname.toLowerCase() ===
                            cleaned.toLowerCase() &&
                          sub.id !== subDptToUpdate.id
                      );
                      return duplicate
                        ? "This sub-department already exists"
                        : true;
                    },
                  })}
                  placeholder="Enter Sub-Department Name"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.subdptname ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  }}
                />
                {errors.subdptname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subdptname.message}
                  </p>
                )}
              </div>

              {/* Is Active */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Is Active? <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6 pt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("isactive", {
                        required: "This field is required",
                      })}
                      value="true"
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("isactive", {
                        required: "This field is required",
                      })}
                      value="false"
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {errors.isactive && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.isactive.message}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  navigate("/view-subDpt");
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update Sub-Department"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateSubDpt;
