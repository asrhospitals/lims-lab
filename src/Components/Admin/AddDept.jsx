import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { addDepartment, viewDepartments } from "../../services/apiService";
import { FiBell } from "react-icons/fi";

const AddDept = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [notifications, setNotifications] = useState([
    { message: "Department added successfully!", read: false }
  ]);
  const [bellOpen, setBellOpen] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      isactive: "true", // Default selected = True (Active Yes)
    },
  });

  // Load existing departments for duplicate check
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await viewDepartments();
        setDepartments(response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("❌ Failed to fetch departments");
      }
    };
    fetchDepartments();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
<<<<<<< HEAD
=======
      // ✅ Convert all string fields in data to uppercase
      const upperCaseData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          typeof value === "string" ? value.toUpperCase() : value,
        ])
      );

      // ✅ Check for duplicate department (case-insensitive)
>>>>>>> main
      const duplicate = departments.find(
        (dept) => dept.dptname?.toLowerCase() === data.dptname.toLowerCase()
      );

      if (duplicate) {
        toast.error("Department with this name already exists!", {
          position: "top-right",
          autoClose: 4000,
        });
        setIsSubmitting(false);
        return;
      }

<<<<<<< HEAD
      const formattedData = { ...data, isactive: data.isactive === "true" };
      const response = await addDepartment(formattedData);

=======
      // ✅ Prepare data
      const formattedData = { ...upperCaseData, isactive: data.isactive === "true" };

      const response = await addDepartment(formattedData);

      // ✅ Accept both 200 and 201 as success
>>>>>>> main
      if (response.status === 200 || response.status === 201) {
        toast.success("Department added successfully!", {
          position: "top-right",
          autoClose: 2000,
        });

        // Add live notification to bell
        setNotifications([
          ...notifications,
          { message: `Department "${data.dptname}" added!`, read: false },
        ]);

        reset();

        setTimeout(() => {
          navigate("/view-departments");
        }, 2200);
      } else {
        toast.error("Unexpected server response.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to create department. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <ToastContainer />
      {/* Breadcrumb & Notification Bell */}
      <div className="fixed top-[61px] w-full z-10 flex justify-between items-center px-4 py-2 bg-gray-50 border-b shadow-lg">
        <nav className="flex items-center font-medium space-x-1 md:space-x-3 text-sm">
          <li className="list-none">
            <Link to="/" className="text-gray-700 hover:text-teal-600">
              🏠 Home
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="list-none">
            <Link
              to="/view-departments"
              className="text-gray-700 hover:text-teal-600"
            >
              Departments
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-500 list-none">Add Department</li>
        </nav>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setBellOpen(!bellOpen);
              // mark all notifications as read
              setNotifications(
                notifications.map((n) => ({ ...n, read: true }))
              );
            }}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiBell className="text-gray-700 w-5 h-5" />
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="absolute top-0 right-0 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>

          {/* Dropdown notifications */}
          {bellOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-lg z-20 p-2 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-xs text-center">
                  No notifications
                </p>
              ) : (
                notifications
                  .slice()
                  .reverse()
                  .map((n, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded mb-1 ${
                        n.read ? "bg-gray-100" : "bg-teal-50 font-medium"
                      }`}
                    >
                      {n.message}
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="w-full mt-12 px-0 sm:px-2 space-y-4 text-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add New Department</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Department Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("dptname", {
                    required: "Department name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                    maxLength: { value: 50, message: "Maximum 50 characters" },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only letters and spaces are allowed",
                    },
                  })}
                  placeholder="Enter Department Name"
                  className={`w-full px-4 py-2 rounded-lg border ${errors.dptname
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                    } focus:ring-2 transition`}
                  onKeyUp={(e) => {
                    if (/^[A-Za-z\s]+$/.test(e.target.value)) clearErrors("dptname");
                  }}
                  onInput={(e) => {
                    const input = e.target;
                    const cursorPos = input.selectionStart;
                    const cleanedValue = input.value.replace(/[^A-Za-z\s]/g, "");
                    const diff = input.value.length - cleanedValue.length;
                    input.value = cleanedValue;
                    input.setSelectionRange(cursorPos - diff, cursorPos - diff);
                  }}
                />
                {errors.dptname && (
                  <p className="text-red-500 text-xs mt-1">{errors.dptname.message}</p>
                )}
              </div>

              {/* Is Active */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Is Active? <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 pt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="true"
                      {...register("isactive", { required: "Mandatory field." })}
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">True</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="false"
                      {...register("isactive", { required: "Mandatory field." })}
                      className="h-4 w-4 text-teal-600"
                    />
                    <span className="ml-2">False</span>
                  </label>
                </div>
                {errors.isactive && (
                  <p className="text-red-500 text-xs mt-1">{errors.isactive.message}</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => reset()}
                className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Add Department"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddDept;
