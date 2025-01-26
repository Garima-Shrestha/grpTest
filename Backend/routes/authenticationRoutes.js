import express from 'express';
import {register, login, manageAccount} from '../controller/authenticationController.js';
import authenticateToken from '../middleware/authenticationMiddleware.js'; 


const router = express.Router();


// POST route to register a new user
router.post('/register', register);
router.post('/login', login);
router.delete('/appManageAcc', authenticateToken, manageAccount);
// router.delete('/appManageAcc', authenticateToken, (req, res, next) => {
//     console.log('DELETE request received for /appManageAcc');
//     manageAccount(req, res, next);
//   });
  

export default router;
