import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import {createTable, createTableEmployer, createTableResume} from './config/db.js';
import AuthenticationRoute from './routes/authenticationRoutes.js'
import EmployerAuthRoute from './routes/employerAuthRoute.js';
import ApplicantHomeRoute from './routes/applicantHomeRoutes.js'
import ApplicantResume from './routes/applicantResumeRoutes.js';

dotenv.config();
const app = express();

//Initializing the database
createTable(); 
createTableEmployer();
createTableResume();

//Middlewares
app.use(cors());
app.use(bodyParser.json());


// Routes
app.use('/api/auth', AuthenticationRoute); 
console.log('Routes for /api/auth have been registered');
app.use('/api/employer/auth', EmployerAuthRoute);
app.use('/api/protected', ApplicantHomeRoute);
app.use('/api/protected/resume', ApplicantResume)

export default app;