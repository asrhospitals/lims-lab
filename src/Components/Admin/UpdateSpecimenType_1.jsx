import { useForm } from "react-hook-form";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminContext from "../../context/adminContext";
import "react-toastify/dist/ReactToastify.css";

const UpdateSpecimenType = () => {
  const { specimenToUpdate, setSpecimenToUpdate } = useContext(AdminContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      specimenname: "",
      specimendes: "",
      isactive: "true",
    },
  });





    useEffect(() => {
      const stored = localStorage.getItem("specimenToUpdate");
  
      if (!specimenToUpdate && stored) {
        try {
          const parsed = JSON.parse(stored);
          setSpecimenToUpdate(parsed);
          reset({
            ...parsed,
            isactive: String(parsed.isactive),
          });
        } catch (err) {
          console.error("Invalid specimenToUpdate in localStorage");
        }
      } else if (specimenToUpdate) {
        reset({
          ...specimenToUpdate,
          isactive: String(specimenToUpdate.isactive),
        });
      }
    }, [specimenToUpdate, reset, setSpecimenToUpdate]);
    



  const onSubmit = async (data) => {
    if (!specimenToUpdate?.id) {
      toast.error("❌ Specimen ID is missing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      await axios.put(
        `https://asrlabs.asrhospitalindia.in/lims/master/update-specimen/${specimenToUpdate.id}`,
        {
          specimenname: data.specimenname,
          specimendes: data.specimendes,
          isactive: data.isactive === "true",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Specimen Type updated!");
      setSpecimenToUpdate(null);
      navigate("/view-specimen-types");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to update specimen."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!specimenToUpdate) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No specimen selected for update.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto">
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
          <h4 className="font-semibold text-white">Update Specimen Type</h4>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Specimen Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Specimen Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("specimenname", {
                  required: "Specimen name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only alphabets allowed",
                  },
                })}
                onBlur={() => trigger("specimenname")}
                placeholder="Enter Specimen Name"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.specimenname
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-teal-500"
                } focus:ring-2 focus:border-transparent transition`}
              />
              {errors.specimenname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.specimenname.message}
                </p>
              )}
            </div>

            {/* Specimen Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Specimen Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("specimendes", {
                  required: "Description is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters",
                  },
                })}
                onBlur={() => trigger("specimendes")}
                placeholder="Enter Description"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.specimendes
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-teal-500"
                } focus:ring-2 focus:border-transparent transition`}
              />
              {errors.specimendes && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.specimendes.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4 pt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="true"
                    {...register("isactive", { required: "Status is required" })}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="false"
                    {...register("isactive", { required: "Status is required" })}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Inactive</span>
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
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Specimen Type"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateSpecimenType;
