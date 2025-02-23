/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Verificar se o usuário está autenticado e não aceitou os termos
  const isAuthenticated = event.cookies.get('session');
  const termsAccepted = event.cookies.get('terms_accepted');
  
  // Se o usuário está autenticado mas não aceitou os termos
  if (isAuthenticated && !termsAccepted && !event.url.pathname.startsWith('/terms-of-service') && !event.url.pathname.startsWith('/api')) {
    return Response.redirect(new URL('/terms-of-service', event.url.origin));
  }

  const response = await resolve(event);
  
  // Adicionar headers para prevenir cache
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
} 