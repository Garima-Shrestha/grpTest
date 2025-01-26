import express from 'express';
import authenticateToken from '../middleware/authenticationMiddleware.js'; 

const router = express.Router();

router.get('/ApplicantHome', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to your Applicant Home page' });
});

export default router;