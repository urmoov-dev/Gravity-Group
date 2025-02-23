import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
    try {
        // Aqui você pode adicionar a lógica para salvar o aceite dos termos no banco de dados
        // Por enquanto, vamos apenas definir um cookie
        cookies.set('terms_accepted', 'true', {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 ano
            httpOnly: false, // Permitir acesso via JavaScript
            secure: false, // Permitir HTTP em desenvolvimento
            sameSite: 'lax' // Mais permissivo que 'strict'
        });

        return json({ success: true });
    } catch (error) {
        console.error('Erro ao processar aceite dos termos:', error);
        return json({ error: 'Erro ao processar aceite dos termos' }, { status: 500 });
    }
} 