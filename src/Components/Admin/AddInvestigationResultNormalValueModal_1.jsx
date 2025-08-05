import { useState } from 'react';

const AddInvestigationResultNormalValueModal = ({ showModal, handleClose }) => {
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        handleClose();
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
                <div className="p-6">
                    <form onSubmit={handleSubmit}>

                        <div className='p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
                        <div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Type</label>
                            <select
                                name="type"
                                className="mt-2 block w-full p-2 border border-gray-300 rounded"
                                onChange={handleChange}
                            >
                                <option>Others</option>
                            </select>
                            <p className="text-gray-500 text-sm">Leave blank if range does not depend on type</p>
                        </div>

                        {/* Age Min */}
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
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Age Max */}
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
                                    />
                                ))}
                            </div>
                            <p className="text-gray-500 text-sm">Leave blank if range does not depend on age.</p>
                        </div>
                        
                        </div>
                        <div>

                        {/* Range */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Range</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    name="rangeMin"
                                    type="number"
                                    placeholder="Min"
                                    className="block w-full p-2 border border-gray-300 rounded"
                                    onChange={handleChange}
                                />
                                <input
                                    name="rangeMax"
                                    type="number"
                                    placeholder="Max"
                                    className="block w-full p-2 border border-gray-300 rounded"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mt-2 space-y-2">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="rangeAbnormal"
                                        className="form-checkbox"
                                        onChange={handleChange}
                                    />
                                    <span className="ml-2">Check if the range is abnormal</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="avoidRangeInReport"
                                        className="form-checkbox"
                                        onChange={handleChange}
                                    />
                                    <span className="ml-2">Check to avoid this range in report</span>
                                </label>
                            </div>
                        </div>

                        {/* Valid Range */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Valid Range</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    name="validRangeMin"
                                    type="number"
                                    placeholder="Min"
                                    className="block w-full p-2 border border-gray-300 rounded"
                                    onChange={handleChange}
                                />
                                <input
                                    name="validRangeMax"
                                    type="number"
                                    placeholder="Max"
                                    className="block w-full p-2 border border-gray-300 rounded"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Critical Range */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Critical Range</label>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    name="criticalRangeLow"
                                    placeholder="Low (<)"
                                    className="block w-full p-2 border border-gray-300 rounded"
                                    onChange={handleChange}
                                />
                                <input
                                    name="criticalRangeHigh"
                                    placeholder="High (>)"
                                    className="block w-full p-2 border border-gray-300 rounded"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        </div>
                        </div>
                                
                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="bg-orange-500 text-white rounded-lg  py-2  px-8 hover:bg-orange-600"
                        >
                            Add Normal Value
                        </button>
                        </div>
                    </form>
                </div>
                <div className="p-4 bg-gray-200 space-x-2 flex justify-between">
                    <button className="bg-gray-500 text-white rounded-lg w-1/2 py-2 hover:bg-gray-600" onClick={handleClose}>
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="bg-green-500 text-white rounded-lg w-1/2 py-2 hover:bg-green-600"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddInvestigationResultNormalValueModal;
