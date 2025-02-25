import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/myads.css';
const EmployerJobRequests = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/jobposting/employer/jobs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('API Response:', response.data);
        setJobs(response.data.jobs || []);  
      } catch (error) {
        setError('Failed to fetch job requests');
        console.error(error);
      }
    };

    fetchJobs();
  }, []);

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats as 'MM/DD/YYYY' by default
  };

  // Function to get status class based on the job status
  const getStatusClass = (status) => {
    if (status === 'approved') return 'job-status-approved-myads';
    if (status === 'rejected') return 'job-status-rejected-myads';
    if (status === 'pending') return 'job-status-pending-myads';
    return ''; // Default case
  };

  return (
    <div className="employer-job-requests-myads">
      {error && <p className="error-message-myads">{error}</p>}
      {jobs.length === 0 ? (
        <p className="no-jobs-myads">No job requests found</p>
      ) : (
        <>
        <p className='para-myads'>Note: Once you submit the job request, it can't be edited or deleted <br/>
        Contact us to cancel the job request</p>
        <table className="jobs-table-myads">
          <thead>
            <tr className="table-header-myads">
              <th className="table-header-cell-myads">Job Title</th>
              <th className="table-header-cell-myads">Deadline</th>
              <th className="table-header-cell-myads">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="job-row-myads">
                <td className="job-title-myads">{job.title}</td>
                <td className="job-deadline-myads">{formatDate(job.deadline)}</td>
                <td className={`job-status-myads ${getStatusClass(job.status)}`}>
                  {job.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
    </div>
  );
};

export default EmployerJobRequests;
