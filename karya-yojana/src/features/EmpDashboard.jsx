import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import "../css/EmpDashboard.css";
import FAQs from "./EmpFAQs.jsx";

const EmpDashboard = () => {
    const [selectedMethod, setSelectedMethod] = useState("esewa");
    const [employerProfile, setEmployerProfile] = useState(null); // State to hold employer profile data
    const [approvedJobCount, setApprovedJobCount] = useState(0); // State to hold approved job count
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error

    // Paths to the QR code images
    const paymentLinks = {
        esewa: "/assests/esewa.png", 
        khalti: "/assests/khalti.png" 
    };

    // Function to fetch employer profile
    const fetchEmployerProfile = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/employer/profile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            });
            setEmployerProfile(response.data.profile);
        } catch (err) {
            setError(err.response ? err.response.data.error : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch approved job count
    const fetchApprovedJobCount = async () => {
        const url = 'http://localhost:3000/api/jobposting/approved-job-count';
        console.log("Fetching from URL:", url);
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setApprovedJobCount(response.data.approvedJobCount);
        } catch (err) {
            console.error("Error fetching approved job count:", err);
        }
    };

    // useEffect to fetch employer profile and approved job count on component mount
    useEffect(() => {
        fetchEmployerProfile();
        fetchApprovedJobCount();
    }, []);

    return (
        <>
        <div className="dashboard-container">
            <div className="content">
                {/* Left side: Payment and QR section */}
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
                <div className="right-section">
                    <div className="notice-box">
                    <h3>Notices</h3>
                        <ul>
                            <li>Notice 1: System update scheduled for Friday</li>
                            <li>Notice 2: New job categories added</li>
                            <li>Notice 3: Company registration deadline extended</li>
                            <li>Notice 4: Security update applied successfully</li>
                            <li>Notice 5: Downtime expected on Saturday for maintenance</li>
                            <li>Notice 6: Employee verification process updated</li>
                            <li>Notice 7: New feature: Resume review system</li>
                            <li>Notice 8: Payment portal improvements deployed</li>
                            <li>Notice 9: User dashboard redesign in progress</li>
                            <li>Notice 10: Important compliance guidelines updated</li>
                            <li>Notice 11: Bug fixes and performance improvements</li>
                            <li>Notice 12: Support hours extended for customer queries</li>
                            <li>Notice 13: Internship applications now open</li>
                            <li>Notice 14: Multi-factor authentication now required</li>
                            <li>Notice 15: Data privacy policy updated</li>
                            <li>Notice 16: Scheduled downtime for database optimization</li>
                            <li>Notice 17: HR policies updated for new job postings</li>
                            <li>Notice 18: Employee referral program launched</li>
                            <li>Notice 19: Company profile verification process simplified</li>
                            <li>Notice 20: Feedback system now available for employers</li>
                            <li>Notice 21: Temporary suspension of certain features for upgrade</li>
                            <li>Notice 22: Webinar on job market trends next Monday</li>
                        </ul>
                    </div>
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