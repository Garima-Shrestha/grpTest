import express from 'express';
import { addUserResume, getUserResumes, updateUserResume} from '../controller/applicantResumeController.js';
import authenticateToken from '../middleware/authenticationMiddleware.js';

const router = express.Router();
 
// Route to add a new applicant profile
router.post('/', authenticateToken, addUserResume); 


router.get('/', authenticateToken, getUserResumes);
  
  router.put('/:id',authenticateToken,updateUserResume);
  

export default router;