import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "../css/EmpDashboard.css";
import FAQs from "./EmpFAQs.jsx";

const EmpDashboard = () => {
    const [selectedMethod, setSelectedMethod] = useState("esewa");
    const [employerProfile, setEmployerProfile] = useState(null);
    const [approvedJobCount, setApprovedJobCount] = useState(0);
    const [latestNotice, setLatestNotice] = useState(null); // State for latest notice
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const paymentLinks = {
        esewa: "/assests/esewa.png", 
        khalti: "/assests/khalti.png" 
    };

    useEffect(() => {
        fetchEmployerProfile();
        fetchApprovedJobCount();
        fetchLatestNotice();
    }, []);

    const fetchEmployerProfile = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/employer/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setEmployerProfile(response.data.profile);
        } catch (err) {
            setError(err.response ? err.response.data.error : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const fetchApprovedJobCount = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/jobposting/approved-job-count', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setApprovedJobCount(response.data.approvedJobCount);
        } catch (err) {
            console.error("Error fetching approved job count:", err);
        }
    };

    const fetchLatestNotice = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/Notices/notice", {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.length > 0) {
                setLatestNotice(response.data[0]); // Only store the latest notice
            } else {
                setLatestNotice(null);
            }
        } catch (err) {
            console.error("Error fetching latest notice:", err);
        }
    };

    return (
        <>
        <div className="dashboard-container">
            <div className="content">
                <div className="left-section">
                    <div className="payment-section">
                        <label>Select Payment Method:</label>
                        <select onChange={(e) => setSelectedMethod(e.target.value)}>
                            <option value="esewa">eSewa</option>
                            <option value="khalti">Khalti</option>
                        </select>
                    </div>

                    <div className="qr-section">
                        <div className="qr-container">
                            <img src={paymentLinks[selectedMethod]} alt={`${selectedMethod} QR Code`} />
                            <p>Scan to pay via {selectedMethod.toUpperCase()}</p>
                        </div>
                        <p className="warn">
                            While completing the transaction make sure you mention
                            your COMPANY NAME and EMAIL in the remarks!
                        </p>
                    </div>
                </div>
                <div className="middle-section">
                    <div className="info-box">
                        <h3>Approved Jobs</h3>
                        <p>{approvedJobCount} Approved Jobs</p>
                    </div>

                    <div className="info-box">
                        <h3>Your Profile</h3>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            employerProfile && (
                                <>
                                <img src={`http://localhost:3000${employerProfile.photo}`} alt="Company Logo" className="profile-dash-board" />
                                    <p><strong>Name:</strong> {employerProfile.company_name}</p>
                                    <p><strong>Email:</strong> {employerProfile.email}</p>
                                    <p><strong>Company:</strong> {employerProfile.company_type}</p>
                                </>
                            )
                        )}
                    </div>
                </div>
                    <div className="notice-box">
                        <h3>Notice</h3>
                        {latestNotice ? (
                            <p><strong>{latestNotice.title}:</strong> <br/>{latestNotice.description}</p>
                        ) : (
                            <p>No new notices</p>
                        )}
                </div>
            </div>
        </div>

        <div>
            <FAQs />
        </div>
        </>
    );
};

export default EmpDashboard;
