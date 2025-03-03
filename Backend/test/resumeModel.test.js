// resumeModel.test.js
import { addResume, getResumesByUserId, updateResume, deleteResume, getResumeById } from '../model/applicantResumeModel.js';
import { pool } from '../config/db.js';

jest.mock('../config/db.js'); // Mock the database pool

describe('Resume Model', () => {
  const mockResume = {
    id: 1,
    user_id: 1,
    full_name: 'John Doe',
    email: 'john@example.com',
    contact: '1234567890',
    address: '123 Main St',
    education: 'Bachelor\'s Degree',
    experience: '5 years',
    skills: 'JavaScript, Node.js',
    certifications: 'Certified Developer',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('addResume should insert a new resume and return it', async () => {
    pool.query.mockResolvedValueOnce({ rows: [mockResume] });

    const result = await addResume(1, 'John Doe', 'john@example.com', '1234567890', '123 Main St', 'Bachelor\'s Degree', '5 years', 'JavaScript, Node.js', 'Certified Developer');
    
    expect(result).toEqual(mockResume);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
  });

  test('getResumesByUser Id should return resumes for a user', async () => {
    pool.query.mockResolvedValueOnce({ rows: [mockResume] });

    const result = await getResumesByUserId(1);
    
    expect(result).toEqual([mockResume]);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
  });

  test('updateResume should update a resume and return it', async () => {
    pool.query.mockResolvedValueOnce({ rows: [mockResume] });

    const result = await updateResume(1, 1, 'John Doe', 'john@example.com', '1234567890', '123 Main St', 'Bachelor\'s Degree', '5 years', 'JavaScript, Node.js', 'Certified Developer');
    
    expect(result).toEqual(mockResume);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
  });

  test('deleteResume should delete a resume and return it', async () => {
    pool.query.mockResolvedValueOnce({ rows: [mockResume] });

    const result = await deleteResume(1, 1);
    
    expect(result).toEqual(mockResume);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 1]);
  });

  test('getResumeById should return a resume by ID', async () => {
    pool.query.mockResolvedValueOnce({ rows: [mockResume] });

    const result = await getResumeById(1, 1);
    
    expect(result).toEqual(mockResume);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 1]);
  });
});