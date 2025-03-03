import request from 'supertest';
import app from '../index.js'; // Ensure you have your Express app exported
import jwt from 'jsonwebtoken';
import {pool} from '../config/db.js';
import {
  addResume,
  getResumesByUserId,
  updateResume,
} from '../model/applicantResumeModel';

jest.mock('../model/applicantResumeModel'); // Mock database functions
jest.mock('jsonwebtoken'); // Mock JWT verification

describe('Resume API Tests', () => {
  const mockUserId = 'user123';
  const mockToken = 'mockJwtToken';

  const mockResume = {
    id: 'resume123',
    fullName: 'John Doe',
    email: 'john@example.com',
    contact: '1234567890',
    address: '123 Street, City',
    education: 'B.Sc in Computer Science',
    experience: '2 years in Software Development',
    skills: 'JavaScript, Node.js',
    certifications: 'AWS Certified',
  };

  beforeEach(() => {
    jwt.verify.mockImplementation(() => ({ id: mockUserId })); // Mock JWT verification
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test adding a resume
  it('should add a new resume', async () => {
    getResumesByUserId.mockResolvedValue([]); // No existing resumes
    addResume.mockResolvedValue(mockResume);

    const response = await request(app)
      .post('/api/resumes')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(mockResume);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Resume saved successfully');
    expect(response.body.newResume).toEqual(mockResume);
  });

  // Test fetching resumes
  it('should fetch user resumes', async () => {
    getResumesByUserId.mockResolvedValue([mockResume]);

    const response = await request(app)
      .get('/api/resumes')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body.resumes).toEqual([mockResume]);
  });

  // Test fetching resumes when none exist
  it('should return 404 if no resumes are found', async () => {
    getResumesByUserId.mockResolvedValue([]);

    const response = await request(app)
      .get('/api/resumes')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No resumes found');
  });

  // Test updating a resume
  it('should update an existing resume', async () => {
    updateResume.mockResolvedValue({ ...mockResume, fullName: 'Jane Doe' });

    const response = await request(app)
      .put(`/api/resumes/${mockResume.id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ fullName: 'Jane Doe', email: mockResume.email, contact: mockResume.contact });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Resume updated successfully');
    expect(response.body.updatedResume.fullName).toBe('Jane Doe');
  });

  // Test updating a non-existent resume
  it('should return 404 if resume not found', async () => {
    updateResume.mockResolvedValue(null);

    const response = await request(app)
      .put(`/api/resumes/${mockResume.id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ fullName: 'Jane Doe',
        email: mockResume.email, 
    contact: mockResume.contact 
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Resume not found or unauthorized');
  });
});

afterAll(async () => {
    await pool.end();
  });