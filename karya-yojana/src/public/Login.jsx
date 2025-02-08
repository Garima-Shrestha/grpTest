import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const LoginApplicant = ({setToken}) => {
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
            const response = await fetch('http://localhost:3000/api/auth/login',{
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

                localStorage.setItem("user", JSON.stringify({ isAuthenticated: true, role: data.user.role }));      // role: data.user.role => Storing user role received from backend


                console.log("Token:", data.token);
console.log("User data:", { isAuthenticated: true, role: data.user.role });


                // navigate('/ApplicantHome');
                console.log("Applicant Logged in successfully");

                setToken(data.user.role);  

                // Navigate based on role
                if (data.user.role === 'admin') {
                    navigate('/useradmin');  // Redirect to admin page
                } else {
                    navigate('/ApplicantHome');  // Redirect to applicant page
                }
  
                // navigate(data.user.role === "admin" ? "/useradmin" : "/ApplicantHome");
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
        <div className="login-container">
            <div className="login-box">
                <div className="login-form-box">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h1>Login</h1>

                        <div className="login-input-group">
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

                        <div className="login-input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Password"
                                required
                                aria-label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="login-show-password-btn"
                                aria-label="Toggle password visibility"
                            >
                                {passwordVisible ? 'Hide' : 'Show'} Password
                            </button>

                        </div>
                        {errors.general && <span className="error-message-login">{errors.general}</span>}<br></br>

                        <div className="login-input-group">
                            <button className='login-btn' type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button><br />
                        </div>

                        <div className="login-signup-link">
                            <p>New here? <Link to="/signup">Signup here</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginApplicant;
