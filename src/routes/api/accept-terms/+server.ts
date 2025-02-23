import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, request }) => {
    try {
        const { version } = await request.json();
        const acceptanceDate = new Date().toISOString();
        
        // Salvar o aceite com a versão e data
        cookies.set('terms_accepted', 'true', {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 ano
            httpOnly: false, // Permitir acesso via JavaScript
            secure: false, // Permitir HTTP em desenvolvimento
            sameSite: 'lax' // Mais permissivo que 'strict'
        });

        cookies.set('terms_version', version, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            httpOnly: false,
            secure: false,
            sameSite: 'lax'
        });

        cookies.set('terms_acceptance_date', acceptanceDate, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            httpOnly: false,
            secure: false,
            sameSite: 'lax'
        });

        return json({ success: true, version, acceptanceDate });
    } catch (error) {
        console.error('Erro ao processar aceite dos termos:', error);
        return json({ error: 'Erro ao processar aceite dos termos' }, { status: 500 });
    }
} 