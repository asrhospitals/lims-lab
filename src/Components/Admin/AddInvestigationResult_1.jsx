import React, { useState } from 'react';

const AddInvestigationResult = () => {
    const initialFormData = {
        resultName: '',
        otherLanguageName: '',
        extResultId: '',
        order: '',
        unit: '',
        formula: '',
        valueType: '',
        defaultValue: '',
        roundOff: '',
        normalValues: '',
        mandatoryConditions: '',
        reflexTests: '',
        showTrends: false
    };

    const [formData, setFormData] = useState(initialFormData);
    const [tableData, setTableData] = useState([]);

    const handleResultChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAdd = () => {
        if (!formData.resultName.trim()) return alert("Result Name is required.");
        setTableData(prev => [...prev, formData]);
        setFormData(initialFormData);
    };

    const handleDelete = (index) => {
        const newData = [...tableData];
        newData.splice(index, 1);
        setTableData(newData);
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-full">

                <div className="mt-8 overflow-x-auto">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">Result List</h2>
                    <table className="min-w-full border border-gray-300 text-sm text-left bg-white rounded shadow-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                {Object.keys(initialFormData).map((key) => (
                                    <th key={key} className="border px-2 py-1">{key.replace(/([A-Z])/g, ' $1')}</th>
                                ))}
                                <th className="border px-2 py-1 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {Object.keys(initialFormData).map((key) => (
                                        <td key={key} className="border px-2 py-1">{row[key]}</td>
                                    ))}
                                    <td className="border px-2 py-1 text-center">
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {tableData.length === 0 && (
                                <tr>
                                    <td colSpan="14" className="text-center py-4 text-gray-500">
                                        No results added yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Add Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white border p-4 rounded shadow-sm">
                    {Object.entries(formData).map(([key, value]) => (
                        <div key={key}>
                            {key === 'valueType' ? (
                                <select
                                    name={key}
                                    value={value}
                                    onChange={handleResultChange}
                                    className="w-full text-sm border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Select Value Type</option>
                                    <option value="number">Number</option>
                                    <option value="text">Text</option>
                                    <option value="boolean">Boolean</option>
                                </select>
                            ) : key === 'showTrends' ? (
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name={key}
                                        checked={value}
                                        onChange={handleResultChange}
                                        className="mr-2"
                                    />
                                    Show Trends
                                </label>
                            ) : (
                                <input
                                    name={key}
                                    value={value}
                                    type={key === 'order' || key === 'roundOff' ? 'number' : 'text'}
                                    placeholder={key.replace(/([A-Z])/g, ' $1')}
                                    onChange={handleResultChange}
                                    className="w-full text-sm border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            )}
                        </div>
                    ))}
                    <div className="md:col-span-3 lg:col-span-4">
                        <button
                            onClick={handleAdd}
                            className="bg-blue-600 text-white px-6 py-2 mt-2 rounded hover:bg-blue-700 transition"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="mt-8 overflow-x-auto">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">Result List</h2>
                    <table className="min-w-full border border-gray-300 text-sm text-left bg-white rounded shadow-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                {Object.keys(initialFormData).map((key) => (
                                    <th key={key} className="border px-2 py-1">{key.replace(/([A-Z])/g, ' $1')}</th>
                                ))}
                                <th className="border px-2 py-1 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {Object.keys(initialFormData).map((key) => (
                                        <td key={key} className="border px-2 py-1">{row[key]}</td>
                                    ))}
                                    <td className="border px-2 py-1 text-center">
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {tableData.length === 0 && (
                                <tr>
                                    <td colSpan="14" className="text-center py-4 text-gray-500">
                                        No results added yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
            </div>
        </div>
    );
};

export default AddInvestigationResult;
