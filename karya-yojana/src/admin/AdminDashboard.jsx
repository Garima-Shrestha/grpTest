import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AdminDash.css';
const DashboardCard = () => {
  const [totalApplicants, setTotalApplicants] = useState(0);

  useEffect(() => {
    const fetchTotalApplicants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/auth/count', {
            headers: { Authorization: `Bearer ${token}` }
          });
        setTotalApplicants(response.data.count);
      } catch (error) {
        console.error('Error fetching total applicants:', error);
      }
    };
    
    fetchTotalApplicants();
  }, []);

  return (
    <div className="card">
      <h3>Total Applicants</h3>
      <p>{totalApplicants}</p>
    </div>
  );
};

export default DashboardCard;
