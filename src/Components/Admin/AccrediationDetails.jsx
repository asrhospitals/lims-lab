import React, { useState, useEffect } from 'react';

const AccrediationDetails = ({
  accreditationItems = [],
  setAccreditationItems,
  consumableItems = [],
  setConsumableItems,
  labConsumableItems = [],
  setLabConsumableItems,
}) => {
  const [inputs, setInputs] = useState({
    accreditation: { name: "", date: "" },
    consumable: { name: "", qty: "" },
    labConsumable: { name: "", qty: "" }
  });
  const [items, setItems] = useState({
    accreditation: accreditationItems,
    consumable: consumableItems,
    labConsumable: labConsumableItems
  });
  useEffect(() => {
    setItems({
      accreditation: accreditationItems,
      consumable: consumableItems,
      labConsumable: labConsumableItems
    });
  }, [accreditationItems, consumableItems, labConsumableItems]);

  const updateParentState = (type, newItems) => {
    if (type === "accreditation") {
      setAccreditationItems(newItems);
    } else if (type === "consumable") {
      setConsumableItems(newItems);
    } else if (type === "labConsumable") {
      setLabConsumableItems(newItems);
    }
  };

  const [editing, setEditing] = useState({
    type: null,
    index: null
  });
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

  const handleAddItem = (type, e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentInput = inputs[type];
    
    if (!currentInput.name || (type === "accreditation" ? !currentInput.date : !currentInput.qty)) {
      alert(`Please fill in all required fields for ${type}`);
      return;
    }

    if (editing.type === type && editing.index !== null) {
      const updatedItems = [...items[type]];
      updatedItems[editing.index] = currentInput;
      updateParentState(type, updatedItems);
      setEditing({ type: null, index: null });
    } else {
      updateParentState(type, [...items[type], currentInput]);
    }

    setInputs(prev => ({
      ...prev,
      [type]: type === "accreditation" ? { name: "", date: "" } : { name: "", qty: "" }
    }));
  };

  const handleEdit = (type, index, e) => {
    e.preventDefault();
    const itemToEdit = items[type][index];
    setInputs(prev => ({
      ...prev,
      [type]: { ...itemToEdit }
    }));
    setEditing({ type, index });
  };

  const handleRemove = (type, index, e) => {
    e.preventDefault();
    const updatedItems = items[type].filter((_, i) => i !== index);
    updateParentState(type, updatedItems);
    
    if (editing.type === type && editing.index === index) {
      setEditing({ type: null, index: null });
      setInputs(prev => ({
        ...prev,
        [type]: type === "accreditation" ? { name: "", date: "" } : { name: "", qty: "" }
      }));
    } else if (editing.index > index) {
      setEditing(prev => ({ ...prev, index: prev.index - 1 }));
    }
  };

  const renderRows = (type) => {
    return items[type].map((item, index) => (
      <tr key={`${type}-${index}`} className="text-sm hover:bg-gray-50">
        <td className="border px-2 py-1">{item.name}</td>
        <td className="border px-2 py-1">{type === "accreditation" ? item.date : item.qty}</td>
        <td className="border px-2 py-1">
          <button
            type="button"
            onClick={(e) => handleEdit(type, index, e)}
            className="text-blue-600 hover:underline mr-3"
          >
            Edit
          </button>
        </td>
        <td className="border px-2 py-1">
          <button
            type="button"
            onClick={(e) => handleRemove(type, index, e)}
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        </td>
      </tr>
    ));
  };

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
          type="button"
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
    <div className="p-6 grid gap-6 w-full">
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

export default AccrediationDetails;
