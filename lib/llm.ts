import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
const MODEL_NAME = "qwen/qwen3.6-27b";

function stripThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

export async function sumarizedMarkdown(markdown: string) {
  try {
    const prompt = `
      You are a data summarization engine for an AI chatbot.
      Convert the input website markdown, text, or CSV data into a CLEAN, DENSE SUMMARY for LLM context usage.

      STRICT RULES:
      - Output ONLY plain text.
      - Write as ONE continuous paragraph.
      - Remove navigation, menus, buttons, CTAs, pricing tables, sponsors, ads, testimonials, community chats, UI labels, emojis, and decorative content.
      - Remove repetition and marketing language.
      - Keep ONLY factual, informational content useful for customer support.
      - Compress aggressively while preserving meaning.
      - The final output MUST be under 2000 words.

      INPUT:
      ${markdown}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL_NAME,
      temperature: 0.1,
      max_tokens: 900,
    });

    return stripThinkTags(completion.choices[0]?.message?.content?.trim() || "");
  } catch (error) {
    console.error("Error in summarizeMarkdown:", error);
    throw error;
  }
}

export async function summarizeConversation(messages: any[]) {
  try {
    const conversationText = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = `
      Summarize the following conversation history into a concise paragraph, 
      preserving key details and user intent. 
      The final output MUST be under 2000 words.

      ${conversationText}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL_NAME,
      temperature: 0.1,
      max_tokens: 500,
    });

    return stripThinkTags(completion.choices[0]?.message?.content?.trim() || "");
  } catch (error) {
    console.error("Error in summarizeConversation:", error);
    throw error;
  }
}