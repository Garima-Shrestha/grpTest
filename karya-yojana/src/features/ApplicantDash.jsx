import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import "../css/DashboardApp.css";
import FAQ from "./FAQ";

const ApplicantDash = () => {
  // Sample data for jobs with profile pictures
  const jobs = [
    { name: "Company A", position: "Sales Representative", image: "../assests/brand1.png" },
    { name: "Company B", position: "Software Engineer", image: "../assests/brand2.png" },
    { name: "Company C", position: "Graphic Designer", image: "../assests/brand3.png" },
    { name: "Company D", position: "Marketing Manager", image: "../assests/brand4.png" },
    { name: "Company E", position: "Product Manager", image: "../assests/brand5.png" },
    { name: "Company F", position: "UX Designer", image: "../assests/brand6.png" },
    { name: "Company G", position: "UX Designer", image: "../assests/brand7.png" },
    { name: "Company H", position: "UX Designer", image: "../assests/brand8.png" },
    { name: "Company I", position: "UX Designer", image: "../assests/brand9.png" },
    { name: "Company J", position: "UX Designer", image: "../assests/brand10.png" },
  ];

  // State to manage the search term
  const [searchTerm, setSearchTerm] = useState("");

  // Highest paying job and top employers
  const highestPayingJob = "Software Engineer - $120,000/year";
  const topEmployers = ["Company A", "Company B", "Company C", "Company D"];

  // Filtering jobs based on the search term
  const filteredJobs = jobs.filter((job) =>
    job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for jobs, companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="content">
        {/* Main Section */}
        <div className="main-section">
          <div className="table-container-main">
            <h3>Job Listings</h3>
            <div className="job-listings-scrollable">
              <div className="job-listings">
                {filteredJobs.map((job, index) => (
                  <Link key={index} to="/jobdesc" className="job-cell"> {/* Add Link here */}
                    <img
                      src={job.image}
                      alt={job.name}
                      className="job-image"
                    />
                    <div className="job-details1">
                      <span className="company-name">{job.name}</span><br/>
                      <span className="position">{job.position}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="table-container">
            <h3>Highest Paying Job</h3>
            <table>
              <tbody>
                <tr>
                  <td>{highestPayingJob}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Top Employers */}
          <div className="table-container">
            <h3>Top Employers</h3>
            <table>
              <tbody>
                {topEmployers.map((employer, index) => (
                  <tr key={index}>
                    <td>{employer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};

export default ApplicantDash;
