import request from "supertest";
import app from "../index.js"; // Ensure this is your Express app instance
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import {
  createUser,
  findEmail,
  deleteAccount,
  updateUser,
  getAllUsers,
  deleteAccountIndv,
  getTotalUsersCount,
} from "../model/autheticationModel.js";

// Load environment variables
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

// Mock model functions
jest.mock("../model/autheticationModel.js");

const mockToken = jwt.sign(
  { id: 1, email: "admin@example.com", role: "admin" },
  jwtSecret,
  { expiresIn: "1h" }
);

describe("Authentication Controller Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });


  it("POST /api/auth/register - should register a user", async () => {
    findEmail.mockResolvedValue(null); // No existing user
    createUser.mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      role: "applicant",
    });

    const response = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "Password@123",
      contact: "9812345678",
      gender: "Male",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "User created successfully");
    expect(response.body).toHaveProperty("token");
  });

  it("POST /api/auth/register - should return error for invalid email", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "invalid-email",
      password: "Password@123",
      contact: "9812345678",
      gender: "Male",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid email format");
  });


  it("POST /api/auth/login - should log in a user", async () => {
    findEmail.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: await bcrypt.hash("Password@123", 10),
      role: "applicant",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Login successful");
    expect(response.body).toHaveProperty("token");
  });

  it("POST /api/auth/login - should return error for incorrect password", async () => {
    findEmail.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      password: await bcrypt.hash("Password@123", 10),
      role: "applicant",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "WrongPassword",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid email or password");
  });


  it("DELETE /api/auth/appManageAcc/:id - should delete user account", async () => {
    deleteAccount.mockResolvedValue(true);

    const response = await request(app)
      .delete("/api/auth/appManageAcc/1")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User deleted successfully");
  });

  it("DELETE /api/auth/appManageAcc/:id - should return error if user not found", async () => {
    deleteAccount.mockResolvedValue(false);

    const response = await request(app)
      .delete("/api/auth/appManageAcc/99")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "User not found");
  });


  it("GET /api/auth/accGet - should get all users", async () => {
    getAllUsers.mockResolvedValue([
      { id: 1, username: "testuser", role: "applicant" },
    ]);

    const response = await request(app)
      .get("/api/auth/accGet")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, username: "testuser", role: "applicant" },
    ]);
  });


  it("PUT /api/auth/accUpdate/:id - should update user details", async () => {
    updateUser.mockResolvedValue({
      id: 1,
      username: "newName",
      role: "applicant",
    });

    const response = await request(app)
      .put("/api/auth/accUpdate/1")
      .set("Authorization", `Bearer ${mockToken}`)
      .send({ username: "newName" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "newName");
  });


  it("DELETE /api/auth/appManageAccIndv - should delete a specific applicant", async () => {
    deleteAccountIndv.mockResolvedValue(true);

    const response = await request(app)
      .delete("/api/auth/appManageAccIndv")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Account deleted successfully");
  });


  it("GET /api/auth/count - should return total applicants count", async () => {
    getTotalUsersCount.mockResolvedValue(10);

    const response = await request(app)
      .get("/api/auth/count")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(10);
  });
});
