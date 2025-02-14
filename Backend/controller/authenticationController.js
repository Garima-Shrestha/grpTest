import { createUser, findEmail, deleteAccount, updateUser,getAllUsers, deleteAccountIndv} from "../model/autheticationModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

export const register = async(req, res) => {
    const {username, email, password, contact, gender, role='applicant'} = req.body;


      // Validation
      const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email || !emailCheck.test(email)) {
          return res.status(400).json({ error: 'Invalid email format' });
      }

      const passwordLengthValid = password.length >= 8; // Minimum 8 characters
      const containsUppercase = /[A-Z]/.test(password); // At least 1 uppercase letter
      const containsNumber = /\d/.test(password); // At least 1 number
      const containsSpecialChar = /[@$!%*?&#]/.test(password); // At least 1 special character
    
      if (!passwordLengthValid) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
      } else if (!containsUppercase || !containsNumber || !containsSpecialChar) {
          return res.status(400).json({ error: 'Password must contain one uppercase letter, one number, and one special character.' });
      }
          
      if (!contact || contact.length !== 10) {
        return res.status(400).json({ error: 'Contact number must be exactly 10 digits!' });
      }


    try{
        console.log('Checking if user exists...');
        const existingUser = await findEmail(email);
    
        if (existingUser) {
          console.log('User exists: ', existingUser);
          return res.status(400).json({ error: 'Email already exists' });
        }

        console.log('Creating new user...');
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser(username, email, hashedPassword, contact, gender, role);
        
        console.log('User created: ', newUser);

        if (!newUser) {
            console.log('Failed to create user');
            return res.status(500).json({ error: 'Failed to create user' });
        }


        console.log('Generating JWT...');
        const token = jwt.sign(
          { id: newUser.id, email: newUser.email, role:newUser.role }, 
          jwtSecret, 
          { expiresIn: '24h' }
        );

        console.log('Sending response...');
        res.status(201).json({ message: 'User created successfully', token });

    }catch (error) {
        console.error('Signup error:', error); // Logs full error details
        res.status(500).json({ error: 'Server error', details: error.message });
      }
}


//login
export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try{
        console.log('Finding user by email...');
        const user = await findEmail(email);

        if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
        }

        console.log('Comparing passwords...');
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
          console.log('Password does not match');
          return res.status(400).json({ error: 'Invalid email or password' });
        }

        console.log('Password matched. Generating JWT...');
        const token = jwt.sign(
          { id: user.id, email: user.email, role:user.role },
          jwtSecret,
          { expiresIn: '24h' }
        );

         res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, username: user.username, email: user.email, role: user.role }, 
            token,
        });
    }catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}


//For Managing Account i.e. deleting account
export const manageAccount  = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser  = await deleteAccount (id);
    if (!deletedUser ) {
      return res.status(404).json({ error: 'User  not found' });
    }
    res.json({ message: 'User  deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};




//Admin Page (Fetching Applicant)
export const getAllUser = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
    console.log(users);
  } catch (error) {
    
    res.status(500).json({ error: 'Error fetching users' });
  }
};



//Admin Page (Deleting Applicant)
export const manageAccountIndv = async (req, res) => {
  const userId = req.user.id;  // Extract user ID from token

  try {
    console.log("Deleting user account...");
    const deletedUser = await deleteAccountIndv(userId);

    if (!deletedUser) {
      console.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error managing account:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};



//Admin Page (Updating Applicant)
export const updateUsers = async (req, res) => {
  const { id } = req.params;
  let updateData = { ...req.body };

  // Ensure contact field is correctly named
  if (updateData.contact) {
    updateData.contact_number = updateData.contact; // Change the field name
    delete updateData.contact; // Delete the old key
  }

  try {
    // If the request includes a password, hash it before updating
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    console.log(updateData);
    const updatedUser = await updateUser(id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};




//Admin Dashboard Showing total number of applicant
import { getTotalUsersCount } from '../model/autheticationModel.js';

export const getTotalApplicants = async (req, res) => {
  try {
    const count = await getTotalUsersCount();
    res.json({ count });
  } catch (error) {
    console.error('Error getting total applicants:', error);
    res.status(500).send('Server error');
  }
};