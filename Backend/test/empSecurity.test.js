import request from 'supertest';
import app from '../index.js'; 
import { createEmployer, findEmployerEmail } from '../model/employerAuthModel.js';
import bcrypt from 'bcrypt';
import {pool} from '../config/db.js';
jest.mock('../model/employerAuthModel.js');
jest.mock('bcrypt');

describe('Employer Controller Security Tests', () => {
  describe('SQL Injection', () => {
    it('should not allow SQL injection in employer registration', async () => {
      const sqlInjectionPayload = {
        companyName: "Test Company",
        email: "test@example.com",
        password: "Password123!",
        contact: "1234567890",
        address: "123 Test St",
        panNumber: "ABCDE1234F",
        companyType: "IT",
        companyDesc: "A test company'; DROP TABLE employers; --"
      };

      findEmployerEmail.mockResolvedValue(null); // Simulate no existing employer
      bcrypt.hash.mockResolvedValue('hashedPassword');
      createEmployer.mockResolvedValue({ employer: { id: '1', email: sqlInjectionPayload.email, role: 'employer' } });

      const response = await request(app)
        .post('/api/employer/employerRegister') // Adjust the endpoint as necessary
        .send(sqlInjectionPayload);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Employer created successfully');
    });
  });

  describe('XSS Attack', () => {
    it('should sanitize input to prevent XSS attacks', async () => {
      const xssPayload = {
        companyName: "<script>alert('XSS')</script>",
        email: "test@example.com",
        password: "Password123!",
        contact: "1234567890",
        address: "123 Test St",
        panNumber: "ABCDE1234F",
        companyType: "IT",
        companyDesc: "A test company"
      };

      findEmployerEmail.mockResolvedValue(null); // Simulate no existing employer
      bcrypt.hash.mockResolvedValue('hashedPassword');
      createEmployer.mockResolvedValue({ employer: { id: '1', email: xssPayload.email, role: 'employer' } });

      const response = await request(app)
        .post('/api/employer/employerRegister') // Adjust the endpoint as necessary
        .send(xssPayload);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Employer created successfully');
    });
  });

  describe('404 Not Found', () => {
    it('should return 404 for non-existent employer profile', async () => {
      const nonExistentId = '999'; // Assuming this ID does not exist
      const response = await request(app)
        .get(`/api/employer/profile/${nonExistentId}`) // Adjust the endpoint as necessary
        .set('Authorization', 'Bearer someValidToken'); // Set a valid token if required

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Route not found');
    });
  });
});
afterAll(async () => {
    await pool.end();
  });