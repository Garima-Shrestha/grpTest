import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import {createTable, createTableEmployer, createTableResume, createTableJob, createEmpProfile, createAppliedJobs, createNotice} from './config/db.js';
import AuthenticationRoute from './routes/authenticationRoutes.js'
import EmployerAuthRoute from './routes/employerAuthRoute.js';
import ApplicantHomeRoute from './routes/applicantHomeRoutes.js'
import ApplicantResume from './routes/applicantResumeRoutes.js';
import EmployerJobPostingRoute from './routes/employerJobPostingRoutes.js';
import JobStatus from './routes/adminRoute.js';
import AdminNotice from './routes/noticeRoute.js';
import ApplicantJobApplied from './routes/applicantJobAppliedRoutes.js';
import helmet from 'helmet';
import xssClean from 'xss-clean';
import path from 'path';  // Import path to handle static files
import { fileURLToPath } from 'url';  // Import to use fileURLToPath
import { dirname } from 'path';  // Import to use dirname

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();


//Initializing the database
createTable(); 
createTableEmployer();
createTableResume();
createTableJob();
createEmpProfile();
createAppliedJobs();
createNotice();

const uploadsPath = path.join(__dirname, 'uploads');
console.log("Uploads directory:", uploadsPath);
app.use('/uploads', express.static(uploadsPath));

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(xssClean());

// Routes
app.use('/api/auth', AuthenticationRoute); 
app.use('/api/employer', EmployerAuthRoute);
app.use('/api/protected', ApplicantHomeRoute);
app.use('/api/resumes', ApplicantResume)
app.use('/api/jobposting', EmployerJobPostingRoute);
app.use('/api', JobStatus);
app.use('/api/jobapplication', ApplicantJobApplied);
app.use('/api/Notices', AdminNotice);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
  });

export default app;