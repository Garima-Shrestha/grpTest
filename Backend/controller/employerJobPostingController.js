import { createJob } from "../model/employerJobPostingModel.js";
import {isTransactionValid, getJobPosting, getSingleJobPosting} from "../model/employerJobPostingModel.js";

export const postJob = async (req, res) => {
    const employerId = req.user.id;      
    const { title, deadline, salary, position, description, qualifications, transaction }= req.body;
    
    try {
        const isValid = await isTransactionValid(transaction);
        console.log("Request Body:", req.body);
        if (!isValid) {
            return res.status(400).json({ message: "Transaction ID has already been used 10 times." });
        }
        const newJob = await createJob(title, deadline, salary, position, description, qualifications, employerId, transaction );
        res.status(201).json({ message: "Job posting created.", job: newJob });
    }catch (error) {
        console.error("Error creating job posting:", error);
        res.status(500).json({ message: "Internal server error." });
    }
    };

    export const fetchJob = async (req, res) => {
        try {
          console.log('Received request to fetch jobs');
          const jobs = await getJobPosting(); // Make sure this is correct and returns data
          console.log('Fetched jobs:', jobs); // Log fetched jobs
          res.json({ jobs });
        } catch (error) {
          console.error('Error fetching jobs:', error);
          res.status(500).json({ error: 'Error fetching jobs' });
        }
      };

//Job description ko lagi
export const fetchSingleJob = async (req, res) => {
  const { jobId } = req.params; 

  try {
      console.log(`Received request to fetch job with ID: ${jobId}`);
      const job = await getSingleJobPosting(jobId);

      if (job.length === 0) {
          return res.status(404).json({ message: "Job not found." }); 
      }

      console.log('Fetched job:', job); 
      res.json(job); 
  } catch (error) {
      console.error('Error fetching job details:', error);
      res.status(500).json({ error: 'Error fetching job details' });
  }
};

import { countApprovedJobs } from "../model/employerJobPostingModel.js";

export const fetchApprovedJobCount = async (req, res) => {
    const employerId = req.user.id; 

    try {
        const count = await countApprovedJobs(employerId);
        res.json({ approvedJobCount: count });
    } catch (error) {
        console.error('Error fetching approved job count:', error);
        res.status(500).json({ error: 'Error fetching approved job count' });
    }
};

import {getJobPostingByEmployer} from '../model/employerJobPostingModel.js';
export const fetchEmployerJobRequests = async (req, res) => {
    const employerId = req.user.id;  // Get employer ID from authenticated user
  
    try {
      console.log(`Fetching job requests for employer ID: ${employerId}`);
      const jobs = await getJobPostingByEmployer(employerId);  // Call the new method
  
      if (jobs.length === 0) {
        return res.status(404).json({ message: "No job requests found for this employer." });
      }
  
      console.log('Fetched jobs:', jobs);
      res.json({ jobs });  // Return jobs
    } catch (error) {
      console.error('Error fetching job requests for employer:', error);
      res.status(500).json({ error: 'Error fetching job requests for employer' });
    }
  };
  