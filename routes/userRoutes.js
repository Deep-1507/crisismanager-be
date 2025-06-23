import express from "express";
import { registerUser } from "../controllers/userController.js";
import { getUserContacts } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.get("/contacts", protect, getUserContacts);

export default router;