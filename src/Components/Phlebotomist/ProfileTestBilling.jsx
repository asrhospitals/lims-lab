import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProfileTestBilling() {
  const [tests, setTests] = useState([]);
  const [addedTests, setAddedTests] = useState([]);
  const [testCodeInput, setTestCodeInput] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [shortCodeInput, setShortCodeInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Billing states
  const [discount, setDiscount] = useState({ type: "%", value: 0 });
  const [amountReceived, setAmountReceived] = useState(0);
  const [note, setNote] = useState("");
  const [payments, setPayments] = useState([{ method: "Cash", amount: 0 }]);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [paymentModeType, setPaymentModeType] = useState("single"); // single or multiple

  // Tab state
  const [activeTab, setActiveTab] = useState("investigation");

  // Handle payment mode changes
  useEffect(() => {
    if (paymentModeType === "single" && payments.length > 1) {
      // Keep only the first payment method when switching to single mode
      setPayments([payments[0]]);
    }
  }, [paymentModeType]);

  // Fetch test profiles from the API
  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true); // Start loading
      try {
        const authToken = localStorage.getItem("authToken");
        const hospitalName = localStorage.getItem("hospital_name");
        const response = await axios.get(
          `https://asrlabs.asrhospitalindia.in/lims/master/get-test`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = (response.data || []).sort(
          (a, b) => Number(a.id) - Number(b.id)
        );
        setTests(data);
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError(err.response?.data?.message || "Failed to fetch tests.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchTests();
  }, []);

  const handleAddTest = (e) => {
    if (e) e.preventDefault();
    let profile = null;

    if (selectedProfile) {
      profile = tests.find((p) => p.id.toString() === selectedProfile);
    } else if (testCodeInput) {
      profile = tests.find(
        (p) => p.shortname.toLowerCase() === testCodeInput.toLowerCase()
      );
    }

    if (!profile) return;

    setAddedTests((prev) => [...prev, { ...profile, uid: Date.now() }]);
    setTestCodeInput("");
    setSelectedProfile("");
  };

  const handleShortCodeAdd = (e) => {
    e.preventDefault();
    if (!shortCodeInput.trim()) return;

    const codes = shortCodeInput.split(",").map((c) => c.trim().toLowerCase());
    const foundTests = tests.filter((p) =>
      codes.includes(p.shortname.toLowerCase())
    );

    if (foundTests.length) {
      setAddedTests((prev) => [
        ...prev,
        ...foundTests.map((ft) => ({ ...ft, uid: Date.now() + Math.random() })),
      ]);
    }
    setShortCodeInput("");
  };

  const handleRemoveTest = (uid) => {
    setAddedTests((prev) => prev.filter((t) => t.uid !== uid));
  };

  const totalAmount = addedTests.reduce((sum, t) => sum + t.walkinprice, 0);
  const discountValue =
    discount.type === "%"
      ? (totalAmount * discount.value) / 100
      : discount.value;
  const receivable = totalAmount - discountValue;
  
  const totalPaid = paymentModeType === "single" 
    ? payments[0]?.amount || 0 
    : payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const dueAmount = receivable - totalPaid;

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
        <h2 className="text-2xl font-bold text-gray-800">
          Patient Test & Billing System
        </h2>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-4 px-6 text-center font-medium text-lg ${
            activeTab === "investigation"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("investigation");
          }}
        >
          Investigation
        </button>
        <button
          className={`flex-1 py-4 px-6 text-center font-medium text-lg ${
            activeTab === "billing"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("billing");
          }}
        >
          Billing
        </button>
      </div>

      {/* Investigation Section */}
      {activeTab === "investigation" && (
        <div className="p-6 space-y-6">
          {loading && <p>Loading tests...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {/* Add Test Forms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add by Shortcode */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Add Tests by Code
              </h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Test Codes (comma separated):
                  </label>
                  <input
                    value={shortCodeInput}
                    onChange={(e) => setShortCodeInput(e.target.value)}
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
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Add Single Test
              </h3>
              <form onSubmit={handleAddTest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Test:
                  </label>
                  <select
                    value={selectedProfile}
                    onChange={(e) => setSelectedProfile(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select a Test --</option>
                    {tests.map((test) => (
                      <option key={test.id} value={test.id}>
                        {test.testname} ({test.shortname}) - ₹{test.walkinprice}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-center text-gray-500">OR</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Test Code:
                  </label>
                  <input
                    type="text"
                    value={testCodeInput}
                    onChange={(e) => setTestCodeInput(e.target.value)}
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
          {addedTests.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        SL No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Test Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tube Color
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Volume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Sample Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {addedTests.map((test, index) => (
                      <tr key={test.uid}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {test.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {test.testname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {test.shortname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {test.containertype}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {test.sampleqty} mL
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {test.sampletype}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          ₹{test.walkinprice}
                        </td>
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
                      <td
                        colSpan="7"
                        className="px-6 py-3 text-right text-sm font-medium text-gray-700"
                      >
                        Total
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-700">
                        ₹{totalAmount}
                      </td>
                      <td className="px-6 py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">
                No tests added yet. Please add tests using the forms above.
              </p>
            </div>
          )}
        </div>
      )}
      {/* Billing Section */}
      {activeTab === "billing" && (
        <div className="p-6 space-y-6">
          {/* Summary Card */}
          <div className="bg-gray-50 p-4 rounded-lg border grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="border-r border-gray-200 pr-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Amount
              </h3>
              <p className="text-xl font-bold">₹{totalAmount}</p>
            </div>
            <div className="border-r border-gray-200 pr-4">
              <h3 className="text-sm font-medium text-gray-500">
                Discount ({discount.type})
              </h3>
              <p className="text-xl font-bold">
                {discount.value} {discount.type === "%" ? "" : "₹"}
              </p>
            </div>
            <div className="border-r border-gray-200 pr-4">
              <h3 className="text-sm font-medium text-gray-500">Receivable</h3>
              <p className="text-xl font-bold text-blue-600">₹{receivable}</p>
            </div>
            <div className="border-r border-gray-200 pr-4">
              <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
              <p className="text-xl font-bold text-green-600">₹{totalPaid}</p>
            </div>
            <div className="">
              <h3 className="text-sm font-medium text-gray-500">Due Amount</h3>
              <p
                className={`text-xl font-bold ${
                  dueAmount > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                ₹{dueAmount}
              </p>
            </div>
          </div>

          {/* Discount Controls */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Discount</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type
                </label>
                <select
                  value={discount.type}
                  onChange={(e) =>
                    setDiscount({ ...discount, type: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="%">Percentage (%)</option>
                  <option value="₹">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount.value}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDiscount({
                      ...discount,
                      value: value === "" ? "" : Number(value),
                    });
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setDiscount({ type: "%", value: 0 });
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
                >
                  Reset Discount
                </button>
              </div>
            </div>
          </div>

          {/* Payment Mode Section */}
          <div className="bg-white border rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Mode</h3>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="single-payment"
                  name="paymentModeType"
                  value="single"
                  checked={paymentModeType === "single"}
                  onChange={(e) => setPaymentModeType(e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <label
                  htmlFor="single-payment"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Single
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="multiple-payment"
                  name="paymentModeType"
                  value="multiple"
                  checked={paymentModeType === "multiple"}
                  onChange={(e) => setPaymentModeType(e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <label
                  htmlFor="multiple-payment"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Multiple
                </label>
              </div>
            </div>
          </div>

          {/* Payments Section */}
          <div className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-800">Payments</h3>
              {paymentModeType === "multiple" && (
                <button
                  onClick={addPaymentMethod}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  + Add Payment
                </button>
              )}
            </div>

            <div className="space-y-4">
              {(paymentModeType === "single" ? payments.slice(0, 1) : payments).map((payment, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Method
                    </label>
                    <select
                      value={payment.method}
                      onChange={(e) => {
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={payment.amount === 0 ? "" : payment.amount}
                      onChange={(e) => {
                        const newPayments = [...payments];
                        newPayments[index].amount =
                          e.target.value === "" ? 0 : Number(e.target.value);
                        setPayments(newPayments);
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Amount"
                    />
                  </div>
                  <div className="flex items-end justify-end">
                    {paymentModeType === "multiple" && payments.length > 1 && (
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
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any additional notes..."
                maxLength={200}
              />
            </div>

            {/* File Upload */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Prescription Upload
              </h3>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Prescription (PDF/JPG/PNG, max 2MB)
                </label>
                <div className="flex items-center gap-4">
                  <label className="block w-full">
                    <div className="border border-gray-300 border-dashed rounded-lg px-6 py-4 cursor-pointer hover:bg-gray-50 transition">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <svg
                          className="h-10 w-10 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-600">
                          {prescriptionFile
                            ? prescriptionFile.name
                            : "Click to upload"}
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
