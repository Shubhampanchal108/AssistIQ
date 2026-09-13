import crypto from "crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import { connectDB } from "@/Database/connection";
import scalekit from "@/lib/scalekit";

export async function GET(){
    connectDB()
    try {
        const state = crypto.randomBytes(16).toString("hex");

        (await cookies()).set("sk_state", state, {
            httpOnly: true,
            sameSite: "lax",
            path: "/"

        })

        const redirectUri = process.env.SCALEKIT_REDIRECT_URI;
        if (!redirectUri) {
          throw new Error("SCALEKIT_REDIRECT_URI is not defined");
        }

        const options = {
            scopes: ["openId", "profile", "email", "offline_access"],
            state
        }

        const authorizationUrl = scalekit.getAuthorizationUrl(redirectUri, options)

        return NextResponse.redirect(authorizationUrl)
    } catch (error) {
        console.log(error)
        return Response.json(error)
    }
}