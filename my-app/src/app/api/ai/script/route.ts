import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, platform = 'youtube', style = 'casual', duration = 60, provider = 'openai', model = 'gpt-4o', apiKey, temperature = 0.7 } = body;

    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    const systemPrompt = `You are an expert video script writer. Create engaging, ${style} style video scripts for ${platform}. Duration: ${duration} seconds. Format as JSON with: hook, sections, cta, estimatedWords`;

    let scriptResult;
    switch (provider) {
      case 'openai': scriptResult = await generateWithOpenAI(prompt, systemPrompt, model, apiKey, temperature); break;
      case 'anthropic': scriptResult = await generateWithAnthropic(prompt, systemPrompt, model, apiKey, temperature); break;
      case 'google': scriptResult = await generateWithGoogle(prompt, systemPrompt, model, apiKey, temperature); break;
      default: return NextResponse.json({ error: `Provider ${provider} not supported` }, { status: 400 });
    }

    return NextResponse.json({ success: true, script: scriptResult, provider, model });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Script generation failed' }, { status: 500 });
  }
}

async function generateWithOpenAI(prompt: string, systemPrompt: string, model: string, apiKey?: string, temperature?: number) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey || process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: model || 'gpt-4o', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }], temperature: temperature || 0.7, max_tokens: 2000 })
  });
  if (!response.ok) throw new Error('OpenAI API error');
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function generateWithAnthropic(prompt: string, systemPrompt: string, model: string, apiKey?: string, temperature?: number) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey || process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: model || 'claude-3-5-sonnet-20241014', system: systemPrompt, messages: [{ role: 'user', content: prompt }], temperature: temperature || 0.7, max_tokens: 2000 })
  });
  if (!response.ok) throw new Error('Anthropic API error');
  const data = await response.json();
  try { return JSON.parse(data.content[0].text); } catch { return { hook: data.content[0].text?.substring(0, 200), sections: [{ title: 'Content', content: data.content[0].text }], cta: 'Subscribe!', estimatedWords: 100 }; }
}

async function generateWithGoogle(prompt: string, systemPrompt: string, model: string, apiKey?: string, temperature?: number) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model || 'gemini-1.5-pro'}:generateContent?key=${apiKey || process.env.GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents: [{ parts: [{ text: prompt }] }, generationConfig: { temperature: temperature || 0.7, maxOutputTokens: 2000 } })
  });
  if (!response.ok) throw new Error('Google API error');
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return { hook: text.substring(0, 200), sections: [{ title: 'Main', content: text.substring(200) }], cta: 'Like & subscribe!', estimatedWords: text.split(' ').length };
}