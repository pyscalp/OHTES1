import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, provider = 'openai', model = 'dall-e-3', apiKey, size = '1024x1024', quality = 'standard', style = 'vivid' } = body;

    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    let imageResult;
    switch (provider) {
      case 'openai': imageResult = await generateWithOpenAI(prompt, model, apiKey, size, quality, style); break;
      case 'stability': imageResult = await generateWithStability(prompt, model, apiKey); break;
      case 'replicate': imageResult = await generateWithReplicate(prompt, model, apiKey); break;
      default: return NextResponse.json({ error: `Provider ${provider} not supported` }, { status: 400 });
    }

    return NextResponse.json({ success: true, image: imageResult, provider, model });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Image generation failed' }, { status: 500 });
  }
}

async function generateWithOpenAI(prompt: string, model: string, apiKey?: string, size?: string, quality?: string, style?: string) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey || process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: model || 'dall-e-3', prompt, size: size || '1024x1024', quality: quality || 'standard', style: style || 'vivid', n: 1 })
  });
  if (!response.ok) throw new Error('OpenAI image error');
  const data = await response.json();
  return { url: data.data[0].url, revised: data.data[0].revised_prompt };
}

async function generateWithStability(prompt: string, model: string, apiKey?: string) {
  const response = await fetch('https://api.stability.ai/v2beta/image generation', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey || process.env.STABILITY_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, cfg_scale: 7, height: 1024, width: 1024, samples: 1, steps: 30 })
  });
  if (!response.ok) throw new Error('Stability AI error');
  const data = await response.json();
  return { artifacts: data.artifacts?.map((a: any) => a.base64) };
}

async function generateWithReplicate(prompt: string, model: string, apiKey?: string) {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey || process.env.REPLICATE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: model || 'black-forest-labs/flux-schnell', input: { prompt } })
  });
  if (!response.ok) throw new Error('Replicate API error');
  const data = await response.json();
  return { id: data.id, status: data.status };
}