import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Suspense } from 'react';
import '../css/EmployerAuth.css';
import { useNavigate } from 'react-router-dom';
const Plans =React.lazy(()=> import('./Plans.jsx'))

function EmpSignup(){
    const [companyName, setcompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contact, setContact] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [contactError, setContactError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };
    const handleSignup = async (e) => {
        e.preventDefault(); 
        const passwordLengthValid = password.length >= 8; // Minimum 8 characters
        const containsUppercase = /[A-Z]/.test(password); // At least 1 uppercase letter
        const containsNumber = /\d/.test(password); // At least 1 number
        const containsSpecialChar = /[@$!%*?&#]/.test(password); // At least 1 special character
    
        // Password length validation
        if (!passwordLengthValid) {
            setPasswordError('Password must be at least 8 characters.');
            hasError = true;
        } else if (!containsUppercase || !containsNumber || !containsSpecialChar) {
            setPasswordError('Password must contain uppercase, number and special character.');
            hasError = true;
        } else if (password !== confirmPassword) {
            setPasswordError('Passwords do not match!');
            hasError = true;
        } else {
            setPasswordError('');
        }
        if (contact.length !== 10) {
            setContactError('Contact number must be exactly 10 digits!');
            hasError = true;
        } else {
            setContactError('');
        }

        setIsLoading(true);
        try{
        const response = await fetch('http://localhost:3000/api/auth/employer/employerRegister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyName, 
                email, 
                password, 
                contact, 
                address, 
                panNumber, 
                companyType,
            }),
        });
        const data = await response.json();
        if (response.ok) {
            console.log('Signup successful:', data);
            navigate('/EmpLogin'); 
        }else {
            console.error('Signup failed:', data.error);
            setErrors({ general: data.error });  
        }
    }catch(error){
        console.error('Error:', err);
        setErrors({ general: 'Something went wrong. Please try again.' });
    }
    finally{
        setIsLoading(false);
    }
    };
   
return(
<div className="register-container">
    <div className="register-box">
        <div className="form-box">
            <form className="register-form" onSubmit={handleSignup}>
                <h1>Company Register</h1>
                <div className="form-columns">
                    {/* Left Column */}
                    <div className="form-column left-column">
                        <div className="form-group">
                            <label htmlFor="username">Company Name</label>
                            <input 
                                type="text" 
                                id="username"
                                name="username" 
                                placeholder="Company Name" 
                                onChange={(e) => setcompanyName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email"
                                name="email" 
                                placeholder="Email" 
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                type={passwordVisible ? 'text' : 'password'} 
                                id="password"
                                name="password" 
                                placeholder="Password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input 
                                type={passwordVisible ? 'text' : 'password'} 
                                id="confirmPassword"
                                name="confirmPassword" 
                                placeholder="Confirm Password" 
                                required 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <button 
                                type="button" 
                                onClick={togglePasswordVisibility} 
                                className="toggle-password-btn"
                            >
                                {passwordVisible ? 'Hide' : 'Show'} Password
                            </button>
                        </div>
                        {passwordError && <p className={`error-message ${passwordError ? 'active' : ''}`}>{passwordError}</p>}
                    </div>
                    
                    {/* Right Column */}
                    <div className="form-column right-column">
                        <div className="form-group">
                            <label htmlFor="contact">Contact Number</label>
                            <input 
                                type="text" 
                                id="contact"
                                name="contact" 
                                placeholder="+977-xxxxxxxxx/01-xxxxxxx" 
                                required 
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                            />
                        </div>
                        {contactError && <p className={`error-message ${contactError ? 'active' : ''}`}>{contactError}</p>}
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input 
                                type="text" 
                                id="address"
                                name="address" 
                                placeholder="Address,Nepal" 
                                onChange={(e) => setAddress(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Pan">Pan Number</label>
                            <input 
                                type="text" 
                                id="contactcompany"
                                name="contact" 
                                placeholder="xxxxxx" 
                                onChange={(e) => setPanNumber(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sector">Company Type</label>
                            <select name="sector" id="sector"  onChange={(e) => setCompanyType(e.target.value)} required>
                                <option value="">Select type</option>
                                <option value="private">Private</option>
                                <option value="ngo">NGO/INGO</option>
                            </select>
                        </div>
                    </div>
                </div>

                {errors.general && <span className="error-message-register">{errors.general}</span>}<br/>

                <div className="form-group">
                <button  onClick={handleSignup} className="register-btn"disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'SignUp'}
            </button><br/>
                </div>
                <div className="login-link">
                    <p>Already have an account? <Link to="/EmpLogin">Login here</Link></p>
                </div>
            </form>
        </div>
    </div>
        <Suspense>
        <div className='Plans'>
            <Plans/>
        </div>
        </Suspense>
    </div>
    )
}

export default EmpSignup;