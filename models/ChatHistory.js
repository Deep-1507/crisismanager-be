import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: [messageSchema],
  emergencyDetected: { type: Boolean, default: false },
  severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
  suggestedActions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ChatHistory", chatHistorySchema);
