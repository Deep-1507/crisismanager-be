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

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findOne({ email });
console.log(user)
  if (!user) return res.status(409).json({ message: "User does not exists. Kindly Register!" });

  const isPasswordvalid = await bcrypt.compare(
    password,
    user.password
  )

  if(!isPasswordvalid){
   res.status(409).json({message:"Incorrect Password"})
  }

   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({
    message: "User logged-in",
    user: { id: user._id, name: user.name, email: user.email },
    token,
  });
};

export const getUser = async (req, res) => {
  
  const User = req.user;
  if (!User) return res.status(409).json({ message: "User does not exists. Kindly Register!" });

  res.status(200).json({
    message: "User found",
    User
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

export const editContact = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { name, phone } = req.body;


  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required." });
  }

  try {
    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        "contacts._id": id
      },
      {
        $set: {
          "contacts.$.name": name,
          "contacts.$.phone": phone
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User or contact not found." });
    }

    res.status(200).json({
      message: "Contact updated successfully.",
      contacts: user.contacts
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Server error." });
  }
};