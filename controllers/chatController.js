import ChatHistory from "../models/ChatHistory.js";
import { generateChatResponse, analyzeEmergencyPrompt } from "../CallFunction/Gemini.js";

export const chatWithAI = async (req, res) => {
  try {
    const userId = req.user._id; // Assumes auth middleware sets req.user
    const { message, messages = [] } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Prepare conversation history for AI
    const conversationHistory = [
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
      })),
      {
        role: "user",
        content: message,
        timestamp: new Date()
      }
    ];

    const userSettings = {};

    const emergencyAnalysis = await analyzeEmergencyPrompt(message);

    const aiResponse = await generateChatResponse(conversationHistory, userSettings);

    const chatHistory = await ChatHistory.create({
      user: userId,
      messages: conversationHistory.concat([
        {
          role: "assistant",
          content: aiResponse.message,
          timestamp: aiResponse.timestamp
        }
      ]),
      emergencyDetected: emergencyAnalysis.isEmergency,
      severity: emergencyAnalysis.severity,
      suggestedActions: emergencyAnalysis.suggestedActions
    });

    res.status(200).json({
      message: aiResponse.message,
      timestamp: aiResponse.timestamp,
      emergencyDetected: emergencyAnalysis.isEmergency,
      severity: emergencyAnalysis.severity,
      suggestedActions: emergencyAnalysis.suggestedActions,
      chatId: chatHistory._id
    });
  } catch (error) {
    console.error("Error in AI chat:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
};


export const getAllChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatHistories = await ChatHistory.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(chatHistories);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Server error fetching chat history" });
  }
};
