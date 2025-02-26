<script lang="ts">
    import { profile } from '$lib/stores/profile';
    import { fade, fly, slide } from 'svelte/transition';
    import { ASTRONOMICAL_LEVELS } from '$lib/types/profile';

    // Encontrar o índice do nível atual
    $: currentLevelIndex = ASTRONOMICAL_LEVELS.findIndex(level => level.id === $profile.currentLevel.id);

    // Estado para controlar qual nível está expandido
    let expandedLevel: number | null = null;
    $: selectedLevel = expandedLevel !== null ? ASTRONOMICAL_LEVELS[expandedLevel] : null;

    // Formatar valor monetário
    function formatCurrency(value: number): string {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    // Função para expandir/recolher nível
    function toggleLevel(index: number) {
        expandedLevel = expandedLevel === index ? null : index;
    }
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Frame da Linha do Tempo -->
    <div class="lg:col-span-3 bg-black/30 backdrop-blur-lg rounded-xl border border-blue-500/20 overflow-hidden">
        <div class="p-6">
            <h2 class="text-xl font-semibold text-blue-400 mb-6">Linha do Tempo Astronômica</h2>
            <div class="relative">
                <!-- Linha base -->
                <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-900/50 via-blue-500/50 to-blue-900/50"></div>
                
                <!-- Níveis -->
                <div class="relative flex justify-between items-center min-h-[80px]">
                    {#each ASTRONOMICAL_LEVELS as level, index}
                        <button 
                            class="relative flex flex-col items-center group"
                            class:opacity-50={index > currentLevelIndex}
                            on:click={() => toggleLevel(index)}
                            title="{level.name} - {formatCurrency(level.requiredAmount)}"
                        >
                            <!-- Ícone do nível -->
                            <div 
                                class="w-14 h-14 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-300 cursor-pointer
                                       {index <= currentLevelIndex ? 'bg-blue-500 border-blue-300' : 'bg-gray-800 border-gray-700'} 
                                       {index === currentLevelIndex ? 'ring-2 ring-blue-400 ring-offset-4 ring-offset-black scale-110' : ''}"
                            >
                                <span class="text-2xl">{level.icon}</span>
                            </div>

                            <!-- Linha de progresso -->
                            {#if index < ASTRONOMICAL_LEVELS.length - 1}
                                <div 
                                    class="absolute top-7 left-[28px] h-0.5 transition-all duration-1000"
                                    style="width: calc(100% - 28px); 
                                           {index < currentLevelIndex ? 'background: linear-gradient(to right, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.8))' : ''}
                                           {index === currentLevelIndex ? `background: linear-gradient(to right, rgba(59, 130, 246, 0.8) ${$profile.progressToNext}%, rgba(31, 41, 55, 0.5) ${$profile.progressToNext}%)` : 'background: rgba(31, 41, 55, 0.5)'}"
                                ></div>
                            {/if}

                            <!-- Nome do nível -->
                            <div class="absolute -bottom-6 transform -translate-x-1/2 left-1/2 text-center">
                                <p class="text-sm font-medium text-gray-400 whitespace-nowrap">{level.name}</p>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <!-- Frame de Detalhes do Nível -->
    {#if selectedLevel}
        <div 
            class="lg:col-span-3 bg-black/30 backdrop-blur-lg rounded-xl border border-blue-500/20 overflow-hidden"
            in:fly={{ y: 20, duration: 300 }}
            out:fly={{ y: 20, duration: 200 }}
        >
            <div class="p-6">
                <div class="flex items-start justify-between mb-6">
                    <div class="flex items-center space-x-4">
                        <div class="text-4xl">{selectedLevel.icon}</div>
                        <div>
                            <h3 class="text-xl font-bold text-blue-400">{selectedLevel.name}</h3>
                            <p class="text-gray-400 text-sm font-mono">Massa: {selectedLevel.mass}</p>
                        </div>
                    </div>
                    <button 
                        class="text-gray-400 hover:text-white transition-colors"
                        on:click={() => toggleLevel(expandedLevel || 0)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Informações do Nível -->
                    <div class="space-y-4">
                        {#if expandedLevel !== null && expandedLevel <= currentLevelIndex}
                            <!-- Nível atual ou já alcançado -->
                            <div class="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                                <h4 class="text-blue-400 font-bold mb-2">Descrição</h4>
                                <p class="text-gray-300">{selectedLevel.description}</p>
                            </div>
                            <div class="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                                <h4 class="text-blue-400 font-bold mb-2">Missão</h4>
                                <p class="text-gray-300">{selectedLevel.mission}</p>
                            </div>
                        {:else}
                            <!-- Nível ainda não alcançado -->
                            <div class="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                                <h4 class="text-blue-400 font-bold mb-2">Próximo Objetivo</h4>
                                <p class="text-gray-300">Meta: {formatCurrency(selectedLevel.requiredAmount)}</p>
                                <div class="mt-4 flex items-center space-x-2">
                                    <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <span class="text-sm text-gray-400">Nível bloqueado</span>
                                </div>
                            </div>
                        {/if}
                    </div>

                    <!-- Status e Progresso -->
                    <div class="space-y-4">
                        <div class="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                            <h4 class="text-blue-400 font-bold mb-2">Status</h4>
                            {#if expandedLevel === currentLevelIndex}
                                <div class="space-y-4">
                                    <div>
                                        <p class="text-sm text-gray-400 mb-1">Progresso para próximo nível</p>
                                        <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                class="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000"
                                                style="width: {$profile.progressToNext}%"
                                            ></div>
                                        </div>
                                        <p class="text-right text-sm text-blue-400 mt-1">{$profile.progressToNext.toFixed(1)}%</p>
                                    </div>
                                </div>
                            {:else if expandedLevel !== null && expandedLevel < currentLevelIndex}
                                <div class="flex items-center space-x-2">
                                    <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span class="text-sm text-gray-400">Nível conquistado</span>
                                </div>
                            {:else}
                                <div class="flex items-center space-x-2">
                                    <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <span class="text-sm text-gray-400">Nível bloqueado</span>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Animação de pulso para o nível atual */
    .ring-2 {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1.1);
        }
        50% {
            opacity: .8;
            transform: scale(1);
        }
    }

    button {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    button:focus {
        outline: none;
    }
</style>