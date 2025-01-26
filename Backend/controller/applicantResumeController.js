import { getProfile, createProfile, updateProfile } from '../model/applicantResumeModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

// Middleware to verify the JWT token and extract the user ID
const verifyTokenAndGetUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('No token provided');
  }
  const decoded = jwt.verify(token, jwtSecret);
  console.log('Decoded JWT:', decoded); // Add this log to check if the user ID is correct
  return decoded.id; // User ID from JWT
};

// Fetch the applicant resume if applicant has logged in
export const fetchProfile = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);
    const profile = await getProfile(userId);

    if (!profile || profile.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching applicant resume:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Add Applicant Info to the Resume Builder/Applicant Profile
export const addProfile = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);
    const { firstName, lastName, email, contact, address, gender, education, bio, experience, certifications, skills, reference, profilePicture } = req.body;

    const newProfile = await createProfile(userId, firstName, lastName, email, contact, address, gender, education, bio, experience, certifications, skills, reference, profilePicture);

    if (!newProfile) {
      return res.status(500).json({ error: 'Failed to save Applicant Resume' });
    }

    res.status(201).json({ message: 'Applicant Resume saved successfully', newProfile });
  } catch (error) {
    console.error('Error saving applicant resume:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Update a Applicant Resume/Applicant Profile
export const upgradeProfile = async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req);
    const resumeId = req.params.id; 
    const { firstName, lastName, email, contact, address, gender, education, bio, experience, certifications, skills, reference, profilePicture } = req.body;

    const newUpgrade = await updateProfile(resumeId, userId, firstName, lastName, email, contact, address, gender, education, bio, experience, certifications, skills, reference, profilePicture);
    console.log('Resume ID:', resumeId); // Debugging log

    if (!newUpgrade) {
      return res.status(404).json({ error: 'Applicant Resume not found or unauthorized' });
    }

    res.status(200).json({ message: 'Applicant Resume updated successfully', newUpgrade });
  } catch (error) {
    console.error('Error updating applicant resume:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};
