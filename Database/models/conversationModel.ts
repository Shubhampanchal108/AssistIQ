import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "agent"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema(
  {
    user_email: {
      type: String,
      required: true,
      index: true,
    },
    customer_name: {
      type: String,
      required: true,
      default: "Customer User",
    },
    customer_email: {
      type: String,
      default: "customer@example.com",
    },
    customer_avatar: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "resolved", "escalated", "pending"],
      default: "active",
      index: true,
    },
    section_name: {
      type: String,
      default: "General Inquiry",
    },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      default: "neutral",
    },
    summary: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 5,
    },
    last_message: {
      type: String,
      default: "",
    },
    last_message_at: {
      type: Date,
      default: Date.now,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export const conversationModel =
  mongoose.models.conversation ||
  mongoose.model("conversation", conversationSchema);

export default conversationModel;
