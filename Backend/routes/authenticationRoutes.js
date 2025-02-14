import express from 'express';
import {register, login, manageAccount,getAllUser,updateUsers,manageAccountIndv,getTotalApplicants} from '../controller/authenticationController.js';
import authenticateToken from '../middleware/authenticationMiddleware.js'; 
// import { get } from 'react-scroll/modules/mixins/scroller.js';


const router = express.Router();

// POST route to register a new user
router.post('/register', register);
router.post('/login', login);
router.delete('/appManageAcc/:id', authenticateToken, manageAccount);
router.delete('/appManageAccIndv', authenticateToken, manageAccountIndv);
router.put('/accUpdate/:id',authenticateToken,updateUsers);
router.get('/accGet',authenticateToken,getAllUser);
router.get('/count',authenticateToken, getTotalApplicants);
export default router;
