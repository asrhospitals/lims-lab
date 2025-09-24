import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AddUserMapping = () => {
  const [fetchError, setFetchError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [hospitalsList, setHospitalsList] = useState([]);
  const [nodalsList, setNodalsList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      createddate: today,
    },
  });

  // Fetch data functions
  const fetchData = async (url, setter) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setter(data.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData(
      "https://asrlabs.asrhospitalindia.in/lims/master/get-hospital?page=1&limit=1000",
      (data) =>
        setHospitalsList(
          data.map((hospital) => ({
            value: hospital.id,
            label: hospital.hospitalname,
          }))
        )
    );
    fetchData(
      "https://asrlabs.asrhospitalindia.in/lims/master/get-nodal?page=1&limit=1000",
      (data) =>
        setNodalsList(
          data.map((nodal) => ({
            value: nodal.id,
            label: nodal.nodalname || "Unknown Nodal",
          }))
        )
    );
    fetchData(
      "https://asrlabs.asrhospitalindia.in/lims/master/get-role",
      (data) =>
        setRolesList(
          data.map((role) => ({
            value: role.id,
            label: role.roletype,
          }))
        )
    );
  }, []);

  const fetchUsers = async (label) => {
    if (!label) return;

    // Extract first name from label (assuming label is "FirstName username")
    const firstName = label.split(" ")[0];

    console.log("Fetching users with first_name==", firstName);

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `https://asrlabs.asrhospitalindia.in/lims/authentication/search-users?first_name=${firstName}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data && data.length > 0 && Array.isArray(data[0].module)) {
        setSelectedModule(data[0].module[0] || "");
        console.log(data[0].module[0]);
        
      } else {
        setSelectedModule(""); // fallback if module is missing
      }
  

      const options = data.map((user) => ({
        value: user.user_id,
        label: `${user.first_name}`,
        module: user.module,
      }));

      setUserOptions(options);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log("value", value);

    setSearchText(value);
    if (!value) {
      setUserData(null);
      setUserOptions([]);
      return;
    }
    fetchUsers(value);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {

      const selectedModule = data.selectedmodule; // "Doctor", "Technician", etc.

      // Initialize all module fields as null
      const payload = {
        user_id: data.searchuser,
        hospital_id: Number(data.hospitalselected),
        nodal_id: Number(data.nodalselected),
        role: Number(data.selectedroll),
        doctor_id: null,
        technician_id: null,
        reception_id: null,
        phlebotomist_id: null,
      };
  
      // Set only the selected module field to 1
      // if (selectedModule === "Doctor") payload.doctor_id = 1;
      // else if (selectedModule === "Technician") payload.technician_id = 1;
      // else if (selectedModule === "Reception") payload.reception_id = 1;
      // else if (selectedModule === "Phlebotomist") payload.phlebotomist_id = 1;
  
      // console.log("Final payload:", payload);
  

      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/authentication/assign-role",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("New Phlebotomist added successfully!");
        reset();
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "❌ Failed to add phlebotomist. Please try again."
      );
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createdBy = localStorage.getItem("roleType");

 const fields = [
  {
    name: "searchuser",
    label: "Search User",
    placeholder: "Enter User Name",
    validation: {
      required: "Name is required",
      pattern: /^[A-Za-z ]+/,
    },
    onBlur: (e, errors) => {
      if (errors?.searchuser) {
        const input = document.querySelector(`[name="searchuser"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "hospitalselected",
    label: "Select Hospital",
    type: "select",
    options: hospitalsList,
    validation: { required: "Hospital is required" },
    // no cursor-preserving needed for select
  },
  {
    name: "nodalselected",
    label: "Select Nodal",
    type: "select",
    options: nodalsList,
    validation: { required: "Nodal is required" },
    // no cursor-preserving needed for select
  },
  {
    name: "selectedroll",
    label: "Select Role",
    type: "select",
    options: rolesList,
    validation: { required: "Role is required" },
    // no cursor-preserving needed for select
  },
  {
    name: "selectedmodule",
    label: "Select Module",
    type: "text",
    placeholder: selectedModule,
    onBlur: (e, errors) => {
      if (errors?.selectedmodule) {
        const input = document.querySelector(`[name="selectedmodule"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "createdby",
    label: "Created By",
    type: "text",
    placeholder: createdBy,
    validations: {
      pattern: {
        value: /^[A-Za-z\s]+$/, // only letters and spaces
        message: "Only letters and spaces are allowed",
      },
    },
    onBlur: (e, errors) => {
      if (errors?.createdby) {
        const input = document.querySelector(`[name="createdby"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "createddate",
    label: "Created Date",
    type: "date",
    validation: { required: "Created date is required" },
    max: today,
    disabled: true,
    defaultValue: today,
    onBlur: (e, errors) => {
      if (errors?.createddate) {
        const input = document.querySelector(`[name="createddate"]`);
        if (input) input.focus();
      }
    },
  },
  {
    name: "isactive",
    label: "Is Active?",
    type: "radio",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
    validation: { required: "Status is required." },
    // no cursor-preserving needed for radio
  },
];


  return (
    <>
      <div className="fixed top-[61px] w-full z-10">
        <nav
          className="flex items-center font-medium justify-start px-4 py-2 bg-gray-50 border-b shadow-lg transition-colors"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors"
              >
                🏠︎ Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-user-list"
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                User Details
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Add User Mapping
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-14 px-0 sm:px-2 space-y-4 text-sm">
        <ToastContainer />
        {fetchError && (
          <p className="text-red-500 text-sm mb-4">{fetchError}</p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add User Mapping</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map(
                ({
                  name,
                  label,
                  placeholder,
                  type = "text",
                  options,
                  validation,
                  max,
                }) => (
                  <div key={name} className="space-y-1 relative">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}{" "}
                      {validation?.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>

                    {name === "searchuser" ? (
                      <>
                        <input
                          type="text"
                          {...register(name, validation)}
                          value={searchText}
                          onChange={handleSearchChange}
                          placeholder={placeholder}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            errors[name]
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-teal-500"
                          } focus:ring
::contentReference[oaicite:0]{index=0}
                           focus:ring-2 transition`}
                        />

                        {/* Dropdown suggestions */}
                        {userOptions.length > 0 && (
                          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                            {userOptions.map((user) => (
                              <li
                                key={user.value}
                                className="px-4 py-2 hover:bg-teal-100 cursor-pointer"
                                onClick={() => {
                                  // Set form value to selected user's ID
                                  setValue("searchuser", user.value);

                                  // Show full name in input
                                  setSearchText(user.label);

                                  // Store selected user object
                                  setUserData(user);

                                  // Log selected user
                                  console.log("Selected user:", user);

                                  // Set module based on user's module array
                                  setValue(
                                    "selectedmodule",
                                    Array.isArray(user.module)
                                      ? user.module.join(", ")
                                      : ""
                                  );

                                  // Close suggestions
                                  setUserOptions([]);
                                }}
                              >
                                {user.label}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : type === "select" ? (
                      <select
                        {...register(name, validation)}
                        onBlur={() => trigger(name)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        } focus:ring-2 transition`}
                      >
                        <option value="">Select {label}</option>
                        {options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : type === "radio" ? (
                      <div className="flex space-x-4 pt-2">
                        {options.map((opt) => (
                          <label
                            key={opt.value}
                            className="inline-flex items-center"
                          >
                            <input
                              type="radio"
                              {...register(name, validation)}
                              value={opt.value}
                              className="h-4 w-4 text-teal-600"
                            />
                            <span className="ml-2">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={type}
                        {...register(name, validation)}
                        onBlur={() => trigger(name)}
                        placeholder={placeholder}
                        max={max}
                        disabled={fields.find((f) => f.name === name)?.disabled}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[name]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-teal-500"
                        } focus:ring-2 transition`}
                      />
                    )}

                    {errors[name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[name]?.message}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Add User Mapping"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUserMapping;
