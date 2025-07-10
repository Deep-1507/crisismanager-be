import express from "express";
import { chatWithAI,getAllChatHistory } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, chatWithAI);
router.get("/history", protect, getAllChatHistory);


export default router;