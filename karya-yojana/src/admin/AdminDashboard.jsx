import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AdminDash.css';
const DashboardCard = () => {
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [totalEmployers, setTotalEmployers] = useState(0);
  const [totalPendingJobs, setTotalPendingJobs] = useState(0);
  const [totalNotices, setTotalNotices] = useState(0);

  useEffect(() => {
    const fetchTotalApplicants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/auth/count', {
            headers: { Authorization: `Bearer ${token}` }
          });
        setTotalApplicants(response.data.count);

        // Fetch total employers
        const employersResponse = await axios.get('http://localhost:3000/api/employer/total-employers', 
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setTotalEmployers(employersResponse.data.totalEmployers);

        // Fetch total pending jobs
        const pendingJobsResponse = await axios.get('http://localhost:3000/api/jobposting/pending-job-count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalPendingJobs(pendingJobsResponse.data.pendingJobCount);  
        
        // Fetch total notice jobs
        const noticesRes = await axios.get('http://localhost:3000/api/Notices/notice-count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalNotices(noticesRes.data.totalNotices);
      } catch (error) {
        console.error('Error fetching total applicants:', error);
      }
    };
    
    fetchTotalApplicants();
  }, []);

  return (
    <div className="dashboard-container">
        <div className="card">
            <h3>Total Applicants</h3>
            <p>{totalApplicants}</p>
        </div>
        
        <div className="card">
            <h3>Total Employers</h3>
            <p>{totalEmployers}</p>
        </div>
        
        <div className="card">
            <h3>Pending Jobs</h3>
            <p>{totalPendingJobs}</p>
        </div>
        
        <div className="card">
            <h3>Total Notices</h3>
            <p>{totalNotices}</p>
        </div>
    </div>
);
};

export default DashboardCard;