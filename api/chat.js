import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Set the runtime to edge to completely bypass Vercel's 10-second timeout limit
export const runtime = 'edge'; 

export async function POST(req: Request) {
  try {
    const { messages, prompt } = await req.json();

    // Dynamically capture the text whether it comes from a chat array or a single tool prompt
    let finalPrompt = prompt;
    if (messages && messages.length > 0) {
      finalPrompt = messages[messages.length - 1].content;
    }

    if (!finalPrompt) {
      return new Response(JSON.stringify({ error: 'No prompt or messages provided' }), { status: 400 });
    }

    // Stream the response token-by-token back to the browser
    const result = await streamText({
      model: google('gemini-1.5-flash'), 
      prompt: finalPrompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Backend Error:", error);
    return new Response(JSON.stringify({ error: 'Streaming execution failed' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
