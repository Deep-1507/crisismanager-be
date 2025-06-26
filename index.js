import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// CORS Configuration - allow specific frontend origin (update as needed)
const allowedOrigins = [
  "http://localhost:3000", // your frontend dev URL
  "http://localhost:5000", // optional if serving from same port
  "https://your-frontend-domain.com", // production domain
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware to respond to preflight OPTIONS requests manually if needed
app.options("*", cors());

// Body parser
app.use(express.json());

// API routes
app.use("/api/users", userRoutes);
app.use("/api/location", locationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));