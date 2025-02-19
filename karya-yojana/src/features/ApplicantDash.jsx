import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import axios from "axios";
import "../css/DashboardApp.css";
import FAQ from "./FAQ";

const ApplicantDash = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/jobposting/jobs', {
          headers: { "Authorization": `Bearer ${token}` },
        });
        setJobs(response.data.jobs); 
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  
  // Filtering jobs based on the search term and status
  const filteredJobs = jobs.filter((job) => {
    // Check if job is defined and has the required properties
    if (job && job.status === 'approved') {
      const jobName = job.title || ""; 
      const jobPosition = job.position || ""; 
      return (
        jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobPosition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return false; 
  });


  // Get highest paying jobs
  const highestPayingJobs = jobs
    .filter(job => job.status === 'approved' && job.salary) // Ensure job is approved and has a salary
    .sort((a, b) => b.salary - a.salary) // Sort by salary descending
    .slice(0, 5); // Get top 5 highest paying jobs

  // Get top employers
  const employerCount = {};
  jobs.forEach(job => {
    if (job.status === 'approved') {
      employerCount[job.employer_name] = (employerCount[job.employer_name] || 0) + 1;
    }
  });
  const topEmployers = Object.entries(employerCount)
    .sort(([, a], [, b]) => b - a) // Sort by number of job postings
    .slice(0, 5) // Get top 5 employers
    .map(([employer]) => employer); // Extract employer names


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
              {filteredJobs.length === 0 ? (
                  <p>No job listings available.</p>
                ) : (
                  filteredJobs.map((job, index) => (
                    <Link key={index} to={`/jobdesc/${job.id}`} className="job-cell">
                      <img 
                        src={`http://localhost:3000${job.employer_profile_picture}`} 
                        alt="company-img" 
                        className="job-image"
                      />
                      <div className="job-details1">
                      <span className="company-name">{job.employer_name}</span><br /> 
                      <span className="job-title">{job.title}</span><br /> 
                      <span className="position">{job.position}</span><br/>
                      <span className="deadline">{new Date(job.deadline).toLocaleDateString() || "N/A"}</span> 
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          {/* Highest Paying Jobs */}
          <div className="table-container">
            <h3>Highest Paying Jobs</h3>
            <table>
              <tbody>
                {highestPayingJobs.length === 0 ? (
                  <tr><td>No highest paying jobs available.</td></tr>
                ) : (
                  highestPayingJobs.map((job, index) => (
                    <tr key={index}>
                      <td>{job.title} - Rs.{job.salary}/month</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Top Employers */}
          <div className="table-container">
            <h3>Top Employers</h3>
            <table>
              <tbody>
                {topEmployers.length === 0 ? (
                  <tr><td>No top employers available.</td></tr>
                ) : (
                  topEmployers.map((employer, index) => (
                    <tr key={index}>
                      <td>{employer}</td>
                    </tr>
                  ))
                )}
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
