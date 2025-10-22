import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import AdminContext from "../../context/adminContext";
import {
  updateDepartment,
  viewDepartment,
  viewDepartments,
} from "../../services/apiService";

const UpdateDept = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const { departmentToUpdate, setDepartmentToUpdate } =
    useContext(AdminContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
  } = useForm({
    mode: "onChange", // real-time validation
    defaultValues: {
      dptname: "",
      isactive: "true",
    },
  });

  // Fetch department data + all departments
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("No department ID provided");
        navigate("/view-departments");
        return;
      }

      setIsLoading(true);
      try {
        const departmentData = await viewDepartment(id);
        const allDepartments = await viewDepartments();

        setDepartments(allDepartments || []);
        setDepartmentToUpdate(departmentData);

        reset({
          dptname: departmentData.dptname || "",
          isactive: String(departmentData.isactive),
        });
      } catch (error) {
        console.error("Failed to fetch department data:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to fetch department data. Please try again."
        );
        navigate("/view-departments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, setDepartmentToUpdate, reset, navigate]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      // Trim department name to avoid leading/trailing spaces
      const payload = {
        dptname: data.dptname.trim(),
        isactive: data.isactive === "true", // convert string to boolean
      };

      // Call your API function
      const response = await updateDepartment(id, payload);

      // ✅ Show toast first, then navigate after 1 second
      toast.success("Department updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        // Clear the form state
        setDepartmentToUpdate(null);

        // Navigate back to department list
        navigate("/view-departments");
      }, 1000);

    } catch (error) {
      console.error("Update Department Error:", error);

      // Show detailed error if available
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "❌ Failed to update department. Please try again.";

      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Loading department data...</p>
      </div>
    );
  }

  if (!departmentToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Department not found.</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg"
          aria-label="Breadcrumb"
        >
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
                to="/view-departments"
                className="text-gray-700 hover:text-teal-600"
              >
                Department
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Department</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl border border-gray-200"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Department</h4>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("dptname", {
                    required: "Department name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                    maxLength: { value: 50, message: "Maximum 50 characters" },
                    validate: (value) => {
                      const cleaned = value.trim();
                      if (!cleaned) return "Department name cannot be empty";

                      // ✅ Allow only letters and single spaces
                      if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(cleaned))
                        return "Only letters and single spaces are allowed";

                      // Duplicate check
                      if (Array.isArray(departments)) {
                        const duplicate = departments.find(
                          (dept) =>
                            dept.dptname.trim().toLowerCase() ===
                              cleaned.toLowerCase() &&
                            String(dept._id) !== String(id)
                        );
                        if (duplicate)
                          return "This department name already exists";
                      }

                      return true;
                    },
                  })}
                  placeholder="Enter Department Name"
                  onChange={(e) => {
                    // ✅ Allow only letters and spaces in real-time
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                    trigger("dptname");
                  }}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.dptname ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
                />

                {errors.dptname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dptname.message}
                  </p>
                )}
              </div>

              {/* Is Active */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Is Active? <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 pt-2">
                  {["true", "false"].map((val) => (
                    <label key={val} className="inline-flex items-center">
                      <input
                        type="radio"
                        {...register("isactive", {
                          required: "This field is required",
                        })}
                        value={val}
                        className="h-4 w-4 text-teal-600"
                      />
                      <span className="ml-2 capitalize">{val}</span>
                    </label>
                  ))}
                </div>
                {errors.isactive && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.isactive.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  navigate("/view-departments");
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Update Department
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateDept;
