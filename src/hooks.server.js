/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Verificar se o usuário está autenticado e não completou o onboarding
  const isAuthenticated = event.cookies.get('session');
  const onboardingCompleted = event.cookies.get('onboarding_completed');
  
  // Se o usuário está autenticado mas não completou o onboarding (que inclui termos)
  if (isAuthenticated && !onboardingCompleted && 
      !event.url.pathname.startsWith('/onboarding') && 
      !event.url.pathname.startsWith('/login') && 
      !event.url.pathname.startsWith('/api') &&
      !event.url.pathname.startsWith('/terms-rejected')) {
    return Response.redirect(new URL('/onboarding', event.url.origin));
  }

  const response = await resolve(event);
  
  // Adicionar headers para prevenir cache
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
} 