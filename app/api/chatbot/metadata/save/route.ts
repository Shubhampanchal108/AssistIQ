import chatBot from "@/Database/models/chatbotModel";
import { isAuthorized } from "@/lib/isAuthorized";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/Database/connection";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { color, welcome_message } = await req.json();

    if (!color && !welcome_message) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
    }

    const updatedMetadata = await chatBot.findOneAndUpdate(
      { user_email: user.email },
      {
        ...(color && { color }),
        ...(welcome_message && { welcome_message }),
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedMetadata, { status: 200 });
  } catch (e) {
    console.error("Error saving chatbot metadata:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
