import express from "express";
import { updateJobStatusController } from "../controller/adminController.js";
import authenticateToken from "../middleware/authenticationMiddleware.js";
const router = express.Router();

router.put("/jobs/:jobId/status",authenticateToken, updateJobStatusController);

export default router;
