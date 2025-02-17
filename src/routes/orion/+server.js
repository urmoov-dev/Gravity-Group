import OPENAI from 'openai';
import {OPENAI_API_KEY} from "$env/static/private"


const openai = new OPENAI({
  apiKey: OPENAI_API_KEY, // Usando process.env diretamente
});

export async function POST({ request }) {
  const { prompt } = await request.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    return new Response(
      JSON.stringify({ answer: completion.choices[0].message.content }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return new Response(JSON.stringify({ error: "OpenAI API error" }), {
      status: 500,
    });
  }
}
