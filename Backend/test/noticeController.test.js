import request from 'supertest';
import express from 'express';
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

describe('Notice Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/notices - should create a notice', async () => {
    const mockNotice = { id: 1, title: 'Test Notice', description: 'This is a test notice.' };
    
    createNotice.mockResolvedValue(mockNotice);

    const response = await request(app)
      .post('/api/notices')
      .send({ title: 'Test Notice', description: 'This is a test notice.' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockNotice);
    expect(createNotice).toHaveBeenCalledWith('Test Notice', 'This is a test notice.');
  });

  test('GET /api/notices - should return all notices', async () => {
    const mockNotices = [
      { id: 1, title: 'Notice 1', description: 'Description 1' },
      { id: 2, title: 'Notice 2', description: 'Description 2' },
    ];

    getAllNotices.mockResolvedValue(mockNotices);

    const response = await request(app).get('/api/notices');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockNotices);
    expect(getAllNotices).toHaveBeenCalled();
  });

  test('GET /api/notices/:id - should return a single notice', async () => {
    const mockNotice = { id: 1, title: 'Notice 1', description: 'Description 1' };

    getNoticeById.mockResolvedValue(mockNotice);

    const response = await request(app).get('/api/notices/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockNotice);
    expect(getNoticeById).toHaveBeenCalledWith('1');
  });

  test('PUT /api/notices/:id - should update a notice', async () => {
    const updatedNotice = { id: 1, title: 'Updated Title', description: 'Updated description' };

    updateNotice.mockResolvedValue(updatedNotice);

    const response = await request(app)
      .put('/api/notices/1')
      .send({ title: 'Updated Title', description: 'Updated description' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedNotice);
    expect(updateNotice).toHaveBeenCalledWith('1', 'Updated Title', 'Updated description');
  });

  test('DELETE /api/notices/:id - should delete a notice', async () => {
    deleteNotice.mockResolvedValue();

    const response = await request(app).delete('/api/notices/1');

    expect(response.status).toBe(204);
    expect(deleteNotice).toHaveBeenCalledWith('1');
  });
});
