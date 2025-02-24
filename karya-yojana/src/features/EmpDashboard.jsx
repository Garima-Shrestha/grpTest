import React, { useState } from "react";
import "../css/EmpDashboard.css";
import FAQs from "./EmpFAQs.jsx";

const EmpDashboard = () => {
    const [selectedMethod, setSelectedMethod] = useState("esewa");

    // Paths to the QR code images
    const paymentLinks = {
        esewa: "../assests/esewa.png", 
        khalti: "../assests/khalti.png" 
    };

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
                        <h3>Jobs Posted</h3>
                        <p>5 Jobs</p>
                    </div>

                    <div className="info-box">
                        <h3>Your Profile</h3>
                        <p><strong>Name:</strong> KaryaYojana</p>
                        <p><strong>Email:</strong> karya@example.com</p>
                        <p><strong>Company:</strong> Job Portal</p>
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