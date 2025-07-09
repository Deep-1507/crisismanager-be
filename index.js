import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import ChatRoutes from "./routes/chatRoutes.js"
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// ✅ Allow CORS for all origins
app.use(cors()); // This allows requests from any origin

app.use(express.json());

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/chat", ChatRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));