import express from "express";
import { sendRequest, acceptRequest, rejectRequest, myRequests } from "../controllers/collabController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authMiddleware, sendRequest);
router.put("/accept/:id", authMiddleware, acceptRequest);
router.put("/reject/:id", authMiddleware, rejectRequest);
router.get("/my", authMiddleware, myRequests);

export default router;
