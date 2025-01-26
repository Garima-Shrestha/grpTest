import React from "react";
import { useState } from "react";
import "../css/Applications.css"
const Applicantions=()=>{
    const [searchTerm, setSearchTerm] = useState("");

    const vacancies = [
      { id: 1, title: "Graphics Design Intern", company: "ByayamKendra.com", vacancyFor: "Internship", date: "2024-10-12" },
      { id: 2, title: "Graphics Designer", company: "Crimson Peak", vacancyFor: "Internship", date: "2024-11-01" },
      { id: 3, title: "Internship - Call Center Food", company: "Jungle Yatra", vacancyFor: "Internship", date: "2024-06-02" },
      { id: 4, title: "Social Media Marketing Intern", company: "Aurora Verge", vacancyFor: "Internship", date: "2024-10-12" },
      { id: 5, title: "Data Entry Officer (Onsite)", company: "Neura & co.", vacancyFor: "Internship/Fresher Job", date: "2024-10-31" },
      { id: 6, title: "Content Creator Intern", company: "NEXI", vacancyFor: "Internship/Fresher Job", date: "2024-11-09" },
      { id: 7, title: "Documentation - In Charge", company: "Zyra", vacancyFor: "Job/Fresher Job", date: "2023-12-27" },
      { id: 8, title: "Receptionist", company: "Lavishslik", vacancyFor: "Internship/Fresher Job", date: "2025-01-25" },
      { id: 9, title: "Customer Service Trainee", company: "Alterio Tech", vacancyFor: "Fresher Job", date: "2025-02-28" },
      { id: 10, title: "Front End Developer", company: "Guff.ai", vacancyFor: "Internship/Fresher Job", date: "2025-02-08" },
      { id: 11, title: "Back End Developer", company: "Guff.ai", vacancyFor: "Internship/Fresher Job", date: "2025-02-08" },
    ];
  
    // Filtering 
    const filteredVacancies = vacancies.filter((vacancy) =>
      vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.vacancyFor.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    return(
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
              <tr key={vacancy.id}>
                <td>{index + 1}</td>
                <td>{vacancy.title}</td>
                <td>{vacancy.company}</td>
                <td>{vacancy.vacancyFor}</td>
                <td>{vacancy.date}</td>
                <td>
                  <button className="view-button">
                    <span role="img" aria-label="view">
                      👁️
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="disclaimer">
        <p>
          *Disclaimer: Please note that only selected candidates will get a call or email.*
        </p>
      </div>
    </div>
    )
}
export default Applicantions