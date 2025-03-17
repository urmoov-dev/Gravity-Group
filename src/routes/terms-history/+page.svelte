<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { terms } from '$lib/stores/terms';
    import { user } from '$lib/stores/auth';
    import { auth } from '$lib/firebase';

    interface HistoryItem {
        version: string;
        acceptedAt: Date;
    }

    let historyItems: HistoryItem[] = [];
    let loading = true;

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (!firebaseUser) {
                goto('/login');
            }
        });

        // Carregar o histórico
        historyItems = terms.history.get().sort((a, b) => 
            new Date(b.acceptedAt).getTime() - new Date(a.acceptedAt).getTime()
        );
        loading = false;

        return () => {
            unsubscribe();
        };
    });

    function formatDate(dateString: string | Date): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function handleViewTermsVersion(version: string) {
        if (version === terms.getCurrentVersion()) {
            alert(`Você aceitou a versão ${version} dos Termos de Serviço durante o onboarding.`);
        } else {
            const historyItem = historyItems.find(item => item.version === version);
            if (historyItem) {
                alert(`Você aceitou a versão ${version} dos Termos de Serviço em ${formatDate(historyItem.acceptedAt)}.`);
            }
        }
    }

    function handleBack() {
        goto('/profile');
    }
</script>

<div class="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
        <div class="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800">
            <div class="p-6 border-b border-gray-800 flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-white">Histórico de Termos de Serviço</h1>
                    <p class="text-gray-400 mt-1">Registro de todos os termos que você aceitou</p>
                </div>
                <button
                    on:click={handleBack}
                    class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Voltar
                </button>
            </div>

            <div class="p-6">
                {#if loading}
                    <div class="flex justify-center py-12">
                        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                {:else if historyItems.length === 0}
                    <div class="text-center py-12 text-gray-400">
                        <p>Nenhum registro de aceitação de termos encontrado.</p>
                    </div>
                {:else}
                    <div class="space-y-6">
                        {#each historyItems as item, index}
                            <div class="bg-gray-800 rounded-lg p-5 border border-gray-700">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h3 class="text-lg font-semibold text-white">Versão {item.version}</h3>
                                        <p class="text-gray-400 mt-1">Aceito em: {formatDate(item.acceptedAt)}</p>
                                    </div>
                                    <button
                                        on:click={() => handleViewTermsVersion(item.version)}
                                        class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-500 transition-colors"
                                    >
                                        Visualizar
                                    </button>
                                </div>
                                {#if index === 0}
                                    <div class="mt-2">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800">
                                            Versão atual
                                        </span>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div> 