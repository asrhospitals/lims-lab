import React, { useState } from 'react';

const InvestigationDetails = () => {
  // State for form inputs
  const [inputs, setInputs] = useState({
    accreditation: { name: "", date: "" },
    consumable: { name: "", qty: "" },
    labConsumable: { name: "", qty: "" }
  });

  // State for stored items
  const [items, setItems] = useState({
    accreditation: [],
    consumable: [],
    labConsumable: []
  });

  // Editing state
  const [editing, setEditing] = useState({
    type: null,
    index: null
  });

  // Handle input changes for all types
  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [name]: value
      }
    }));
  };

  // Add or Update item
  const handleAddItem = (type, e) => {
    e.preventDefault();
    const currentInput = inputs[type];
    
    // Validate required fields
    if (!currentInput.name || (type === "accreditation" ? !currentInput.date : !currentInput.qty)) {
      return;
    }

    if (editing.type === type && editing.index !== null) {
      // Update existing item
      const updatedItems = [...items[type]];
      updatedItems[editing.index] = currentInput;
      setItems(prev => ({
        ...prev,
        [type]: updatedItems
      }));
      setEditing({ type: null, index: null });
    } else {
      // Add new item
      setItems(prev => ({
        ...prev,
        [type]: [...prev[type], currentInput]
      }));
    }

    // Clear inputs
    setInputs(prev => ({
      ...prev,
      [type]: type === "accreditation" ? { name: "", date: "" } : { name: "", qty: "" }
    }));
  };

  // Edit item
  const handleEdit = (type, index, e) => {
    e.preventDefault();
    const itemToEdit = items[type][index];
    setInputs(prev => ({
      ...prev,
      [type]: { ...itemToEdit }
    }));
    setEditing({ type, index });
  };

  // Remove item
  const handleRemove = (type, index, e) => {
    e.preventDefault();
    const updatedItems = items[type].filter((_, i) => i !== index);
    setItems(prev => ({
      ...prev,
      [type]: updatedItems
    }));
    
    // If editing this item, cancel edit
    if (editing.type === type && editing.index === index) {
      setEditing({ type: null, index: null });
      setInputs(prev => ({
        ...prev,
        [type]: type === "accreditation" ? { name: "", date: "" } : { name: "", qty: "" }
      }));
    } else if (editing.index > index) {
      // Adjust editing index if needed
      setEditing(prev => ({ ...prev, index: prev.index - 1 }));
    }
  };

  // Render rows for all types
  const renderRows = (type) => {
    return items[type].map((item, index) => (
      <tr key={`${type}-${index}`} className="text-sm hover:bg-gray-50">
        <td className="border px-2 py-1">{item.name}</td>
        <td className="border px-2 py-1">{type === "accreditation" ? item.date : item.qty}</td>
        <td className="border px-2 py-1">
          <button
            onClick={(e) => handleEdit(type, index, e)}
            className="text-blue-600 hover:underline mr-3"
          >
            Edit
          </button>
        </td>
        <td className="border px-2 py-1">
          <button
            onClick={(e) => handleRemove(type, index, e)}
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        </td>
      </tr>
    ));
  };

  // Form fields for all types
  const renderFormFields = (type) => (
    <tr>
      <td className="border px-2 py-1">
        <input
          name="name"
          value={inputs[type].name}
          onChange={(e) => handleInputChange(e, type)}
          placeholder={
            type === "accreditation" ? "Accreditation Name" : 
            "Product Name"
          }
          className="w-full border px-2 py-1"
        />
      </td>
      <td className="border px-2 py-1">
        {type === "accreditation" ? (
          <input
            name="date"
            value={inputs[type].date}
            type="date"
            onChange={(e) => handleInputChange(e, type)}
            className="w-full border px-2 py-1"
          />
        ) : (
          <input
            name="qty"
            value={inputs[type].qty}
            onChange={(e) => handleInputChange(e, type)}
            placeholder="Quantity"
            className="w-full border px-2 py-1"
          />
        )}
      </td>
      <td className="border px-2 py-1" colSpan="2">
        <button
          onClick={(e) => handleAddItem(type, e)}
          className={`px-3 py-1 rounded ${
            editing.type === type ? 
            "bg-yellow-100 text-yellow-700 border-yellow-700" :
            "bg-purple-100 text-purple-700 border-purple-700"
          } border hover:opacity-90`}
        >
          {editing.type === type ? "Update" : "Add"}
        </button>
      </td>
    </tr>
  );

  return (
    <div className="p-6 grid gap-6">
      {/* Accreditation Section */}
      <div className="col-span-full">
        <h3 className="font-bold mb-2">Add Accreditation</h3>
        <table className="mb-4 w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-orange-600">Name</th>
              <th className="border px-2 py-1 text-orange-600">Date</th>
              <th className="border px-2 py-1" colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderFormFields("accreditation")}
            {renderRows("accreditation")}
          </tbody>
        </table>
      </div>

      {/* Consumables Section */}
      <div className="col-span-full">
        <h3 className="font-bold mb-2">Add Consumables</h3>
        <table className="mb-4 w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-orange-600">Product</th>
              <th className="border px-2 py-1 text-orange-600">Qty</th>
              <th className="border px-2 py-1" colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderFormFields("consumable")}
            {renderRows("consumable")}
          </tbody>
        </table>
      </div>

      {/* Lab Consumables Section */}
      <div className="col-span-full">
        <h3 className="font-bold mb-2">Lab Consumables</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-orange-600">Product</th>
              <th className="border px-2 py-1 text-orange-600">Qty</th>
              <th className="border px-2 py-1" colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderFormFields("labConsumable")}
            {renderRows("labConsumable")}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestigationDetails;