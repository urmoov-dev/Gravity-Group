import { OPENAI_API_KEY } from '$env/static/private';
import OPENAI from 'openai';

const response = await fetch('https://api.openai.com/v1/some-endpoint', {
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
});

const openai = new OPENAI({
  apiKey: OPENAI_API_KEY, // Certifique-se de que a variável está correta
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
      model: "gpt-4o",
      store: true,
      messages: [
          {"role": "user", "content": prompt}
      ],
      max_tokens: 300,
    });

    console.log(completion.choices[0].message.content)
    return new Response(JSON.stringify({ answer: completion.choices[0].message.content }), {
      status: 500,
    });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return new Response(JSON.stringify({ error: "OpenAI API error" }), {
      status: 500,
    });
  }
}
