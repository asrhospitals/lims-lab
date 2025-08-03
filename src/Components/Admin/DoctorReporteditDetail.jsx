import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiZoomIn, FiZoomOut, FiCheck, FiRotateCw, FiTrash2, FiPrinter, FiArrowLeft } from 'react-icons/fi';

const DoctorReporteditDetail = () => {
    const [showZoomModal, setShowZoomModal] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [editing, setEditing] = useState(false);
    const [reportData, setReportData] = useState({
        result1: 'REACTIVE',
        result2: 'REACTIVE',
        result: '',
        remark: 'eat more fruits and vegetables',
        hlFlag: 'H',
        units: 'Units',
        refRange: 'Reference Range',
        criticalRange: 'Critical Range',
        method: 'manual',
        sampleType: 'SERUM',
        image: "https://static.vecteezy.com/system/resources/thumbnails/002/098/203/small/silver-tabby-cat-sitting-on-green-background-free-photo.jpg",
        barCode: '3481529'
    });

    const handleChange = (field, value) => {
        setReportData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('image', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-5 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Patient Report Entry Section</h2>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-black mr-2">Patient ID:</span>
                            <span className="text-sm text-gray-800">ASR/PPP/1759525</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-black mr-2">Patient Details:</span>
                            <span className="text-sm text-gray-800">KHATI RAM REANG/24/M</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-black mr-2">Reference Centre:</span>
                            <span className="text-sm text-gray-800">DHALAI DISTRICT HOSPITAL</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Zoom Modal */}
            {showZoomModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => {
                        setShowZoomModal(false);
                        setZoomLevel(1);
                    }}
                >
                    <div 
                        className="bg-white rounded-lg p-6 max-w-4xl w-full mx-auto shadow-xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative w-full h-[70vh] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                            <img
                                src={reportData.image}
                                alt="Zoomable Preview"
                                className="max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out"
                                style={{
                                    transform: `scale(${zoomLevel})`,
                                }}
                            />
                        </div>
                        <div className="text-center mb-4 text-sm font-medium">
                            Zoom: {Math.round(zoomLevel * 100)}%
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setZoomLevel(prev => Math.min(prev + 0.1, 5));
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                                disabled={zoomLevel >= 5}
                            >
                                <FiZoomIn className="w-4 h-4" />
                                Zoom In
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
                                }}
                                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 transition-colors flex items-center gap-2"
                                disabled={zoomLevel <= 0.5}
                            >
                                <FiZoomOut className="w-4 h-4" />
                                Zoom Out
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setZoomLevel(1);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FiRotateCw className="w-4 h-4" />
                                Reset
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowZoomModal(false);
                                    setZoomLevel(1);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <FiX className="w-4 h-4" />
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Two Column Layout - Stack on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column - Remark and Action Buttons */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="mb-4">
                        <span className="text-base font-semibold text-gray-700">Remark: </span>
                        <span className="text-gray-800 ml-2">{reportData.remark}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-semibold shadow-sm w-full sm:w-auto">
                            OPEN OTHER REPORT
                        </button>
                        <button className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-semibold shadow-sm w-full sm:w-auto">
                            OPEN OLD REPORT
                        </button>
                    </div>
                </div>

                {/* Right Column - Image */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-center items-center">
                    <div 
                        className="cursor-pointer inline-block"
                        onClick={() => setShowZoomModal(true)}
                    >
                        <div className="relative group">
                            <img 
                                src={reportData.image} 
                                alt="Report Preview" 
                                className="h-32 w-40 object-cover rounded border border-gray-200 hover:shadow-md transition-shadow"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center rounded">
                                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    View
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Table - Make scrollable on mobile */}
            <div className="mb-8 overflow-x-auto">
                <div className="md:min-w-0 bg-white border border-gray-300">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Sl No.</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Profile Name</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Test Name</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Approval Pending Since</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Result 1</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Result 2</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Result</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">H/L Flag</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Units</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Reference Range</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Critical Range</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Method</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Sample Type</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Attach Image</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Bar Code</th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <tr>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">1</td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    <div className="text-xs leading-tight">
                                        <div>Profile</div>
                                        <div>Name</div>
                                    </div>
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    <div className="text-xs leading-tight">
                                        <div>Hepatitis</div>
                                        <div>C</div>
                                        <div>Antibody</div>
                                        <div>Test</div>
                                    </div>
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300"></td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    {editing ? (
                                        <select 
                                            value={reportData.result1}
                                            onChange={(e) => handleChange('result1', e.target.value)}
                                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="REACTIVE">REACTIVE</option>
                                            <option value="NON-REACTIVE">NON-REACTIVE</option>
                                            <option value="INVALID">INVALID</option>
                                        </select>
                                    ) : (
                                        <span className="text-xs font-medium">{reportData.result1}</span>
                                    )}
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    {editing ? (
                                        <select 
                                            value={reportData.result2}
                                            onChange={(e) => handleChange('result2', e.target.value)}
                                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="REACTIVE">REACTIVE</option>
                                            <option value="NON-REACTIVE">NON-REACTIVE</option>
                                            <option value="INVALID">INVALID</option>
                                        </select>
                                    ) : (
                                        <span className="text-xs font-medium">{reportData.result2}</span>
                                    )}
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    {editing ? (
                                        <input 
                                            type="text" 
                                            value={reportData.result} 
                                            onChange={(e) => handleChange('result', e.target.value)}
                                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <span className="text-xs">{reportData.result}</span>
                                    )}
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    <span className="text-xs font-bold">{reportData.hlFlag}</span>
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    <span className="text-xs">{reportData.units}</span>
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    <div className="text-xs leading-tight">
                                        <div>Reference</div>
                                        <div>Range</div>
                                    </div>
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    <div className="text-xs leading-tight">
                                        <div>Critical</div>
                                        <div>Range</div>
                                    </div>
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    <span className="text-xs">{reportData.method}</span>
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    <span className="text-xs">{reportData.sampleType}</span>
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    <img 
                                        src={reportData.image} 
                                        alt="Attachment" 
                                        className="h-8 w-10 object-cover rounded border cursor-pointer mx-auto"
                                        onClick={() => setShowZoomModal(true)}
                                    />
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    <span className="text-xs">{reportData.barCode}</span>
                                </td>
                                <td className="px-2 py-3 text-center text-xs text-gray-900 border border-gray-300">
                                    {editing ? (
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={() => setEditing(false)}
                                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={() => setEditing(false)}
                                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={() => setEditing(true)}
                                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                         
                                         
                                        </div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Remarks Section */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Remark</h4>
                <textarea 
                    value={reportData.remark}
                    onChange={(e) => handleChange('remark', e.target.value)}
                    rows="3"
                    placeholder="Please write down if any Important Note / Remark."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>

            {/* Bottom Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                    <button className="inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium w-full sm:w-auto">
                        <FiCheck className="w-4 h-4 mr-1 sm:mr-2" />
                        <span>Accept</span>
                    </button>
                    <button className="inline-flex items-center justify-center px-3 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium w-full sm:w-auto">
                        <FiRotateCw className="w-4 h-4 mr-1 sm:mr-2" />
                        <span>Redo</span>
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium w-full sm:w-auto">
                        <FiTrash2 className="w-4 h-4 mr-1 sm:mr-2" />
                        <span>Reject</span>
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full sm:w-auto">
                        <FiPrinter className="w-4 h-4 mr-1 sm:mr-2" />
                        <span>Print</span>
                    </button>
                    <button className="col-span-2 sm:ml-auto flex items-center justify-center px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium w-full sm:w-auto">
                        <FiArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                        <span>Back</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorReporteditDetail;
