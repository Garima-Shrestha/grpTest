import React, { useState, Suspense,useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

// Lazy-loaded pages
const LandingPage = React.lazy(() => import('../public/LandingPage.jsx'));
const Authentication = React.lazy(() => import('../public/Authenticaiton.jsx'));
const Feature = React.lazy(() => import('../features/Feature.jsx'));
const EmpFeatures = React.lazy(() => import('../features/EmpFeatures'));
const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  const setTokenHandler = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={token ? <Navigate to="/ApplicantHome" /> : <LandingPage />} />

          {/* Jatii pani login signup wala portion xa sabb */}
          <Route path="/signup" element={<Authentication />} />
          <Route path="/login" element={<Authentication setToken={setTokenHandler}/>} />
          <Route path="/Empsignup" element={<Authentication />} />
          <Route path="/EmpLogin" element={<Authentication setToken={setTokenHandler}/>} />
            <Route
            path="/ApplicantHome"
            element={<ProtectedRoute token={token}><Feature />
          </ProtectedRoute>}/>
            <Route
            path="/profileApplicant"
            element={<ProtectedRoute token={token}><Feature />
            </ProtectedRoute>}/>
            <Route
            path="/preparation"
            element={<ProtectedRoute token={token}><Feature />
            </ProtectedRoute>}/>
            <Route
            path="/applications"
            element={<ProtectedRoute token={token}><Feature />
            </ProtectedRoute>}/>
          <Route
            path="/appManageAcc"
            element={<ProtectedRoute token={token}><Feature />
            </ProtectedRoute>}/>
            <Route
            path="/jobdesc"
            element={<ProtectedRoute token={token}><Feature />
            </ProtectedRoute>}/>
            <Route path="/jobdesc/:jobId" element={<Feature/>} />
           <Route path="/empDash"element={<ProtectedRoute token={token}><EmpFeatures />
            </ProtectedRoute>}
            />
             <Route path="/jobreq"element={<ProtectedRoute token={token}><EmpFeatures />
            </ProtectedRoute>}
            />
            <Route path="/pdf"element={<ProtectedRoute token={token}><EmpFeatures />
            </ProtectedRoute>}
            />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
