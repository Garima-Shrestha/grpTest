import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Signup.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contact, setContact] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [contactError, setContactError] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState);
    };

    const handleSignup = async (e) => {
        e.preventDefault(); 

        let hasError = false;

        const passwordLengthValid = password.length >= 8; // Minimum 8 characters
        const containsUppercase = /[A-Z]/.test(password); // At least 1 uppercase letter
        const containsNumber = /\d/.test(password); // At least 1 number
        const containsSpecialChar = /[@$!%*?&#]/.test(password); // At least 1 special character
    
        // Password validation
        if (!passwordLengthValid) {
            setPasswordError('Password must be at least 8 characters.');
            hasError = true;
        } else if (!containsUppercase || !containsNumber || !containsSpecialChar) {
            setPasswordError('Password must contain one uppercase, number and special character.');
            hasError = true;
        } else if (password !== confirmPassword) {
            setPasswordError('Passwords do not match!');
            hasError = true;
        } else {
            setPasswordError('');
        }
    
        // Contact number validation
        if (contact.length !== 10) {
            setContactError('Contact number must be exactly 10 digits!');
            hasError = true;
        } else {
            setContactError('');
        }
        setIsLoading(true);
        try{
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    contact,
                    gender,
                }),                
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Signup successful:', data);
                navigate('/login'); 
            }else {
                console.error('Signup failed:', data.error);
                setErrors({ general: data.error });  
            }
        }catch (err) {
            console.error('Error:', err);
            setErrors({ general: 'Something went wrong. Please try again.' });
        }
        finally{
            setIsLoading(false);
          }
    };

    return (
        <div className="signup">
            <div className="Box">
                <div className="Form-Box">
                    <form className="form" onSubmit={handleSignup}>
                        <h1>Sign Up</h1>

                        <div className="input-row">
                            <div className="input-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
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
                        </div>

                        <div className="input-row">
                            <div className="input-group">
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
                                 {passwordError && <p className="error-message">{passwordError}</p>}
                            </div>

                            <div className="input-group">
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
                                 <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="show-password-btn"
                                >
                                    {passwordVisible ? 'Hide' : 'Show'} Password
                                </button>
                               
                            </div>
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label htmlFor="contact">Contact Number</label>
                                <input
                                    type="text"
                                    id="contact"
                                    name="contact"
                                    placeholder="Contact Number"
                                    required
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                />
                                  {contactError && <p className="error-message">{contactError}</p>}
                            </div>

                            <div className="input-group">
                                <label htmlFor="gender">Gender</label>
                                <select 
                                    name="gender" 
                                    id="gender" 
                                    onChange={(e) => setGender(e.target.value)} 
                                    required>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        
                        {errors.general && <span className="error-message-register">{errors.general}</span>}<br></br>

                        <div className="input-group">
                        <button id="RegisterButton" type="submit" className="signup-btn" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'SignUp'}
            </button><br/>                        </div>

                        <div className="login-link">
                            <p>Already have an account? <Link to="/login">Login here</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;