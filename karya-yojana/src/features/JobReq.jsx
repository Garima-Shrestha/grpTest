import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "../css/JobPostingForm.css";
import { Link } from "react-router-dom";

const JobPostingForm = () => {
  const [fetchError, setFetchError] = useState(null); 

  const [formData, setFormData] = useState({
    title: "",
    deadline: "",
    salary: "",
    position: "Fresher",
    description: "",
    qualifications: "",
    transaction: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuillChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Job Posted:", formData);
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token) {
      setFetchError("You are not authenticated. Please log in.");
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/jobposting/jobreq/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Job posted successfully", data);
        setFetchError(null);  
  
        // Reset form data after a successful submission
        setFormData({
          title: "",
          deadline: "",
          salary: "",
          position: "Fresher",
          description: "",
          qualifications: "",
          transaction: "",
        });
      } else {
        setFetchError("Failed to post the job or Transaction limit exceeded.");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      setFetchError("An error occurred. Please try again later.");
    }
  };
  
  
  return (
      <div className="job-posting-container">
      <h2 className="req-form-title">Post a Job</h2>
      {fetchError && <div className="error-message">{fetchError}</div>}

        <form onSubmit={handleSubmit} className="req-form-content">
          <div className="req-form-group">
            <label>Job Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="req-form-group">
            <label>Application Deadline</label>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
          </div>
          <div className="req-form-group">
            <label>Salary</label>
            <input type="number" name="salary" value={formData.salary} onChange={handleChange} required />
          </div>
          <div className="req-form-group">
            <label>Job Position</label>
            <select name="position" value={formData.position} onChange={handleChange}>
              <option value="Fresher">Fresher</option>
              <option value="Intern">Intern</option>
              <option value="Full Time">Full Time</option>
            </select>
          </div>
          <div className="req-form-group">
            <label>Job Description</label>
            <ReactQuill className="quill" value={formData.description} onChange={(value) => handleQuillChange("description", value)} />
          </div>
          <div className="req-form-group">
            <label>Qualifications</label>
            <ReactQuill className="quill" theme="snow" value={formData.qualifications} onChange={(value) => handleQuillChange("qualifications", value)} />
          </div>
          <div className="req-form-group">
            <label>Transaction Id</label>
            <input type="text" name="transaction" value={formData.transaction} onChange={handleChange} required />
            <p className="quillpara">Make sure you re-check your transaction id. Failure to verify will result in job not being posted. Each transaction will be valid for 10 ads only.</p>
          </div>
          <button type="submit" className="req-form-button">Post Job</button>
        </form>
        <Link to="/pdf">
         Read "NEPAL LABOR ACT 2074"
        </Link>
      </div>
  );
};

export default JobPostingForm;
