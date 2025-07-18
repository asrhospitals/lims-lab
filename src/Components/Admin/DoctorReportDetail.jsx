import React, { useState } from 'react';
import './DoctorReportDetail.css';

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
        <div className="report-detail-container">
            <h2>Report Detail Section</h2>
            <div className="filters">
                <input type="text" placeholder="Search by Hospital" />
                <input type="text" placeholder="Search by Test" />
                <input type="date" />
                <input type="date" />
                <button>Search</button>
            </div>
            <table className="report-table">
                <thead>
                    <tr>
                        <th 
                            onClick={() => requestSort('id')}
                            className={sortConfig.key === 'id' ? sortConfig.direction : ''}
                        >Sl No.</th>
                        <th 
                            onClick={() => requestSort('patientId')}
                            className={sortConfig.key === 'patientId' ? sortConfig.direction : ''}
                        >Patient ID</th>
                        <th 
                            onClick={() => requestSort('patientName')}
                            className={sortConfig.key === 'patientName' ? sortConfig.direction : ''}
                        >Patient Name</th>
                        <th 
                            onClick={() => requestSort('barCode')}
                            className={sortConfig.key === 'barCode' ? sortConfig.direction : ''}
                        >Bar Code</th>
                        <th 
                            onClick={() => requestSort('slidePrep')}
                            className={sortConfig.key === 'slidePrep' ? sortConfig.direction : ''}
                        >Slide Preparation</th>
                        <th 
                            onClick={() => requestSort('nodalName')}
                            className={sortConfig.key === 'nodalName' ? sortConfig.direction : ''}
                        >Nodal Name</th>
                        <th 
                            onClick={() => requestSort('hospitalName')}
                            className={sortConfig.key === 'hospitalName' ? sortConfig.direction : ''}
                        >Hospital Name {sortConfig.key === 'hospitalName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                        <th 
                            onClick={() => requestSort('regDate')}
                            className={sortConfig.key === 'regDate' ? sortConfig.direction : ''}
                        >Date Of Registration</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((item, index) => (
                        <tr key={item.id}>
                            <td>{startIndex + index + 1}</td>
                            <td>{item.patientId}</td>
                            <td>{item.patientName}</td>
                            <td>{item.barCode}</td>
                            <td>{item.slidePrep}</td>
                            <td>{item.nodalName}</td>
                            <td>{item.hospitalName}</td>
                            <td>{item.regDate}</td>
                            <td><button onClick={() => window.location.href='/doctorreportedit'}>Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Pagination controls */}
            <div className="pagination">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                
                <span>Page {currentPage} of {totalPages}</span>
                
                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DoctorReportDetail;