import { isAuthorized } from "@/lib/isAuthorized";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/Database/connection";
import { metadata } from "@/Database/models/metadataModel";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const user = await isAuthorized();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { business_name, website_url, external_links, support_email, timezone, allowed_domains, api_key } = body;

    if (!business_name || !website_url) {
      return NextResponse.json(
        { error: "Business name and website URL are required" },
        { status: 400 }
      );
    }

    const updatedMetadata = await metadata.findOneAndUpdate(
      { user_email: user.email },
      {
        user_email: user.email,
        business_name,
        website_url,
        ...(external_links !== undefined && { external_links }),
        ...(support_email !== undefined && { support_email }),
        ...(timezone !== undefined && { timezone }),
        ...(allowed_domains !== undefined && { allowed_domains }),
        ...(api_key !== undefined && { api_key }),
      },
      { new: true, upsert: true }
    );

    const cookieStore = await cookies();
    cookieStore.set(
      "metadata",
      JSON.stringify({ business_name, website_url }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );

    return NextResponse.json({ metadataResponse: updatedMetadata }, { status: 200 });
  } catch (error) {
    console.error("Error storing metadata:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}