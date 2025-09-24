import React, { useState } from "react";

// Mock test profiles (with department and amount)
const testProfiles = [
  { id: 1, name: "Basic Metabolic Panel", code: "BMP", department: "Biochemistry", amount: 500 },
  { id: 2, name: "Complete Blood Count", code: "CBC", department: "Hematology", amount: 300 },
  { id: 3, name: "Lipid Profile", code: "LIPID", department: "Biochemistry", amount: 700 },
  { id: 4, name: "Liver Function Test", code: "LFT", department: "Biochemistry", amount: 800 }
];

export default function ProfileTestBilling() {
  const [tests, setTests] = useState([]);
  const [testCodeInput, setTestCodeInput] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [shortCodeInput, setShortCodeInput] = useState("");

  // Billing states
  const [discount, setDiscount] = useState({ type: "%", value: 0 });
  const [amountReceived, setAmountReceived] = useState(0);
  const [note, setNote] = useState("");
  const [payments, setPayments] = useState([{ method: "Cash", amount: 0 }]);
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  const handleAddTest = () => {
    let profile = null;

    if (selectedProfile) {
      profile = testProfiles.find(p => p.id.toString() === selectedProfile);
    } else if (testCodeInput) {
      profile = testProfiles.find(p => p.code.toLowerCase() === testCodeInput.toLowerCase());
    }

    if (!profile) return;

    setTests(prev => [...prev, { ...profile, uid: Date.now() }]);
    setTestCodeInput("");
    setSelectedProfile("");
  };

  const handleShortCodeAdd = (e) => {
    e.preventDefault();
    const codes = shortCodeInput.split(",").map(c => c.trim().toLowerCase());
    const foundTests = testProfiles.filter(p => codes.includes(p.code.toLowerCase()));

    if (foundTests.length) {
      setTests(prev => [
        ...prev,
        ...foundTests.map(ft => ({ ...ft, uid: Date.now() + Math.random() }))
      ]);
    }
    setShortCodeInput("");
  };

  const handleRemoveTest = (uid) => {
    setTests(prev => prev.filter(t => t.uid !== uid));
  };

  // Billing calculations
  const totalAmount = tests.reduce((sum, t) => sum + t.amount, 0);
  const discountValue = discount.type === "%"
    ? (totalAmount * discount.value) / 100
    : discount.value;
  const receivable = totalAmount - discountValue;
  const dueAmount = receivable - amountReceived;

  // Group by department
  const groupedTests = tests.reduce((acc, test) => {
    if (!acc[test.department]) acc[test.department] = [];
    acc[test.department].push(test);
    return acc;
  }, {});

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setPrescriptionFile(file);
    } else {
      alert("File too large (max 2MB)");
      e.target.value = null;
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-3">Investigation & Billing</h2>

      {/* Add by Shortcode */}
      <div className="mb-3">
        <label>Shortcode (comma separated):</label>
        <input
          value={shortCodeInput}
          onChange={e => setShortCodeInput(e.target.value)}
          className="border p-2 w-64"
        />
        <button
          onClick={handleShortCodeAdd}
          className="bg-blue-600 text-white px-3 py-1 ml-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Add by Dropdown or Code */}
      <div className="flex gap-2 mb-3 mt-3">
        <select
          value={selectedProfile}
          onChange={e => setSelectedProfile(e.target.value)}
          className="border p-2"
        >
          <option value="">Select Test</option>
          {testProfiles.map(test => (
            <option key={test.id} value={test.id}>{test.name} ({test.code})</option>
          ))}
        </select>
        <h3>OR</h3>
        <input
          type="text"
          placeholder="Search by code"
          value={testCodeInput}
          onChange={e => setTestCodeInput(e.target.value)}
          className="border p-2"
        />
        <button
          type="button"
          onClick={handleAddTest}
          className="bg-teal-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Table: Grouped by Department */}
      {Object.entries(groupedTests).map(([dept, deptTests]) => (
        <div key={dept} className="mb-4">
          <h3 className="font-semibold">{dept}</h3>
          <table className="border-collapse border w-full mb-2">
            <thead>
              <tr>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Code</th>
                <th className="border px-2 py-1">Amount</th>
                <th className="border px-2 py-1">Remove</th>
              </tr>
            </thead>
            <tbody>
              {deptTests.map(test => (
                <tr key={test.uid}>
                  <td className="border px-2 py-1">{test.name}</td>
                  <td className="border px-2 py-1">{test.code}</td>
                  <td className="border px-2 py-1">{test.amount}</td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleRemoveTest(test.uid)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Billing Section */}
      <div className="border-t pt-3 mt-6">
        <div className="ml-4 gap-2">
        <div>Total: ₹{totalAmount}</div>
        <div>
          Discount:
          <select
            value={discount.type}
            onChange={e => setDiscount({ ...discount, type: e.target.value })}
          >
            <option value="%">%</option>
            <option value="₹">₹</option>
          </select>
          <input
            type="number"
            value={discount.value}
            onChange={e => setDiscount({ ...discount, value: Number(e.target.value) })}
            className="border p-1 ml-2 w-20"
          />
        </div>
        <div>Receivable: ₹{receivable}</div>
        <div>
          Amount Received:
          <input
            type="number"
            value={amountReceived}
            onChange={e => setAmountReceived(Number(e.target.value))}
            className="border p-1 ml-2 w-20"
          />
        </div>
        <div>Due Amount: ₹{dueAmount}</div>

        {/* Payment Modes */}
        <div className="mt-10">
          <h4 className="font-semibold">Payment Methods</h4>
          {payments.map((p, idx) => (
            <div key={idx} className="flex gap-2 mb-1">
              <select
                value={p.method}
                onChange={e => {
                  const newPayments = [...payments];
                  newPayments[idx].method = e.target.value;
                  setPayments(newPayments);
                }}
                className="border p-1"
              >
                <option>Cash</option>
                <option>Credit</option>
                <option>DD</option>
                <option>Cheque</option>
                <option>UPI</option>
                <option>NEFT</option>
              </select>
              <input
                type="number"
                value={p.amount}
                onChange={e => {
                  const newPayments = [...payments];
                  newPayments[idx].amount = Number(e.target.value);
                  setPayments(newPayments);
                }}
                placeholder="Amount"
                className="border p-1 w-24"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPayments([...payments, { method: "Cash", amount: 0 }])}
            className="bg-green-600 text-white px-2 py-1 rounded"
          >
            + Add Payment Mode
          </button>
        </div>
          </div>

        {/* Note */}
        <div className="mt-4">
          <label>Note:</label>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            className="border p-1 ml-2 w-64"
            maxLength={200}
          />
        </div>

        {/* File Upload */}
        <div className="mt-2">
          <label>Prescription Upload (PDF/Image, max 2MB):</label>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileUpload}
            className="ml-2"
          />
          {prescriptionFile && <span className="ml-2 text-green-600">File ready</span>}
        </div>
      </div>
      
    </div>
  );
}
