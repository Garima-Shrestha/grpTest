import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/AdminSidebar.css";

const AdminSidebar = () => {
    const sidebarRef = useRef(null);
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user")
        window.location.href = "/login";
    };

    return (
        <>
            {/* Sidebar */}
            <div className="admin-sidebar" ref={sidebarRef}>
                <nav>
                    <ul>
                        <li className={location.pathname === "/useradmin" ? "active" : ""}>
                            <Link to="/useradmin">Dashboard</Link>
                        </li>
                        <li className={location.pathname === "/handelJob" ? "active" : ""}>
                            <Link to="/handelJob">Requests</Link>
                        </li>
                        <li className={location.pathname === "/userManage" ? "active" : ""}>
                            <Link to="/userManage">Applicant Management</Link>
                        </li>
                        <li className={location.pathname === "/empview" ? "active" : ""}>
                            <Link to="/empview">Employer Management</Link>
                        </li>
                        <li>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default AdminSidebar;