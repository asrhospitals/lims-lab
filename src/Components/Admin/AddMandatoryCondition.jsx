import { useState } from 'react';

const AddMandatoryConditions = ({ showModal, handleClose, onDataUpdate }) => {
    const [formData, setFormData] = useState({
        resultName: '',
        resultValue: '',
    });

    const [conditions, setConditions] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        setConditions([...conditions, formData]);
        setFormData({
            resultName: '',
            resultValue: '',
        });
    };

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Validate required fields
        if (!formData.resultName || !formData.resultValue) {
            alert("Both Result Name and Result Value are required");
            return;
        }
        
        handleSubmit();
    };

    const handleRemove = (index) => {
        setConditions(conditions.filter((_, i) => i !== index));
    };

    return (
        <div
            className={`${showModal ? 'block' : 'hidden'} fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75`}
        >
            <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full  max-w-3xl p-6">
                <div className="border-b border-green-400 pb-3">
                    <h2 className="text-xl font-semibold text-center">Mandatory Conditions</h2>
                    <button className="text-gray-600 float-right" onClick={handleClose}>
                        ✖
                    </button>
                </div>
                <form onSubmit={handleAdd} className="mt-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Result Name</label>
                        <select
                            name="resultName"
                            className="mt-2 block w-full p-2 border border-gray-300 rounded"
                            onChange={handleChange}
                            value={formData.resultName}
                        >
                            <option value="">Select Result</option>
                            <option value="Result C">Result</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Result Value</label>
                        <input
                            name="resultValue"
                            type="text"
                            placeholder="Result Value"
                            className="mt-2 block w-full p-2 border border-gray-300 rounded"
                            onChange={handleChange}
                            value={formData.resultValue}
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            className="bg-orange-500 text-white rounded-lg py-2 px-4 hover:bg-orange-600"
                            onClick={handleAdd}
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            className="bg-gray-500 text-white rounded-lg py-2 px-4 hover:bg-gray-600"
                            onClick={() => {
                                onDataUpdate && onDataUpdate(conditions);
                                handleClose();
                            }}
                        >
                            Submit & Close
                        </button>
                    </div>
                </form>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Added Conditions</h3>
                    <ul>
                        {conditions.map((condition, index) => (
                            <li key={index} className="flex justify-between border-b py-2">
                                <span>{`${condition.resultName}: ${condition.resultValue}`}</span>
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => handleRemove(index)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AddMandatoryConditions;
