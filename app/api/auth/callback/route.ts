import scalekit from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/Database/connection";
import { User } from "@/Database/models/userModel";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  // 🔴 If OAuth returned error
  if (error) {
    return NextResponse.json(
      { error, error_description },
      { status: 401 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "No code provided" },
      { status: 400 }
    );
  }

  try {
    // ✅ Connect DB first
    await connectDB();

    const redirectUri = process.env.SCALEKIT_REDIRECT_URI;

    if (!redirectUri) {
      throw new Error("SCALEKIT_REDIRECT_URI is not defined");
    }

    // ✅ Exchange code for token
    const authResult = await scalekit.authenticateWithCode(
      code,
      redirectUri
    );

    const { user, idToken } = authResult;

    if (!user || !idToken) {
      throw new Error("Invalid authentication response from Scalekit");
    }

    // ✅ Validate token
    const claims = (await scalekit.validateToken(idToken)) as Record<string, any>;

    const organizationId =
      claims?.organizationId ||
      claims?.org_id ||
      claims?.oid ||
      null;

    if (!organizationId) {
      return NextResponse.json(
        { error: "No organization id found in token" },
        { status: 500 }
      );
    }

    // ✅ Check if user exists
    const existingUser = await User.findOne({
      email: user.email,
    });

    if (!existingUser) {
      await User.create({
        name: user?.name || "User",
        email: user.email,
        organization_id: organizationId,
      });
    }

    // ✅ Create session object
    const userSession = {
      email: user.email,
      organization_id: organizationId,
    };

    // ✅ Redirect to home
    const response = NextResponse.redirect(
      new URL("/", req.url)
    );

    // ✅ Set cookie
    response.cookies.set(
      "user_session",
      JSON.stringify(userSession),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      }
    );

    return response;
  } catch (err: any) {
    console.error(
      "Authentication error:",
      err?.response?.data || err
    );

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
