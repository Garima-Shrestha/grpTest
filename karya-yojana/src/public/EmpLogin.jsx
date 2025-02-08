import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/EmployerLogin.css';
import { useNavigate } from 'react-router-dom';
const EmpLogin=({setToken})=> {
    const [email, setEmail] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try{
            const response = await fetch('http://localhost:3000/api/employer/employerLogin',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                localStorage.setItem("token", data.token); // Ensure token is stored

                localStorage.setItem("user", JSON.stringify({ isAuthenticated: true, role: data.employer.role }));     // role: data.employer.role => Storing user role received from backend
                
                navigate('/empDash');
            } else {
                console.error('Login failed:', data.error);
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
        <div className="emp-login">
            <div className="emp-box">
                <div className="emp-form-box">
                    <form className="emp-form" onSubmit={handleSubmit}>
                        <h1>Employer Login</h1>
                        
                        <div className="emp-input-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email"
                                name="email" 
                                placeholder="Email" 
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-label="Email"
                            />
                        </div>

                        <div className="emp-input-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                type={passwordVisible ? 'text' : 'password'} 
                                id="password"
                                name="password" 
                                placeholder='Password'
                                aria-label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button 
                                type="button" 
                                onClick={togglePasswordVisibility} 
                                className="emp-show-password-btn" 
                                aria-label="Toggle password visibility"
                            >
                                {passwordVisible ? 'Hide' : 'Show'} Password
                            </button>
                        </div>
                        {errors.general && <span className="error-message-login">{errors.general}</span>}<br></br>
                        <div className="emp-input-group">
                        <button className='emp-login-btn' type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button><br />
                        </div>

                        <div className="emp-signup-link">
                            <p>New here? <Link to="/Empsignup">Signup here</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EmpLogin;