<!-- TacticalAnalysisPanel.svelte -->
<script lang="ts">
    import HologramDisplay from '../HologramDisplay.svelte';
    
    // Dados de alertas (em produção viriam de uma API ou store)
    export let alertsData = [
        { symbol: 'PETR4', message: 'Oportunidade de compra', type: 'buy', icon: '▲', color: 'text-green-500' },
        { symbol: 'VALE3', message: 'Alerta de venda', type: 'sell', icon: '▼', color: 'text-red-500' }
    ];
</script>

<HologramDisplay>
    <div class="space-y-6">
        <h2 class="text-2xl font-bold text-blue-400">Análise Tática</h2>
        <div class="space-y-4">
            <div class="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                <h3 class="text-blue-400 mb-3">Alertas Prioritários</h3>
                <ul class="space-y-3">
                    {#each alertsData as alert}
                        <li class="flex items-center space-x-3">
                            <span class="{alert.color} text-2xl">{alert.icon}</span>
                            <div>
                                <div class="text-white">{alert.symbol}</div>
                                <div class="text-sm text-gray-400">{alert.message}</div>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</HologramDisplay> 