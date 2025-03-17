<!-- LevelController.svelte -->
<script lang="ts">
    import { currentLevel } from '$lib/stores/level';
    import { ASTRONOMICAL_LEVELS } from '$lib/types/profile';
    import { fade, slide } from 'svelte/transition';

    let isOpen = false;

    function togglePanel() {
        isOpen = !isOpen;
    }

    function selectLevel(levelId: number) {
        currentLevel.setLevel(levelId);
    }
</script>

<div class="fixed bottom-4 right-4 z-50">
    <button
        class="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-105"
        on:click={togglePanel}
    >
        <span class="text-xl">🚀</span>
    </button>

    {#if isOpen}
        <div
            class="absolute bottom-16 right-0 w-64 bg-black/90 backdrop-blur-xl border border-blue-500/20 rounded-lg shadow-2xl p-4"
            transition:slide={{ duration: 300 }}
        >
            <h3 class="text-blue-400 font-bold mb-4">Modo Super Usuário</h3>
            <div class="space-y-2 max-h-96 overflow-y-auto">
                {#each ASTRONOMICAL_LEVELS as level}
                    <button
                        class="w-full text-left p-2 rounded transition-all duration-300 flex items-center space-x-2 {
                            $currentLevel.id === level.id
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'hover:bg-blue-500/10 text-gray-400 hover:text-white'
                        }"
                        on:click={() => selectLevel(level.id)}
                    >
                        <span class="text-2xl">{level.icon}</span>
                        <div class="flex-1">
                            <div class="font-medium">{level.name}</div>
                            <div class="text-xs opacity-75">
                                Min: {level.requiredAmount.toLocaleString('pt-BR')}
                            </div>
                        </div>
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div> 