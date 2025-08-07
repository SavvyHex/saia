import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, model } = await req.json();

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // Change to your domain if deployed
        "X-Title": "SAIA",
      },
      body: JSON.stringify({
        model: model || "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        messages,
        stream: false,
      }),
    });

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;

    return NextResponse.json({ content });
  } catch (error) {
    console.error("OpenRouter error:", error);
    return NextResponse.json({ error: "Failed to get response from OpenRouter" }, { status: 500 });
  }
}