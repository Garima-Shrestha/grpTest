import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/jobdesc.css"; // Assuming you have a CSS file for styling

const JobDesc = () => {
  const { jobId } = useParams(); // Access `jobId` from the URL
  const [jobDetails, setJobDetails] = useState(null);

  // (dummy data for now)
  useEffect(() => {
    const fetchJobDetails = async () => {
      const dummyJobDetails = {
        id: jobId,
        name: `Company ${jobId}`,
        position: "Software Engineer",
        image: `../assests/brand${jobId}.png`,
        jobReq: `
          - 3+ years of experience in software development with a strong understanding of computer science fundamentals.
          - Proficiency in JavaScript, React, and Node.js, with experience in building scalable web applications.
          - Hands-on experience with RESTful APIs, microservices, and cloud-based architectures (e.g., AWS, Azure, or GCP).
          - Familiarity with databases such as PostgreSQL, MongoDB, or MySQL, including schema design and query optimization.
          - Strong debugging and problem-solving skills with a focus on performance optimization.
          - Knowledge of version control systems like Git, including branching and pull request workflows.
          - Experience with Agile methodologies and tools such as JIRA or Trello.
          - Ability to write clean, maintainable, and testable code, following best practices and coding standards.
          - Strong communication skills and the ability to collaborate effectively in a cross-functional team.
          - Passion for learning and adapting to new technologies, with a proactive approach to skill development.
        `,
        jobDesc: `
          We are seeking a talented and motivated Software Engineer to join our dynamic team. As a Software Engineer, you will:
          
          - Design, develop, and maintain high-quality software applications that meet business requirements.
          - Collaborate with product managers, designers, and other engineers to define and implement innovative solutions.
          - Participate in code reviews to ensure code quality, performance, and adherence to best practices.
          - Troubleshoot and resolve technical issues, ensuring optimal application performance and user experience.
          - Contribute to the architecture and design of scalable and maintainable systems.
          - Stay updated on emerging technologies and industry trends to ensure our applications remain cutting-edge.
          
          This role offers the opportunity to work on challenging projects, grow your skills, and make a meaningful impact in a fast-paced and supportive environment.
        `,
        jobType: "Full-Time",
        deadline:"2025-02-26",
      };

      // Simulate fetching data
      setTimeout(() => setJobDetails(dummyJobDetails), 500);
    };

    fetchJobDetails();
  }, [jobId]);

  // Show a loading message while data is being fetched
  if (!jobDetails) {
    return <div>Loading...</div>;
  }

  const handleApplyClick = () => {
    console.log("Applied");
  };

  return (
    <div className="job-desc-container">
      <div className="job-header">
        <img
          src={jobDetails.image}
          alt={jobDetails.name}
          className="company-logo"
        />
        <div className="job-header-details">
          <h2>{jobDetails.name}</h2>
          <h4>{jobDetails.position}</h4>
        </div>
        <div className="job-section-head">
          <h3>Job Type</h3>
          <p>{jobDetails.jobType}</p>
        </div>
        <div className="job-section-head">
          <h3>Deadline</h3>
          <p>{jobDetails.deadline}</p>
        </div>
      </div>

      <div className="job-details">
        <div className="job-section">
          <h3>Job Requirements</h3>
          <ul>
            {jobDetails.jobReq
              .split("\n")
              .filter((req) => req.trim() !== "")
              .map((req, index) => (
                <li key={index}>{req.trim().replace(/^-\s*/, "")}</li>
              ))}
          </ul>
        </div>

        <div className="job-section">
          <h3>Job Description</h3>
          <ul>
            {jobDetails.jobDesc
              .split("\n")
              .filter((desc) => desc.trim() !== "")
              .map((desc, index) => (
                <li key={index}>{desc.trim().replace(/^-\s*/, "")}</li>
              ))}
          </ul>
        </div>
      </div>

      <div className="apply-button-container">
        <button className="apply-button" onClick={handleApplyClick}>
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDesc;
