import express from 'express';
import { employerRegister, employerLogin ,getEmployerProfile, updateEmployerProfile, deleteEmployerProfile } from '../controller/employerAuthController.js';
import upload from "../middleware/upload.js";
import authenticateToken from '../middleware/authenticationMiddleware.js'; 
import { fetchEmployerInfo, addEmployer, updateEmployer, deleteEmployer } from '../controller/employerAuthController.js';

const router = express.Router();

// POST route to register a new user
router.post('/employerRegister', upload.single("photo"),employerRegister);
router.post('/employerLogin', employerLogin);
router.get('/profile', authenticateToken, getEmployerProfile);
router.put('/profile', upload.single("photo"),authenticateToken, updateEmployerProfile);
router.delete('/profile', authenticateToken, deleteEmployerProfile);


//Admin ko page ma Employer ko info
router.get('/empview', authenticateToken, fetchEmployerInfo);
router.post('/empview/add', authenticateToken, addEmployer);
router.put('/empview/update/:id', authenticateToken, updateEmployer); 
router.delete('/empview/:id', authenticateToken, deleteEmployer);


export default router;
