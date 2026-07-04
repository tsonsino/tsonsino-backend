export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://tsonsino.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, maxTokens } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: maxTokens || 2500 }
        })
      }
    );

    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      return res.status(200).json({ text: '', error: data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      return res.status(200).json({ text: '', debug: JSON.stringify(data).substring(0, 500) });
    }
    
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
