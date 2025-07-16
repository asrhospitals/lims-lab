import React, { useState } from 'react';

const InvestigationDetails = () => {
  const [items, setItems] = useState({
    accreditation: { name: "", date: "" },
    consumable: { name: "", qty: "" },
    labConsumable: { name: "", qty: "" },
  });

  const [itemLists, setItemLists] = useState({
    accreditationList: [],
    consumablesList: [],
    labConsumablesList: [],
  });

  const addItem = (type) => {
    const currentItem = items[type];
    if (type === "accreditation" && currentItem.name && currentItem.date) {
      setItemLists((prev) => ({
        ...prev,
        accreditationList: [...prev.accreditationList, currentItem],
      }));
      setItems((prev) => ({ ...prev, [type]: { name: "", date: "" } }));
    } else if (type === "consumable" && currentItem.name && currentItem.qty) {
      setItemLists((prev) => ({
        ...prev,
        consumablesList: [...prev.consumablesList, currentItem],
      }));
      setItems((prev) => ({ ...prev, [type]: { name: "", qty: "" } }));
    } else if (type === "labConsumable" && currentItem.name && currentItem.qty) {
      setItemLists((prev) => ({
        ...prev,
        labConsumablesList: [...prev.labConsumablesList, currentItem],
      }));
      setItems((prev) => ({ ...prev, [type]: { name: "", qty: "" } }));
    }
  };

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    setItems((prev) => ({
      ...prev,
      [type]: { ...prev[type], [name]: value },
    }));
  };

  const renderRows = (list, type) => {
    return list.map((item, index) => (
      <tr key={index} className="text-sm">
        <td className="border px-2 py-1">{item.name}</td>
        <td className="border px-2 py-1">{item.date || item.qty}</td>
      </tr>
    ));
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Section: Accreditation */}
      <div className="col-span-full">
        <h3 className="font-bold mb-2">Add Accreditation</h3>
        <table className="mb-4 w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-orange-600">Name</th>
              <th className="border px-2 py-1 text-orange-600">Date</th>
              <th className="border px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">
                <input
                  name="name"
                  value={items.accreditation.name}
                  onChange={(e) => handleChange(e, "accreditation")}
                  placeholder="Accreditation Name"
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  name="date"
                  value={items.accreditation.date}
                  type="date"
                  onChange={(e) => handleChange(e, "accreditation")}
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default behavior
                    addItem("accreditation");
                  }}
                  className="bg-white border text-purple-700 border-purple-700 px-3 py-1 rounded hover:bg-purple-100"
                >
                  Add
                </button>
              </td>
            </tr>
            {renderRows(itemLists.accreditationList, "accreditation")}
          </tbody>
        </table>
      </div>

      {/* Section: Consumables */}
      <div className="col-span-full">
        <h3 className="font-bold mb-2">Add Consumables</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-orange-600">Product Name</th>
              <th className="border px-2 py-1 text-orange-600">Qty</th>
              <th className="border px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">
                <input
                  name="name"
                  value={items.consumable.name}
                  onChange={(e) => handleChange(e, "consumable")}
                  placeholder="Product Name"
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  name="qty"
                  value={items.consumable.qty}
                  onChange={(e) => handleChange(e, "consumable")}
                  placeholder="Quantity"
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default behavior
                    addItem("consumable");
                  }}
                  className="bg-white border text-purple-700 border-purple-700 px-3 py-1 rounded hover:bg-purple-100"
                >
                  Add
                </button>
              </td>
            </tr>
            {renderRows(itemLists.consumablesList, "consumable")}
          </tbody>
        </table>
      </div>

      {/* Section: Lab Consumables */}
      <div className="col-span-full">
        <h3 className="font-bold mb-2">Lab Consumables</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-orange-600">Product Name</th>
              <th className="border px-2 py-1 text-orange-600">Qty</th>
              <th className="border px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {renderRows(itemLists.labConsumablesList, "labConsumable")}

            <tr>
              <td className="border px-2 py-1">
                <input
                  name="name"
                  value={items.labConsumable.name}
                  onChange={(e) => handleChange(e, "labConsumable")}
                  placeholder="Product Name"
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  name="qty"
                  value={items.labConsumable.qty}
                  onChange={(e) => handleChange(e, "labConsumable")}
                  placeholder="Quantity"
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default behavior
                    addItem("labConsumable");
                  }}
                  className="bg-white border text-purple-700 border-purple-700 px-3 py-1 rounded hover:bg-purple-100"
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestigationDetails;
