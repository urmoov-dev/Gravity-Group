import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get('session');
    const termsAccepted = event.cookies.get('terms_accepted');
    const path = event.url.pathname;

    // Se está autenticado e não aceitou os termos, só permite acesso à página de termos
    if (sessionCookie && !termsAccepted && path !== '/terms-of-service' && !path.startsWith('/api')) {
        return new Response(null, {
            status: 302,
            headers: { Location: '/terms-of-service' }
        });
    }

    // Se não está autenticado e não é página pública, redireciona para login
    if (!sessionCookie && path !== '/login' && path !== '/' && !path.startsWith('/api')) {
        return new Response(null, {
            status: 302,
            headers: { Location: '/login' }
        });
    }

    const response = await resolve(event);
    
    // Adicionar headers para prevenir cache
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
} 