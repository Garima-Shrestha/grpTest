import {createEmployer, findEmployerEmail} from '../model/employerAuthModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

export const employerRegister = async (req, res) =>{
    const {companyName, email, password, contact, address, panNumber, companyType} = req.body;

    try{
        console.log('if company user exists...');
        const existingEmployer = await findEmployerEmail(email);

        if (existingEmployer){
            console.log("Employer exists", existingEmployer);
            return res.status(400).json({error: "Employer already exists"});
        }

        console.log("Creating new employers...");
        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployer = await createEmployer(companyName, email, hashedPassword, contact, address, panNumber, companyType);

        console.log("Employer created: ", newEmployer);

        if(!newEmployer){
            console.log("Failed to create new employer");
            return res.status(500).json({error: 'Failed to create new employer'});
        }

        console.log('Generating JWT...');
        const token = jwt.sign(
            {id:newEmployer.id, email:newEmployer.email},
            jwtSecret,
            {expiresIn: '24h'}
        );

        console.log("Sending response...");
        res.status(201).json({message: 'Employer created sucessfully', token})
    }catch(error){
        console.error('Signup error:', error);
        res.status(500).json({error: 'Server error', details: error.message})
    }
}


//Login
export const employerLogin = async (req, res) => {
    const { email, password } = req.body;

    try{
        console.log('Finding employer by email...');
        const employer = await findEmployerEmail(email);

        if (!employer) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        console.log('Comparing passwords...');
        const isMatch = await bcrypt.compare(password, employer.password);

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        console.log('Password matched. Generating JWT...');
            const token = jwt.sign(
                { id: employer.id, email: employer.email },
                jwtSecret,
                { expiresIn: '24h' }
            );
        
        res.status(200).json({
            message: 'Login successful',
            employer: { id: employer.id, companyName: employer.companyName, email: employer.email },
            token,
        });    
    }catch(error){
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }

}