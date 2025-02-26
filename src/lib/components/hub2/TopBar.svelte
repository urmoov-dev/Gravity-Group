<!-- TopBar.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    export let activeSection: string;

    const sections = [
        { id: 'overview', label: 'VISÃO GERAL', icon: '📊' },
        { id: 'portfolio', label: 'PORTFÓLIO', icon: '💼' },
        { id: 'market', label: 'MERCADO', icon: '📈' },
        { id: 'analysis', label: 'ANÁLISE', icon: '🔍' },
        { id: 'settings', label: 'AJUSTES', icon: '⚙️' }
    ];

    const stats = [
        { label: 'Status do Sistema', value: 'ONLINE', color: 'text-green-400' },
        { label: 'Integridade', value: '98%', color: 'text-blue-400' },
        { label: 'Latência', value: '45ms', color: 'text-blue-400' },
        { label: 'Conexão', value: 'SEGURA', color: 'text-green-400' }
    ];

    let currentTime = new Date();
    let connectionStrength = 100;
    
    onMount(() => {
        const timer = setInterval(() => {
            currentTime = new Date();
            connectionStrength = 85 + Math.random() * 15;
        }, 1000);

        return () => clearInterval(timer);
    });

    $: formattedTime = currentTime.toLocaleTimeString('pt-BR');
    $: formattedDate = currentTime.toLocaleDateString('pt-BR');

    function getConnectionClass(strength: number): string {
        if (strength >= 90) return 'text-green-400';
        if (strength >= 70) return 'text-blue-400';
        return 'text-yellow-400';
    }
</script>

<div class="relative z-20">
    <!-- Barra superior com gradiente e blur -->
    <div class="bg-black/40 backdrop-blur-xl border-b border-blue-500/20">
        <!-- Status do Sistema -->
        <div class="max-w-7xl mx-auto px-4 py-2">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-6">
                    {#each stats as stat}
                        <div class="flex items-center space-x-2">
                            <span class="text-gray-400 text-sm">{stat.label}:</span>
                            <span class="font-mono {stat.color} text-sm flex items-center">
                                <span class="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
                                {stat.value}
                            </span>
                        </div>
                    {/each}
                </div>

                <!-- Data e Hora -->
                <div class="flex items-center space-x-4 text-sm">
                    <div class="text-blue-400 font-mono">{formattedTime}</div>
                    <div class="text-gray-400">{formattedDate}</div>
                </div>
            </div>
        </div>

        <!-- Navegação Principal -->
        <nav class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex space-x-6">
                {#each sections as section}
                    <button
                        class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300
                               {activeSection === section.id ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'}"
                        on:click={() => activeSection = section.id}
                    >
                        <span class="text-lg">{section.icon}</span>
                        <span class="font-mono text-sm">{section.label}</span>
                    </button>
                {/each}
            </div>

            <!-- Força da Conexão -->
            <div class="flex items-center space-x-2">
                <span class="text-gray-400 text-sm">SINAL</span>
                <div class="flex space-x-0.5">
                    {#each Array(4) as _, i}
                        <div 
                            class="w-1 h-3 rounded-sm transition-all duration-300 {
                                connectionStrength > (i + 1) * 25 
                                    ? getConnectionClass(connectionStrength)
                                    : 'bg-gray-600'
                            }"
                        ></div>
                    {/each}
                </div>
            </div>
        </nav>
    </div>

    <!-- Linha de gradiente -->
    <div class="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
</div>

<style>
    button {
        position: relative;
        overflow: hidden;
    }

    button::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 5px;
        background: rgba(0, 255, 255, 0.3);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1);
        transition: all 0.5s ease-out;
    }

    button:hover::after {
        opacity: 1;
        transform: scale(20);
    }

    button:active::after {
        opacity: 0;
        transform: scale(1);
        transition: 0s;
    }
</style> 