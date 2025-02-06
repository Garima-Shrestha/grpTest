import React from "react";
import { Link } from "react-router-dom";
import "../css/Pdf.css";

const Pdf = () => {
  return (
    <div className="pdf-container">
      <div className="back">
        <Link to="/jobreq">Back</Link>
        <p>The PDF is based on the Nepal Labor Act, 2074. No modifications have been made from our side.</p>
      </div>
      <iframe
        src="/assests/law.pdf"
        width="100%"
        height="100%"
        title="Employment Law in Nepal"
      />
    </div>
  );
};

export default Pdf;
