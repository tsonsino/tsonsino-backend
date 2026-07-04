import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://tsonsino.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;

      // Call Anthropic API
      const msg = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620', // Ensure this model name is current
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });

      // Send the text content back to your frontend
      res.status(200).json({ reply: msg.content[0].text });

    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
