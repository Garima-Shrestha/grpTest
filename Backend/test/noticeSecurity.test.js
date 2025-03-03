import request from 'supertest';
import express from 'express';
import xss from 'xss';
import validator from 'validator';
import {pool} from '../config/db.js';
import {
  createNotices,
  getAllNotice,
  getNoticeId,
  updateNotices,
  deleteNotices,
} from '../controller/noticeController.js';
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} from '../model/noticeModel.js';

jest.mock('../model/noticeModel.js'); // Mock database functions

const app = express();
app.use(express.json());

app.post('/api/notices', createNotices);
app.get('/api/notices', getAllNotice);
app.get('/api/notices/:id', getNoticeId);
app.put('/api/notices/:id', updateNotices);
app.delete('/api/notices/:id', deleteNotices);

// 404 Not Found Route
app.use('*', (req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

describe('Notice Controller Security Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('XSS Prevention - should sanitize script tags', async () => {
    const xssPayload = {
      title: "<script>alert('XSS')</script>",
      description: "<img src=x onerror=alert('XSS')>",
    };

    const sanitizedTitle = xss(xssPayload.title);
    const sanitizedDescription = xss(xssPayload.description);

    createNotice.mockResolvedValue({
      id: 1,
      title: sanitizedTitle,
      description: sanitizedDescription,
    });

    const response = await request(app)
      .post('/api/notices')
      .send(xssPayload);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(sanitizedTitle);
    expect(response.body.description).toBe(sanitizedDescription);
    expect(response.body.title).not.toContain("<script>");
    expect(response.body.description).not.toContain("onerror=");
  });

  test('404 Route Not Found - should return 404 for unknown route', async () => {
    const response = await request(app).get('/api/invalid-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Route Not Found" });
  });
});
afterAll(async () => {
  await pool.end();
});