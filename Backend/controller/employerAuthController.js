import {createEmployer, findEmployerEmail} from '../model/employerAuthModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
import { getEmployerById, updateEmployerById, deleteEmployerById } from '../model/employerAuthModel.js';

// Fetch Employer Profile
export const getEmployerProfile = async (req, res) => {
  try {
    const employerId = req.user.id; // Assuming user ID is extracted from JWT
    const employer = await getEmployerById(employerId);

    if (!employer) {
      return res.status(404).json({ error: "Employer profile not found" });
    }

    res.status(200).json({ profile: employer });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Update Employer Profile
export const updateEmployerProfile = async (req, res) => {
  try {
    const employerId = req.user.id;
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;
    const updatedData = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      companyType: req.body.companyType,
      panNumber: req.body.panNumber,
      companyDesc: req.body.companyDesc,
      photoPath: photoPath,
    };

    const updatedEmployer = await updateEmployerById(employerId, updatedData);

    if (!updatedEmployer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", profile: updatedEmployer });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Delete Employer Profile
export const deleteEmployerProfile = async (req, res) => {
  try {
    const employerId = req.user.id;
    const deletedEmployer = await deleteEmployerById(employerId);

    if (!deletedEmployer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const employerRegister = async (req, res) => {
    const { companyName, email, password, contact, address, panNumber, companyType, role = "employer", companyDesc } = req.body;
  
    try {
      console.log("Checking if employer already exists...");
      const existingEmployer = await findEmployerEmail(email);
  
      if (existingEmployer) {
        console.log("Employer exists", existingEmployer);
        return res.status(400).json({ error: "Employer already exists" });
      }
  
      console.log("Hashing password...");
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Handle file upload
      const photoPath = req.file ? `/uploads/${req.file.filename}` : null; // Store file path, not buffer
  
      console.log("Creating new employer...");
      const newEmployer = await createEmployer(
        companyName,
        email,
        hashedPassword,
        contact,
        address,
        panNumber,
        companyType,
        role,
        companyDesc,
        photoPath // Pass file path instead of buffer
      );
  
      if (!newEmployer) {
        console.log("Failed to create new employer");
        return res.status(500).json({ error: "Failed to create new employer" });
      }
  
      console.log("Generating JWT...");
      const token = jwt.sign(
        { id: newEmployer.employer.id, email: newEmployer.employer.email, role: newEmployer.employer.role },
        jwtSecret,
        { expiresIn: "24h" }
      );
  
      console.log("Sending response...");
      res.status(201).json({ message: "Employer created successfully", token });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  };


//Login
export const employerLogin = async (req, res) => {
    const { email, password } = req.body;

    try{
        console.log('Finding employer by email...');
        const employer = await findEmployerEmail(email);

        if (!employer) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        console.log('Comparing passwords...');
        const isMatch = await bcrypt.compare(password, employer.password);

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        console.log('Password matched. Generating JWT...');
            const token = jwt.sign(
                { id: employer.id, email: employer.email, role:employer.role },
                jwtSecret,
                { expiresIn: '24h' }
            );
        
        res.status(200).json({
            message: 'Login successful',
            employer: { id: employer.id, companyName: employer.companyName, email: employer.email, role:employer.role },
            token,
        });    
    }catch(error){
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }

}