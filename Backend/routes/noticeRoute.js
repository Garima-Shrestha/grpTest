import express from 'express'

import {createNotices,getAllNotice,updateNotices,getNoticeId,deleteNotices} from '../controller/noticeController.js';
import authenticateToken from '../middleware/authenticationMiddleware.js';
const router = express.Router();
router.post("/notice", authenticateToken,createNotices);
router.get("/notice", authenticateToken,getAllNotice);
router.get("/notice/:id",authenticateToken, getNoticeId);
router.put("/notice/:id", authenticateToken,updateNotices);
router.delete("/notice/:id",authenticateToken, deleteNotices);

export default router;