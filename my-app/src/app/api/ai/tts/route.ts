import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voice = 'alloy', provider = 'openai', model = 'tts-1', apiKey, speed = 1.0, outputFormat = 'mp3' } = body;

    if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

    let audioResult;
    switch (provider) {
      case 'openai': audioResult = await generateWithOpenAI(text, voice, model, apiKey, speed, outputFormat); break;
      case 'elevenlabs': audioResult = await generateWithElevenLabs(text, voice, apiKey, speed); break;
      case 'google': audioResult = await generateWithGoogle(text, voice, apiKey, speed); break;
      default: return NextResponse.json({ error: `Provider ${provider} not supported` }, { status: 400 });
    }

    return NextResponse.json({ success: true, audio: audioResult, provider, model, voice, textLength: text.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'TTS generation failed' }, { status: 500 });
  }
}

async function generateWithOpenAI(text: string, voice: string, model: string, apiKey?: string, speed?: number, format?: string) {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey || process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: model || 'tts-1', voice: voice || 'alloy', input: text, speed: speed || 1.0, response_format: format || 'mp3' })
  });
  if (!response.ok) throw new Error('OpenAI TTS error');
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:audio/mp3;base64,${base64}`;
}

async function generateWithElevenLabs(text: string, voiceId: string, apiKey?: string, speed?: number) {
  const voiceMap: Record<string, string> = { 'Rachel': '21m00Tcm4TlvDq8ikWAM', 'Domi': 'AZnzlk1XZOvJtqOcD5n7', 'Bella': 'EXAW8gCr2Ck6U93nE0i5' };
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceMap[voiceId] || voiceId}`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey || process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.8, speed: speed || 1.0 } })
  });
  if (!response.ok) throw new Error('ElevenLabs TTS error');
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:audio/mp3;base64,${base64}`;
}

async function generateWithGoogle(text: string, voiceName: string, apiKey?: string, speed?: number) {
  const voice = voiceName || 'en-US-Neural2-J';
  const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey || process.env.GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: { text }, voice: { languageCode: voice.split('-')[0], name: voice }, audioConfig: { audioEncoding: 'MP3', speakingRate: speed || 1.0, pitch: 0 } })
  });
  if (!response.ok) throw new Error('Google TTS error');
  const data = await response.json();
  return data.audioContent;
}