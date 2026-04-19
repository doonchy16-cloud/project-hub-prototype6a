import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, appContext } = await req.json();

    const response = await openai.responses.create({
      model: "gpt-5",
      instructions:
        "You are the AI assistant for an off-grid and project-based community app. " +
        "Use the provided app context when relevant. Be helpful, practical, and concise.",
      input: [
        {
          role: "system",
          content: `App context: ${JSON.stringify(appContext ?? {})}`,
        },
        ...messages.map((m: { role: "user" | "assistant"; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    });

    return NextResponse.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "AI chat request failed." },
      { status: 500 }
    );
  }
}
