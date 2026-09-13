import { connectDB } from "@/Database/connection";
import conversationModel from "@/Database/models/conversationModel";
import { isAuthorized } from "@/lib/isAuthorized";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const query = searchParams.get("query");

    const filter: any = { user_email: user.email };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (query) {
      filter.$or = [
        { customer_name: { $regex: query, $options: "i" } },
        { customer_email: { $regex: query, $options: "i" } },
        { last_message: { $regex: query, $options: "i" } },
        { section_name: { $regex: query, $options: "i" } },
      ];
    }

    const conversations = await conversationModel
      .find(filter)
      .sort({ last_message_at: -1 });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error fetching dynamic conversations from database:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
