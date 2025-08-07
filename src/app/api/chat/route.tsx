import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { messages, model } = await req.json();

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'SAIA',
      },
      body: JSON.stringify({
        model: model || 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
        messages,
      }),
    });

    const data = await response.json();
    console.log('OpenRouter raw response:', data);
    return NextResponse.json(data.choices[0].message);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'OpenRouter request failed' }, { status: 500 });
  }
}