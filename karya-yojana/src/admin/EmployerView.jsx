import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/EmployerView.css';

const EmployerViewPage = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [address, setAddress] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [forceUpdate, setForceUpdate] = useState(0);
    const [addError, setAddError] = useState('');
    
    const navigate = useNavigate();
    
    const fetchEmployers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/api/employer/empview`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setEmployers(data.employers);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployers();
    }, [navigate, forceUpdate]);

    const handleRowClick = (employer) => {
        setSelectedUser(employer.id);
        setCompanyName(employer.company_name);
        setEmail(employer.email);
        setPassword('');        
        setContactNumber(employer.contact); 
        setAddress(employer.address);
        setPanNumber(employer.pan_number); 
        setCompanyType(employer.company_type); 
    };

    const handleSubmit = async () => {
        if (!companyName || !email || !contactNumber || !address || !panNumber || !companyType) {
            setAddError("All fields are required.");
            return;
        }
    
        const token = localStorage.getItem('token');
        const requestBody = selectedUser
            ? {
                  company_name: companyName,
                  email: email,
                  contact: contactNumber,
                  address: address,
                  pan_number: panNumber,
                  company_type: companyType,
              }
            : {
                  companyName,
                  email,
                  password,
                  contactNumber,
                  address,
                  panNumber,
                  companyType,
              };
    
        const url = selectedUser
            ? `http://localhost:3000/api/employer/empview/update/${selectedUser}`
            : 'http://localhost:3000/api/employer/empview/add';
        const method = selectedUser ? 'PUT' : 'POST';
    
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });
    
            if (response.ok) {
                await fetchEmployers();
                setForceUpdate(forceUpdate + 1);
                setSelectedUser(null);
                setCompanyName('');
                setEmail('');
                setPassword('');
                setContactNumber('');
                setAddress('');
                setPanNumber('');
                setCompanyType('');
            } else {
                console.error('Operation failed:', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again.');
        }
    };
    

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employer?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/employer/empview/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setForceUpdate(forceUpdate + 1);
            }
        } catch (err) {
            alert("Error deleting employer: " + err.message);
        }
    };
    
    return (
        <section className="employerview-by-admin">
            <div className="employer-inputfield">
                <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type={passwordVisible ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="show-password-btn-emp">{passwordVisible ? 'Hide' : 'Show'} Password</button>
                <input type="text" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <input type="text" placeholder="Pan Number" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} required />
                <select value={companyType} onChange={(e) => setCompanyType(e.target.value)} required>
                    <option value="">Select type</option>
                    <option value="private">Private</option>
                    <option value="ngo">NGO/INGO</option>
                </select>
                {addError && <p className="error-message">{addError}</p>}
                <button onClick={handleSubmit} className="button">{selectedUser ? "Update" : "Add"}</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Pan</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employers.map((employer) => (
                        <tr key={employer.id}>
                            <td>{employer.company_name}</td>
                            <td>{employer.email}</td>
                            <td>{employer.contact}</td>
                            <td>{employer.pan_number}</td>
                            <td>{employer.address}</td>
                            <td>
                                <button onClick={() => handleRowClick(employer)}>Edit</button>
                                <button onClick={() => handleDelete(employer.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default EmployerViewPage;
