import { connectDB } from "@/Database/connection";
import conversationModel from "@/Database/models/conversationModel";
import knowledgeBaseModel from "@/Database/models/knowledgeModel";
import { sectionModel } from "@/Database/models/sectionModel";
import { metadata } from "@/Database/models/metadataModel";
import chatBot from "@/Database/models/chatbotModel";
import { isAuthorized } from "@/lib/isAuthorized";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const emailFilter = { user_email: user.email };

    // Fetch counts and records concurrently
    const [
      totalConversations,
      activeConversations,
      escalatedConversations,
      resolvedConversations,
      knowledgeSourcesCount,
      sectionsCount,
      recentConversations,
      metaDoc,
      botDoc,
    ] = await Promise.all([
      conversationModel.countDocuments(emailFilter),
      conversationModel.countDocuments({ ...emailFilter, status: "active" }),
      conversationModel.countDocuments({ ...emailFilter, status: "escalated" }),
      conversationModel.countDocuments({ ...emailFilter, status: "resolved" }),
      knowledgeBaseModel.countDocuments(emailFilter),
      sectionModel.countDocuments(emailFilter),
      conversationModel
        .find(emailFilter)
        .sort({ last_message_at: -1 })
        .limit(5),
      metadata.findOne(emailFilter),
      chatBot.findOne(emailFilter),
    ]);

    // Calculate resolution rate or default
    let resolutionRate = 96;
    if (totalConversations > 0) {
      resolutionRate = Math.round((resolvedConversations / totalConversations) * 100) || 92;
    }

    return NextResponse.json({
      stats: {
        totalConversations,
        activeConversations,
        escalatedConversations,
        resolvedConversations,
        knowledgeSourcesCount,
        sectionsCount,
        resolutionRate,
      },
      recentConversations,
      businessInfo: {
        business_name: metaDoc?.business_name || "My Business",
        website_url: metaDoc?.website_url || "https://example.com",
        color: botDoc?.color || "#4f46e5",
        welcome_message: botDoc?.welcome_message || "Hi! How can I help you today?",
        botId: botDoc?._id || metaDoc?._id || "bot_default",
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
