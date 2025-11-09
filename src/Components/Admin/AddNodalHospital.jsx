import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import {
  viewAllHosiptalList,
  viewNodals,
  addNodalHospital,
  getAllNodals
} from "../../services/apiService";
import axios from "axios";

const AddNodalHospital = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hospitalList, setHospitalList] = useState([]);
  const [nodalList, setNodalList] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setError,
    clearErrors,
  } = useForm({
  mode: "onBlur",
  defaultValues: {
    isactive: "true",
  },
});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospitalResponse, nodalResponse] = await Promise.all([
          viewAllHosiptalList(),
          getAllNodals(),
        ]);

        
        setHospitalList(hospitalResponse);
        setNodalList(nodalResponse || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setFetchError(
          error?.response?.data?.message ||
            "Failed to fetch hospital/nodal list."
        );
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const nodalid = parseInt(data.nodal_id, 10);
      const hospitalid = parseInt(data.hospital_id, 10);

      if (isNaN(nodalid) || isNaN(hospitalid)) {
        throw new Error("Nodal ID and Hospital ID must be valid numbers.");
      }

      const payload = {
        nodalid,
        hospitalid,
        isactive: data.isactive === "true",
      };

      const authToken = localStorage.getItem("authToken");

      console.log("Auth Token:", authToken);
      console.log("Payload:", payload);

      const response = await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/master/add-nodalhospital",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);


      console.log("API Response:", response.data);
      toast.success("Nodal Hospital added successfully!");
      reset();
      setTimeout(() => navigate("/view-nodal-hospitals"), 1500);



    } catch (error) {
      console.error("Error adding nodal hospital:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "❌ Failed to add Nodal Hospital. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live validation for dropdowns and text
  const handleValidation = (name, value) => {
    if (name === "nodal_id") {
      if (!value || value === "") {
        setError(name, { type: "manual", message: "Nodal name is required" });
      } else {
        clearErrors(name);
      }
    } else if (name === "hospital_id") {
      if (!value || value === "") {
        setError(name, {
          type: "manual",
          message: "Hospital name is required",
        });
      } else {
        clearErrors(name);
      }
    }
  };

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
                to="/view-nodal-hospitals"
                className="text-gray-700 hover:text-teal-600"
              >
                Nodal Hospital
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li aria-current="page" className="text-gray-500">
              Add Nodal Hospital
            </li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-10 px-0 sm:px-2 space-y-4 text-sm">
        {fetchError && (
          <p className="text-red-500 text-sm mb-4">{fetchError}</p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="font-semibold text-white">Add Nodal Hospital</h4>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nodal Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Nodal Name <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("nodal_id", {
                    required: "Nodal name is required",
                  })}
                  onKeyUp={(e) => handleValidation("nodal_id", e.target.value)}
                  onInput={(e) => handleValidation("nodal_id", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.nodal_id
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:ring-2 transition`}
                  defaultValue=""
                >
                  <option value="">Select Nodal Name</option>
                  {nodalList.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.nodalname}
                    </option>
                  ))}
                </select>
                {errors.nodal_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nodal_id.message}
                  </p>
                )}
              </div>

              {/* Hospital Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Hospital Name <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("hospital_id", {
                    required: "Hospital name is required",
                  })}
                  onKeyUp={(e) =>
                    handleValidation("hospital_id", e.target.value)
                  }
                  onInput={(e) =>
                    handleValidation("hospital_id", e.target.value)
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.hospital_id
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:ring-2 transition`}
                  defaultValue=""
                >
                  <option value="">Select Hospital Name</option>
                  {hospitalList.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hospitalname}
                    </option>
                  ))}
                </select>
                {errors.hospital_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.hospital_id.message}
                  </p>
                )}
              </div>

              {/* Is Active */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Is Active? <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 pt-2">
                  {["true", "false"].map((val) => (
                    <label key={val} className="inline-flex items-center">
                      <input
                        type="radio"
                        {...register("isactive", {
                          required: "Status is required",
                        })}
                        value={val}
                        className="h-4 w-4 text-teal-600"
                        defaultChecked={val === "true"}
                      />
                      <span className="ml-2">
                        {val === "true" ? "Yes" : "No"}
                      </span>
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
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Add Nodal Hospital"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNodalHospital;
