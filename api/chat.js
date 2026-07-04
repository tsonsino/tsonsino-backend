export default async function handler(req, res) {
  // 1. Mandatory CORS headers to allow your GitHub Pages site to talk to this API
  res.setHeader('Access-Control-Allow-Origin', 'https://tsonsino.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 2. Handle the 'OPTIONS' preflight request sent by your browser
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. Process the actual POST request from your frontend
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;

      // --- YOUR AI LOGIC GOES HERE ---
      // Example: 
      // const response = await callYourAIService(prompt);
      // res.status(200).json({ result: response });
      
      // Temporary test response to verify connection:
      res.status(200).json({ message: "Backend is connected and receiving prompts!" });

    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  } else {
    // 4. Handle any other HTTP methods (GET, PUT, etc.)
    res.status(405).json({ message: 'Method not allowed' });
  }
}
