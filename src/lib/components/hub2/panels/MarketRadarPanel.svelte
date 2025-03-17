<!-- MarketRadarPanel.svelte -->
<script lang="ts">
    import HologramDisplay from '../HologramDisplay.svelte';
    
    // Dados de mercado (em produção viriam de uma API ou store)
    export let marketData = {
        indices: [
            { name: 'IBOVESPA', value: 118250, change: 1.8, color: 'text-green-500' },
            { name: 'S&P 500', value: 4850, change: -0.5, color: 'text-red-500' }
        ]
    };
</script>

<HologramDisplay>
    <div class="space-y-6">
        <h2 class="text-2xl font-bold text-blue-400">Radar de Mercado</h2>
        <div class="grid grid-cols-2 gap-4">
            {#each marketData.indices as index}
                <div class="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                    <h3 class="text-blue-400 mb-2">{index.name}</h3>
                    <div class="text-2xl font-bold {index.color}">{index.change > 0 ? '+' : ''}{index.change}%</div>
                    <div class="text-sm text-gray-400">{index.value.toLocaleString('pt-BR')} pts</div>
                </div>
            {/each}
        </div>
    </div>
</HologramDisplay> 