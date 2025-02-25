import React, { useState, Suspense, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
// Lazy-loaded pages
const LandingPage = React.lazy(() => import('../public/LandingPage.jsx'));
const Authentication = React.lazy(() => import('../public/Authenticaiton.jsx'));
const Feature = React.lazy(() => import('../features/Feature.jsx'));
const EmpFeatures = React.lazy(() => import('../features/EmpFeatures'));
const Admin = React.lazy(() => import('../admin/Admin.jsx'));
const EmployerViewPage = React.lazy(() => import('../admin/EmployerView.jsx'));


const App = () => {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const updateAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setRole(decoded.role);
          setToken(token);
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          setRole(null);
          setToken(null);
        }
      } else {
        setRole(null);
        setToken(null);
      }
    };

    updateAuth(); // Initial check

    // Event listener for token change
    window.addEventListener("tokenUpdated", updateAuth);
    window.addEventListener("storage", updateAuth); // Handle cross-tab changes

    return () => {
      window.removeEventListener("tokenUpdated", updateAuth);
      window.removeEventListener("storage", updateAuth);
    };
  }, []);

  const redirectToRolePage = () => {
    if (role === "applicant") return <Navigate to="/ApplicantHome" />;
    if (role === "employer") return <Navigate to="/empDash" />;
    if (role === "admin") return <Navigate to="/useradmin" />;
    return <LandingPage />;
  };

  // // Manually handle token deletion
  // const handleTokenRemoval = () => {
  //   localStorage.removeItem("token");
  //   setRole(null);
  //   setToken(null); // Make sure to clear state
  // };

  // useEffect(() => {
  //   if (!token) {
  //     // If there's no token, navigate to login
  //     <Navigate to="/login" replace/>;
  //   }
  // }, [token]);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={redirectToRolePage()} />
          <Route path="/signup" element={<PublicRoute><Authentication /></PublicRoute>}/>
          <Route path="/login" element={<PublicRoute><Authentication setToken={setToken}/></PublicRoute>} />
          <Route path="/Empsignup" element={<PublicRoute><Authentication/></PublicRoute>} />
          <Route path="/EmpLogin" element={<PublicRoute><Authentication setToken={setToken} /></PublicRoute>} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["applicant", "admin"]} />}>
            <Route path="/ApplicantHome" element={<Feature />} />
            <Route path="/profileApplicant" element={<Feature />} />
            <Route path="/preparation" element={<Feature />} />
            <Route path="/applications" element={<Feature />} />
            <Route path="/appManageAcc" element={<Feature />} />
            <Route path="/jobdesc" element={<Feature />} />
            <Route path="/jobdesc/:jobId" element={<Feature />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["employer", "admin"]} />}>
            <Route path="/empDash" element={<EmpFeatures />} />
            <Route path="/jobreq" element={<EmpFeatures />} />
            <Route path="/pdf" element={<EmpFeatures />} />
            <Route path="/empprofile" element={<EmpFeatures />} />
            <Route path="/myads" element={<EmpFeatures />} />
          </Route>

          {/* Admin Route */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/useradmin" element={<Admin />} />
            <Route path="/userManage" element={<Admin />} />
            <Route path="/empview" element={<Admin/>} />
            <Route path="/handelJob" element={<Admin/>} />
            <Route path="/notice" element={<Admin/>} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
