<script>
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase';

    onMount(() => {
        if (browser) {
            // Verificar se o usuário está autenticado
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (!user) {
                    // Se não estiver autenticado, redireciona para login
                    goto('/login');
                } else if (document.cookie.includes('terms_accepted=true')) {
                    // Se já aceitou os termos, redireciona para o hub
                    goto('/hub');
                }
            });

            return unsubscribe;
        }
    });
</script>

<slot />