<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase';
    import { TermsService } from '$lib/services/termsService';
    import type { UserTermsAcceptance, TermsVersion } from '$lib/types/terms';
    import { goto } from '$app/navigation';

    let acceptedTerms: (UserTermsAcceptance & { terms?: TermsVersion })[] = [];
    let loading = true;
    let error = '';

    onMount(async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                goto('/login');
                return;
            }

            // Carrega os termos aceitos pelo usuário
            const userAcceptances = await TermsService.getUserAcceptedTerms(user.uid);
            
            // Carrega os detalhes de cada versão dos termos
            const acceptancesWithTerms = await Promise.all(
                userAcceptances.map(async (acceptance) => {
                    const terms = await TermsService.getTermsById(acceptance.termsId);
                    return {
                        ...acceptance,
                        terms: terms || undefined
                    };
                })
            );

            acceptedTerms = acceptancesWithTerms.sort(
                (a, b) => b.acceptedAt.getTime() - a.acceptedAt.getTime()
            );
        } catch (e) {
            console.error('Erro ao carregar histórico de termos:', e);
            error = 'Erro ao carregar histórico de termos aceitos';
        } finally {
            loading = false;
        }
    });

    function formatDate(date: Date): string {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Histórico de Termos de Serviço</h1>

    {#if loading}
        <div class="flex justify-center items-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    {:else if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
        </div>
    {:else if acceptedTerms.length === 0}
        <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Você ainda não aceitou nenhum termo de serviço.
        </div>
    {:else}
        <div class="space-y-4">
            {#each acceptedTerms as acceptance}
                <div class="bg-white shadow rounded-lg p-6 border border-gray-200">
                    <div class="flex justify-between items-start">
                        <div>
                            <h2 class="text-xl font-semibold mb-2">
                                Versão {acceptance.terms?.version || 'Desconhecida'}
                            </h2>
                            <p class="text-gray-600">
                                Aceito em: {formatDate(acceptance.acceptedAt)}
                            </p>
                            {#if acceptance.terms?.effectiveDate}
                                <p class="text-gray-600">
                                    Data efetiva: {formatDate(acceptance.terms.effectiveDate)}
                                </p>
                            {/if}
                        </div>
                        <a
                            href="/terms/view/{acceptance.termsId}"
                            class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                        >
                            Visualizar
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <div class="mt-8">
        <a
            href="/hub2"
            class="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
            Voltar
        </a>
    </div>
</div>

<style>
    .container {
        max-width: 800px;
    }
</style> 