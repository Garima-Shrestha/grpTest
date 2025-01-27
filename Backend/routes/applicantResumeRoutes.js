import express from 'express';
import { saveResume, fetchResume } from '../controller/applicantResumeController.js';
import multer from 'multer';
import authenticateToken from '../middleware/authenticationMiddleware.js';
const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Route to create or update applicant resume with file upload
router.post('/save-resume', upload.single('photo'), saveResume);

// Route to get applicant resume
router.get('/fetch-resume/:userId', fetchResume);

// Route to get user ID
router.get('/get-user-id', authenticateToken, (req, res) => {
    res.json({ userId: req.user.id }); // Assuming req.user.id contains the authenticated user's ID
});

export default router;
