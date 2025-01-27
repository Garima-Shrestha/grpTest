import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // Import to handle file URL
import { createTable, createTableEmployer, createTableResume } from './config/db.js';
import AuthenticationRoute from './routes/authenticationRoutes.js'
import EmployerAuthRoute from './routes/employerAuthRoute.js';
import ApplicantHomeRoute from './routes/applicantHomeRoutes.js'
import ApplicantResumeRoute from './routes/applicantResumeRoutes.js';
import multer from 'multer';

dotenv.config();
const app = express();

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initializing the database
createTable(); 
createTableEmployer();
createTableResume();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

app.locals.upload = multer({ storage });

// Routes
app.use('/api/auth', AuthenticationRoute); 
app.use('/api/employer/auth', EmployerAuthRoute);
app.use('/api/protected', ApplicantHomeRoute);
app.use('/api/protected/applicant/resume', ApplicantResumeRoute);

app.get('/test', (req, res) => {
    res.send('API is working');
  });

export default app;
