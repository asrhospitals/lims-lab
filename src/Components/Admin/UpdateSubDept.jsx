import { useContext, useEffect, useState } from "react"; 
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AdminContext from "../../context/adminContext";
import { useNavigate, Link } from "react-router-dom";

const UpdateSubDpt = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [ setFetchError] = useState(null);
  const { subDptToUpdate, setsubDptToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      dptname: "",
      subdptname: "",
      isactive: "true",
    },
  });

  // Watch dptname value for controlled select
  const selectedDptName = watch("dptname");

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://asrlabs.asrhospitalindia.in/lims/master/get-department",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setDepartments(response.data || []);
      } catch (error) {
        setFetchError(
          error.response?.data?.message || "Failed to fetch departments."
        );
      }
    };

    fetchDepartments();
  }, []);

  // Set form default values from subDptToUpdate or localStorage
  useEffect(() => {
    if (!subDptToUpdate) {
      const stored = localStorage.getItem("subDptToUpdate");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setsubDptToUpdate(parsed);
          reset({
            dptname: parsed.dptname || "",
            subdptname: parsed.subdptname || "",
            isactive: String(parsed.isactive),
          });
        } catch (err) {
          console.error("Failed to parse sub-department from localStorage", err);
        }
      }
    } else {
      reset({
        dptname: subDptToUpdate.dptname || "",
        subdptname: subDptToUpdate.subdptname || "",
        isactive: String(subDptToUpdate.isactive),
      });
    }
  }, [subDptToUpdate, reset, setsubDptToUpdate]);

  const onSubmit = async (data) => {
    if (!subDptToUpdate?.id) return;
    setIsSubmitting(true);

    try {
      const authToken = localStorage.getItem("authToken");

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-subdepartment/${subDptToUpdate.id}`,
        {
          ...data,
          isactive: data.isactive === "true",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      toast.success("✅ Sub-department updated successfully!");
      setsubDptToUpdate(null);
      localStorage.removeItem("subDptToUpdate");
      navigate("/view-subdpt");
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

  if (!subDptToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No sub-department selected for update.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  value={selectedDptName || ""}
                  onChange={(e) => {
                    // Manually trigger react-hook-form change event
                    // NOTE: normally no need if using {...register()}
                    const event = e;
                    register("dptname").onChange(event);
                  }}
                  onBlur={() => trigger("dptname")}
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept.dptname}>
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
                  Sub-Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("subdptname", {
                    required: "Sub-department name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                    maxLength: { value: 50, message: "Maximum 50 characters" },
                    pattern: {
                      value: /^[A-Za-z0-9-_ ]+$/,
                      message:
                        "Only letters, numbers, hyphens, and underscores allowed",
                    },
                  })}
                  onBlur={() => trigger("subdptname")}
                  placeholder="Enter Sub-Department Name"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.subdptname ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-teal-500`}
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
                  setsubDptToUpdate(null);
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
