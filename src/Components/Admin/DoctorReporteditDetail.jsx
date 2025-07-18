import React, { useState } from 'react';
import './DoctorReporteditDetail.css';

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
        <div className="patient-report-container">
            <div className="report-header">
                <h2 style={{fontSize: '24px', fontWeight: '600', color: '#495057'}}>Patient Report Entry Section</h2>
                <div className="patient-info-horizontal">
                    <div className="info-item">
                        <span className="info-label">Patient ID:</span>
                        <span className="info-value">ASR/PPP/1759525</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Patient Details:</span>
                        <span className="info-value">KHATI RAM REANG/24/M</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Reference Centre:</span>
                        <span className="info-value">DHALAI DISTRICT HOSPITAL</span>
                    </div>
                    <div className="info-item report-image-preview" onClick={() => setShowZoomModal(true)}>
                        <img src={reportData.image} alt="Report Preview" />
                    </div>
                </div>
            </div>
            {showZoomModal && (
                <div className="image-zoom-modal" onClick={() => setShowZoomModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="zoomable-img-wrapper">
                            <img
                                src={reportData.image}
                                alt="Zoomable Preview"
                                style={{
                                    transform: `scale(${zoomLevel})`,
                                    transition: 'transform 0.3s',
                                    maxWidth: '100%',
                                    maxHeight: '60vh',
                                    display: 'block',
                                    margin: '0 auto'
                                }}
                            />
                        </div>
                        <div className="zoom-controls">
                            <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 3))}>Zoom In (+)</button>
                            <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 1))}>Zoom Out (-)</button>
                            <button onClick={() => setShowZoomModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                <div style={{flex: 1}}>
                    <span style={{fontSize: '16px', fontWeight: '600', color: '#495057'}}>Remark: </span>
                    <span style={{fontSize: '16px', marginLeft: '8px', color: '#212529'}}>{reportData.remark}</span>
                </div>
                <div style={{display: 'flex', gap: '12px'}}>
                    <button style={{padding: '10px 20px', fontSize: '14px', fontWeight: '600', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s'}}>OPEN OTHER REPORT</button>
                    <button style={{padding: '10px 20px', fontSize: '14px', fontWeight: '600', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s'}}>OPEN OLD REPORT</button>
                </div>
            </div>
            <table className="report-entry-table">
                <thead>
                    <tr>
                        <th>Sl No.</th>
                        <th>Profile Name</th>
                        <th>Test Name</th>
                        <th>Approval Pending Since</th>
                        <th>Result 1</th>
                        <th>Result 2</th>
                        <th>Result</th>
                        <th>H/L Flag</th>
                        <th>Units</th>
                        <th>Reference Range</th>
                        <th>Critical Range</th>
                        <th>Method</th>
                        <th>Sample Type</th>
                        <th>Attach Image</th>
                        <th>Bar Code</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Sample row, replace with dynamic content */}
                    <tr>
                        <td>1</td>
                        <td>Profile Name</td>
                        <td>Hepatitis C Antibody Test</td>
                        <td></td>
                        <td>
                            {editing ? (
                                <input type="text" value={reportData.result1} onChange={e => handleChange('result1', e.target.value)} />
                            ) : (
                                reportData.result1
                            )}
                        </td>
                        <td>
                            {editing ? (
                                <input type="text" value={reportData.result2} onChange={e => handleChange('result2', e.target.value)} />
                            ) : (
                                reportData.result2
                            )}
                        </td>
                        <td>
                            {editing ? (
                                <input type="text" value={reportData.result} onChange={e => handleChange('result', e.target.value)} />
                            ) : (
                                reportData.result
                            )}
                        </td>
                        <td>{reportData.hlFlag}</td>
                        <td>{reportData.units}</td>
                        <td>{reportData.refRange}</td>
                        <td>{reportData.criticalRange}</td>
                        <td>{reportData.method}</td>
                        <td>{reportData.sampleType}</td>
                        <td>
                            {reportData.image ? 
                                <img src={reportData.image} alt="Report" style={{maxWidth: '100px'}} /> 
                                : 'No Image'
                            }
                        </td>
                        <td>{reportData.barCode}</td>
                        <td>
                            {editing ? (
                                <button onClick={() => setEditing(false)}>Save</button>
                            ) : (
                                <button onClick={() => setEditing(true)}>Edit</button>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="remark-section">
                <label>Remark</label>
                <textarea placeholder="Please write down if any Important Note / Remark."></textarea>
            </div>
            <div className="action-buttons">
                <button>Accept</button>
                <button>Redo</button>
                <button>Reject</button>
                <button>Print Preview</button>
                <button>Back</button>
            </div>
        </div>
    );
};

export default DoctorReporteditDetail;