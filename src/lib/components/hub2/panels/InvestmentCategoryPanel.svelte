<!-- InvestmentCategoryPanel.svelte -->
<script lang="ts">
    import { profile } from '$lib/stores/profile';
    import { getCurrentCategory, getCategoryExample } from '$lib/stores/investment';
    import HologramDisplay from '../HologramDisplay.svelte';
    import { fade, slide } from 'svelte/transition';

    // Formatar valor monetário
    function formatCurrency(value: number): string {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    // Obter categoria atual baseada no valor investido
    $: currentCategory = $getCurrentCategory($profile.currentAmount);
    $: currentExample = currentCategory ? $getCategoryExample(currentCategory.id) : null;

    // Calcular progresso para próxima categoria
    $: progressToNext = currentCategory?.maxAmount
        ? Math.min(
              (($profile.currentAmount - currentCategory.minAmount) /
                  (currentCategory.maxAmount - currentCategory.minAmount)) *
                  100,
              100
          )
        : 100;
</script>

<HologramDisplay>
    {#if currentCategory && currentExample}
        <div class="space-y-6" in:fade>
            <!-- Cabeçalho -->
            <div class="flex items-center justify-between">
                <h3 class="text-2xl font-bold text-blue-400">Categoria de Investimento</h3>
                <span class="text-4xl">{currentExample.icon}</span>
            </div>

            <!-- Informações da Categoria -->
            <div class="space-y-4">
                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400">Nível</span>
                        <span class="text-white font-bold">{currentCategory.name}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400">Capital Investido</span>
                        <span class="text-white">{formatCurrency($profile.currentAmount)}</span>
                    </div>
                </div>

                <!-- Barra de Progresso -->
                {#if currentCategory.maxAmount}
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-400">Próximo Nível</span>
                            <span class="text-blue-400">{formatCurrency(currentCategory.maxAmount)}</span>
                        </div>
                        <div class="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                            <div
                                class="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
                                style="width: {progressToNext}%"
                            />
                        </div>
                    </div>
                {/if}

                <!-- Exemplo de Investimento -->
                <div class="mt-6 space-y-4 bg-gray-900/50 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-blue-300">
                        Exemplo de Investimento Disponível
                    </h4>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400">Produto</span>
                            <span class="text-white">{currentExample.name}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400">Risco</span>
                            <span
                                class="px-2 py-1 rounded text-sm"
                                class:bg-green-500/20={currentExample.risk === 'Baixo'}
                                class:text-green-400={currentExample.risk === 'Baixo'}
                                class:bg-yellow-500/20={currentExample.risk === 'Moderado'}
                                class:text-yellow-400={currentExample.risk === 'Moderado'}
                                class:bg-red-500/20={currentExample.risk === 'Alto'}
                                class:text-red-400={currentExample.risk === 'Alto'}
                            >
                                {currentExample.risk}
                            </span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400">Retorno Esperado</span>
                            <span class="text-cyan-400">{currentExample.expectedReturn}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-400">Investimento Mínimo</span>
                            <span class="text-white"
                                >{formatCurrency(currentExample.minimumInvestment)}</span
                            >
                        </div>
                    </div>
                    <p class="text-sm text-gray-400 mt-2">{currentExample.description}</p>
                </div>
            </div>
        </div>
    {:else}
        <div class="text-center text-gray-400 py-8">
            <p>Nenhuma categoria encontrada para o valor investido atual.</p>
        </div>
    {/if}
</HologramDisplay>

<style>
    /* Adicione estilos específicos aqui se necessário */
</style> 