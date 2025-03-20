<script lang="ts">
    import UnifiedLayout from '$lib/components/UnifiedLayout.svelte';
    import GravityCard from '$lib/components/GravityCard.svelte';
    import { profile } from '$lib/stores/profile';
    import { goto } from '$app/navigation';

    let activeSection = 'overview';
    
    // Define se usamos o tema claro ou escuro (false = escuro)
    let lightMode = false;
    
    // Cor de destaque da aplicação
    const accentColor = '#3b82f6'; // Azul

    function formatCurrency(value: number): string {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    function formatPercentage(value: number): string {
        return value.toLocaleString('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        });
    }

    function handleProfileClick() {
        goto('/profile');
    }
</script>

<UnifiedLayout {activeSection} {lightMode} {accentColor}>
    <div class="container mx-auto p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Painel de Status do Piloto -->
            <GravityCard 
                title="Status do Piloto" 
                {lightMode} 
                {accentColor}
                height="100%"
            >
                <!-- Perfil e Status -->
                <button 
                    on:click={handleProfileClick}
                    class="w-full text-left hover:scale-105 transition-transform duration-300"
                >
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="text-4xl">{$profile.currentLevel.icon}</span>
                                <span class="text-lg font-medium">{$profile.currentLevel.name}</span>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class={lightMode ? "text-black/60" : "text-white/60"}>Investimento</span>
                                <span class="font-medium">{formatCurrency($profile.currentAmount)}</span>
                            </div>
                            {#if $profile.nextLevel}
                                <div class="space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span class={lightMode ? "text-black/60" : "text-white/60"}>Próximo Nível</span>
                                        <span style:color={accentColor}>{$profile.nextLevel.name}</span>
                                    </div>
                                    <div class="h-2 rounded-full overflow-hidden" style:background-color={lightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}>
                                        <div
                                            class="h-full transition-all duration-1000"
                                            style:background-color={accentColor}
                                            style:width={`${$profile.progressToNext}%`}
                                        ></div>
                                    </div>
                                </div>
                            {/if}
                            
                            <!-- Detalhes adicionais -->
                            <div class="mt-4 pt-4 border-t" style:border-color={lightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}>
                                <div class="flex justify-between items-center mb-2">
                                    <span class={lightMode ? "text-black/60" : "text-white/60"}>Nível de Risco</span>
                                    <span class="text-amber-500">Moderado</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class={lightMode ? "text-black/60" : "text-white/60"}>Meta Anual</span>
                                    <span style:color={accentColor}>65% alcançado</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            </GravityCard>

            <!-- Radar de Mercado -->
            <GravityCard 
                title="Radar de Mercado" 
                {lightMode} 
                {accentColor}
                height="100%"
            >
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 rounded-lg border" style:border-color={lightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"} style:background-color={lightMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}>
                        <div class="mb-2" style:color={accentColor}>IBOVESPA</div>
                        <div class="text-2xl font-bold text-green-500">+1.8%</div>
                        <div class="text-sm" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.6">118.250 pts</div>
                    </div>
                    <div class="p-4 rounded-lg border" style:border-color={lightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"} style:background-color={lightMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}>
                        <div class="mb-2" style:color={accentColor}>S&P 500</div>
                        <div class="text-2xl font-bold text-red-500">-0.5%</div>
                        <div class="text-sm" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.6">4.850 pts</div>
                    </div>
                    
                    <!-- Indicadores adicionais -->
                    <div class="p-4 rounded-lg border" style:border-color={lightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"} style:background-color={lightMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}>
                        <div class="mb-2" style:color={accentColor}>DÓLAR</div>
                        <div class="text-2xl font-bold text-red-500">+0.3%</div>
                        <div class="text-sm" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.6">R$ 5,15</div>
                    </div>
                    <div class="p-4 rounded-lg border" style:border-color={lightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"} style:background-color={lightMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}>
                        <div class="mb-2" style:color={accentColor}>BITCOIN</div>
                        <div class="text-2xl font-bold text-green-500">+2.1%</div>
                        <div class="text-sm" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.6">US$ 68.750</div>
                    </div>
                </div>
            </GravityCard>

            <!-- Análise Tática -->
            <GravityCard 
                title="Análise Tática" 
                {lightMode} 
                {accentColor}
                height="100%"
            >
                <div class="space-y-4">
                    <div class="p-4 rounded-lg border" style:border-color={lightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"} style:background-color={lightMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}>
                        <h3 class="mb-3" style:color={accentColor}>Alertas Prioritários</h3>
                        <ul class="space-y-3">
                            <li class="flex items-center space-x-3">
                                <span class="text-green-500 text-2xl">▲</span>
                                <div>
                                    <div class="font-medium">PETR4</div>
                                    <div class="text-sm" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.6">Oportunidade de compra</div>
                                </div>
                            </li>
                            <li class="flex items-center space-x-3">
                                <span class="text-red-500 text-2xl">▼</span>
                                <div>
                                    <div class="font-medium">VALE3</div>
                                    <div class="text-sm" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.6">Alerta de venda</div>
                                </div>
                            </li>
                            <li class="flex items-center space-x-3">
                                <span class="text-amber-500 text-2xl">▶</span>
                                <div>
                                    <div class="font-medium">WEGE3</div>
                                    <div class="text-sm" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.6">Monitorar desdobramento</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </GravityCard>
        </div>
        
        <!-- Segunda fileira - Gráficos e Análises -->
        <div class="mt-6">
            <GravityCard 
                title="Desempenho da Carteira" 
                {lightMode} 
                {accentColor}
                height="auto"
            >
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <span class="text-3xl font-bold" style:color={accentColor}>+12.4%</span>
                        <span class="ml-2 text-sm" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.6">nos últimos 30 dias</span>
                    </div>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 rounded-full text-sm border" style:border-color={`${accentColor}40`} style:color={accentColor}>1M</button>
                        <button class="px-3 py-1 rounded-full text-sm" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.6">3M</button>
                        <button class="px-3 py-1 rounded-full text-sm" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.6">1A</button>
                        <button class="px-3 py-1 rounded-full text-sm" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.6">5A</button>
                    </div>
                </div>
                
                <!-- Simulação de gráfico -->
                <div class="relative h-64 mt-4 rounded-lg overflow-hidden" style:background-color={lightMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}>
                    <div class="absolute inset-0 flex items-center justify-center" class:text-black={lightMode} class:text-white={!lightMode} style:opacity="0.6">
                        Carregando gráfico...
                    </div>
                </div>
            </GravityCard>
        </div>
    </div>
</UnifiedLayout> 