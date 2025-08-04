import React, { useState } from 'react';

const DoctorReportDetail = () => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // Sample data - replace with your actual data source
    const [data, setData] = useState([
        {
            id: 1,
            patientId: 'ASR/PPP/123456',
            patientName: 'John Doe',
            barCode: '123456',
            slidePrep: 'Not Applicable',
            nodalName: 'Sample Lab',
            hospitalName: 'Sample Hospital',
            regDate: '12/07/2025'
        },
        {
            id: 2,
            patientId: 'ASR/PPP/123457',
            patientName: 'Jane Smith',
            barCode: '123457',
            slidePrep: 'Prepared',
            nodalName: 'Alpha Lab',
            hospitalName: 'City Hospital',
            regDate: '11/07/2025'
        },
        {
            id: 3,
            patientId: 'ASR/PPP/123458',
            patientName: 'Robert Johnson',
            barCode: '123458',
            slidePrep: 'Not Applicable',
            nodalName: 'Beta Lab',
            hospitalName: 'Metro Hospital',
            regDate: '10/07/2025'
        },
        {
            id: 4,
            patientId: 'ASR/PPP/123459',
            patientName: 'Emily Davis',
            barCode: '123459',
            slidePrep: 'Prepared',
            nodalName: 'Gamma Lab',
            hospitalName: 'Saint Mary Hospital',
            regDate: '09/07/2025'
        },
        {
            id: 5,
            patientId: 'ASR/PPP/123460',
            patientName: 'Michael Brown',
            barCode: '123460',
            slidePrep: 'Not Applicable',
            nodalName: 'Delta Lab',
            hospitalName: 'Greenfield Hospital',
            regDate: '08/07/2025'
        },
        {
            id: 6,
            patientId: 'ASR/PPP/123461',
            patientName: 'Olivia Wilson',
            barCode: '123461',
            slidePrep: 'Prepared',
            nodalName: 'Sigma Lab',
            hospitalName: 'Westside Hospital',
            regDate: '07/07/2025'
        },
        {
            id: 7,
            patientId: 'ASR/PPP/123462',
            patientName: 'William Martinez',
            barCode: '123462',
            slidePrep: 'Not Applicable',
            nodalName: 'Theta Lab',
            hospitalName: 'Central Hospital',
            regDate: '06/07/2025'
        },
        {
            id: 8,
            patientId: 'ASR/PPP/123463',
            patientName: 'Ava Anderson',
            barCode: '123463',
            slidePrep: 'Prepared',
            nodalName: 'Omega Lab',
            hospitalName: 'Sunrise Hospital',
            regDate: '05/07/2025'
        },
        {
            id: 9,
            patientId: 'ASR/PPP/123464',
            patientName: 'James Thomas',
            barCode: '123464',
            slidePrep: 'Not Applicable',
            nodalName: 'Epsilon Lab',
            hospitalName: 'Grandview Hospital',
            regDate: '04/07/2025'
        },
        {
            id: 10,
            patientId: 'ASR/PPP/123465',
            patientName: 'Sophia Lee',
            barCode: '123465',
            slidePrep: 'Prepared',
            nodalName: 'Zeta Lab',
            hospitalName: 'Harmony Hospital',
            regDate: '03/07/2025'
        },
        {
            id: 11,
            patientId: 'ASR/PPP/123466',
            patientName: 'Benjamin Garcia',
            barCode: '123466',
            slidePrep: 'Not Applicable',
            nodalName: 'Iota Lab',
            hospitalName: 'Hope Hospital',
            regDate: '02/07/2025'
        },
        {
            id: 12,
            patientId: 'ASR/PPP/123467',
            patientName: 'Charlotte Martinez',
            barCode: '123467',
            slidePrep: 'Prepared',
            nodalName: 'Lambda Lab',
            hospitalName: 'Riverdale Hospital',
            regDate: '01/07/2025'
        },
        {
            id: 13,
            patientId: 'ASR/PPP/123468',
            patientName: 'Daniel Rodriguez',
            barCode: '123468',
            slidePrep: 'Not Applicable',
            nodalName: 'Mu Lab',
            hospitalName: 'Sunview Hospital',
            regDate: '30/06/2025'
        },
        {
            id: 14,
            patientId: 'ASR/PPP/123469',
            patientName: 'Amelia Hernandez',
            barCode: '123469',
            slidePrep: 'Prepared',
            nodalName: 'Nu Lab',
            hospitalName: 'Mountain Hospital',
            regDate: '29/06/2025'
        },
        {
            id: 15,
            patientId: 'ASR/PPP/123470',
            patientName: 'Logan Clark',
            barCode: '123470',
            slidePrep: 'Not Applicable',
            nodalName: 'Xi Lab',
            hospitalName: 'Riverbend Hospital',
            regDate: '28/06/2025'
        },
        {
            id: 16,
            patientId: 'ASR/PPP/123471',
            patientName: 'Mia Lewis',
            barCode: '123471',
            slidePrep: 'Prepared',
            nodalName: 'Omicron Lab',
            hospitalName: 'Seaside Hospital',
            regDate: '27/06/2025'
        },
        {
            id: 17,
            patientId: 'ASR/PPP/123472',
            patientName: 'Lucas Walker',
            barCode: '123472',
            slidePrep: 'Not Applicable',
            nodalName: 'Pi Lab',
            hospitalName: 'Evergreen Hospital',
            regDate: '26/06/2025'
        },
        {
            id: 18,
            patientId: 'ASR/PPP/123473',
            patientName: 'Harper Young',
            barCode: '123473',
            slidePrep: 'Prepared',
            nodalName: 'Rho Lab',
            hospitalName: 'Crescent Hospital',
            regDate: '25/06/2025'
        },
        {
            id: 19,
            patientId: 'ASR/PPP/123474',
            patientName: 'Ethan Allen',
            barCode: '123474',
            slidePrep: 'Not Applicable',
            nodalName: 'Sigma Lab',
            hospitalName: 'Oakwood Hospital',
            regDate: '24/06/2025'
        },
        {
            id: 20,
            patientId: 'ASR/PPP/123475',
            patientName: 'Abigail Scott',
            barCode: '123475',
            slidePrep: 'Prepared',
            nodalName: 'Tau Lab',
            hospitalName: 'Lakeside Hospital',
            regDate: '23/06/2025'
        }
    ]);
    
    // Calculate pagination values
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const paginatedData = sortedData.slice(startIndex, endIndex);

    return (
        <div className="p-4 sm:p-5 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Report Detail Section</h2>
            
            {/* Search Controls - Updated for mobile */}
            <div className="flex flex-col gap-3 mb-6 w-full">
                {/* Search inputs - Stack on mobile */}
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input 
                        type="text" 
                        placeholder="Search by Hospital" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input 
                        type="text" 
                        placeholder="Search by Test" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                {/* Date inputs and button - Full width on mobile */}
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input 
                        type="date" 
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input 
                        type="date" 
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium whitespace-nowrap">
                        Search
                    </button>
                </div>
            </div>
            
            {/* Table Container */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th 
                                    onClick={() => requestSort('id')}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${sortConfig.key === 'id' ? 'bg-gray-100' : ''}`}
                                >
                                    <div className="flex items-center">
                                        Sl No.
                                        {sortConfig.key === 'id' && (
                                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th 
                                    onClick={() => requestSort('patientId')}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${sortConfig.key === 'patientId' ? 'bg-gray-100' : ''}`}
                                >
                                    <div className="flex items-center">
                                        Patient ID
                                        {sortConfig.key === 'patientId' && (
                                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th 
                                    onClick={() => requestSort('patientName')}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${sortConfig.key === 'patientName' ? 'bg-gray-100' : ''}`}
                                >
                                    <div className="flex items-center">
                                        Patient Name
                                        {sortConfig.key === 'patientName' && (
                                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th 
                                    onClick={() => requestSort('barCode')}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${sortConfig.key === 'barCode' ? 'bg-gray-100' : ''}`}
                                >
                                    <div className="flex items-center">
                                        Bar Code
                                        {sortConfig.key === 'barCode' && (
                                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th 
                                    onClick={() => requestSort('slidePrep')}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${sortConfig.key === 'slidePrep' ? 'bg-gray-100' : ''}`}
                                >
                                    <div className="flex items-center">
                                        Slide Preparation
                                        {sortConfig.key === 'slidePrep' && (
                                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th 
                                    onClick={() => requestSort('nodalName')}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${sortConfig.key === 'nodalName' ? 'bg-gray-100' : ''}`}
                                >
                                    <div className="flex items-center">
                                        Nodal Name
                                        {sortConfig.key === 'nodalName' && (
                                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th 
                                    onClick={() => requestSort('hospitalName')}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${sortConfig.key === 'hospitalName' ? 'bg-gray-100' : ''}`}
                                >
                                    <div className="flex items-center">
                                        Hospital Name
                                        {sortConfig.key === 'hospitalName' && (
                                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th 
                                    onClick={() => requestSort('regDate')}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${sortConfig.key === 'regDate' ? 'bg-gray-100' : ''}`}
                                >
                                    <div className="flex items-center">
                                        Date Of Registration
                                        {sortConfig.key === 'regDate' && (
                                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.patientId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.patientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.barCode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.slidePrep}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nodalName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.hospitalName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.regDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => window.location.href='/lims-lab/doctorreportedit'}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Pagination - Stacked on mobile */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-1 gap-3">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium w-full sm:w-auto text-center ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    Previous
                </button>
                
                <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                
                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium w-full sm:w-auto text-center ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DoctorReportDetail;