import { pool } from '../config/db.js'; // Adjust the path as necessary
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} from '../model/noticeModel.js';

jest.mock('../config/db.js'); // Mock the database pool

describe('Notice Model', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('createNotice', () => {
    it('should create a new notice and return it', async () => {
      const newNotice = { title: 'Test Notice', description: 'This is a test notice.' };
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, ...newNotice }] });

      const result = await createNotice(newNotice.title, newNotice.description);
      expect(result).toEqual({ id: 1, ...newNotice });
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO notices (title, description) VALUES ($1, $2) RETURNING *",
        [newNotice.title, newNotice.description]
      );
    });
  });

  describe('getAllNotices', () => {
    it('should return all notices', async () => {
      const notices = [
        { id: 1, title: 'Notice 1', description: 'Description 1' },
        { id: 2, title: 'Notice 2', description: 'Description 2' },
      ];
      pool.query.mockResolvedValueOnce({ rows: notices });

      const result = await getAllNotices();
      expect(result).toEqual(notices);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM notices ORDER BY created_at DESC");
    });
  });

  describe('getNoticeById', () => {
    it('should return a notice by ID', async () => {
      const notice = { id: 1, title: 'Notice 1', description: 'Description 1' };
      pool.query.mockResolvedValueOnce({ rows: [notice] });

      const result = await getNoticeById(1);
      expect(result).toEqual(notice);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM notices WHERE id = $1", [1]);
    });

    it('should return null if notice not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // Return an empty array

      const result = await getNoticeById(999);
      expect(result).toBeNull(); // Expect null
    });
  });

  describe('updateNotice', () => {
    it('should update a notice and return it', async () => {
      const updatedNotice = { title: 'Updated Notice', description: 'Updated description.' };
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, ...updatedNotice }] });

      const result = await updateNotice(1, updatedNotice.title, updatedNotice.description);
      expect(result).toEqual({ id: 1, ...updatedNotice });
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE notices SET title = $1, description = $2 WHERE id = $3 RETURNING *",
        [updatedNotice.title, updatedNotice.description, 1]
      );
    });

    it('should return null if notice to update not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // Return an empty array

      const result = await updateNotice(999, 'Title', 'Description');
      expect(result).toBeNull(); // Expect null
    });
  });

  describe('deleteNotice', () => {
    it('should delete a notice', async () => {
      await deleteNotice(1);
      expect(pool.query).toHaveBeenCalledWith("DELETE FROM notices WHERE id = $1", [1]);
    });
  });
});
afterAll(async () => {
  await pool.end();
});