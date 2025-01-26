import React, { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';

// Lazy-loaded components
const Signup = lazy(() => import('./Singup.jsx'));
const LoginApplicant = lazy(() => import('./Login.jsx'));
const EmpSignup = lazy(() => import('./EmployerSignup.jsx'));
const EmpLogin = lazy(() => import('./EmpLogin.jsx'));
const AuthHeader = lazy(() => import('./UnifiedHeader.jsx'));
const Foot = lazy(() => import('../rct/Footer.jsx'));

function Authentication({setToken}) {
  const location = useLocation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
        <AuthHeader />
      {location.pathname === '/signup' ? (
        <>
          <Signup />
          <Foot />
        </>
      ) : location.pathname === '/login' ? (
        <>
          <LoginApplicant setToken={setToken}/>
          <Foot />
        </>
      ) : location.pathname === '/Empsignup' ? (
        <>
          <EmpSignup />
          <Foot />
        </>
      ) : location.pathname === '/EmpLogin' ? (
        <>
          <EmpLogin setToken={setToken}/>
          <Foot />
        </>
      ) : (
        <div>404 Page Not Found</div>
      )}
    </Suspense>
  );
}

export default Authentication;
