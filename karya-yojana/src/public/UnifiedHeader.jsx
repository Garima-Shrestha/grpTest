import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/Untitled.png';
import '../css/Signup.css';

function UnifiedHeader() {
    const location = useLocation();

    // Determine the type of user based on the route
    const isEmployerRoute = location.pathname.includes('Emp');
    const isLoginPage = isEmployerRoute ? location.pathname === '/EmpLogin' : location.pathname === '/login';

    return (
        <nav className="head-small">
            <Link to="/" onClick={() => {
                window.location.href = "/";
            }}>
                <div className="logo">
                    <img src={logo} alt="KaryaYojana" />
                </div>
            </Link>
            <div className="title">
                <ul>
                    <li>
                        {/* Toggle the Link text and route dynamically */}
                        <Link to={isLoginPage ? (isEmployerRoute ? '/Empsignup' : '/signup') : (isEmployerRoute ? '/EmpLogin' : '/login')}>
                            {isLoginPage ? (isEmployerRoute ? 'Signup' : 'Signup') : (isEmployerRoute ? 'Login' : 'Login')}
                        </Link>
                    </li>
                    <li>
                        {/* Switch between Applicant and Employer Zone */}
                        <Link to={isEmployerRoute ? '/signup' : '/Empsignup'}>
                            {isEmployerRoute ? 'Applicant Zone' : 'Employer Zone'}
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default UnifiedHeader;
