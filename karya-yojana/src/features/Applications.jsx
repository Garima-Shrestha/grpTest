import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../css/Applications.css";

const Applications = () => {
  const [appliedJobs, setAppliedJobs] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedJobs = localStorage.getItem("appliedJobs");
    const userId = localStorage.getItem("userId"); // Get the user ID from local storage

    if (storedJobs && userId) { // Ensure userId is available
      const allJobs = JSON.parse(storedJobs);
      // Filter jobs by user ID
      const userJobs = allJobs.filter(job => job.userId === userId); 
      setAppliedJobs(userJobs); // Set only the jobs that belong to the user
    }
  }, []);

  // Filtering 
  const filteredVacancies = appliedJobs.filter((vacancy) =>
    vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacancy.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacancy.vacancyFor.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const handleViewPost = (id) => {
    // Navigate to the job description page using the job ID
    navigate(`/jobdesc/${id}`);
  };

  return (
    <div className="vacancies-container">
      <div className="table-wrapper">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <table>
          <thead>
            <tr>
              <th>NUMBER</th>
              <th>TITLE OF VACANCY</th>
              <th>COMPANY</th>
              <th>VACANCY FOR</th>
              <th>APPLICATION DATE</th>
              <th>VIEW POST</th>
            </tr>
          </thead>
          <tbody>
            {filteredVacancies.map((vacancy, index) => (
              <tr key={vacancy.id || index}>
                <td>{index + 1}</td>
                <td>{vacancy.title}</td>
                <td>{vacancy.company}</td>
                <td>{vacancy.vacancyFor}</td>
                <td>{vacancy.date}</td>
                <td>
                  <button className="view-button" onClick={() => handleViewPost(vacancy.id)}>
                    <span role="img" aria-label="view">👁️</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="disclaimer">
        <p>*Disclaimer: Please note that only selected candidates will get a call or email.*</p>
      </div>
    </div>
  );
};

export default Applications;