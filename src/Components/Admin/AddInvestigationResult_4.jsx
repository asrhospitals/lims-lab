import React, { useState } from 'react';
import AddInvestigationResultNormalValueModal from './AddInvestigationResultNormalValueModal';
import AddInvestigationResultMandatoryConditions from './AddInvestigationResultMandatoryConditions';
import AddInvestigationResultReflexTests from './AddInvestigationResultReflexTests';





const AddInvestigationResult = () => {

    const [showNormalValueModal, setShowNormalValueModal] = useState(false);
    const [showMandatoryConditionsModal, setShowMandatoryConditionsModal] = useState(false);
    const [showReflexTestsModal, setShowReflexTestsModal] = useState(false);
    const handleCloseNormalValue = () => setShowNormalValueModal(false);
    const handleShowNormalValue = () => setShowNormalValueModal(true);
    const handleCloseMandatoryConditions = () => setShowMandatoryConditionsModal(false);
    const handleShowMandatoryConditions = () => setShowMandatoryConditionsModal(true);
    const handleCloseReflexTests = () => setShowReflexTestsModal(false);
    const handleShowReflexTests = () => setShowReflexTestsModal(true);

  const [results, setResults] = useState([]);
  const [newResult, setNewResult] = useState({
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

  const handleAddResult = (e) => {
    e.preventDefault();
    setResults([...results, newResult]);
    
    setNewResult({
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
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewResult({ 
      ...newResult, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleOpenModal = (type) => {
    // Logic to open modal based on type
    console.log(`${type} modal opened`);
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
              <tr key={index} className="bg-white hover:bg-gray-50">
                <td className="border px-2 py-1">{result.name}</td>
                <td className="border px-2 py-1">{result.otherLanguageName}</td>
                <td className="border px-2 py-1">{result.extResultId}</td>
                <td className="border px-2 py-1">{result.order}</td>
                <td className="border px-2 py-1">{result.unit}</td>
                <td className="border px-2 py-1">{result.formula}</td>
                <td className="border px-2 py-1">{result.valueType}</td>
                <td className="border px-2 py-1">{result.defaultValue}</td>
                <td className="border px-2 py-1">{result.roundOff}</td>
                <td className="border px-2 py-1">{result.normalValues.join(', ')}</td>
                <td className="border px-2 py-1">{result.mandatoryConditions.join(', ')}</td>
                <td className="border px-2 py-1">{result.reflexTests.join(', ')}</td>
                <td className="border px-2 py-1">{result.showTrends ? 'Yes' : 'No'}</td>
                <td className="border px-2 py-1 text-center">
                  <button 
                    className="text-red-600 hover:text-red-800 text-xs"
                    onClick={() => { /* Add delete functionality */ }}
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
          <label className="block text-sm font-medium text-gray-700">Result Name</label>
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



        {/* <div>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-5 w-full" 
            onClick={() => handleOpenModal('normal values')}
          >
            Add Normal Values
          </button>
        </div> */}



        {/* <div>
            <button variant="primary" onClick={handleShow}>
                Open Modal
            </button>
            <AddInvestigationResultNormalValueModal showModal={show} handleClose={handleClose} />
        </div> */}

      





        {/* <div>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-5 w-full"
            onClick={() => handleOpenModal('mandatory conditions')}
          >
            Add Mandatory Conditions
          </button>
        </div> */}

        


        {/* <div>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-5 w-full"
            onClick={() => handleOpenModal('reflex tests')}
          >
            Add Reflex Tests
          </button>
        </div> */}

        
            {/* Add Normal Values Button */}
                        <div className="">
                            <button
                                onClick={handleShowNormalValue}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mt-5 w-full"
                            >
                                Add Normal Values
                            </button>
                            <AddInvestigationResultNormalValueModal showModal={showNormalValueModal} handleClose={handleCloseNormalValue} />
                        </div>
            
                        {/* Add Mandatory Conditions Button */}
                        <div className="">
                            <button
                                onClick={handleShowMandatoryConditions}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mt-5 w-full"
                            >
                                Add Mandatory Conditions
                            </button>
                            <AddInvestigationResultMandatoryConditions showModal={showMandatoryConditionsModal} handleClose={handleCloseMandatoryConditions} />
                        </div>
            
                        {/* Add Reflex Tests Button */}
                        <div className="">
                            <button
                                onClick={handleShowReflexTests}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mt-5 w-full"
                            >
                                Add Reflex Tests
                            </button>
                            <AddInvestigationResultReflexTests showModal={showReflexTestsModal} handleClose={handleCloseReflexTests} />
                        </div>

     




        <div>
          <label className="inline-block text-sm font-medium text-gray-700 " htmlFor='showTrends'>Show Trends</label>
          <input 
            type="checkbox" 
            name="showTrends" 
            checked={newResult.showTrends} 
            onChange={handleChange} 
            className='mx-4 mt-4'
            id='showTrends'
          />
        </div>
        <div className="col-span-full text-center">
          <button 
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            onClick={handleAddResult}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInvestigationResult;
