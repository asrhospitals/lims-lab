import { useMemo, useState } from 'react';

const ProfileTestSection = () => {
  const [tests, setTests] = useState([]); // [{code,name,...}]
  const [selectedProfile, setSelectedProfile] = useState(''); // profile id as string
  const [testCode, setTestCode] = useState(''); // manual code input
  const [error, setError] = useState('');

  const testProfiles = [
    { id: 1, name: 'Basic Metabolic Panel', code: 'BMP',   tubeColor: 'Red',      volume: 5, sampleCollection: 'Serum',       amount: 200 },
    { id: 2, name: 'Complete Blood Count',   code: 'CBC',   tubeColor: 'Lavender', volume: 3, sampleCollection: 'Whole Blood', amount: 150 },
    { id: 3, name: 'Lipid Profile',          code: 'LIPID', tubeColor: 'Yellow',   volume: 4, sampleCollection: 'Serum',       amount: 300 },
    { id: 4, name: 'Liver Function Test',    code: 'LFT',   tubeColor: 'Green',    volume: 5, sampleCollection: 'Plasma',      amount: 250 }
  ];

  // Quick lookup maps
  const profileById = useMemo(
    () => new Map(testProfiles.map(p => [String(p.id), p])),
    [testProfiles]
  );
  const profileByCode = useMemo(
    () => new Map(testProfiles.map(p => [p.code.toLowerCase(), p])),
    [testProfiles]
  );

  const selectedProfileObj = useMemo(() => {
    if (selectedProfile) return profileById.get(String(selectedProfile)) || null;
    const code = testCode.trim().toLowerCase();
    if (code) return profileByCode.get(code) || null;
    return null;
  }, [selectedProfile, testCode, profileById, profileByCode]);

  const alreadyAdded = useMemo(() => {
    if (!selectedProfileObj) return false;
    return tests.some(t => t.code.toLowerCase() === selectedProfileObj.code.toLowerCase());
  }, [tests, selectedProfileObj]);

  const canAdd = !!selectedProfileObj && !alreadyAdded;

  const handleSelectChange = (e) => {
    setSelectedProfile(e.target.value);
    setTestCode('');           // mutually exclusive
    setError('');
  };

  const handleCodeChange = (e) => {
    setTestCode(e.target.value);
    setSelectedProfile('');    // mutually exclusive
    setError('');
  };

const handleAddTest = (e) => {
  e.preventDefault(); // prevent reload no matter what

  let profile = null;

  if (selectedProfile) {
    profile = testProfiles.find(p => p.id.toString() === selectedProfile);
  } else if (testCode) {
    profile = testProfiles.find(p => p.code.toLowerCase() === testCode.toLowerCase());
  }

  if (!profile) return;

  const newTest = {
    id: Date.now(), // safer than tests.length + 1
    name: profile.name,
    code: profile.code,
    tubeColor: profile.tubeColor,
    volume: profile.volume,
    sampleCollection: profile.sampleCollection,
    amount: profile.amount
  };

  setTests(prev => [...prev, newTest]);
  resetForm();
};

  const resetForm = () => {
    setSelectedProfile('');
    setTestCode('');
    setError('');
  };

  const handleDeleteTest = (e, code) => {
    e.preventDefault();
    setTests(prev => prev.filter(t => t.code !== code));
  };

  const totalAmount = useMemo(
    () => tests.reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [tests]
  );





  return (
    <div className="px-6 pt-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-0">Add Profile and Test</h3>
      <div className="mt-1 border-b border-gray-100"></div>

      <form onSubmit={handleAddTest} className="p-6 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Select Profile</label>
          <select
            value={selectedProfile}
            onChange={handleSelectChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Profile</option>
            {testProfiles.map(profile => (
              <option key={profile.id} value={profile.id}>{profile.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <span className="text-sm text-gray-500">OR</span>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Enter Test Code</label>
          <input
            type="text"
            value={testCode}
            onChange={handleCodeChange}
            placeholder="e.g. CBC, BMP, LIPID, LFT"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleAddTest}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
            >
            Add
            </button>

        </div>

        {error && (
          <div className="col-span-6 -mt-2">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </form>

      {tests.length > 0 && (
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SL No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name of Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tube Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume (ML)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sample Collection</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tests.map((test, index) => (
                  <tr key={test.key}>
                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{test.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{test.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{test.tubeColor}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{test.volume}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{test.sampleCollection}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{test.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <button
                        onClick={(e) => handleDeleteTest(e, test.code)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900" colSpan={6}>Total</td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900">{totalAmount}</td>
                  <td className="px-6 py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTestSection;
