import request from 'supertest';
import app from '../index.js';
import { employerRegister, employerLogin } from '../controller/employerAuthController.js';
import { pool } from '../config/db.js';
// Mock the controller functions
jest.mock('../controller/employerAuthController.js');

describe('Employer Routes Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /employerRegister should create a new employer', async () => {
    const mockEmployer = {
      companyName: 'TechCorp',
      email: 'tech@example.com',
      password: 'hashedpassword',
      contact: '9800000000',
      address: 'Kathmandu',
      panNumber: '123456789',
      companyType: 'IT',
    };

    // Mock implementation for employerRegister
    employerRegister.mockImplementationOnce((req, res) => {
      return res.status(201).json({ message: 'Employer registered successfully', employer: mockEmployer });
    });

    const response = await request(app).post('/api/employer/employerRegister').send(mockEmployer);

    console.log("Mocked employerRegister:", employerRegister.mock.calls);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Employer registered successfully');
    expect(employerRegister).toHaveBeenCalledTimes(1);
  });

  test('POST /employerLogin should authenticate employer', async () => {
    const mockLoginData = { email: 'tech@example.com', password: 'hashedpassword' };

    // Mock implementation for employerLogin
    employerLogin.mockImplementationOnce((req, res) => {
      return res.status(200).json({ token: 'mocked-jwt-token' });
    });

    const response = await request(app).post('/api/employer/employerLogin').send(mockLoginData);

    console.log("Mocked employerLogin:", employerLogin.mock.calls);

    expect(response.status).toBe(200);
    expect(response.body.token).toBe('mocked-jwt-token');
    expect(employerLogin).toHaveBeenCalledTimes(1);
  });
});
afterAll(async () => {
    await pool.end();
  });