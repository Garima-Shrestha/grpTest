import express from 'express';
import { employerRegister, employerLogin } from '../controller/employerAuthController.js';


const router = express.Router();

// POST route to register a new user
router.post('/employerRegister', employerRegister);
router.post('/employerLogin', employerLogin);


export default router;
