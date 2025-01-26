import express from 'express';
import { addProfile, upgradeProfile, fetchProfile } from '../controller/applicantResumeController.js';
import authenticateToken from '../middleware/authenticationMiddleware.js';

const router = express.Router();

// Route to get/retrive the user profile
router.get('/profileApplicant', authenticateToken, fetchProfile); 
// Route to add a new applicant profile
router.post('/profileApplicant', authenticateToken, addProfile); 

// Route to update an existing applicant profile
router.put('/profileApplicant/:id', authenticateToken, upgradeProfile); 

export default router;