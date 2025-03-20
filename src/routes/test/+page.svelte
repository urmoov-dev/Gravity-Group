<script lang="ts">
    import { onMount } from 'svelte';
    import { runTests } from '$lib/firebase/test';
    import UnifiedLayout from '$lib/components/UnifiedLayout.svelte';
    import GravityCard from '$lib/components/GravityCard.svelte';

    let loading = false;
    let lightMode = false;
    let logs: string[] = [];
    const accentColor = '#3b82f6';
    const activeSection = 'test';

    // Sobrescreve o console.log para capturar os logs
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
        originalLog(...args);
        logs = [...logs, args.join(' ')];
    };

    console.error = (...args) => {
        originalError(...args);
        logs = [...logs, `🔴 ERRO: ${args.join(' ')}`];
    };

    async function handleRunTests() {
        try {
            loading = true;
            logs = [];
            await runTests();
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        // Restaura o console original quando o componente é desmontado
        return () => {
            console.log = originalLog;
            console.error = originalError;
        };
    });
</script>

<UnifiedLayout {activeSection} {lightMode} {accentColor}>
    <div class="container mx-auto p-6">
        <GravityCard title="Testes do Firebase" {lightMode} {accentColor}>
            <div class="mb-4">
                <button
                    on:click={handleRunTests}
                    disabled={loading}
                    class="px-6 py-3 rounded-lg text-white font-medium transition-colors"
                    style:background-color={accentColor}
                    style:opacity={loading ? "0.7" : "1"}
                >
                    {loading ? 'Executando testes...' : 'Executar Testes'}
                </button>
            </div>

            <div class="logs-container" class:light-mode={lightMode}>
                {#each logs as log}
                    <div class="log-entry">
                        {log}
                    </div>
                {/each}
            </div>
        </GravityCard>
    </div>
</UnifiedLayout>

<style>
    .logs-container {
        background-color: #1a1a1a;
        border-radius: 0.5rem;
        padding: 1rem;
        font-family: monospace;
        max-height: 500px;
        overflow-y: auto;
        color: #fff;
    }

    .logs-container.light-mode {
        background-color: #f5f5f5;
        color: #1a1a1a;
    }

    .log-entry {
        padding: 0.25rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .light-mode .log-entry {
        border-bottom-color: rgba(0, 0, 0, 0.1);
    }
</style> 