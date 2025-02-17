import express from 'express';
import { postJob,fetchJob } from '../controller/employerJobPostingController.js';
import authenticateToken from '../middleware/authenticationMiddleware.js';

const router = express.Router();


router.post('/jobreq/add', authenticateToken, postJob);
router.get('/jobs', authenticateToken, (req, res) => {
    console.log("Fetching jobs..."); // Add logging here
    fetchJob(req, res);
  });


export default router;
