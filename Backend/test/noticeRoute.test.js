import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import noticeRouter from '../routes/noticeRoute.js'; // Adjust the path as necessary
import { createNotice, getAllNotices, getNoticeById, updateNotice, deleteNotice } from '../model/noticeModel.js';
import dotenv from "dotenv";
// Mock the notice model
jest.mock('../model/noticeModel.js'); 
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
jest.mock("../model/autheticationModel.js");
// Create a mock token
const mockToken = jwt.sign(
  { id: 1, email: "admin@example.com", role: "admin" },
  jwtSecret,
  { expiresIn: "1h" }
);

const app = express();
app.use(express.json());

app.use('/api/Notices', noticeRouter);
describe('Notice Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('POST /notice', () => {
    it('should create a new notice', async () => {
      const newNotice = { title: 'Test Notice', description: 'This is a test notice.' };
      createNotice.mockResolvedValue({ id: 1, ...newNotice }); // Mock the createNotice function

      const response = await request(app)
        .post('/api/Notices/notice')
        .send(newNotice)
        .set('Authorization', `Bearer ${mockToken}`); // Use the mock token

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, ...newNotice });
      expect(createNotice).toHaveBeenCalledWith(newNotice.title, newNotice.description);
    });

    it('should return 400 if title or description is missing', async () => {
      const response = await request(app)
        .post('/api/Notices/notice')
        .send({ title: 'Test Notice' }) // Missing description
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Title and description are required.");
    });
  });

  describe('GET /notice', () => {
    it('should return all notices', async () => {
      const notices = [
        { id: 1, title: 'Notice 1', description: 'Description 1' },
        { id: 2, title: 'Notice 2', description: 'Description 2' },
      ];
      getAllNotices.mockResolvedValue(notices); // Mock the getAllNotices function

      const response = await request(app)
        .get('/api/Notices/notice')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(notices);
    });
  });

  describe('GET /notice/:id', () => {
    it('should return a notice by ID', async () => {
      const notice = { id: 1, title: 'Notice 1', description: 'Description 1' };
      getNoticeById.mockResolvedValue(notice); // Mock the getNoticeById function

      const response = await request(app)
        .get('/api/Notices/notice/1')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(notice);
    });

    it('should return 404 if notice not found', async () => {
      getNoticeById.mockResolvedValue(null); // Mock not found

      const response = await request(app)
        .get('/api/Notices/notice/999') // Non-existent ID
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Notice not found");
    });
  });

  describe('PUT /notice/:id', () => {
    it('should update a notice', async () => {
      const updatedNotice = { title: 'Updated Notice', description: 'Updated description.' };
      updateNotice.mockResolvedValue({ id: 1, ...updatedNotice }); // Mock the updateNotice function

      const response = await request(app)
        .put('/api/Notices/notice/1')
        .send(updatedNotice)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, ...updatedNotice });
      expect(updateNotice).toHaveBeenCalledWith("1", updatedNotice.title, updatedNotice.description);
    });

    it('should return 404 if notice to update not found', async () => {
      const updatedNotice = { title: 'Updated Notice', description: 'Updated description.' };
      updateNotice.mockResolvedValue(null); // Mock not found

      const response = await request(app)
        .put('/api/Notices/notice/999') // Non-existent ID
        .send(updatedNotice)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Notice not found");
    });
  });

  describe('DELETE /notice/:id', () => {
    it('should delete a notice', async () => {
      deleteNotice.mockResolvedValue(); // Mock successful deletion

      const response = await request(app)
        .delete('/api/Notices/notice/1')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(204);
      expect(deleteNotice).toHaveBeenCalledWith("1");
    });

    it('should return 500 if there is an error deleting the notice', async () => {
      deleteNotice.mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .delete('/api/Notices/notice/1')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error deleting notice");
    });
  });
});