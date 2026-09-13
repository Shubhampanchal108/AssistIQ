import { connectDB } from "@/Database/connection";
import conversationModel from "@/Database/models/conversationModel";
import { isAuthorized } from "@/lib/isAuthorized";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  await connectDB();
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Conversation ID and status are required" }, { status: 400 });
    }

    const updated = await conversationModel.findOneAndUpdate(
      { _id: id, user_email: user.email },
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating conversation status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
