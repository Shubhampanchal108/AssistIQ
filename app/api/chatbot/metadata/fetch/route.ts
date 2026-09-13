import chatBot from "@/Database/models/chatbotModel";
import { isAuthorized } from "@/lib/isAuthorized";
import { NextResponse } from "next/server";
import {connectDB} from "@/Database/connection"

export async function GET(){
    await connectDB();
    try{
        const user = await isAuthorized();

        if(!user){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        let existingMetadata = await chatBot.findOne({ user_email: user.email });

        if (!existingMetadata) {
            existingMetadata = await chatBot.create({
                user_email: user.email,
                color: "#4f46e5",
                welcome_message: "Hi! How can I help you today?"
            });
        }

        return NextResponse.json(existingMetadata, { status: 200 });
    } catch (e) {
        console.error("Error fetching chatbot metadata:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}