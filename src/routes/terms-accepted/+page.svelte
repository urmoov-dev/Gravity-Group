<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { auth } from '$lib/firebase';

    let loading = true;
    let countdown = 5;
    let termsAcceptanceDate = '';

    onMount(() => {
        // Verifica se está autenticado
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                goto('/login');
            }
        });

        // Recupera a data de aceite dos termos
        if (typeof document !== 'undefined') {
            const cookieDate = document.cookie.split('terms_acceptance_date=')[1]?.split(';')[0];
            if (cookieDate) {
                const date = new Date(decodeURIComponent(cookieDate));
                termsAcceptanceDate = date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        }

        // Inicia o contador regressivo
        loading = false;
        const timer = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(timer);
                goto('/hub');
            }
        }, 1000);

        return () => {
            unsubscribe();
            clearInterval(timer);
        };
    });
</script>

<div class="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-lg w-full bg-gray-900/60 backdrop-blur-lg rounded-xl shadow-2xl p-8 text-center space-y-6 border border-green-500/30">
        {#if loading}
            <div class="w-16 h-16 border-4 border-t-transparent border-green-500 rounded-full animate-spin mx-auto"></div>
        {:else}
            <div class="mx-auto w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            
            <h1 class="text-3xl font-bold text-white">Termos aceitos com sucesso!</h1>
            
            <p class="text-gray-300 text-lg leading-relaxed">
                Você aceitou os Termos de Serviço da plataforma Gravity Group em {termsAcceptanceDate}.
            </p>
            
            <p class="text-gray-300">
                Você agora tem acesso a todas as funcionalidades da plataforma. Bem-vindo ao Gravity Group!
            </p>
            
            <div class="pt-4">
                <p class="text-gray-400 mb-4">Redirecionando em {countdown} segundos...</p>
                <button
                    on:click={() => goto('/hub')}
                    class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                >
                    Ir para a plataforma agora
                </button>
            </div>
        {/if}
    </div>
</div> 