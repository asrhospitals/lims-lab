import React, { useState } from 'react';

const InvestigationDetails = () => {
  // Accreditation
  const [accreditation, setAccreditation] = useState({ name: "", date: "" });
  const [accreditationList, setAccreditationList] = useState([]);

  // Consumables
  const [consumable, setConsumable] = useState({ name: "", qty: "" });
  const [consumablesList, setConsumablesList] = useState([]);

  // Lab Consumables
  const [labConsumable, setLabConsumable] = useState({ name: "", qty: "" });
  const [labConsumablesList, setLabConsumablesList] = useState([]);

  // Add handlers
  const addItem = (type) => {
    if (type === "accreditation" && accreditation.name && accreditation.date) {
      setAccreditationList([...accreditationList, accreditation]);
      setAccreditation({ name: "", date: "" });
    } else if (type === "consumable" && consumable.name && consumable.qty) {
      setConsumablesList([...consumablesList, consumable]);
      setConsumable({ name: "", qty: "" });
    } else if (type === "lab" && labConsumable.name && labConsumable.qty) {
      setLabConsumablesList([...labConsumablesList, labConsumable]);
      setLabConsumable({ name: "", qty: "" });
    }
  };

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "accreditation") {
      setAccreditation({ ...accreditation, [name]: value });
    } else if (type === "consumable") {
      setConsumable({ ...consumable, [name]: value });
    } else if (type === "lab") {
      setLabConsumable({ ...labConsumable, [name]: value });
    }
  };

  // Table row generator
  const renderRows = (list, type) => {
    return list.map((item, index) => (
      <tr key={index} className="text-sm">
        <td className="border px-2 py-1">{item.name}</td>
        <td className="border px-2 py-1">{item.date || item.qty}</td>
      </tr>
    ));
  };

  return (
    <div  className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" >
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
                  value={accreditation.name}
                  onChange={(e) => handleChange(e, "accreditation")}
                  placeholder="Accreditation Name"
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  name="date"
                  value={accreditation.date}
                  type="date"
                  onChange={(e) => handleChange(e, "accreditation")}
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => addItem("accreditation")}
                  className="bg-white border text-purple-700 border-purple-700 px-3 py-1 rounded hover:bg-purple-100"
                >
                  Add
                 

                </button>
              </td>
            </tr>
            {renderRows(accreditationList, "accreditation")}
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
                  value={consumable.name}
                  onChange={(e) => handleChange(e, "consumable")}
                  placeholder="Product Name"
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  name="qty"
                  value={consumable.qty}
                  onChange={(e) => handleChange(e, "consumable")}
                  placeholder="Quantity"
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => addItem("consumable")}
                  className="bg-white border text-purple-700 border-purple-700 px-3 py-1 rounded hover:bg-purple-100"
                >
                  Add
                </button>
              </td>
            </tr>
            {renderRows(consumablesList, "consumable")}
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
            <tr>
              <td className="border px-2 py-1">
                <input
                  name="name"
                  value={labConsumable.name}
                  onChange={(e) => handleChange(e, "lab")}
                  placeholder="Product Name"
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  name="qty"
                  value={labConsumable.qty}
                  onChange={(e) => handleChange(e, "lab")}
                  placeholder="Quantity"
                  className="w-full border px-2 py-1"
                />
              </td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => addItem("lab")}
                  className="bg-white border text-purple-700 border-purple-700 px-3 py-1 rounded hover:bg-purple-100"
                >
                  Add
                </button>
              </td>
            </tr>
            {renderRows(labConsumablesList, "lab")}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestigationDetails;
