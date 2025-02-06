import React, { useState } from "react";
import "../css/EmpDashboard.css";
import FAQs from './EmpFAQs.jsx'
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
                            <p className="warn">While completing the transaction make sure you mention
                            your COMPANY NAME and EMAIL in the remarks!</p>
                    </div>
                </div>

                {/* Right side: Info section */}
                <div className="right-section">
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
            </div>
            
        </div>
        <div>
        <FAQs/>
    </div>
    </>
    );
};

export default EmpDashboard;
