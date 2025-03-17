<!-- PilotStatusPanel.svelte -->
<script lang="ts">
    import { profile } from '$lib/stores/profile';
    import { currentLevel } from '$lib/stores/level';
    import { goto } from '$app/navigation';
    import HologramDisplay from '../HologramDisplay.svelte';

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
                    <span class="text-gray-400">Nível Atual</span>
                    <span class="text-white">{$profile.currentLevel.name}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-400">Simulando</span>
                    <span class="text-cyan-400 font-bold">{$currentLevel.name}</span>
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