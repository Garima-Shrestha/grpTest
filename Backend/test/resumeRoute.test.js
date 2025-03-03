import request from 'supertest';
import app from '../index.js'; // Your Express app
import jwt from 'jsonwebtoken';
import { addResume, getResumesByUserId, updateResume } from '../model/applicantResumeModel.js';
import {pool} from '../config/db.js'
// Mocking database functions
jest.mock('../model/applicantResumeModel.js');

const mockUserId = 'user123';
const mockToken = jwt.sign({ id: mockUserId }, process.env.JWT_SECRET);

const mockResume = {
  id: 'resume1',
  fullName: 'John Doe',
  email: 'johndoe@example.com',
  contact: '1234567890',
  address: '123 Street, City',
  education: 'BSc in Computer Science',
  experience: '2 years as a Developer',
  skills: 'JavaScript, Node.js',
  certifications: 'AWS Certified',
};

describe('Applicant Resume Routes', () => {
  
  test('POST /api/resumes - Add new resume', async () => {
    getResumesByUserId.mockResolvedValue([]); // No existing resume
    addResume.mockResolvedValue(mockResume);

    const response = await request(app)
      .post('/api/resumes')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(mockResume);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Resume saved successfully');
    expect(addResume).toHaveBeenCalledWith(mockUserId, expect.any(String), expect.any(String), expect.any(String), expect.any(String), expect.any(String), expect.any(String), expect.any(String), expect.any(String));
  });

  test('POST /api/resumes - Prevent duplicate resumes', async () => {
    getResumesByUserId.mockResolvedValue([mockResume]); // Resume exists

    const response = await request(app)
      .post('/api/resumes')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(mockResume);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('User  already has a resume. Please update the existing one.');
  });

  test('GET /api/resumes - Fetch user resumes', async () => {
    getResumesByUserId.mockResolvedValue([mockResume]);

    const response = await request(app)
      .get('/api/resumes')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body.resumes).toEqual([mockResume]);
  });

  test('PUT /api/resumes/:id - Update user resume', async () => {
    updateResume.mockResolvedValue({ ...mockResume, fullName: 'Jane Doe' });

    const response = await request(app)
  .put(`/api/resumes/${mockResume.id}`)
  .set('Authorization', `Bearer ${mockToken}`)
  .send({ 
    fullName: 'Jane Doe', 
    email: mockResume.email, 
    contact: mockResume.contact 
  });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Resume updated successfully');
  });
});
afterAll(async () => {
    await pool.end();
  });