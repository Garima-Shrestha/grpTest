import React, { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import axios from "axios";
import "../css/jobdesc.css"; // Assuming you have a CSS file for styling

const JobDesc = () => {
  const { jobId } = useParams(); // Access `jobId` from the URL
  const [jobDetails, setJobDetails] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3000/api/jobposting/jobdesc/${jobId}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        setJobDetails(response.data[0]); // Access the first job object in the array
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };
  
    fetchJobDetails();
  }, [jobId]);


  // Show a loading message while data is being fetched
  if (!jobDetails) {
    return <div>Loading...</div>;
  }


  const handleApplyClick = () => {
    console.log("Applied");
    const userId = localStorage.getItem("userId"); // Assuming you store the user ID in local storage
    const existingJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];
  
    // Check if the user has already applied for this job
    const jobExists = existingJobs.some(job => job.userId === userId && job.id === jobId);
  
    if (!jobExists) {
      // Add the new job to the existing jobs array
      existingJobs.push({
        userId: userId, // Store the user ID
        id: jobId, // Use a unique ID for the job
        title: jobDetails.title,
        company: jobDetails.employer_name,
        vacancyFor: jobDetails.position,
        date: new Date().toLocaleDateString(), // Use the current date for the application date
      });
  
      // Save the updated jobs array back to local storage
      localStorage.setItem("appliedJobs", JSON.stringify(existingJobs));
      setMessage("Application submitted successfully!"); 
    } else {
      setMessage("You have already applied for this job.");
    }
  
    navigate("/applications");
  };



  return (
    <div className="job-desc-container">
      <div className="job-header">
        <img
          src={`http://localhost:3000${jobDetails.employer_profile_picture}`} // Ensure the image URL is correct
          alt={jobDetails.employer_name}
          className="company-logo"
        />
        <div className="job-header-details">
          <h2>{jobDetails.employer_name}</h2> {/* Company Name */}
          <h4>{jobDetails.title}</h4> {/* Job Title */}
        </div>
        <div className="job-section-head">
          <h3>Job Type</h3>
          <p>{jobDetails.position}</p> {/* Job Type */}
        </div>
        <div className="job-section-head">
          <h3>Deadline</h3>
          <p>{new Date(jobDetails.deadline).toLocaleDateString() || "N/A"}</p> {/* Deadline */}
        </div>
      </div>

      <div className="job-details">
        <div className="job-section">
        <h3>Job Qualifications</h3>
          <ul>
            {jobDetails.qualifications
              ? jobDetails.qualifications
                  .replace(/<\/?ul>/g, "") // Remove <ul> tags
                  .replace(/<\/?li>/g, "\n") // Replace <li> tags with new lines
                  .split("\n")
                  .filter(req => req.trim() !== "")
                  .map((req, index) => (
                    <li key={index}>{req.trim()}</li>
                  ))
              : <li>No job qualifications available.</li>}
          </ul>
        </div>

        <div className="job-section">
          <h3>Job Description</h3>
          <div dangerouslySetInnerHTML={{ __html: jobDetails.description }} /> {/* Render HTML safely */}
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="apply-button-container">
        <button className="apply-button" onClick={handleApplyClick}>
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDesc;