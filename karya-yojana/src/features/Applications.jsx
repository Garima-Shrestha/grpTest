import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios";
import "../css/Applications.css";

const Applications = () => {
  const [appliedJobs, setAppliedJobs] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get('http://localhost:3000/api/jobapplication/applications/specific', {
          headers: { "Authorization": `Bearer ${token}` },
        });
        setAppliedJobs(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  // Filtering 
  const filteredVacancies = appliedJobs.filter((vacancy) =>
    vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacancy.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacancy.vacancyFor.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const handleViewPost = (id) => {
    navigate(`/jobdesc/${id}`);        // Navigate to the job description page using the job ID
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
                <td>{vacancy.vacancy_for}</td>
                <td>{new Date(vacancy.application_date).toLocaleDateString()}</td>

                <td>
                  {/* <button className="view-button" onClick={() => handleViewPost(vacancy.id)}> */}

                  <button className="view-button" onClick={() => {    //remember
                    console.log('Vacancy id:', vacancy.id);
                    console.log('Vacancy:', vacancy);
                    // handleViewPost(vacancy.id);
                    console.log('Vacancy job_id:', vacancy.job_id);
                    handleViewPost(vacancy.job_id);
                  }}>


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