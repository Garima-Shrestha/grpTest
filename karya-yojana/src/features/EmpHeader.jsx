import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Untitled.png";
import "../css/mainHeader.css";

const EmpHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation(); // Get the current location

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Helper function to check if the link is active
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };
  const handleLogout=()=>{
    localStorage.removeItem('token')
    window.location.reload()
  }
  return (
    <div className="emp-header-main">
      <div className="emp-main-logo">
        <Link to="/empDash">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="emp-main-menu">
        <ul>
          <li className={isActive("/empDash")}>
            <Link to="/empDash">Home</Link>
          </li>
          <li className={isActive("/jobreq")}>
            <Link to="/jobreq">Post Request</Link>
          </li>
          <li className={isActive("/requests")}>
            <Link to="/applications">My Ads</Link>
          </li>
        </ul>
      </div>
      <div className="emp-profile" onClick={toggleDropdown}>
        <img src="../assests/person.svg" alt="Profile" />
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <ul>
              <li onClick={() => window.location.href = "/profileEmp"}>Profile</li>
              <li onClick={() => window.location.href = "/empManageAcc"}>Manage Account</li>
              <li onClick={handleLogout}>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpHeader;
