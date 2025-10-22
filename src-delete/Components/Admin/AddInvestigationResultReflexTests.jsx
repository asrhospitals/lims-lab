import { useState } from 'react';

const AddInvestigationResultReflexTests = ({ showModal, handleClose }) => {
    const [formData, setFormData] = useState({
        triggerParameter: '',
        reflexTest: '',
    });

    const [selectedTests, setSelectedTests] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddTest = (e) => {
        e.preventDefault();
        if (formData.reflexTest) {
            setSelectedTests([...selectedTests, formData.reflexTest]);
            setFormData({ ...formData, reflexTest: '' }); // Reset reflex test input
        }
    };

    const handleRemoveTest = (index) => {
        setSelectedTests(selectedTests.filter((_, i) => i !== index));
    };

    return (
        <div className={`${showModal ? 'block' : 'hidden'} fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75`}>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-3xl p-6">
                <div className="border-b border-green-400 pb-3">
                    <h2 className="text-xl font-semibold text-center">Reflex Tests</h2>
                    <button className="text-gray-600 float-right" onClick={handleClose}>
                        ✖
                    </button>
                </div>
                <form onSubmit={handleAddTest} className="mt-4">
                    <div className="mb-4">
                        <label className="inline-block text-gray-700">Trigger Parameter *</label>

                        <div className="justify-evenly flex">
                            <label className="inline-flex items-center ">
                                <input
                                    type="radio"
                                    name="triggerParameter"
                                    value="critical"
                                    onChange={handleChange}
                                    className="form-radio"
                                />
                                <span className="ml-2">Critical Range</span>
                            </label>
                            <label className="inline-flex items-center ml-4">
                                <input
                                    type="radio"
                                    name="triggerParameter"
                                    value="abnormal"
                                    onChange={handleChange}
                                    className="form-radio"
                                />
                                <span className="ml-2">Abnormal Range</span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Choose Reflex Tests *</label>
                        <select
                            name="reflexTest"
                            className="mt-2 block w-full p-2 border border-gray-300 rounded"
                            onChange={handleChange}
                            value={formData.reflexTest}
                        >
                            <option value="">Select Test</option>
                            <option value="Test A">Test A</option>
                            <option value="Test B">Test B</option>
                            <option value="Test C">Test C</option>
                        </select>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            className="bg-orange-500 text-white rounded-lg py-2 px-4 hover:bg-orange-600"
                            onClick={handleAddTest}
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            className="bg-gray-500 text-white rounded-lg py-2 px-4 hover:bg-gray-600"
                            onClick={handleClose}
                        >
                            Close
                        </button>
                    </div>
                </form>
                
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Selected Tests</h3>
                    <ul>
                        {selectedTests.map((test, index) => (
                            <li key={index} className="flex justify-between border-b py-2">
                                <span>{`${index + 1}. ${test}`}</span>
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => handleRemoveTest(index)}
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

export default AddInvestigationResultReflexTests;
