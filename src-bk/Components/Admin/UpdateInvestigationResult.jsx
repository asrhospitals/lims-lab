import React, { useState } from 'react';
import AddInvestigationResultNormalValueModal from './AddInvestigationResultNormalValueModal';
import AddInvestigationResultMandatoryConditions from './AddInvestigationResultMandatoryConditions';
import AddInvestigationResultReflexTests from './AddInvestigationResultReflexTests';

const UpdateInvestigationResult = ({ results, setResults }) => {
  const [showNormalValueModal, setShowNormalValueModal] = useState(false);
  const [showMandatoryConditionsModal, setShowMandatoryConditionsModal] = useState(false);
  const [showReflexTestsModal, setShowReflexTestsModal] = useState(false);

  const [newResult, setNewResult] = useState({
    id: null,
    resultname: '',
    unit: '',
    valueType: '',
    formula: '',
    order: '',
    roundOff: '',
    showTrends: false,
    defaultValue: '',
    normalValues: [],
    mandatoryConditions: [],
    reflexTests: [],
  });

  const getNextId = () => {
    if (results.length === 0) return 1;
    return results[results.length - 1].id + 1;
  };

  const handleAddResult = (e) => {
    e.preventDefault();
    if (!newResult.resultname) {
      alert("Result Name is required.");
      return;
    }

    const resultWithId = {
      ...newResult,
      id: newResult.id || getNextId(),
    };

    const updatedResults = newResult.id
      ? results.map((res) => (res.id === newResult.id ? resultWithId : res))
      : [...results, resultWithId];

    setResults(updatedResults);
    resetNewResult();
  };

  const resetNewResult = () => {
    setNewResult({
      id: null,
      resultname: '',
      unit: '',
      valueType: '',
      formula: '',
      order: '',
      roundOff: '',
      showTrends: false,
      defaultValue: '',
      normalValues: [],
      mandatoryConditions: [],
      reflexTests: [],
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewResult({
      ...newResult,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEditResult = (e, index) => {
    e.preventDefault();
    setNewResult({ ...results[index] });
  };

  const handleDeleteResult = (e, index) => {
    e.preventDefault();
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);
  };

  const handleSubmitToAPI = async () => {
    try {
      const payload = { results: results };
      const response = await fetch(
        "https://asrlabs.asrhospitalindia.in/lims/master/update/2/results",
        {
          method: "POST", // or PUT based on API requirements
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to update results");

      alert("Results updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating results.");
    }
  };

  return (
    <div className="p-6">
      {/* Results Table */}
      <div className="col-span-full p-4 overflow-auto">
        <h2 className="font-bold mb-2">Results</h2>
        <div className="col-span-full border-b mb-4 border-gray-300"></div>
        <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
          <thead className="bg-gray-100 text-orange-600">
            <tr>
              <th className="border px-2 py-1">Result Name</th>
              <th className="border px-2 py-1">Unit</th>
              <th className="border px-2 py-1">Value Type</th>
              <th className="border px-2 py-1">Formula</th>
              <th className="border px-2 py-1">Order</th>
              <th className="border px-2 py-1">Round Off</th>
              <th className="border px-2 py-1">Default Value</th>
              <th className="border px-2 py-1">Show Trends</th>
              <th className="border px-2 py-1 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={result.id} className="bg-white hover:bg-gray-50">
                <td className="border px-2 py-1">{result.resultname}</td>
                <td className="border px-2 py-1">{result.unit}</td>
                <td className="border px-2 py-1">{result.valueType}</td>
                <td className="border px-2 py-1">{result.formula}</td>
                <td className="border px-2 py-1">{result.order}</td>
                <td className="border px-2 py-1">{result.roundOff}</td>
                <td className="border px-2 py-1">{result.defaultValue}</td>
                <td className="border px-2 py-1">{result.showTrends ? 'Yes' : 'No'}</td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={(e) => handleEditResult(e, index)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteResult(e, index)}
                    className="text-red-600 hover:text-red-800 text-xs ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form */}
      <h2 className="font-bold mb-4 mx-4">Add / Update Result</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4 mx-4">
        <input type="text" name="resultname" placeholder="Result Name" value={newResult.resultname} onChange={handleChange} className="border px-3 py-2 rounded" />
        <input type="text" name="unit" placeholder="Unit" value={newResult.unit} onChange={handleChange} className="border px-3 py-2 rounded" />
        <select name="valueType" value={newResult.valueType} onChange={handleChange} className="border px-3 py-2 rounded">
          <option value="">Select Type</option>
          <option value="Number">Number</option>
          <option value="Text">Text</option>
          <option value="Boolean">Boolean</option>
        </select>
        <input type="text" name="formula" placeholder="Formula" value={newResult.formula || ''} onChange={handleChange} className="border px-3 py-2 rounded" />
        <input type="number" name="order" placeholder="Order" value={newResult.order} onChange={handleChange} className="border px-3 py-2 rounded" />
        <input type="number" name="roundOff" placeholder="Round Off" value={newResult.roundOff} onChange={handleChange} className="border px-3 py-2 rounded" />
        <input type="text" name="defaultValue" placeholder="Default Value" value={newResult.defaultValue} onChange={handleChange} className="border px-3 py-2 rounded" />
        <label className="inline-flex items-center">
          <input type="checkbox" name="showTrends" checked={newResult.showTrends} onChange={handleChange} className="form-checkbox h-4 w-4 text-blue-600" />
          <span className="ml-2 text-sm text-gray-700">Show Trends</span>
        </label>

        <div className="col-span-full flex gap-4">
          <button onClick={handleAddResult} className="bg-teal-600 text-white px-4 py-2 rounded">
            {newResult.id ? "Update Result" : "Add Result"}
          </button>
          <button onClick={handleSubmitToAPI} className="bg-blue-600 text-white px-4 py-2 rounded">
            Save All to API
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddInvestigationResultNormalValueModal showModal={showNormalValueModal} handleClose={() => setShowNormalValueModal(false)} />
      <AddInvestigationResultMandatoryConditions showModal={showMandatoryConditionsModal} handleClose={() => setShowMandatoryConditionsModal(false)} />
      <AddInvestigationResultReflexTests showModal={showReflexTestsModal} handleClose={() => setShowReflexTestsModal(false)} />
    </div>
  );
};

export default UpdateInvestigationResult;
