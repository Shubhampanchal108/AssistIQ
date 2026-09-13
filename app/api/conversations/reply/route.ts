import { connectDB } from "@/Database/connection";
import conversationModel from "@/Database/models/conversationModel";
import { isAuthorized } from "@/lib/isAuthorized";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, message } = await req.json();

    if (!id || !message || typeof message !== "string") {
      return NextResponse.json({ error: "Conversation ID and message are required" }, { status: 400 });
    }

    const newMessage = {
      role: "agent",
      content: message,
      timestamp: new Date(),
    };

    const updated = await conversationModel.findOneAndUpdate(
      { _id: id, user_email: user.email },
      {
        $push: { messages: newMessage },
        $set: {
          last_message: message,
          last_message_at: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error replying to conversation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
