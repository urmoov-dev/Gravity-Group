import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get('session');
    const onboardingCompleted = event.cookies.get('onboarding_completed');
    const path = event.url.pathname;

    console.log('Current path:', path);
    console.log('Session:', !!sessionCookie);
    console.log('Onboarding completed:', !!onboardingCompleted);

    // Rotas que não precisam de autenticação
    const publicRoutes = ['/login', '/', '/api'];

    // Rotas de onboarding que são sempre permitidas se autenticado
    const onboardingRoutes = [
        '/onboarding',
        '/terms-rejected'
    ];

    // Se não está autenticado e não é página pública, redireciona para login
    if (!sessionCookie && !publicRoutes.some(route => path.startsWith(route))) {
        console.log('Redirecionando para login (não autenticado)');
        return new Response(null, {
            status: 302,
            headers: { Location: '/login' }
        });
    }

    // Se está autenticado, verifica o fluxo de onboarding
    if (sessionCookie && !path.startsWith('/api')) {
        // Se estiver na página inicial, redireciona para o próximo passo necessário
        if (path === '/') {
            if (!onboardingCompleted) {
                console.log('Redirecionando página inicial para onboarding');
                return new Response(null, {
                    status: 302,
                    headers: { Location: '/onboarding' }
                });
            } else {
                console.log('Redirecionando página inicial para hub');
                return new Response(null, {
                    status: 302,
                    headers: { Location: '/hub' }
                });
            }
        }

        // Não permitir acesso a outras páginas se não completou onboarding
        // (o onboarding já inclui a aceitação dos termos)
        if (!onboardingCompleted && !onboardingRoutes.some(route => path.startsWith(route))) {
            console.log('Forçando redirecionamento para onboarding');
            return new Response(null, {
                status: 302,
                headers: { Location: '/onboarding' }
            });
        }
    }

    const response = await resolve(event);
    
    // Adicionar headers para prevenir cache
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
} 