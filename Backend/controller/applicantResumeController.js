import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  addResume,
  getResumesByUserId,
  updateResume,
  deleteResume,
  getResumeById,
} from '../model/applicantResumeModel.js';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

// Middleware to verify the JWT token and extract the user ID
const verifyTokenAndGetUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('No token provided');
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.id; // User ID from JWT
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Add a new resume
export const addUserResume = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);

    // Check if the user already has a resume
    const existingResumes = await getResumesByUserId(userId);
    if (existingResumes.length > 0) {
      return res.status(400).json({ error: 'User already has a resume. Please update the existing one.' });
    }

    // Proceed to add the new resume
    const { fullName, email, contact, address, education, experience, skills, certifications } = req.body;
    const newResume = await addResume(userId, fullName, email, contact, address, education, experience, skills, certifications);

    res.status(201).json({ message: 'Resume saved successfully', newResume });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};


// Get resumes for the logged-in user
export const getUserResumes = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);

    const resumes = await getResumesByUserId(userId);

    if (!resumes || resumes.length === 0) {
      return res.status(404).json({ message: 'No resumes found' });
    }

    res.status(200).json({ resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Update a resume
// Update a resume
export const updateUserResume = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);
    const resumeId = req.params.id; // Correctly retrieve resume ID from URL params
    const { fullName, email, contact, address, education, experience, skills, certifications } = req.body;

    // Log user ID and resume ID for debugging
    console.log(`User ID: ${userId}, Resume ID: ${resumeId}`);

    // Validate required fields
    if (!resumeId || !fullName || !email || !contact) {
      return res.status(400).json({ error: 'Resume ID, Full Name, Email, and Contact are required' });
    }
    console.log('Request body:', req.body);
console.log('Resume ID:', resumeId);
console.log('User ID:', userId);

    const updatedResume = await updateResume(resumeId, userId, fullName, email, contact, address, education, experience, skills, certifications);

    if (!updatedResume) {
      return res.status(404).json({ error: 'Resume not found or unauthorized' });
    }

    res.status(200).json({ message: 'Resume updated successfully', updatedResume });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

