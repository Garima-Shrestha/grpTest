import express from 'express';
import { postJob,fetchJob,fetchSingleJob,fetchApprovedJobCount,fetchEmployerJobRequests, fetchPendingJobCount } from '../controller/employerJobPostingController.js';
import authenticateToken from '../middleware/authenticationMiddleware.js';

const router = express.Router();


router.post('/jobreq/add', authenticateToken, postJob);
router.get('/jobs', authenticateToken, (req, res) => {
    console.log("Fetching jobs..."); // Add logging here
    fetchJob(req, res);
  });

router.get('/jobdesc/:jobId', authenticateToken, fetchSingleJob);  //Job description
router.get('/approved-job-count', authenticateToken, fetchApprovedJobCount);
router.get('/employer/jobs', authenticateToken, fetchEmployerJobRequests);  // Add this route
router.get('/pending-job-count', authenticateToken, fetchPendingJobCount);  // Admin dashboard


export default router;