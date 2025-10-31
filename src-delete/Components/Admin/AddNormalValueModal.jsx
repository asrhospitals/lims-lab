import { useState } from 'react';

const AddNormalValueModal = ({ showModal, handleClose, onDataUpdate }) => {
    const [formData, setFormData] = useState({
        type: '',
        ageMinYear: '',
        ageMinMonth: '',
        ageMinDay: '',
        ageMaxYear: '',
        ageMaxMonth: '',
        ageMaxDay: '',
        rangeMin: '',
        rangeMax: '',
        validRangeMin: '',
        validRangeMax: '',
        criticalRangeLow: '',
        criticalRangeHigh: '',
        rangeAbnormal: false,
        avoidRangeInReport: false,
    });

    const [normalValues, setNormalValues] = useState([]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = () => {
        setNormalValues([...normalValues, formData]);
        setFormData({
            type: '',
            ageMinYear: '',
            ageMinMonth: '',
            ageMinDay: '',
            ageMaxYear: '',
            ageMaxMonth: '',
            ageMaxDay: '',
            rangeMin: '',
            rangeMax: '',
            validRangeMin: '',
            validRangeMax: '',
            criticalRangeLow: '',
            criticalRangeHigh: '',
            rangeAbnormal: false,
            avoidRangeInReport: false,
        });
    };

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Validate required fields
        if (!formData.type) {
            alert("Type is required");
            return;
        }
        
        handleSubmit();
    };

    const handleEdit = (index) => {
        const valueToEdit = normalValues[index];
        setFormData(valueToEdit);
        setNormalValues(normalValues.filter((_, i) => i !== index));
    };

    const handleRemove = (index) => {
        setNormalValues(normalValues.filter((_, i) => i !== index));
    };

    return (
        <div
            className={`${showModal ? 'block' : 'hidden'} fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75`}
        >
            <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-6xl p-1">
                <div className="border bottom-5 border-green-400 p-3">
                    <h2 className="text-xl font-semibold text-center">Create Normal Values - New</h2>
                    <button className="text-gray-600 float-right" onClick={handleClose}>
                        ✖
                    </button>
                </div>
                <div className="p-6 overflow-auto max-h-90">
                    <form onSubmit={handleAdd}>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
                            <div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Type</label>
                                    <select
                                        name="type"
                                        className="mt-2 block w-full p-2 border border-gray-300 rounded"
                                        onChange={handleChange}
                                        value={formData.type}
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Child">Child</option>
                                        <option value="Adult">Adult</option>
                                        <option value="Elderly">Elderly</option>
                                        <option value="General">General</option>
                                    </select>
                                    <p className="text-gray-500 text-sm">Leave blank if range does not depend on type</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Age Min</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['Year', 'Month', 'Day'].map((label, index) => (
                                            <input
                                                key={index}
                                                name={`ageMin${label}`}
                                                type="number"
                                                placeholder={label}
                                                className="block w-full p-2 border border-gray-300 rounded"
                                                onChange={handleChange}
                                                value={formData[`ageMin${label}`]}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Age Max</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['Year', 'Month', 'Day'].map((label, index) => (
                                            <input
                                                key={index}
                                                name={`ageMax${label}`}
                                                type="number"
                                                placeholder={label}
                                                className="block w-full p-2 border border-gray-300 rounded"
                                                onChange={handleChange}
                                                value={formData[`ageMax${label}`]}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-500 text-sm">Leave blank if range does not depend on age.</p>
                                </div>
                            </div>
                            <div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Range</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            name="rangeMin"
                                            type="number"
                                            placeholder="Min"
                                            className="block w-full p-2 border border-gray-300 rounded"
                                            onChange={handleChange}
                                            value={formData.rangeMin}
                                        />
                                        <input
                                            name="rangeMax"
                                            type="number"
                                            placeholder="Max"
                                            className="block w-full p-2 border border-gray-300 rounded"
                                            onChange={handleChange}
                                            value={formData.rangeMax}
                                        />
                                    </div>
                                    <div className="mt-2 space-y-2">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                name="rangeAbnormal"
                                                className="form-checkbox"
                                                onChange={handleChange}
                                                checked={formData.rangeAbnormal}
                                            />
                                            <span className="ml-2">Check if the range is abnormal</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                name="avoidRangeInReport"
                                                className="form-checkbox"
                                                onChange={handleChange}
                                                checked={formData.avoidRangeInReport}
                                            />
                                            <span className="ml-2">Check to avoid this range in report</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Valid Range</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            name="validRangeMin"
                                            type="number"
                                            placeholder="Min"
                                            className="block w-full p-2 border border-gray-300 rounded"
                                            onChange={handleChange}
                                            value={formData.validRangeMin}
                                        />
                                        <input
                                            name="validRangeMax"
                                            type="number"
                                            placeholder="Max"
                                            className="block w-full p-2 border border-gray-300 rounded"
                                            onChange={handleChange}
                                            value={formData.validRangeMax}
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Critical Range</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            name="criticalRangeLow"
                                            placeholder="Low (<)"
                                            className="block w-full p-2 border border-gray-300 rounded"
                                            onChange={handleChange}
                                            value={formData.criticalRangeLow}
                                        />
                                        <input
                                            name="criticalRangeHigh"
                                            placeholder="High (>)"
                                            className="block w-full p-2 border border-gray-300 rounded"
                                            onChange={handleChange}
                                            value={formData.criticalRangeHigh}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-4">
                            <button
                                type="button"
                                className="bg-orange-500 text-white rounded-lg py-2 px-8 hover:bg-orange-600"
                                onClick={handleAdd}
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </div>
                <div className="border-t border-gray-400 p-4 max-h-96 ">
                    <h3 className="text-lg font-semibold">Edited Normal Value List</h3>
                    <table className="min-w-full mt-2">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Type</th>
                                <th className="border px-4 py-2">Age (Min)</th>
                                <th className="border px-4 py-2">Age (Max)</th>
                                <th className="border px-4 py-2">Range (Min)</th>
                                <th className="border px-4 py-2">Range (Max)</th>
                                <th className="border px-4 py-2">Range is Abnormal</th>
                                <th className="border px-4 py-2">Avoid Range in Report</th>
                                <th className="border px-4 py-2">Valid Range (Min)</th>
                                <th className="border px-4 py-2">Valid Range (Max)</th>
                                <th className="border px-4 py-2">Critical Range (Low)</th>
                                <th className="border px-4 py-2">Critical Range (High)</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {normalValues.map((value, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{value.type}</td>
                                    <td className="border px-4 py-2">{`${value.ageMinYear}Y ${value.ageMinMonth}M ${value.ageMinDay}D`}</td>
                                    <td className="border px-4 py-2">{`${value.ageMaxYear}Y ${value.ageMaxMonth}M ${value.ageMaxDay}D`}</td>
                                    <td className="border px-4 py-2">{value.rangeMin}</td>
                                    <td className="border px-4 py-2">{value.rangeMax}</td>
                                    <td className="border px-4 py-2">{value.rangeAbnormal ? "Yes" : "No"}</td>
                                    <td className="border px-4 py-2">{value.avoidRangeInReport ? "Yes" : "No"}</td>
                                    <td className="border px-4 py-2">{value.validRangeMin}</td>
                                    <td className="border px-4 py-2">{value.validRangeMax}</td>
                                    <td className="border px-4 py-2">{value.criticalRangeLow}</td>
                                    <td className="border px-4 py-2">{value.criticalRangeHigh}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="text-blue-500 hover:underline"
                                            onClick={() => handleEdit(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-500 hover:underline"
                                            onClick={() => handleRemove(index)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-gray-200 space-x-2 flex justify-between">
                    <button className="bg-gray-500 text-white rounded-lg w-1/2 py-2 hover:bg-gray-600" onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-green-500 text-white rounded-lg w-1/2 py-2 hover:bg-green-600"
                        onClick={() => {
                            onDataUpdate && onDataUpdate(normalValues);
                            handleClose();
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNormalValueModal;
