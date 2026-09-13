import { connectDB } from "@/Database/connection";
import conversationModel from "@/Database/models/conversationModel";
import { isAuthorized } from "@/lib/isAuthorized";
import { summarizeConversation } from "@/lib/llm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
    }

    const conversation = await conversationModel.findOne({ _id: id, user_email: user.email });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    let summaryText = "";
    try {
      summaryText = await summarizeConversation(conversation.messages || []);
    } catch (e) {
      console.error("Groq summary failed, generating basic fallback summary", e);
      summaryText = `Conversation between ${conversation.customer_name} and Support AI regarding ${conversation.section_name || "customer inquiry"}. Total messages: ${conversation.messages?.length || 0}.`;
    }

    // Infer basic sentiment from messages
    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    const textLower = (conversation.messages || []).map((m: any) => m.content).join(" ").toLowerCase();
    if (textLower.includes("thank") || textLower.includes("great") || textLower.includes("awesome") || textLower.includes("perfect") || textLower.includes("helped")) {
      sentiment = "positive";
    } else if (textLower.includes("fail") || textLower.includes("error") || textLower.includes("asap") || textLower.includes("broken") || textLower.includes("bad")) {
      sentiment = "negative";
    }

    conversation.summary = summaryText;
    conversation.sentiment = sentiment;
    await conversation.save();

    return NextResponse.json({
      summary: summaryText,
      sentiment,
      conversation,
    });
  } catch (error) {
    console.error("Error generating conversation summary:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
