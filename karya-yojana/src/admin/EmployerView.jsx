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
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState('');
    const [contactError, setContactError] = useState('');

    

    const navigate = useNavigate();
    
    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };



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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }



    const handleRowClick = (employer) => {
        setSelectedUser (employer.id);
        setCompanyName(employer.company_name);
        setEmail(employer.email);
        setPassword('');        
        setContactNumber(employer.contact); 
        setAddress(employer.address);
        setPanNumber(employer.pan_number); 
        setCompanyType(employer.company_type); 
    };



    const handleAddEmployer = async (e) => {
        const passwordLengthValid = password.length >= 8; // Minimum 8 characters
        const containsUppercase = /[A-Z]/.test(password); // At least 1 uppercase letter
        const containsNumber = /\d/.test(password); // At least 1 number
        const containsSpecialChar = /[@$!%*?&#]/.test(password); // At least 1 special character

        if (!companyName || !email || !password || !contactNumber || !address || !panNumber || !companyType) {
            setAddError("All fields are required.");
            return;
        }


        let hasError = false;   

        const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailCheck.test(email)) {  
            setEmailError("Please enter a valid email address");                                   
            hasError = true;
        } else {
            setEmailError(""); 
        }
        if (hasError) {
            return;
        }   

        if (!passwordLengthValid) {
            setPasswordError('Password must be at least 8 characters.');
            hasError = true;
        } else if (!containsUppercase || !containsNumber || !containsSpecialChar) {
            setPasswordError('Password must contain uppercase, number and special character.');
            hasError = true;
        } else {
            setPasswordError('');
        }
        if (hasError) {
            return;
        } 
        

        if (contactNumber.length !== 10) {
            setContactError('Contact number must be exactly 10 digits!');
            hasError = true;
        } else {
            setContactError('');
        }
        if (hasError) {
            return;
        } 




        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/employer/empview/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({
                    companyName,
                    email,
                    password,
                    contactNumber,
                    address,
                    panNumber,
                    companyType,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                await fetchEmployers(); 
                setForceUpdate(forceUpdate + 1); 
                setCompanyName('');
                setEmail('');
                setPassword('');
                setContactNumber('');
                setAddress('');
                setPanNumber('');
                setCompanyType('');
                setAddError('');
            } else {
                console.error('Failed to add employer:', data.error);
                setAddError(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = async () => {
        if (!selectedUser) return; 
    
        try {
            const token = localStorage.getItem('token');

            const updateData = {
                company_name: companyName, 
                email : email,
                contact: contactNumber,
                address: address,
                pan_number: panNumber, 
                company_type: companyType, 
            };

            let hasError = false;

            if (email !== employers.find(employer => employer.id === selectedUser ).email) {               
                const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailCheck.test(email)) {
                    setEmailError("Please enter a valid email address");
                    hasError = true;
                } else {
                    setEmailError(""); // Clear error if valid
                }
            }
            if (hasError) {
                return;
            }



            if (contactNumber.length !== 10 || !/^\d+$/.test(contactNumber)) {
                setContactError('Contact number must be exactly 10 digits and contain only numbers!');
                hasError = true; 
            } else {
                setContactError(''); 
            }
            if (hasError) {
                return; 
            }

            if (password.trim() !== "") {
                const passwordLengthValid = password.length >= 8; // Minimum 8 characters
                const containsUppercase = /[A-Z]/.test(password); // At least 1 uppercase letter
                const containsNumber = /\d/.test(password); // At least 1 number
                const containsSpecialChar = /[@$!%*?&#]/.test(password); // At least 1 special character

                if (!passwordLengthValid) {
                    setPasswordError('Password must be at least 8 characters.');
                    hasError = true;
                } else if (!containsUppercase || !containsNumber || !containsSpecialChar) {
                    setPasswordError('Password must contain uppercase, number and special character.');
                    hasError = true;
                } else {
                    setPasswordError('');
                    updateData.password = password;
                }
                if (hasError) {
                    return;
                }


                


            }
                
            const response = await fetch(`http://localhost:3000/api/employer/empview/update/${selectedUser}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
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
                console.error('Update failed:', await response.text());
            }
        } catch (error) {
            console.error('Error updating employers:', error);
        }
    };



    const handleDelete = async (id) => {
        if (!selectedUser) return;

        const isConfirmed = window.confirm("Are you sure you want to delete this employers?");
        if (!isConfirmed) return;
            
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/employer/empview/${selectedUser}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                await fetchEmployers(); // Re-fetch the user data to ensure updated state
                setForceUpdate(forceUpdate + 1); // Trigger re-render
                // Reset form fields
                setSelectedUser(null);
                setCompanyName('');
                setEmail('');
                setPassword('');
                setContactNumber('');
                setAddress('');
                setPanNumber('');
                setCompanyType('');
            }
        } catch (err) {
            alert("Error deleting employer: " + err.message);
        }
    };


    
    return (
        <section className="employerview-by-admin">
            <div className="employer-inputfield">
                <label htmlFor="empname">Company Name</label>
                <input 
                    type="text" 
                    id="empname"
                    name="empname" 
                    placeholder="Company Name" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required 
                />
                <br/>

                <label htmlFor="emp-email">Email</label>
                <input 
                    type="email" 
                    id="emp-email"
                    name="emp-email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <br/>

                <label htmlFor="emp-password">Password</label>
                <input 
                    type={passwordVisible ? 'text' : 'password'} 
                    id="emp-password"
                    name="emp-password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                <br/>


                <button type="button" onClick={togglePasswordVisibility} className="emp-toggle-password-btn">
                    {passwordVisible ? 'Hide' : 'Show'} Password
                </button>
                <br/>

                <label htmlFor="contact">Contact Number</label>
                <input 
                    type="text" 
                    id="contact"
                    name="contact" 
                    placeholder="+977-xxxxxxxxx/01-xxxxxxx" 
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required 
                />
                <br/>

                <label htmlFor="address">Address</label>
                <input 
                    type="text" 
                    id="address"
                    name="address" 
                    placeholder="Address,Nepal" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required 
                />
                <br/>
                
                <label htmlFor="Pan">Pan Number</label>
                <input 
                    type="text" 
                    id="pan"
                    name="pan" 
                    placeholder="xxxxxx" 
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    required 
                />
                <br/>

                <label htmlFor="sector">Company Type</label>
                <select name="sector" 
                    id="sector" 
                    value={companyType} 
                    onChange={(e) => setCompanyType(e.target.value)} 
                    required
                >
                    <option value="">Select type</option>
                    <option value="private">Private</option>
                    <option value="ngo">NGO/INGO</option>
                </select>
                <br/>

                {addError && <p className="error-message">{addError}</p>} <br/>
                {emailError && <p className="error-message">{emailError}</p>} <br/>
                {passwordError && <p className="error-message">{passwordError}</p>} <br/>
                {contactError && <p className="error-message">{contactError}</p>}
            </div>    


            <div className="employer-table-list">
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Company Name </th>
                            <th>Email</th>
                            <th>Contact Number</th>
                            <th>Address</th>
                            <th>Pan Number</th>
                            <th>Company Type</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employers.filter(employer => employer).map((employer) => (
                            <tr key={employer.id}
                                onClick={() => handleRowClick(employer)}
                                className={selectedUser === employer.id ? 'selected-row' : ''}
                            > 
                                <td>{employer.id}</td>
                                <td>{employer.company_name}</td>
                                <td>{employer.email}</td>
                                <td>{employer.contact}</td>
                                <td>{employer.address}</td>
                                <td>{employer.pan_number}</td>
                                <td>{employer.company_type}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            <div className="add-button">
                <button onClick={handleAddEmployer}>Add</button>
            </div>

            <div className="edit-button">
                <button onClick={handleEdit}>Edit</button>
            </div>

            <div className="delete-button">
                <button onClick={handleDelete}>Delete</button>
            </div>
        </section>
    );
}

export default EmployerViewPage;