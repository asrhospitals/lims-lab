import React, { useState, useEffect } from 'react';
import AddInvestigationResultNormalValueModal from './AddInvestigationResultNormalValueModal';
import AddInvestigationResultMandatoryConditions from './AddInvestigationResultMandatoryConditions';
import AddInvestigationResultReflexTests from './AddInvestigationResultReflexTests';

const AddInvestigationResult = () => {
    const [showNormalValueModal, setShowNormalValueModal] = useState(false);
    const [showMandatoryConditionsModal, setShowMandatoryConditionsModal] = useState(false);
    const [showReflexTestsModal, setShowReflexTestsModal] = useState(false);
    
    const handleCloseNormalValue = (e) => {
        e.preventDefault();
        setShowNormalValueModal(false);
    };
    
    const handleShowNormalValue = (e) => {
        e.preventDefault();
        setShowNormalValueModal(true);
    };
    
    const handleCloseMandatoryConditions = (e) => {
        e.preventDefault();
        setShowMandatoryConditionsModal(false);
    };
    
    const handleShowMandatoryConditions = (e) => {
        e.preventDefault();
        setShowMandatoryConditionsModal(true);
    };
    
    const handleCloseReflexTests = (e) => {
        e.preventDefault();
        setShowReflexTestsModal(false);
    };
    
    const handleShowReflexTests = (e) => {
        e.preventDefault();
        setShowReflexTestsModal(true);
    };

    const [results, setResults] = useState(() => {
        const storedResults = localStorage.getItem('investigationResults');
        return storedResults ? JSON.parse(storedResults) : [];
    });

    const [newResult, setNewResult] = useState({
        id: null,
        name: '',
        otherLanguageName: '',
        extResultId: '',
        order: '',
        unit: '',
        formula: '',
        valueType: '',
        defaultValue: '',
        roundOff: '',
        normalValues: [],
        mandatoryConditions: [],
        reflexTests: [],
        showTrends: false,
    });

    // Function to generate the next sequential ID
    const getNextId = () => {
        if (results.length === 0) return "Row 1";
        const lastId = results[results.length - 1].id;
        const lastNumber = parseInt(lastId.replace("Row ", ""), 10);
        return `Row ${lastNumber + 1}`;
    };

    const handleAddResult = (e) => {
        e.preventDefault();
        if (!newResult.name) {
            alert("Result Name is required.");
            return;
        }

        const resultWithId = {
            id: newResult.id || getNextId(), // Use existing ID for editing or generate a new sequential ID
            resultname: newResult.name,
            otherLanguageName: newResult.otherLanguageName,
            extResultId: newResult.extResultId,
            unit: newResult.unit,
            valueType: newResult.valueType,
            formula: newResult.formula,
            order: newResult.order,
            roundOff: newResult.roundOff,
            showTrends: newResult.showTrends,
            defaultValue: newResult.defaultValue,
            normalValues: newResult.normalValues,
            mandatoryConditions: newResult.mandatoryConditions,
            reflexTests: newResult.reflexTests,
        };

        const updatedResults = newResult.id
            ? results.map(result => (result.id === newResult.id ? resultWithId : result))
            : [...results, resultWithId];

        localStorage.setItem('investigationResults', JSON.stringify(updatedResults));

        setNewResult({
            id: null,
            name: '',
            otherLanguageName: '',
            extResultId: '',
            order: '',
            unit: '',
            formula: '',
            valueType: '',
            defaultValue: '',
            roundOff: '',
            normalValues: [],
            mandatoryConditions: [],
            reflexTests: [],
            showTrends: false,
        });

        setResults(updatedResults);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewResult({ 
            ...newResult, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleEditResult = (e, index) => {
        e.preventDefault();
        const resultToEdit = results[index];
        setNewResult({
            ...resultToEdit,
        });
    };

    const handleDeleteResult = (e, index) => {
        e.preventDefault();
        const updatedResults = results.filter((_, i) => i !== index);
        setResults(updatedResults);
        localStorage.setItem('investigationResults', JSON.stringify(updatedResults));
    };

    return (
        <div className="p-6">
            <div className="col-span-full p-4 overflow-auto">
                <h2 className="font-bold mb-2">Results</h2>
                <div className="col-span-full border-b mb-4 border-gray-300"></div>
                <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
                    <thead className="bg-gray-100 text-orange-600">
                        <tr>
                            <th className="border px-2 py-1">Result Name</th>
                            <th className="border px-2 py-1">Other Language Result Name</th>
                            <th className="border px-2 py-1">ExtResultId</th>
                            <th className="border px-2 py-1">Order</th>
                            <th className="border px-2 py-1">Unit</th>
                            <th className="border px-2 py-1">Formula</th>
                            <th className="border px-2 py-1">Value Type</th>
                            <th className="border px-2 py-1">Default</th>
                            <th className="border px-2 py-1">RoundOff</th>
                            <th className="border px-2 py-1">Normal Values</th>
                            <th className="border px-2 py-1">Mandatory Conditions</th>
                            <th className="border px-2 py-1">Reflex Tests</th>
                            <th className="border px-2 py-1">Show Trends</th>
                            <th className="border px-2 py-1 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={result.id} className="bg-white hover:bg-gray-50">
                                <td className="border px-2 py-1">{result.resultname}</td>
                                <td className="border px-2 py-1">{result.otherLanguageName}</td>
                                <td className="border px-2 py-1">{result.extResultId}</td>
                                <td className="border px-2 py-1">{result.order}</td>
                                <td className="border px-2 py-1">{result.unit}</td>
                                <td className="border px-2 py-1">{result.formula}</td>
                                <td className="border px-2 py-1">{result.valueType}</td>
                                <td className="border px-2 py-1">{result.defaultValue}</td>
                                <td className="border px-2 py-1">{result.roundOff}</td>
                                <td className="border px-2 py-1">{Array.isArray(result.normalValues) ? result.normalValues.join(', ') : ''}</td>
                                <td className="border px-2 py-1">{Array.isArray(result.mandatoryConditions) ? result.mandatoryConditions.join(', ') : ''}</td>
                                <td className="border px-2 py-1">{Array.isArray(result.reflexTests) ? result.reflexTests.join(', ') : ''}</td>
                                <td className="border px-2 py-1">{result.showTrends ? 'Yes' : 'No'}</td>
                                <td className="border px-2 py-1 text-center">
                                    <button 
                                        className="text-blue-600 hover:text-blue-800 text-xs"
                                        onClick={(e) => handleEditResult(e, index)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="text-red-600 hover:text-red-800 text-xs ml-2"
                                        onClick={(e) => handleDeleteResult(e, index)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2 className="font-bold mb-4 mx-4">Add Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4 mx-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Result Name <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        name="name"
                        value={newResult.name}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded" 
                        placeholder="Result Name" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Other Language Result Name</label>
                    <input 
                        type="text" 
                        name="otherLanguageName"
                        value={newResult.otherLanguageName}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded" 
                        placeholder="Other Language" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ext Result Id</label>
                    <input 
                        type="text" 
                        name="extResultId"
                        value={newResult.extResultId}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded" 
                        placeholder="ExtResultId" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Order</label>
                    <input 
                        type="number" 
                        name="order"
                        value={newResult.order}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded" 
                        placeholder="Order" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                    <input 
                        type="text" 
                        name="unit"
                        value={newResult.unit}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded" 
                        placeholder="Unit" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Formula</label>
                    <input 
                        type="text" 
                        name="formula"
                        value={newResult.formula}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded" 
                        placeholder="Formula" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Value Type</label>
                    <select 
                        name="valueType" 
                        value={newResult.valueType}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="">Select Type</option>
                        <option value="number">Number</option>
                        <option value="text">Text</option>
                        <option value="boolean">Boolean</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Default</label>
                    <input 
                        type="text" 
                        name="defaultValue"
                        value={newResult.defaultValue}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded" 
                        placeholder="Default" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Round Off</label>
                    <input 
                        type="number" 
                        name="roundOff"
                        value={newResult.roundOff}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded" 
                        placeholder="Round Off" 
                    />
                </div>

                <div className="col-span-full">
                    <label className="inline-flex items-center">
                        <input 
                            type="checkbox" 
                            name="showTrends"
                            checked={newResult.showTrends}
                            onChange={handleChange}
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Show Trends</span>
                    </label>
                </div>

                {/* Add Normal Values Button */}
                <div className="">
                    <button
                        onClick={handleShowNormalValue}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mt-5 w-full"
                    >
                        Add Normal Values
                    </button>
                </div>
                
                {/* Add Mandatory Conditions Button */}
                <div className="">
                    <button
                        onClick={handleShowMandatoryConditions}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mt-5 w-full"
                    >
                        Add Mandatory Conditions
                    </button>
                </div>
                
                {/* Add Reflex Tests Button */}
                <div className="">
                    <button
                        onClick={handleShowReflexTests}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mt-5 w-full"
                    >
                        Add Reflex Tests
                    </button>
                </div>

                <div className="col-span-full text-center">
                    <button 
                        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                        onClick={handleAddResult}
                    >
                        {newResult.id ? "Update Result" : "Add Result"}
                    </button>
                </div>
            </div>

            {/* Modals */}
            <AddInvestigationResultNormalValueModal showModal={showNormalValueModal} handleClose={handleCloseNormalValue} />
            <AddInvestigationResultMandatoryConditions showModal={showMandatoryConditionsModal} handleClose={handleCloseMandatoryConditions} />
            <AddInvestigationResultReflexTests showModal={showReflexTestsModal} handleClose={handleCloseReflexTests} />
        </div>
    );
};

export default AddInvestigationResult;
