import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      prompt, 
      topic,
      platform = 'youtube', 
      style = 'casual', 
      duration = 60, 
      provider = 'openai', 
      model = 'gpt-4o', 
      apiKey, 
      temperature = 0.7,
      enableSearch = true
    } = body;

    if (!prompt && !topic) return NextResponse.json({ error: 'Prompt or topic is required' }, { status: 400 });

    // Step 1: Fetch real information from internet
    let searchResults: any[] = [];
    const searchQuery = topic || prompt;
    
    if (enableSearch && searchQuery) {
      searchResults = await searchInternet(searchQuery);
    }

    // Build context from search results
    const context = searchResults.length > 0 
      ? `\n\nLATEST INFORMATION:\n${searchResults.map(r => `- ${r.title}: ${r.content?.substring(0, 300)}`).join('\n')}`
      : '';

    const systemPrompt = `You are an expert video script writer. Create accurate, well-researched video scripts using the provided context.
    
RULES:
- Only use facts from the provided context
- If information is unsure, say "Based on..."
- Include specific data, dates, sources when available
- Style: ${style}
- Platform: ${platform}
- Duration: ${duration} seconds
- Format as JSON with: hook, sections[{title, content}], cta, factsUsed[]`;

    let scriptResult;
    switch (provider) {
      case 'openai': 
        scriptResult = await generateWithOpenAI(topic || prompt, systemPrompt, context, model, apiKey, temperature); 
        break;
      case 'anthropic': 
        scriptResult = await generateWithAnthropic(topic || prompt, systemPrompt, context, model, apiKey, temperature); 
        break;
      case 'google': 
        scriptResult = await generateWithGoogle(topic || prompt, systemPrompt, context, model, apiKey, temperature); 
        break;
      default: 
        return NextResponse.json({ error: `Provider ${provider} not supported` }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      script: scriptResult,
      provider,
      model,
      grounding: { used: enableSearch, sources: searchResults.map(r => ({ title: r.title, url: r.url })) }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Script generation failed' }, { status: 500 });
  }
}

// Web Search using Tavily
async function searchInternet(query: string): Promise<any[]> {
  try {
    const tavilyKey = process.env.TAVILY_API_KEY;
    if (!tavilyKey) {
      // Fallback to free search
      const res = await fetch(`https://api.tavily.com/search?q=${encodeURIComponent(query)}&api_key=demo&max_results=3`);
      const data = await res.json();
      return data.results || [];
    }
    
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, api_key: tavilyKey, max_results: 5, search_depth: 'basic' })
    });
    
    const data = await response.json();
    return data.results || [];
  } catch (e) {
    console.error('Search error:', e);
    return [];
  }
}

async function generateWithOpenAI(prompt: string, systemPrompt: string, context: string, model: string, apiKey?: string, temperature?: number) {
  const fullPrompt = context ? `${prompt}\n${context}` : prompt;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey || process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ 
      model: model || 'gpt-4o', 
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: fullPrompt }], 
      temperature: temperature || 0.7, 
      max_tokens: 3000 
    })
  });
  
  if (!response.ok) throw new Error('OpenAI API error');
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function generateWithAnthropic(prompt: string, systemPrompt: string, context: string, model: string, apiKey?: string, temperature?: number) {
  const fullPrompt = context ? `${prompt}\n${context}` : prompt;
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey || process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: model || 'claude-3-5-sonnet-20241014', system: systemPrompt, messages: [{ role: 'user', content: fullPrompt }], temperature: temperature || 0.7, max_tokens: 3000 })
  });
  if (!response.ok) throw new Error('Anthropic API error');
  const data = await response.json();
  try { return JSON.parse(data.content[0].text); } catch { return { hook: data.content[0].text?.substring(0, 200), sections: [{ title: 'Content', content: data.content[0].text }], cta: 'Subscribe!', factsUsed: [] }; }
}

async function generateWithGoogle(prompt: string, systemPrompt: string, context: string, model: string, apiKey?: string, temperature?: number) {
  const fullPrompt = context ? `${prompt}\n${context}` : prompt;
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model || 'gemini-1.5-pro'}:generateContent?key=${apiKey || process.env.GOOGLE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents: [{ parts: [{ text: fullPrompt }] }, generationConfig: { temperature: temperature || 0.7, maxOutputTokens: 3000 } })
  });
  if (!response.ok) throw new Error('Google API error');
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  try { return JSON.parse(text); } catch { return { hook: text.substring(0, 200), sections: [{ title: 'Main', content: text }], cta: 'Like & subscribe!', factsUsed: [] }; }
}