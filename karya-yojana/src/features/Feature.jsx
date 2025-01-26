import React, { Suspense } from "react";
import { useLocation, useParams } from "react-router-dom";

const HeaderMain = React.lazy(() => import("./HeaderMain"));
const Footer = React.lazy(() => import("../rct/Footer"));
const ApplicantProfile = React.lazy(() => import("./ApplicantProfile"));
const ApplicantDash = React.lazy(() => import("./ApplicantDash"));
const Prep = React.lazy(() => import("./Prep.jsx"));
const Applications = React.lazy(() => import("./Applications.jsx"));
const ManageAcc = React.lazy(() => import("./ManageAccount.jsx"));
const JobDesc = React.lazy(() => import("./JobDesc.jsx"));

const Features = () => {
  const location = useLocation();

  // Map of routes to components
  const routeComponents = {
    "/ApplicantHome": <ApplicantDash />,
    "/profileApplicant": <ApplicantProfile />,
    "/preparation": <Prep />,
    "/applications": <Applications />,
    "/appManageAcc": <ManageAcc />,
    "/jobdesc": <JobDesc />,
  };

  // Handle dynamic `/jobdesc/:jobId` route
  if (location.pathname.startsWith("/jobdesc")) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <HeaderMain />
        <JobDesc />
        <Footer />
      </Suspense>
    );
  }

  const CurrentComponent = routeComponents[location.pathname] || (
    <div>404 Page Not Found</div>
  );

  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <HeaderMain />
      {CurrentComponent}
      <Footer />
    </Suspense>
  );
};

export default Features;
