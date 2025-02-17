import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/JobHandel.css";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pending');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/jobposting/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setJobs(response.data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApprove = async (jobId) => {
    try {
      await axios.put(`http://localhost:3000/api/jobs/${jobId}/status`, { status: 'approved' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: 'approved' } : job
      ));
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  const handleReject = async (jobId) => {
    try {
      await axios.put(`http://localhost:3000/api/jobs/${jobId}/status`, { status: 'rejected' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: 'rejected' } : job
      ));
    } catch (error) {
      console.error('Error rejecting job:', error);
    }
  };

  const filteredJobs = Array.isArray(jobs) ? jobs.filter(job => 
    selectedTab === 'all' ? true : job.status === selectedTab
  ) : [];

  return (
    <div className="admin-dashboard-handel">
      <div className="tab-buttons-handel">
        <button 
          onClick={() => setSelectedTab('pending')} 
          className={selectedTab === 'pending' ? 'selected-handel' : ''}
        >
          Pending ({Array.isArray(jobs) ? jobs.filter(job => job.status === 'pending').length : 0})
        </button>
        <button 
          onClick={() => setSelectedTab('approved')} 
          className={selectedTab === 'approved' ? 'selected-handel' : ''}
        >
          Approved ({Array.isArray(jobs) ? jobs.filter(job => job.status === 'approved').length : 0})
        </button>
        <button 
          onClick={() => setSelectedTab('rejected')} 
          className={selectedTab === 'rejected' ? 'selected-handel' : ''}
        >
          Rejected ({Array.isArray(jobs) ? jobs.filter(job => job.status === 'rejected').length : 0})
        </button>
      </div>

      <div className="table-container-handel">
        {loading ? (
          <div className="spinner-handel"></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Salary</th>
                <th>Deadline</th>
                <th>Transaction</th>
                <th>Status</th>
                <th>Employer Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.employer_name}</td>
                  <td>{job.salary}</td>
                  <td>{job.deadline}</td>
                  <td>{job.transaction}</td>
                  <td>
                    <span className={`status-handel ${job.status}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div className="employer-info-handel">
                      <img 
                        src={`http://localhost:3000${job.employer_profile_picture}`} 
                        alt="Employer Profile" 
                        className="employer-photo-handel"
                      />
                      <div>
                        <p><strong>Contact:</strong> {job.employer_contact}</p>
                        <p><strong>Email:</strong> {job.employer_email}</p>
                        <p><strong>Address:</strong> {job.employer_address}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {job.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApprove(job.id)} 
                          className="approve-button-handel"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(job.id)} 
                          className="reject-button-handel"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
