<script>
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    onMount(() => {
        if (browser) {
            // Redirecionar para o onboarding, que agora inclui os termos
            goto('/onboarding');
        }
    });

    function handleClick() {
        goto('/onboarding');
    }
</script>

<div class="min-h-screen bg-black flex items-center justify-center p-4">
    <div class="bg-gray-900 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <h1 class="text-2xl font-bold text-white mb-4">Redirecionando...</h1>
        <p class="text-gray-300 mb-4">
            A verificação de termos agora faz parte do processo de onboarding.
            Você será redirecionado automaticamente.
        </p>
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <button 
            class="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            on:click={handleClick}
        >
            Clique aqui se não for redirecionado
        </button>
    </div>
</div> 