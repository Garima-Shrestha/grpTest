import express from 'express';
import { applyForJob, getUserApplications } from '../controller/applicantJobAppliedController.js';
import authenticateToken from '../middleware/authenticationMiddleware.js';

const router = express.Router();

router.post('/applications/apply', authenticateToken, applyForJob);
router.get('/applications/specific', authenticateToken, getUserApplications);  

export default router;