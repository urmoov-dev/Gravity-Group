import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export async function POST({ request }) {
  try {
    const { message } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
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
