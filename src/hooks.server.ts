import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get('session');
    const termsAccepted = event.cookies.get('terms_accepted');
    const onboardingCompleted = event.cookies.get('onboarding_completed');
    const path = event.url.pathname;

    console.log('Current path:', path);
    console.log('Session:', !!sessionCookie);
    console.log('Onboarding completed:', !!onboardingCompleted);
    console.log('Terms accepted:', !!termsAccepted);

    // Rotas que não precisam de autenticação
    const publicRoutes = ['/login', '/', '/api'];

    // Se não está autenticado e não é página pública, redireciona para login
    if (!sessionCookie && !publicRoutes.some(route => path.startsWith(route))) {
        console.log('Redirecionando para login (não autenticado)');
        return new Response(null, {
            status: 302,
            headers: { Location: '/login' }
        });
    }

    // Se está autenticado, verifica o fluxo de onboarding e termos
    if (sessionCookie && !path.startsWith('/api')) {
        // Se estiver na página inicial, redireciona para o próximo passo necessário
        if (path === '/') {
            if (!onboardingCompleted) {
                console.log('Redirecionando página inicial para onboarding');
                return new Response(null, {
                    status: 302,
                    headers: { Location: '/onboarding' }
                });
            } else if (!termsAccepted) {
                console.log('Redirecionando página inicial para termos');
                return new Response(null, {
                    status: 302,
                    headers: { Location: '/terms-of-service' }
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
        if (!onboardingCompleted && !path.startsWith('/onboarding')) {
            console.log('Forçando redirecionamento para onboarding');
            return new Response(null, {
                status: 302,
                headers: { Location: '/onboarding' }
            });
        }

        // Se completou onboarding mas não aceitou os termos
        if (onboardingCompleted && !termsAccepted && !path.startsWith('/terms-of-service')) {
            console.log('Forçando redirecionamento para termos');
            return new Response(null, {
                status: 302,
                headers: { Location: '/terms-of-service' }
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