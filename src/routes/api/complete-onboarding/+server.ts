import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, request }) => {
    try {
        const { userName, userRole, userObjective } = await request.json();
        const completionDate = new Date().toISOString();
        
        // Salvar os dados do onboarding
        cookies.set('onboarding_completed', 'true', {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 ano
            httpOnly: false,
            secure: false,
            sameSite: 'lax'
        });

        cookies.set('user_name', userName, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            httpOnly: false,
            secure: false,
            sameSite: 'lax'
        });

        cookies.set('user_role', userRole, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            httpOnly: false,
            secure: false,
            sameSite: 'lax'
        });

        cookies.set('user_objective', userObjective, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            httpOnly: false,
            secure: false,
            sameSite: 'lax'
        });

        cookies.set('onboarding_completion_date', completionDate, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            httpOnly: false,
            secure: false,
            sameSite: 'lax'
        });

        return json({ success: true, completionDate });
    } catch (error) {
        console.error('Erro ao processar dados do onboarding:', error);
        return json({ error: 'Erro ao processar dados do onboarding' }, { status: 500 });
    }
} 