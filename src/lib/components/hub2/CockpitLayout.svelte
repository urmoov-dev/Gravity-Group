<!-- CockpitLayout.svelte -->
<script lang="ts">
    import { writable, type Writable } from 'svelte/store';
    import { fade, fly } from 'svelte/transition';
    import PlanetaryBackground from './PlanetaryBackground.svelte';

    // Estado de visibilidade dos painéis
    const leftPanelVisible = writable(true);
    const centerPanelVisible = writable(true);
    const rightPanelVisible = writable(true);

    // Configuração dos painéis disponíveis para cada janela
    const panels = {
        left: [
            { id: 'portfolio', title: 'Portfolio', icon: '📊', description: 'Visão geral do portfólio' },
            { id: 'performance', title: 'Performance', icon: '📈', description: 'Análise de desempenho' },
            { id: 'allocation', title: 'Alocação', icon: '🎯', description: 'Distribuição de ativos' }
        ],
        center: [
            { id: 'market', title: 'Mercado', icon: '🌐', description: 'Visão geral do mercado' },
            { id: 'opportunities', title: 'Oportunidades', icon: '💡', description: 'Oportunidades de investimento' },
            { id: 'news', title: 'Notícias', icon: '📰', description: 'Últimas notícias do mercado' }
        ],
        right: [
            { id: 'analysis', title: 'Análise', icon: '🔍', description: 'Análise de risco e recomendações' },
            { id: 'alerts', title: 'Alertas', icon: '🔔', description: 'Alertas e notificações' },
            { id: 'settings', title: 'Configurações', icon: '⚙️', description: 'Configurações do sistema' }
        ]
    };

    // Estado ativo de cada janela
    const leftPanel: Writable<string> = writable('portfolio');
    const centerPanel: Writable<string> = writable('market');
    const rightPanel: Writable<string> = writable('analysis');

    // Função para trocar o painel ativo
    function switchPanel(window: 'left' | 'center' | 'right', panelId: string) {
        switch(window) {
            case 'left':
                leftPanel.set(panelId);
                break;
            case 'center':
                centerPanel.set(panelId);
                break;
            case 'right':
                rightPanel.set(panelId);
                break;
        }
    }

    // Função para alternar visibilidade do painel
    function togglePanelVisibility(window: 'left' | 'center' | 'right') {
        switch(window) {
            case 'left':
                leftPanelVisible.update(v => !v);
                break;
            case 'center':
                centerPanelVisible.update(v => !v);
                break;
            case 'right':
                rightPanelVisible.update(v => !v);
                break;
        }
    }
</script>

<div class="relative w-full h-screen overflow-hidden bg-black">
    <!-- Fundo com planetas -->
    <PlanetaryBackground />

    <!-- Container principal do cockpit -->
    <div class="absolute inset-0 flex flex-col p-4 space-y-4">
        <!-- Barra superior com controles -->
        <div class="flex justify-between items-center h-12 px-4 bg-black/30 backdrop-blur-sm rounded-lg border border-blue-500/20">
            <div class="text-blue-400 font-mono">GRAVITY HUB 2.0</div>
            <div class="flex space-x-4">
                <button class="text-gray-400 hover:text-white transition-colors">
                    <span class="mr-2">👤</span> Profile
                </button>
                <button class="text-gray-400 hover:text-white transition-colors">
                    <span class="mr-2">⚙️</span> Settings
                </button>
                <button class="text-gray-400 hover:text-white transition-colors">
                    <span class="mr-2">❔</span> Help
                </button>
            </div>
        </div>

        <!-- Container das janelas -->
        <div class="flex-1 grid grid-cols-3 gap-4">
            <!-- Janela Esquerda -->
            <div class="relative flex flex-col">
                <!-- Conteúdo da janela -->
                <div class="flex-1 bg-black/10 backdrop-blur-sm rounded-lg border border-blue-500/20 window-content overflow-y-auto transition-opacity duration-300"
                     class:opacity-0={!$leftPanelVisible}>
                    {#if $leftPanelVisible}
                        <slot name="left-window" />
                    {/if}
                </div>

                <!-- Painel de controle -->
                <div class="mt-2 bg-black/30 backdrop-blur-md rounded-lg border border-blue-500/20 p-2">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-blue-400 font-mono">LEFT DISPLAY</span>
                        <button
                            class="text-sm px-2 py-1 rounded {$leftPanelVisible ? 'text-green-400' : 'text-red-400'}"
                            on:click={() => togglePanelVisibility('left')}
                        >
                            {$leftPanelVisible ? '👁️ ON' : '👁️ OFF'}
                        </button>
                    </div>
                    <div class="flex space-x-1">
                        {#each panels.left as panel}
                            <button
                                class="flex-1 px-2 py-1 text-sm rounded transition-all transform hover:scale-105 {
                                    $leftPanel === panel.id && $leftPanelVisible
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-black/50 text-gray-400 hover:text-white'
                                }"
                                on:click={() => switchPanel('left', panel.id)}
                            >
                                <span>{panel.icon}</span>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Janela Central -->
            <div class="relative flex flex-col">
                <!-- Conteúdo da janela -->
                <div class="flex-1 bg-black/10 backdrop-blur-sm rounded-lg border border-blue-500/20 window-content overflow-y-auto transition-opacity duration-300"
                     class:opacity-0={!$centerPanelVisible}>
                    {#if $centerPanelVisible}
                        <slot name="center-window" />
                    {/if}
                </div>

                <!-- Painel de controle -->
                <div class="mt-2 bg-black/30 backdrop-blur-md rounded-lg border border-blue-500/20 p-2">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-blue-400 font-mono">CENTER DISPLAY</span>
                        <button
                            class="text-sm px-2 py-1 rounded {$centerPanelVisible ? 'text-green-400' : 'text-red-400'}"
                            on:click={() => togglePanelVisibility('center')}
                        >
                            {$centerPanelVisible ? '👁️ ON' : '👁️ OFF'}
                        </button>
                    </div>
                    <div class="flex space-x-1">
                        {#each panels.center as panel}
                            <button
                                class="flex-1 px-2 py-1 text-sm rounded transition-all transform hover:scale-105 {
                                    $centerPanel === panel.id && $centerPanelVisible
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-black/50 text-gray-400 hover:text-white'
                                }"
                                on:click={() => switchPanel('center', panel.id)}
                            >
                                <span>{panel.icon}</span>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Janela Direita -->
            <div class="relative flex flex-col">
                <!-- Conteúdo da janela -->
                <div class="flex-1 bg-black/10 backdrop-blur-sm rounded-lg border border-blue-500/20 window-content overflow-y-auto transition-opacity duration-300"
                     class:opacity-0={!$rightPanelVisible}>
                    {#if $rightPanelVisible}
                        <slot name="right-window" />
                    {/if}
                </div>

                <!-- Painel de controle -->
                <div class="mt-2 bg-black/30 backdrop-blur-md rounded-lg border border-blue-500/20 p-2">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-blue-400 font-mono">RIGHT DISPLAY</span>
                        <button
                            class="text-sm px-2 py-1 rounded {$rightPanelVisible ? 'text-green-400' : 'text-red-400'}"
                            on:click={() => togglePanelVisibility('right')}
                        >
                            {$rightPanelVisible ? '👁️ ON' : '👁️ OFF'}
                        </button>
                    </div>
                    <div class="flex space-x-1">
                        {#each panels.right as panel}
                            <button
                                class="flex-1 px-2 py-1 text-sm rounded transition-all transform hover:scale-105 {
                                    $rightPanel === panel.id && $rightPanelVisible
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-black/50 text-gray-400 hover:text-white'
                                }"
                                on:click={() => switchPanel('right', panel.id)}
                            >
                                <span>{panel.icon}</span>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <!-- Barra inferior com informações adicionais -->
        <div class="h-12 px-4 bg-black/30 backdrop-blur-sm rounded-lg border border-blue-500/20 flex items-center justify-between">
            <div class="flex space-x-6 text-sm">
                <div class="text-gray-400">
                    <span class="text-blue-400 mr-2">●</span> Sistema Online
                </div>
                <div class="text-gray-400">
                    <span class="text-green-400 mr-2">●</span> Mercado Aberto
                </div>
                <div class="text-gray-400">
                    <span class="text-yellow-400 mr-2">●</span> 15 Alertas
                </div>
            </div>
            <div class="text-gray-400 text-sm">
                Última atualização: {new Date().toLocaleTimeString('pt-BR')}
            </div>
        </div>
    </div>
</div>

<style>
    .window-content {
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 150, 255, 0.3) transparent;
        padding: 1rem;
    }

    .window-content::-webkit-scrollbar {
        width: 6px;
    }

    .window-content::-webkit-scrollbar-track {
        background: transparent;
    }

    .window-content::-webkit-scrollbar-thumb {
        background-color: rgba(0, 150, 255, 0.3);
        border-radius: 3px;
    }
</style> 