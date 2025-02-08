// import React, { useState, Suspense,useEffect } from 'react';
// import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import { Navigate } from 'react-router-dom';

// // Lazy-loaded pages
// const LandingPage = React.lazy(() => import('../public/LandingPage.jsx'));
// const Authentication = React.lazy(() => import('../public/Authenticaiton.jsx'));
// const Feature = React.lazy(() => import('../features/Feature.jsx'));
// const EmpFeatures = React.lazy(() => import('../features/EmpFeatures'));
// const ProtectedRoute = ({ token, children }) => {
//   if (!token) {
//     return <Navigate to="/login" />;
//   }
//   return <>{children}</>;
// };

// function App() {
//   const [token, setToken] = useState(localStorage.getItem("token"));

//   useEffect(() => {
//     const handleStorageChange = () => {
//       setToken(localStorage.getItem("token"));
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);
//   const setTokenHandler = (newToken) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//   };
//   return (
//     <Router>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Routes>
//           {/* Landing Page Route */}
//           <Route path="/" element={token ? <Navigate to="/ApplicantHome" /> : <LandingPage />} />

//           {/* Jatii pani login signup wala portion xa sabb */}
//           <Route path="/signup" element={<Authentication />} />
//           <Route path="/login" element={<Authentication setToken={setTokenHandler}/>} />
//           <Route path="/Empsignup" element={<Authentication />} />
//           <Route path="/EmpLogin" element={<Authentication setToken={setTokenHandler}/>} />
//             <Route
//             path="/ApplicantHome"
//             element={<ProtectedRoute token={token}><Feature />
//           </ProtectedRoute>}/>
//             <Route
//             path="/profileApplicant"
//             element={<ProtectedRoute token={token}><Feature />
//             </ProtectedRoute>}/>
//             <Route
//             path="/preparation"
//             element={<ProtectedRoute token={token}><Feature />
//             </ProtectedRoute>}/>
//             <Route
//             path="/applications"
//             element={<ProtectedRoute token={token}><Feature />
//             </ProtectedRoute>}/>
//           <Route
//             path="/appManageAcc"
//             element={<ProtectedRoute token={token}><Feature />
//             </ProtectedRoute>}/>
//             <Route
//             path="/jobdesc"
//             element={<ProtectedRoute token={token}><Feature />
//             </ProtectedRoute>}/>
//             <Route path="/jobdesc/:jobId" element={<Feature/>} />
//            <Route path="/empDash"element={<ProtectedRoute token={token}><EmpFeatures />
//             </ProtectedRoute>}
//             />
//              <Route path="/jobreq"element={<ProtectedRoute token={token}><EmpFeatures />
//             </ProtectedRoute>}
//             />
//             <Route path="/pdf"element={<ProtectedRoute token={token}><EmpFeatures />
//             </ProtectedRoute>}
//             />
//         </Routes>
//       </Suspense>
//     </Router>
//   );
// }

// export default App;





import React, { useState, Suspense,useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

// Lazy-loaded pages
const LandingPage = React.lazy(() => import('../public/LandingPage.jsx'));
const Authentication = React.lazy(() => import('../public/Authenticaiton.jsx'));
const Feature = React.lazy(() => import('../features/Feature.jsx'));
const EmpFeatures = React.lazy(() => import('../features/EmpFeatures'));
const Admin = React.lazy(() => import('../admin/Admin.jsx'));
const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setToken(localStorage.getItem("token"));
  //   };

  //   window.addEventListener("storage", handleStorageChange);
  //   return () => window.removeEventListener("storage", handleStorageChange);
  // }, []);
  // const setTokenHandler = (newToken) => {
  //   localStorage.setItem("token", newToken);
  //   setToken(newToken);
  // };
  

  // yo useEffect le token decode garxa aani role set garxa
  useEffect(() => {
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
    }
  }, []);  // Runs only once on component mount

  // Token handler to update state and localStorage
  const setTokenHandler = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Landing Page Route */}
          {/* <Route path="/" element={token ? <Navigate to="/ApplicantHome" /> : <LandingPage />} /> */}
          <Route path="/" element={role === "admin" ? <Navigate to="/useradmin" /> : role ? <Navigate to="/ApplicantHome" /> : <LandingPage />} />


          {/* Jatii pani login signup wala portion xa sabb */}
          <Route path="/signup" element={<Authentication />} />
          <Route path="/login" element={<Authentication setToken={setTokenHandler}/>} />
          <Route path="/Empsignup" element={<Authentication />} />
          <Route path="/EmpLogin" element={<Authentication setToken={setTokenHandler}/>} />


          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/ApplicantHome" element={<Feature />}/>
            <Route path="/profileApplicant" element={<Feature />}/>
            <Route path="/preparation" element={<Feature />}/>
            <Route path="/applications" element={<Feature />}/>
            <Route path="/appManageAcc" element={<Feature />}/>
            <Route path="/jobdesc" element={<Feature />}/>
            <Route path="/jobdesc/:jobId" element={<Feature/>} />
            
            <Route path="/empDash"element= {<EmpFeatures />}/>
            <Route path="/jobreq"element= {<EmpFeatures />}/>
            <Route path="/pdf"element= {<EmpFeatures />}/>
          </Route>



            {/* Admin Route */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/useradmin" element={<Admin />} />
          </Route>

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
