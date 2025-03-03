import { createUser, findEmail, deleteAccount, updateUser, getAllUsers, deleteAccountIndv } from "../model/autheticationModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import xss from 'xss';
import validator from 'validator';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

// Register User
export const register = async (req, res) => {
    let { username, email, password, contact, gender, role = 'applicant' } = req.body;

    // XSS Protection
    username = xss(username);
    email = xss(email);
    contact = xss(contact);
    gender = xss(gender);

    // Validation
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validator.isLength(password, { min: 8 }) || 
        !/[A-Z]/.test(password) || 
        !/\d/.test(password) || 
        !/[@$!%*?&#]/.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.' });
    }

    if (!validator.isNumeric(contact) || !validator.isLength(contact, { min: 10, max: 10 })) {
        return res.status(400).json({ error: 'Contact number must be exactly 10 digits and numeric!' });
    }

    try {
        console.log('Checking if user exists...');
        const existingUser = await findEmail(email);

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        console.log('Creating new user...');
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(username, email, hashedPassword, contact, gender, role);

        if (!newUser) {
            return res.status(500).json({ error: 'Failed to create user' });
        }

        console.log('Generating JWT...');
        const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, jwtSecret, { expiresIn: '24h' });

        res.status(201).json({ message: 'User created successfully', token });

    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
}

// Login User
export const login = async (req, res) => {
    let { email, password } = req.body;

    // XSS Protection
    email = xss(email);

    try {
        console.log('Finding user by email...');
        const user = await findEmail(email);

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        console.log('Generating JWT...');
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '24h' });

        res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email, role: user.role }, token });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

// Delete Account
export const manageAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await deleteAccount(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

// Fetch All Users (Admin)
export const getAllUser = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

// Delete User by Admin
export const manageAccountIndv = async (req, res) => {
    const userId = req.user.id;

    try {
        const deletedUser = await deleteAccountIndv(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// Update User
export const updateUsers = async (req, res) => {
    const { id } = req.params;
    let updateData = { ...req.body };

    // XSS Protection
    Object.keys(updateData).forEach(key => {
        if (typeof updateData[key] === 'string') {
            updateData[key] = xss(updateData[key]);
        }
    });

    if (updateData.contact) {
        updateData.contact_number = updateData.contact;
        delete updateData.contact;
    }

    try {
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedUser = await updateUser(id, updateData);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};

// Get Total Applicants Count
import { getTotalUsersCount } from '../model/autheticationModel.js';

export const getTotalApplicants = async (req, res) => {
    try {
        const count = await getTotalUsersCount();
        res.json({ count });
    } catch (error) {
        res.status(500).send('Server error');
    }
};
