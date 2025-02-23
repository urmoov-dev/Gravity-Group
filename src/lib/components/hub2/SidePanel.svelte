<!-- SidePanel.svelte -->
<script lang="ts">
    export let position: 'left' | 'right';

    // Dados de exemplo (em produção viriam do backend)
    const marketData = {
        indices: [
            { name: 'IBOV', value: 130750.25, change: 1.25 },
            { name: 'S&P500', value: 5200.75, change: -0.45 },
            { name: 'NASDAQ', value: 16300.50, change: 0.85 }
        ],
        currencies: [
            { name: 'USD/BRL', value: 4.95, change: -0.30 },
            { name: 'EUR/BRL', value: 5.35, change: 0.15 },
            { name: 'BTC/USD', value: 52000.00, change: 2.50 }
        ]
    };

    const systemStatus = {
        cpu: 45,
        memory: 62,
        network: 78,
        security: 98
    };

    function formatNumber(value: number, decimals: number = 2): string {
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function getChangeColor(change: number): string {
        return change >= 0 ? 'text-green-400' : 'text-red-400';
    }

    function getStatusColor(value: number): string {
        if (value >= 90) return 'bg-green-500';
        if (value >= 70) return 'bg-blue-500';
        if (value >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    }
</script>

<div class="side-panel w-64 p-4 bg-black/30 backdrop-blur-sm border-{position === 'left' ? 'r' : 'l'} border-blue-500/20">
    <!-- Cabeçalho do Painel -->
    <div class="mb-6">
        <div class="text-blue-400 text-sm font-mono mb-1">
            {position.toUpperCase()} CONTROL
        </div>
        <div class="h-0.5 bg-blue-500/30"></div>
    </div>

    {#if position === 'left'}
        <!-- Painel Esquerdo: Dados de Mercado -->
        <div class="space-y-6">
            <!-- Índices -->
            <div class="panel-section">
                <h3 class="text-blue-400 text-xs font-mono mb-2">MARKET INDICES</h3>
                <div class="space-y-2">
                    {#each marketData.indices as index}
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400">{index.name}</span>
                            <div class="text-right">
                                <div class="text-white">{formatNumber(index.value)}</div>
                                <div class={getChangeColor(index.change)}>
                                    {index.change > 0 ? '+' : ''}{index.change}%
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Moedas -->
            <div class="panel-section">
                <h3 class="text-blue-400 text-xs font-mono mb-2">CURRENCY RATES</h3>
                <div class="space-y-2">
                    {#each marketData.currencies as currency}
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400">{currency.name}</span>
                            <div class="text-right">
                                <div class="text-white">{formatNumber(currency.value)}</div>
                                <div class={getChangeColor(currency.change)}>
                                    {currency.change > 0 ? '+' : ''}{currency.change}%
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {:else}
        <!-- Painel Direito: Status do Sistema -->
        <div class="space-y-6">
            <div class="panel-section">
                <h3 class="text-blue-400 text-xs font-mono mb-2">SYSTEM STATUS</h3>
                <div class="space-y-4">
                    {#each Object.entries(systemStatus) as [key, value]}
                        <div>
                            <div class="flex justify-between text-xs mb-1">
                                <span class="text-gray-400">{key.toUpperCase()}</span>
                                <span class="text-white">{value}%</span>
                            </div>
                            <div class="h-1 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    class="{getStatusColor(value)} h-full transition-all duration-500"
                                    style="width: {value}%"
                                ></div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Alertas e Notificações -->
            <div class="panel-section">
                <h3 class="text-blue-400 text-xs font-mono mb-2">ALERTS</h3>
                <div class="space-y-2">
                    <div class="flex items-center text-green-400 text-sm">
                        <span class="mr-2">●</span>
                        <span>All systems operational</span>
                    </div>
                    <div class="flex items-center text-yellow-400 text-sm">
                        <span class="mr-2">●</span>
                        <span>Market volatility high</span>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .side-panel {
        animation: panelSlide 0.5s ease-out forwards;
    }

    .panel-section {
        position: relative;
        padding: 1rem;
        background: rgba(0, 30, 60, 0.3);
        border: 1px solid rgba(0, 255, 255, 0.1);
        border-radius: 0.5rem;
    }

    .panel-section::before {
        content: '';
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border-radius: 0.5rem;
        background: linear-gradient(45deg, 
            rgba(0, 255, 255, 0.1),
            transparent 40%,
            transparent 60%,
            rgba(0, 255, 255, 0.1)
        );
        pointer-events: none;
    }

    @keyframes panelSlide {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
</style> 