import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validator from 'validator';
import xss from 'xss';
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

// Function to sanitize and validate input
const sanitizeAndValidateResumeData = (data) => {
  const { fullName, email, contact, address, education, experience, skills, certifications } = data;

  // Validate required fields
  if (!fullName || !email || !contact) {
    throw new Error('Full Name, Email, and Contact are required');
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Sanitize inputs
  return {
    fullName: xss(fullName),
    email: xss(email),
    contact: xss(contact),
    address: xss(address),
    education: xss(education),
    experience: xss(experience),
    skills: xss(skills),
    certifications: xss(certifications),
  };
};

// Add a new resume
export const addUserResume = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);

    // Check if the user already has a resume
    const existingResumes = await getResumesByUserId(userId);
    if (existingResumes.length > 0) {
      return res.status(400).json({ error: 'User  already has a resume. Please update the existing one.' });
    }

    // Sanitize and validate input data
    const sanitizedData = sanitizeAndValidateResumeData(req.body);

    // Proceed to add the new resume
    const newResume = await addResume(userId, sanitizedData.fullName, sanitizedData.email, sanitizedData.contact, sanitizedData.address, sanitizedData.education, sanitizedData.experience, sanitizedData.skills, sanitizedData.certifications);

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
export const updateUserResume = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);
    const resumeId = req.params.id; // Correctly retrieve resume ID from URL params

    // Sanitize and validate input data
    const sanitizedData = sanitizeAndValidateResumeData(req.body);

    // Log user ID and resume ID for debugging
    console.log(`User  ID: ${userId}, Resume ID: ${resumeId}`);

    const updatedResume = await updateResume(resumeId, userId, sanitizedData.fullName, sanitizedData.email, sanitizedData.contact, sanitizedData.address, sanitizedData.education, sanitizedData.experience, sanitizedData.skills, sanitizedData.certifications);

    if (!updatedResume) {
      return res.status(404).json({ error: 'Resume not found or unauthorized' });
    }

    res.status(200).json({ message: 'Resume updated successfully', updatedResume });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};