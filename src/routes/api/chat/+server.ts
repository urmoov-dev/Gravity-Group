import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { message } = await request.json();

    // Aqui você pode adicionar a lógica para processar a mensagem
    // Por exemplo, integração com OpenAI ou outro serviço de IA
    
    // Por enquanto, vamos criar uma resposta simples
    const responses = {
      investimentos: "Posso ajudar você com informações sobre investimentos na Gravity Group. Temos diferentes opções de investimento, incluindo Renda Fixa Internacional, Private Equity e Ativos Alternativos.",
      rendimentos: "Os rendimentos variam de acordo com o tipo de investimento. Por exemplo, nosso produto de Renda Fixa Internacional tem rendido em média 35% ao ano.",
      "como investir": "Para começar a investir na Gravity Group, você precisa criar uma conta e passar por um processo de verificação. Posso te ajudar com esse processo.",
      default: "Olá! Sou o Orion, assistente virtual da Gravity Group. Como posso ajudar você hoje?"
    };

    // Procura palavras-chave na mensagem
    const lowerMessage = message.toLowerCase();
    let response = responses.default;

    if (lowerMessage.includes('investimento')) {
      response = responses.investimentos;
    } else if (lowerMessage.includes('rendimento') || lowerMessage.includes('retorno')) {
      response = responses.rendimentos;
    } else if (lowerMessage.includes('como investir') || lowerMessage.includes('começar')) {
      response = responses['como investir'];
    }

    // Simula um pequeno delay para parecer mais natural
    await new Promise(resolve => setTimeout(resolve, 1000));

    return json({
      response
    });

  } catch (error) {
    console.error('Erro no processamento da mensagem:', error);
    return json(
      { error: 'Erro no processamento da mensagem' },
      { status: 500 }
    );
  }
}; 