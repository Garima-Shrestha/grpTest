import React, { useState, useEffect } from "react";
import '../css/photo.css';

const ResumeBuilder = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [certifications, setCertifications] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch resume data on initial render
  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/resumes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Resume Data:", data);
        if (data.resumes.length > 0) {
          const resume = data.resumes[0]; // Assuming only one resume per user
          console.log("Selected Resume:", resume);
          setResumeData(resume);
          setFullName(resume.full_name);
          setEmail(resume.email);
          setContact(resume.contact);
          setAddress(resume.address);
          setEducation(resume.education);
          setExperience(resume.experience);
          setSkills(resume.skills);
          setCertifications(resume.certifications);
        } else {
          setErrorMessage('No resume found for the user.');
        }
      } else {
        setErrorMessage('Error fetching resume: ' + response.statusText);
      }
    } catch (error) {
      setErrorMessage('Request failed: ' + error.message);
    }
  };
  

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const url = editing
      ? `http://localhost:3000/api/resumes/${resumeData.id}` // Update endpoint
      : 'http://localhost:3000/api/resumes'; // Save endpoint
    const method = editing ? 'PUT' : 'POST';
  
    const resumePayload = {
      fullName,
      email,
      contact,
      address,
      education,
      experience,
      skills,
      certifications,
    };
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumePayload),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (editing) {
          setResumeData(data.updatedResume);
          console.log(resumeData);
          
        } else {
          setResumeData(data.newResume);
          console.log(resumeData);

        }
        setEditing(false); // Exit editing mode after saving
      } else {
        const errorData = await response.json();
        setErrorMessage('Error: ' + errorData.message);
      }
    } catch (error) {
      setErrorMessage('Request failed: ' + error.message);
    }
  };
  
  const handleEdit = () => {
    setEditing(true);
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setContact("");
    setAddress("");
    setEducation("");
    setExperience("");
    setSkills("");
    setCertifications("");
    setEditing(false);
  };

  return (
    <div className="resume-builder-container">
      <div className="resume-form">
        <h1>Resume Builder</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Full Name */}
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
        />

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        {/* Contact */}
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Enter your contact number"
        />

        {/* Address */}
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
        />

        {/* Education Qualification Dropdown */}
        <select
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          className="dropdown"
        >
          <option value="">Select your education qualification</option>
          <option value="High School">High School</option>
          <option value="Bachelor's Degree">Bachelor's Degree</option>
          <option value="Master's Degree">Master's Degree</option>
          <option value="Ph.D">Ph.D</option>
        </select>

        {/* Experience */}
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Enter your experience"
        />

        {/* Skills */}
        <textarea
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Enter your skills (comma-separated)"
        />

        {/* Certifications */}
        <textarea
          value={certifications}
          onChange={(e) => setCertifications(e.target.value)}
          placeholder="Enter your certifications"
        />

        {/* Save and Update Buttons */}
        <button onClick={handleSave}>
          {editing ? 'Update Resume' : 'Save Resume'}
        </button>
      </div>
      {console.log("Rendering Resume Data:", resumeData)}
      {/* Display Resume */}
      {resumeData && !editing && (
        <div className="resume-display">
          <h3>Your Resume</h3>
          <p><strong>Full Name:</strong> {resumeData.full_name || "N/A"}</p>
          <p><strong>Email:</strong> {resumeData.email}</p>
          <p><strong>Contact:</strong> {resumeData.contact}</p>
          <p><strong>Address:</strong> {resumeData.address}</p>
          <p><strong>Education:</strong> {resumeData.education}</p>
          <p><strong>Experience:</strong> {resumeData.experience}</p>
          <p><strong>Skills:</strong> {resumeData.skills}</p>
          <p><strong>Certifications:</strong> {resumeData.certifications}</p>
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
