import { NextRequest, NextResponse } from 'next/server';

const CUSTOM_API_URL = 'http://89.169.108.20:8000/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemma-4-31b-it';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      topic,
      platform = 'youtube', 
      style = 'casual', 
      duration = 180,
      enableSearch = true
    } = body;

    if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

    let context = '';
    if (enableSearch && topic) {
      context = await searchInternet(topic);
    }

    const systemPrompt = `You are an expert YouTube video script writer. Create a ${duration / 60}-minute video script.

RULES:
- Total duration: ${duration} seconds (~${Math.floor(duration / 150)} words)
- Hook: 5-10 seconds, grab attention
- Sections: 3 main points, each ~40 seconds
- CTA: 5-10 seconds
- Style: ${style}
- Only use facts from provided context
- Format as JSON with exact structure below

OUTPUT FORMAT:
{
  "hook": "Opening hook (15-25 words)",
  "sections": [
    {"duration": "30-45s", "title": "Point 1", "content": "Content for point 1"},
    {"duration": "30-45s", "title": "Point 2", "content": "Content for point 2"},
    {"duration": "30-45s", "title": "Point 3", "content": "Content for point 3"}
  ],
  "cta": "Call to action (15-25 words)"
}`;

    const userPrompt = `Topic: ${topic}
${context ? `\n\nLATEST INFO:\n${context}` : ''}

Write a ${duration / 60}-minute YouTube script.`;

    const response = await fetch(CUSTOM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model: DEFAULT_MODEL, 
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ], 
        temperature: 0.7, 
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `API error: ${err}` }, { status: 500 });
    }

    const data = await response.json();
    let script;
    try {
      script = JSON.parse(data.choices[0].message.content);
    } catch {
      const content = data.choices[0].message.content;
      script = {
        hook: content.substring(0, 100),
        sections: [{ title: 'Main', content }],
        cta: 'Like and subscribe!'
      };
    }

    return NextResponse.json({
      success: true,
      script,
      duration,
      provider: 'custom',
      model: DEFAULT_MODEL
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Script generation failed' }, { status: 500 });
  }
}

async function searchInternet(query: string): Promise<string> {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, api_key: process.env.TAVILY_API_KEY || 'demo', max_results: 3 })
    });
    const data = await response.json();
    return data.results?.map((r: any) => `${r.title}: ${r.content?.substring(0, 200)}`).join('\n') || '';
  } catch {
    return '';
  }
}

export async function GET() {
  return NextResponse.json({ status: 'OK', endpoint: '/api/ai/script-3min', model: DEFAULT_MODEL });
}