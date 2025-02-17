import { apiConfig } from '$lib/config';

export async function getOrionResponse(message: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.openAiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Você é o Orion, um assistente financeiro especializado em investimentos. Você deve ser profissional mas amigável, e sempre responder em Português do Brasil."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao obter resposta do Orion:', error);
    return 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
  }
} 