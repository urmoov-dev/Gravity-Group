import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { get } from 'svelte/store';
import { terms } from '$lib/stores/terms';

export const load: LayoutLoad = async () => {
    const termsStore = get(terms);
    
    if (!termsStore.hasAccepted) {
        throw redirect(302, '/onboarding');
    }

    return {};
};

export const ssr = false;
export const csr = true;

// Desativa a pré-renderização
export const prerender = false; 