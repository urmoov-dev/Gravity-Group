import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  // Lógica para buscar produtos
  const products = [
    // Seus dados de produtos aqui
  ];

  return json(products);
}

export async function POST({ request }) {
  // Lógica para criar novo produto
  const data = await request.json();
  
  // Processar dados...
  
  return json({ success: true });
} 