import { pool } from '../config/db.js';
import { createUser, findEmail, deleteAccount, getAllUsers, updateUser, deleteAccountIndv, getTotalUsersCount } from '../model/autheticationModel.js';

jest.mock('../config/db.js'); // Mocking database connection

describe('User Model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createUser should insert user and return new user', async () => {
        const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password: 'hashedpassword', contact_number: '1234567890', gender: 'male', role: 'applicant' };
        pool.query.mockResolvedValue({ rows: [mockUser] });

        const result = await createUser('testuser', 'test@example.com', 'hashedpassword', '1234567890', 'male', 'applicant');

        expect(pool.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
        expect(result).toEqual(mockUser);
    });

    test('findEmail should return user if email exists', async () => {
        const mockUser = { id: 1, email: 'test@example.com' };
        pool.query.mockResolvedValue({ rows: [mockUser] });

        const result = await findEmail('test@example.com');

        expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['test@example.com']);
        expect(result).toEqual(mockUser);
    });

    test('deleteAccount should remove user and return deleted user', async () => {
        const mockDeletedUser = { id: 1, username: 'testuser' };
        pool.query.mockResolvedValue({ rows: [mockDeletedUser] });

        const result = await deleteAccount(1);

        expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(result).toEqual(mockDeletedUser);
    });

    test('getAllUsers should return list of applicants', async () => {
        const mockUsers = [{ id: 1, username: 'testuser', role: 'applicant' }];
        pool.query.mockResolvedValue({ rows: mockUsers });

        const result = await getAllUsers();

        expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['applicant']);
        expect(result).toEqual(mockUsers);
    });

    test('updateUser should update user details', async () => {
        const mockUpdatedUser = { id: 1, username: 'updatedUser' };
        pool.query.mockResolvedValue({ rows: [mockUpdatedUser] });

        const result = await updateUser(1, { username: 'updatedUser' });

        expect(pool.query).toHaveBeenCalled();
        expect(result).toEqual(mockUpdatedUser);
    });

    test('deleteAccountIndv should delete user and return deleted data', async () => {
        const mockDeletedUser = { id: 1 };
        pool.query.mockResolvedValue({ rows: [mockDeletedUser] });

        const result = await deleteAccountIndv(1);

        expect(pool.query).toHaveBeenCalled();
        expect(result).toEqual(mockDeletedUser);
    });

    test('getTotalUsersCount should return count of users', async () => {
        pool.query.mockResolvedValue({ rows: [{ count: '10' }] });

        const result = await getTotalUsersCount();

        expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['admin']);
        expect(result).toBe('10');
    });
});
