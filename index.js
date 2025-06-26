import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// CORS CONFIGURATION
app.use(cors({
  origin: "*", // frontend origin(s)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // allow cookies if needed
}));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/location", locationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));import express from "express";