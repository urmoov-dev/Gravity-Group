<script lang="ts">
    import { TopBar, CockpitWindow, HologramDisplay, PlanetaryBackground } from '$lib/components/hub2';
    import { profile } from '$lib/stores/profile';
    import { goto } from '$app/navigation';

    let activeSection = 'overview';

    function formatCurrency(value: number): string {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    function handleProfileClick() {
        goto('/profile');
    }
</script>

<div class="relative min-h-screen bg-black overflow-hidden">
    <!-- Background com efeito espacial -->
    <PlanetaryBackground />

    <!-- Interface do Cockpit -->
    <div class="relative z-10 min-h-screen flex flex-col">
        <!-- Barra superior com status -->
        <TopBar {activeSection} />

        <!-- Layout principal do cockpit -->
        <div class="flex-1 flex items-center justify-center p-8">
            <div class="cockpit-frame w-full h-[80vh] flex items-center justify-center gap-4">
                <!-- Janela Esquerda -->
                <CockpitWindow position="left">
                    <HologramDisplay>
                        <!-- Perfil e Status -->
                        <button 
                            on:click={handleProfileClick}
                            class="w-full text-left hover:scale-105 transition-transform duration-300"
                        >
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <h3 class="text-2xl font-bold text-blue-400">Status do Piloto</h3>
                                    <span class="text-4xl">{$profile.currentLevel.icon}</span>
                                </div>
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-gray-400">Nível</span>
                                        <span class="text-white">{$profile.currentLevel.name}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-gray-400">Investimento</span>
                                        <span class="text-white">{formatCurrency($profile.currentAmount)}</span>
                                    </div>
                                    {#if $profile.nextLevel}
                                        <div class="space-y-2">
                                            <div class="flex justify-between text-sm">
                                                <span class="text-gray-400">Próximo Nível</span>
                                                <span class="text-blue-400">{$profile.nextLevel.name}</span>
                                            </div>
                                            <div class="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                                                <div
                                                    class="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
                                                    style="width: {$profile.progressToNext}%"
                                                ></div>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </button>
                    </HologramDisplay>
                </CockpitWindow>

                <!-- Janela Central -->
                <CockpitWindow position="center">
                    <HologramDisplay>
                        <div class="space-y-6">
                            <h2 class="text-2xl font-bold text-blue-400">Radar de Mercado</h2>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                                    <h3 class="text-blue-400 mb-2">IBOVESPA</h3>
                                    <div class="text-2xl font-bold text-green-500">+1.8%</div>
                                    <div class="text-sm text-gray-400">118.250 pts</div>
                                </div>
                                <div class="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                                    <h3 class="text-blue-400 mb-2">S&P 500</h3>
                                    <div class="text-2xl font-bold text-red-500">-0.5%</div>
                                    <div class="text-sm text-gray-400">4.850 pts</div>
                                </div>
                            </div>
                        </div>
                    </HologramDisplay>
                </CockpitWindow>

                <!-- Janela Direita -->
                <CockpitWindow position="right">
                    <HologramDisplay>
                        <div class="space-y-6">
                            <h2 class="text-2xl font-bold text-blue-400">Análise Tática</h2>
                            <div class="space-y-4">
                                <div class="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                                    <h3 class="text-blue-400 mb-3">Alertas Prioritários</h3>
                                    <ul class="space-y-3">
                                        <li class="flex items-center space-x-3">
                                            <span class="text-green-500 text-2xl">▲</span>
                                            <div>
                                                <div class="text-white">PETR4</div>
                                                <div class="text-sm text-gray-400">Oportunidade de compra</div>
                                            </div>
                                        </li>
                                        <li class="flex items-center space-x-3">
                                            <span class="text-red-500 text-2xl">▼</span>
                                            <div>
                                                <div class="text-white">VALE3</div>
                                                <div class="text-sm text-gray-400">Alerta de venda</div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </HologramDisplay>
                </CockpitWindow>
            </div>
        </div>
    </div>
</div>

<style>
    .cockpit-frame {
        perspective: 1000px;
        transform-style: preserve-3d;
    }

    :global(.window-container) {
        animation: windowStartup 1.5s ease-out forwards;
    }

    @keyframes windowStartup {
        0% {
            opacity: 0;
            transform: perspective(2000px) translateZ(-300px) rotateX(-60deg);
        }
        50% {
            opacity: 0.5;
        }
        100% {
            opacity: 1;
            transform: perspective(2000px) translateZ(0) rotateX(0);
        }
    }
</style> 