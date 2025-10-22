import React, { useState } from "react";

const testProfiles = [
  { id: 1, name: "Basic Metabolic Panel", code: "BMP", department: "Biochemistry", amount: 500, tubeColor: "Red", volume: 5, sampleCollection: "Serum" },
  { id: 2, name: "Complete Blood Count", code: "CBC", department: "Hematology", amount: 300, tubeColor: "Lavender", volume: 3, sampleCollection: "Whole Blood" },
  { id: 3, name: "Lipid Profile", code: "LIPID", department: "Biochemistry", amount: 700, tubeColor: "Yellow", volume: 4, sampleCollection: "Serum" },
  { id: 4, name: "Liver Function Test", code: "LFT", department: "Biochemistry", amount: 800, tubeColor: "Green", volume: 5, sampleCollection: "Plasma" }
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
  
  // Tab state
  const [activeTab, setActiveTab] = useState('investigation');
  
  const handleAddTest = (e) => {
    if (e) e.preventDefault();
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
    if (!shortCodeInput.trim()) return;
    
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

  const addPaymentMethod = (e) => {
    e.preventDefault();    
    setPayments([...payments, { method: "Cash", amount: 0 }]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto my-8">
      <div className="p-6 bg-gray-50 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Patient Test & Billing System</h2>
      </div>
      
      {/* Tabs Navigation */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-4 px-6 text-center font-medium text-lg ${activeTab === 'investigation' ? 
            'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
           onClick={(e) => { e.preventDefault(); setActiveTab('investigation'); }}
        >
          Investigation
        </button>
        <button
          className={`flex-1 py-4 px-6 text-center font-medium text-lg ${activeTab === 'billing' ? 
            'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
           onClick={(e) => { e.preventDefault(); setActiveTab('billing'); }}

        >
          Billing
        </button>
      </div>
      
      {/* Investigation Section */}
      {activeTab === 'investigation' && (
        <div className="p-6 space-y-6">
          {/* Add Test Forms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add by Shortcode */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Add Tests by Code</h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Test Codes (comma separated):</label>
                  <input
                    value={shortCodeInput}
                    onChange={e => setShortCodeInput(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. CBC, BMP, LIPID"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleShortCodeAdd}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Add Tests
                </button>
              </form>
            </div>


            {/* Add by Dropdown or Code */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Add Single Test</h3>
              <form onSubmit={handleAddTest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Test:</label>
                  <select
                    value={selectedProfile}
                    onChange={e => setSelectedProfile(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select a Test --</option>
                    {testProfiles.map(test => (
                      <option key={test.id} value={test.id}>
                        {test.name} ({test.code}) - ₹{test.amount}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="text-center text-gray-500">OR</div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Test Code:</label>
                  <input
                    type="text"
                    value={testCodeInput}
                    onChange={e => setTestCodeInput(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. CBC, BMP"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={handleAddTest}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded"
                >
                  Add Test
                </button>
              </form>
            </div>
          </div>

          {/* Tests Table */}
          {tests.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SL No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tube Color</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sample Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tests.map((test, index) => (
                      <tr key={test.uid}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{test.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{test.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{test.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{test.tubeColor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{test.volume} mL</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{test.sampleCollection}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{test.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <button
                            onClick={() => handleRemoveTest(test.uid)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="7" className="px-6 py-3 text-right text-sm font-medium text-gray-700">Total</td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-700">₹{totalAmount}</td>
                      <td className="px-6 py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">No tests added yet. Please add tests using the forms above.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Billing Section */}
      {activeTab === 'billing' && (
        <div className="p-6 space-y-6">
          {/* Summary Card */}
          <div className="bg-gray-50 p-4 rounded-lg border grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-r border-gray-200 pr-4">
              <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
              <p className="text-xl font-bold">₹{totalAmount}</p>
            </div>
            <div className="border-r border-gray-200 pr-4">
              <h3 className="text-sm font-medium text-gray-500">Discount ({discount.type})</h3>
              <p className="text-xl font-bold">{discount.value} {discount.type === "%" ? "" : "₹"}</p>
            </div>
            <div className="border-r border-gray-200 pr-4">
              <h3 className="text-sm font-medium text-gray-500">Receivable</h3>
              <p className="text-xl font-bold text-blue-600">₹{receivable}</p>
            </div>
            <div className="">
              <h3 className="text-sm font-medium text-gray-500">Due Amount</h3>
              <p className={`text-xl font-bold ${dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹{dueAmount}
              </p>
            </div>
          </div>

          {/* Discount Controls */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Discount</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                <select
                  value={discount.type}
                  onChange={e => setDiscount({ ...discount, type: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="%">Percentage (%)</option>
                  <option value="₹">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                <input
                  type="number"
                  min="0"
                  value={discount.value}
                  onChange={e => {
                    const value = e.target.value;
                    setDiscount({ ...discount, value: value === "" ? "" : Number(value) })
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={(e) => { e.preventDefault(); setDiscount({ type: "%", value: 0 });}}

                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
                >
                  Reset Discount
                </button>
              </div>
            </div>
          </div>

          {/* Payments Section */}
          <div className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-800">Payments</h3>
              <button
                onClick={addPaymentMethod}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                + Add Payment
              </button>
            </div>
            
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                    <select
                      value={payment.method}
                      onChange={e => {
                        const newPayments = [...payments];
                        newPayments[index].method = e.target.value;
                        setPayments(newPayments);
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Cash</option>
                      <option>Credit</option>
                      <option>Card</option>
                      <option>UPI</option>
                      <option>Cheque</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      min="0"
                      value={payment.amount === 0 ? "" : payment.amount}
                      onChange={e => {
                        const newPayments = [...payments];
                        newPayments[index].amount = e.target.value === "" ? 0 : Number(e.target.value);
                        setPayments(newPayments);
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Amount"
                    />
                  </div>
                  <div className="flex items-end justify-end">
                    {payments.length > 1 && (
                      <button
                        onClick={() => {
                          const newPayments = [...payments];
                          newPayments.splice(index, 1);
                          setPayments(newPayments);
                        }}
                        className="text-red-600 hover:text-red-800 px-3 py-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

         {/* Notes & File Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notes */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Notes</h3>
            <textarea
              rows="4"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes..."
              maxLength={200}
            />
          </div>

          {/* File Upload */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Prescription Upload</h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Prescription (PDF/JPG/PNG, max 2MB)
              </label>
              <div className="flex items-center gap-4">
                <label className="block w-full">
                  <div className="border border-gray-300 border-dashed rounded-lg px-6 py-4 cursor-pointer hover:bg-gray-50 transition">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">
                        {prescriptionFile ? prescriptionFile.name : "Click to upload"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </label>
                {prescriptionFile && (
                  <button
                    type="button"
                    onClick={() => setPrescriptionFile(null)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
            onClick={(e) => {
            e.preventDefault();
    }}
          >
            Complete Billing
          </button>
        </div>
        
      </div>
    )}
  </div>
);
}
