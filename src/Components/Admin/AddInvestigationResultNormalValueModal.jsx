import { useState, useEffect } from 'react';

const AddInvestigationResultNormalValueModal = ({ showModal, handleClose }) => {
    const [formData, setFormData] = useState({
        sno: '',
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

    const [normalValues, setNormalValues] = useState(() => {
        const storedValues = localStorage.getItem('normalValues');
        return storedValues ? JSON.parse(storedValues) : [];
    });

    useEffect(() => {
        localStorage.setItem('normalValues', JSON.stringify(normalValues));
    }, [normalValues]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAdd = (e) => {
        e.preventDefault();
        setNormalValues([...normalValues, formData]);
        setFormData({
            sno: '',
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

    const handleEdit = (index) => {
        const valueToEdit = normalValues[index];
        setFormData(valueToEdit);
        setNormalValues(normalValues.filter((_, i) => i !== index));
    };

    const handleRemove = (index) => {
        setNormalValues(normalValues.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        try {
            const storedResults = localStorage.getItem('investigationResults');
            const results = storedResults ? JSON.parse(storedResults) : [];

            const updatedNormalValues = normalValues.map((value, index) => {
                const ageMinYear = value.ageMinYear || '';
                const ageMinMonth = value.ageMinMonth || '';
                const ageMinDay = value.ageMinDay || '';
                const ageMaxYear = value.ageMaxYear || '';
                const ageMaxMonth = value.ageMaxMonth || '';
                const ageMaxDay = value.ageMaxDay || '';

                return {
                    id: index + 1,
                    gender: value.type || '',
                    ageMin: `${ageMinYear}${ageMinYear ? 'Y ' : ''}${ageMinMonth}${ageMinMonth ? 'M ' : ''}${ageMinDay}${ageMinDay ? 'D' : ''}`.trim(),
                    ageMax: `${ageMaxYear}${ageMaxYear ? 'Y ' : ''}${ageMaxMonth}${ageMaxMonth ? 'M ' : ''}${ageMaxDay}${ageMaxDay ? 'D' : ''}`.trim(),
                    rangeMin: value.rangeMin || '',
                    rangeMax: value.rangeMax || '',
                    validRangeMin: value.validRangeMin || '',
                    validRangeMax: value.validRangeMax || '',
                    criticalLow: value.criticalRangeLow || '',
                    criticalHigh: value.criticalRangeHigh || '',
                    isRangeAbnormal: value.rangeAbnormal || false,
                    avoidInReport: value.avoidRangeInReport || false,
                };
            });

            const newResult = {
                id: Date.now(),
                normalValues: updatedNormalValues,
                resultname: "",
                unit: "",
                valueType: "",
            };

            results.push(newResult);
            localStorage.setItem('investigationResults', JSON.stringify(results));

            localStorage.removeItem('normalValues');
            setNormalValues([]);
            handleClose();
        } catch (error) {
            console.error('Error saving investigation results:', error);
        }
    };

    return (
        <div
            className={`${showModal ? 'block' : 'hidden'} fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75`}
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[80vh] flex flex-col">

                {/* Header */}
                <div className="border-b border-green-400 p-3 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-center">Create Normal Values - New</h2>
                    <button className="text-gray-600" onClick={handleClose}>
                        ✖
                    </button>
                </div>

                {/* Form + Table Container */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Form */}
                    <div className="p-4 overflow-auto">
                        {/* Keep your existing form JSX here */}
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto p-4 border-t border-gray-400">
                        <h3 className="text-lg font-semibold mb-2">Edited Normal Value List</h3>
                        <table className="min-w-full border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="border px-4 py-2">S.No</th>
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
                                        <td className="border px-4 py-2">{index + 1}</td>
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
                                        <td className="border px-4 py-2 flex space-x-2">
                                            <button className="text-blue-500 hover:underline" onClick={() => handleEdit(index)}>Edit</button>
                                            <button className="text-red-500 hover:underline" onClick={() => handleRemove(index)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between p-4 bg-gray-200">
                    <button className="bg-gray-500 text-white rounded-lg py-2 px-4 hover:bg-gray-600" onClick={handleClose}>Cancel</button>
                    <button className="bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-green-600" onClick={handleSubmit}>Submit</button>
                </div>

            </div>
        </div>
    );
};

export default AddInvestigationResultNormalValueModal;
