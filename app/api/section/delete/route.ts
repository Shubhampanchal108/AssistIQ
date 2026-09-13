import { connectDB } from "@/Database/connection";
import { sectionModel } from "@/Database/models/sectionModel";
import { isAuthorized } from "@/lib/isAuthorized";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  await connectDB()
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "section id is required." },
        { status: 400 },
      );
    }

    const section = await sectionModel.find({ user_email: user.email });

    if (!section) {
      return NextResponse.json(
        { error: "You can not delete this section" },
        { status: 400 },
      );
    }

    const response = await sectionModel.findByIdAndDelete(id);
    return NextResponse.json(section);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
