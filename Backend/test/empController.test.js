import {
    employerRegister,
    employerLogin,
    getEmployerProfile,
    updateEmployerProfile,
    deleteEmployerProfile,
  } from '../controller/employerAuthController.js';
  import {
    createEmployer,
    findEmployerEmail,
    getEmployerById,
    updateEmployerById,
    deleteEmployerById,
  } from '../model/employerAuthModel.js';
  import bcrypt from 'bcrypt';
  import jwt from 'jsonwebtoken';
  
  jest.mock('../model/employerAuthModel.js');
  jest.mock('bcrypt');
  jest.mock('jsonwebtoken');
  
  describe('EmployerController', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {},
        user: { id: '1' },
        file: null,
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('employerRegister', () => {
      it('should register a new employer successfully', async () => {
        req.body = {
          companyName: 'Test Company',
          email: 'test@example.com',
          password: 'Password123!',
          contact: '1234567890',
          address: '123 Test St',
          panNumber: 'ABCDE1234F',
          companyType: 'IT',
          companyDesc: 'A test company',
        };
  
        findEmployerEmail.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedPassword');
        createEmployer.mockResolvedValue({
          employer: {
            id: '1',
            email: req.body.email,
            role: 'employer',
          },
        });
        jwt.sign.mockReturnValue('token');
  
        await employerRegister(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Employer created successfully',
          token: 'token',
        });
      });
  
      it('should return an error if employer already exists', async () => {
        req.body = {
            companyName: 'Test Company',
            email: 'test@example.com',
            password: 'Password123!', 
            contact: '1234567890',
            address: '123 Test St',
            panNumber: 'ABCDE1234F',
            companyType: 'IT',
            companyDesc: 'A test company',
          };
        findEmployerEmail.mockResolvedValue({ email: req.body.email });
  
        await employerRegister(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Employer already exists' });
      });
    });
  
    describe('employerLogin', () => {
      it('should log in an employer successfully', async () => {
        req.body = {
          email: 'test@example.com',
          password: 'Password123!',
        };
  
        findEmployerEmail.mockResolvedValue({
          id: '1',
          email: req.body.email,
          password: 'hashedPassword',
          role: 'employer',
        });
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('token');
  
        await employerLogin(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Login successful',
          employer: { id: '1', companyName: undefined, email: req.body.email, role: 'employer' },
          token: 'token',
        });
      });
  
      it('should return an error if email or password is invalid', async () => {
        req.body.email = 'test@example.com';
        findEmployerEmail.mockResolvedValue(null);
  
        await employerLogin(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
      });
    });
  
    describe('getEmployerProfile', () => {
      it('should fetch employer profile successfully', async () => {
        getEmployerById.mockResolvedValue({ id: '1', name: 'Test Company' });
  
        await getEmployerProfile(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ profile: { id: '1', name: 'Test Company' } });
      });
  
      it('should return an error if employer profile not found', async () => {
        getEmployerById.mockResolvedValue(null);
  
        await getEmployerProfile(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Employer profile not found' });
      });
    });
  
    describe('updateEmployerProfile', () => {
      it('should update employer profile successfully', async () => {
        req.body = { name: 'Updated Company' };
        updateEmployerById.mockResolvedValue({ id: '1', name: 'Updated Company' });
  
        await updateEmployerProfile(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Profile updated successfully',
          profile: { id: '1', name: 'Updated Company' },
        });
      });
  
      it('should return an error if employer not found during update', async () => {
        req.body = { name: 'Updated Company' };
        updateEmployerById.mockResolvedValue(null);
  
        await updateEmployerProfile(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Employer not found' });
      });
    });
  
    describe('deleteEmployerProfile', () => {
      it('should delete employer profile successfully', async () => {
        deleteEmployerById.mockResolvedValue(true);
  
        await deleteEmployerProfile(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Profile deleted successfully' });
      });
  
      it('should return an error if employer not found during deletion', async () => {
        deleteEmployerById.mockResolvedValue(null);
  
        await deleteEmployerProfile(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Employer not found' });
      });
    });
  });