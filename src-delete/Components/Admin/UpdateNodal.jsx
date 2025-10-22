import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { viewNodal, updateNodal, viewNodals } from "../../services/apiService";

const UpdateNodal = () => {
  const [nodalToUpdate, setNodalToUpdate] = useState(null);
  const [existingNodals, setExistingNodals] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("No Nodal ID provided");
        navigate("/view-nodal");
        return;
      }

      setIsLoading(true);
      try {
        const [nodalResponse, allNodals] = await Promise.all([
          viewNodal(id),
          viewNodals(),
        ]);

        setNodalToUpdate(nodalResponse);
        setExistingNodals(allNodals || []);

        const nodalData = nodalResponse;
        reset({
          nodalname: nodalData.nodalname || "",
          motherlab: nodalData.motherlab ? "true" : "false",
          isactive: nodalData.isactive ? "true" : "false",
        });
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to fetch nodal data.");
        navigate("/view-nodal");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, reset, navigate]);

  const validateField = (name, value) => {
    const lettersOnly = /^[A-Za-z\s]{2,50}$/;

    switch (name) {
      case "nodalname":
        if (!lettersOnly.test(value.trim())) {
          setError(name, {
            type: "manual",
            message: "Only letters and spaces allowed (2–50 chars).",
          });
        } else if (
          existingNodals.some(
            (n) =>
              n.nodalname.toLowerCase() === value.trim().toLowerCase() &&
              n.id !== nodalToUpdate.id
          )
        ) {
          setError(name, {
            type: "manual",
            message: "Nodal name already exists.",
          });
        } else {
          clearErrors(name);
        }
        break;

      default:
        break;
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        nodalname: data.nodalname.trim(),
        motherlab: data.motherlab === "true",
        isactive: data.isactive === "true",
      };

      await updateNodal(id, payload);

      // ✅ Show toast before navigation
      toast.success("✅ Nodal updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      // Delay navigation to allow toast visibility
      setTimeout(() => {
        navigate("/view-nodal");
      }, 2100);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "❌ Failed to update nodal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return <div className="text-center py-10">Loading nodal data...</div>;
  if (!nodalToUpdate)
    return <div className="text-center py-10">Nodal not found.</div>;

  const fields = [
    {
      name: "nodalname",
      label: "Nodal Name",
      placeholder: "Enter Nodal Name",
    },
    {
      name: "motherlab",
      label: "Is Mother Lab?",
      type: "radio",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
    },
    {
      name: "isactive",
      label: "Is Active?",
      type: "radio",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
    },
  ];

  return (
    <>
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
                🏠 Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to="/view-nodal"
                className="text-gray-700 hover:text-teal-600"
              >
                Nodal
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500">Update Nodal</li>
          </ol>
        </nav>
      </div>

      <div className="w-full mt-12 px-2 space-y-4 text-sm">
        <ToastContainer />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-500">
            <h4 className="text-white font-semibold">Update Nodal</h4>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {fields.map(({ name, label, placeholder, type = "text", options = [] }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">
                  {label} <span className="text-red-500">*</span>
                </label>

                {type === "radio" ? (
                  <div className="flex space-x-4 pt-2">
                    {options.map((opt) => (
                      <label key={opt.value} className="inline-flex items-center">
                        <input
                          type="radio"
                          {...register(name, { required: `${label} is required` })}
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
                    placeholder={placeholder}
                    {...register(name, { required: `${label} is required` })}
                    onChange={(e) => validateField(name, e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors[name] ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-teal-500`}
                  />
                )}

                {errors[name] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[name].message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/view-nodal")}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg shadow hover:bg-teal-700 transition"
            >
              {isSubmitting ? "Updating..." : "Update Nodal"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateNodal;
