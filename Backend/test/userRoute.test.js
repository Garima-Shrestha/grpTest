import request from 'supertest';
import app from '../index.js';
import { register, login, manageAccount, getAllUser, updateUsers, manageAccountIndv, getTotalApplicants } from '../controller/authenticationController.js';

jest.mock('../controller/authenticationController.js'); // Mock controller
jest.mock('../middleware/authenticationMiddleware.js', () => 
    (req, res, next) => next() // Automatically pass authentication
);

describe('Authentication Routes', () => {
    test('POST /api/auth/register - should register a user', async () => {
        register.mockImplementation((req, res) => res.status(201).json({ message: 'User registered' }));

        const response = await request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', email: 'test@example.com', password: '123456', contactNumber: '9876543210', gender: 'male', role: 'applicant' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered');
    });

    test('POST /api/auth/login - should log in a user', async () => {
        login.mockImplementation((req, res) => res.status(200).json({ token: 'mockToken' }));

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: '123456' });

        expect(response.status).toBe(200);
        expect(response.body.token).toBe('mockToken');
    });

    test('DELETE /api/auth/appManageAcc/:id - should delete user account', async () => {
        manageAccount.mockImplementation((req, res) => res.status(200).json({ message: 'Account deleted' }));

        const response = await request(app)
            .delete('/api/auth/appManageAcc/1')
            .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Account deleted');
    });

    test('GET /api/auth/accGet - should get all applicants', async () => {
        getAllUser.mockImplementation((req, res) => res.status(200).json([{ id: 1, username: 'testuser', role: 'applicant' }]));

        const response = await request(app)
            .get('/api/auth/accGet')
            .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, username: 'testuser', role: 'applicant' }]);
    });

    test('PUT /api/auth/accUpdate/:id - should update user details', async () => {
        updateUsers.mockImplementation((req, res) => res.status(200).json({ message: 'User updated' }));

        const response = await request(app)
            .put('/api/auth/accUpdate/1')
            .set('Authorization', 'Bearer mockToken')
            .send({ username: 'newName' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated');
    });

    test('DELETE /api/auth/appManageAccIndv - should delete a specific applicant', async () => {
        manageAccountIndv.mockImplementation((req, res) => res.status(200).json({ message: 'User deleted' }));

        const response = await request(app)
            .delete('/api/auth/appManageAccIndv')
            .set('Authorization', 'Bearer mockToken')
            .send({ userId: 1 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted');
    });

    test('GET /api/auth/count - should return total applicants count', async () => {
        getTotalApplicants.mockImplementation((req, res) => res.status(200).json({ count: 10 }));

        const response = await request(app)
            .get('/api/auth/count')
            .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(200);
        expect(response.body.count).toBe(10);
    });
});
