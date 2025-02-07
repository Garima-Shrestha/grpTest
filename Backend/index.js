import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import {createTable, createTableEmployer, createTableResume, createTableJob} from './config/db.js';
import AuthenticationRoute from './routes/authenticationRoutes.js'
import EmployerAuthRoute from './routes/employerAuthRoute.js';
import ApplicantHomeRoute from './routes/applicantHomeRoutes.js'
import ApplicantResume from './routes/applicantResumeRoutes.js';
import EmployerJobPostingRoute from './routes/employerJobPostingRoutes.js';

dotenv.config();
const app = express();

//Initializing the database
createTable(); 
createTableEmployer();
createTableResume();
createTableJob();

//Middlewares
app.use(cors());
app.use(bodyParser.json());


// Routes
app.use('/api/auth', AuthenticationRoute); 
app.use('/api/employer', EmployerAuthRoute);
app.use('/api/protected', ApplicantHomeRoute);
app.use('/api/resumes', ApplicantResume)
app.use('/api/jobposting', EmployerJobPostingRoute);

export default app;