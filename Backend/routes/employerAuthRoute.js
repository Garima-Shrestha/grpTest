import express from 'express';
import { employerRegister, employerLogin ,getEmployerProfile, updateEmployerProfile, deleteEmployerProfile } from '../controller/employerAuthController.js';
import upload from "../middleware/upload.js";
import authenticateToken from '../middleware/authenticationMiddleware.js'; 
const router = express.Router();

// POST route to register a new user
router.post('/employerRegister', upload.single("photo"),employerRegister);
router.post('/employerLogin', employerLogin);
router.get('/profile', authenticateToken, getEmployerProfile);
router.put('/profile', upload.single("photo"),authenticateToken, updateEmployerProfile);
router.delete('/profile', authenticateToken, deleteEmployerProfile);


export default router;
