import { pool } from '../config/db.js';
import {
  createEmployer,
  findEmployerEmail,
  getEmployerById,
  updateEmployerById,
  deleteEmployerById,
} from '../model/employerAuthModel.js';

// Mock the database
jest.mock('../config/db.js', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('Employer Model Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createEmployer should insert employer and profile data', async () => {
    const mockEmployer = {
      companyName: 'TechCorp',
      email: 'tech@example.com',
      password: 'hashedpassword',
      contact: '9800000000',
      address: 'Kathmandu',
      panNumber: '123456789',
      companyType: 'IT',
      role: 'Employer',
      companyDesc: 'An IT company',
      photoPath: '/uploads/profile.png',
    };

    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1, company_name: 'TechCorp', email: 'tech@example.com', role: 'Employer' }] }) // Employer insert
      .mockResolvedValueOnce({ rows: [{ employer_id: 1, company_desc: 'An IT company', photo: '/uploads/profile.png' }] }); // Profile insert

    const result = await createEmployer(
      mockEmployer.companyName,
      mockEmployer.email,
      mockEmployer.password,
      mockEmployer.contact,
      mockEmployer.address,
      mockEmployer.panNumber,
      mockEmployer.companyType,
      mockEmployer.role,
      mockEmployer.companyDesc,
      mockEmployer.photoPath
    );

    expect(result.employer.company_name).toBe('TechCorp');
    expect(result.profile.company_desc).toBe('An IT company');
    expect(pool.query).toHaveBeenCalledTimes(2);
  });

  test('findEmployerEmail should return employer data', async () => {
    const mockEmail = 'tech@example.com';
    const mockEmployerData = {
      id: 1,
      company_name: 'TechCorp',
      email: 'tech@example.com',
      company_desc: 'An IT company',
      photo: '/uploads/profile.png',
    };

    pool.query.mockResolvedValueOnce({ rows: [mockEmployerData] });

    const result = await findEmployerEmail(mockEmail);

    expect(result.email).toBe(mockEmail);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockEmail]);
  });

  test('deleteEmployerById should remove an employer', async () => {
    const mockEmployerId = 1;

    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, company_name: 'TechCorp' }] });

    const result = await deleteEmployerById(mockEmployerId);

    expect(result.company_name).toBe('TechCorp');
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockEmployerId]);
  });
});
