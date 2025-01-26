import React, { lazy, Suspense, useEffect } from 'react';
import '../css/landingstyle.css'
// Lazy-loaded components
const Body = lazy(() => import('./LnadingBody.jsx'));
const Head = lazy(() => import('../rct/Header.jsx'));
const Foot = lazy(() => import('../rct/Footer.jsx'));

function LandingPage() {
  useEffect(() => {
    // Scroll to top when landing page loads
    window.scrollTo(20, 0);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="Landing-body">
      <Head />
      <Body />
      <Foot />
      </div>
    </Suspense>
  );
}

export default LandingPage;
