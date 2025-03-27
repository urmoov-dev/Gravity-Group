<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { auth } from '$lib/firebase';
    import { TermsService } from '$lib/services/termsService';
    import type { TermsVersion } from '$lib/types/terms';
    import { goto } from '$app/navigation';

    let terms: TermsVersion | null = null;
    let loading = true;
    let error = '';
    let userCanView = false;

    onMount(async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                goto('/login');
                return;
            }

            const termsId = $page.params.id;
            
            // Verifica se o usuário aceitou estes termos
            const userAcceptances = await TermsService.getUserAcceptedTerms(user.uid);
            userCanView = userAcceptances.some(acceptance => acceptance.termsId === termsId);

            if (!userCanView) {
                error = 'Você não tem permissão para visualizar estes termos';
                return;
            }

            // Carrega os termos
            terms = await TermsService.getTermsById(termsId);
            if (!terms) {
                error = 'Termos não encontrados';
            }
        } catch (e) {
            console.error('Erro ao carregar termos:', e);
            error = 'Erro ao carregar os termos de serviço';
        } finally {
            loading = false;
        }
    });

    function formatDate(date: Date): string {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    }
</script>

<div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
        {#if loading}
            <div class="flex justify-center items-center h-32">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        {:else if error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        {:else if terms}
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="p-6">
                    <div class="border-b pb-4 mb-4">
                        <h1 class="text-3xl font-bold mb-2">Termos de Serviço</h1>
                        <p class="text-gray-600">Versão {terms.version}</p>
                        <p class="text-gray-600">
                            Data efetiva: {formatDate(terms.effectiveDate)}
                        </p>
                    </div>
                    
                    <div class="prose max-w-none">
                        {@html terms.content}
                    </div>
                </div>
            </div>
        {/if}

        <div class="mt-8 flex justify-between">
            <a
                href="/terms/history"
                class="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
                Voltar ao Histórico
            </a>
            <a
                href="/hub2"
                class="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
                Voltar ao Hub
            </a>
        </div>
    </div>
</div>

<style>
    :global(.prose) {
        @apply text-gray-800;
    }
    :global(.prose h2) {
        @apply text-2xl font-bold mt-6 mb-4;
    }
    :global(.prose h3) {
        @apply text-xl font-semibold mt-4 mb-2;
    }
    :global(.prose p) {
        @apply mb-4;
    }
    :global(.prose ul) {
        @apply list-disc pl-6 mb-4;
    }
    :global(.prose ol) {
        @apply list-decimal pl-6 mb-4;
    }
    :global(.prose li) {
        @apply mb-2;
    }
</style> 