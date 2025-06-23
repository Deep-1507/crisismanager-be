import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  const { name, phone, email, password, contacts, distress } = req.body;

  if (!name || !phone || !email || !password || contacts.length !== 3) {
    return res.status(400).json({ message: "All fields required including 3 contacts" });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "User already exists" });

  const user = await User.create({ name, phone, email, password, contacts, distress:0 });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({
    message: "User registered",
    user: { id: user._id, name: user.name, email: user.email },
    token,
  });
};

export const getUserContacts = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      contacts: user.contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(500).json({ message: "Server error while fetching contacts" });
  }
};