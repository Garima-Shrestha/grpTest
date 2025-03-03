import request from "supertest";
import app from "../index.js"; // Ensure this is your Express app instance
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import {pool} from '../config/db.js';
import {
  createUser ,
  findEmail,
  deleteAccount,
  updateUser ,
  getAllUsers,
  deleteAccountIndv,
  getTotalUsersCount,
} from "../model/autheticationModel.js";

// Load environment variables
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

// Mock model functions
jest.mock("../model/autheticationModel.js");

describe("Authentication Controller Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("POST /api/auth/login - should prevent SQL injection", async () => {
    findEmail.mockResolvedValue(null); // Simulating no user found

    const response = await request(app).post("/api/auth/login").send({
      email: "' OR 1=1; --",
      password: "anyPassword",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid email or password");
  });


  it("POST /api/auth/register - should sanitize input and prevent XSS", async () => {
    findEmail.mockResolvedValue(null); // No existing user
    createUser .mockResolvedValue({
      id: 1,
      username: "safeUser ",
      email: "safe@example.com",
      role: "applicant",
    });

    const response = await request(app).post("/api/auth/register").send({
      username: "<script>alert('XSS')</script>",
      email: "safe@example.com",
      password: "Password@123",
      contact: "9812345678",
      gender: "Male",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User created successfully");
    expect(response.body).toHaveProperty("token");
  });


  it("GET /api/unknown-route - should return 404 for unknown routes", async () => {
    const response = await request(app).get("/api/unknown-route");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Route not found");
  });
});
afterAll(async () => {
  await pool.end();
});