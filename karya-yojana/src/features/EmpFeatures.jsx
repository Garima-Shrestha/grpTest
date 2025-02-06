import React, { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import '../css/pdf.css'
const EmpHeader = lazy(() => import("./EmpHeader.jsx"));
const EmpFooter = lazy(() => import("./EmpFooter.jsx"));
const Dash = lazy(() => import("./EmpDashboard.jsx"));
const Req = lazy(()=>import("./JobReq.jsx"))
const PDF = lazy(()=>import("./pdf.jsx"))
const EmpFeature = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmpHeader />
      {location.pathname === "/empDash" ?( <Dash /> ):
      location.pathname==='/jobreq'?(<Req/>):
      location.pathname==='/pdf'?(<PDF/>): 
      <div>404 Page Not Found</div>}

      <EmpFooter />
    </Suspense>
  );
};

export default EmpFeature;
