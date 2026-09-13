import { connectDB } from "@/Database/connection";
import chatBot from "@/Database/models/chatbotModel";
import { metadata } from "@/Database/models/metadataModel";
import { sectionModel } from "@/Database/models/sectionModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const botId = searchParams.get("botId");

    let botDoc = null;
    if (botId && mongoose.Types.ObjectId.isValid(botId)) {
      botDoc = await chatBot.findOne({ _id: botId }).catch(() => null);
    }
    if (!botDoc) {
      botDoc = await chatBot.findOne({}).sort({ updatedAt: -1 });
    }

    const userEmail = botDoc?.user_email || "";

    let metaDoc = null;
    let sections: any[] = [];

    if (userEmail) {
      metaDoc = await metadata.findOne({ user_email: userEmail }).sort({ updatedAt: -1 });
      sections = await sectionModel.find({ user_email: userEmail, status: "active" });
    } else {
      metaDoc = await metadata.findOne({}).sort({ updatedAt: -1 });
    }

    const payload = {
      botId: botDoc?._id || "bot_default",
      color: botDoc?.color || "#4f46e5",
      welcome_message: botDoc?.welcome_message || "Hi! How can I help you today?",
      business_name: metaDoc?.business_name || "Assist IQ Support",
      website_url: metaDoc?.website_url || "",
      sections: sections.map((sec: any) => ({
        id: sec._id.toString(),
        name: sec.name,
      })),
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching public embed info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
