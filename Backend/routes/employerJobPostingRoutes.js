import express from 'express';
import { postJob } from '../controller/employerJobPostingController.js';
import authenticateToken from '../middleware/authenticationMiddleware.js';

const router = express.Router();


router.post('/jobreq/add', authenticateToken, postJob);
// router.get('/jobs', fetchJobs);


export default router;
