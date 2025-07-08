import express from "express";
import { editContact, getUser, loginUser, registerUser } from "../controllers/userController.js";
import { getUserContacts } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/contacts", protect, getUserContacts);
router.post("/edit-contact/:id", protect, editContact);
router.get("/get-user-details", protect, getUser);

export default router; 