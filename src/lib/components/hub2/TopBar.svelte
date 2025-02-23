<!-- TopBar.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    export let activeSection: string;

    // Seções de navegação
    const sections = [
        { id: 'overview', label: 'OVERVIEW', icon: '📊' },
        { id: 'portfolio', label: 'PORTFOLIO', icon: '💼' },
        { id: 'market', label: 'MARKET', icon: '📈' },
        { id: 'analysis', label: 'ANALYSIS', icon: '🔍' },
        { id: 'settings', label: 'SETTINGS', icon: '⚙️' }
    ];

    // Status do sistema
    let systemTime = new Date();
    let pingStatus = 'ONLINE';
    let connectionStrength = 100;

    // Atualizar tempo e status
    onMount(() => {
        const timer = setInterval(() => {
            systemTime = new Date();
            connectionStrength = 85 + Math.random() * 15;
        }, 1000);

        return () => clearInterval(timer);
    });

    function formatTime(date: Date): string {
        return date.toLocaleTimeString('pt-BR', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    function getConnectionClass(strength: number): string {
        if (strength >= 90) return 'text-green-400';
        if (strength >= 70) return 'text-blue-400';
        return 'text-yellow-400';
    }
</script>

<div class="top-bar h-16 bg-black/30 backdrop-blur-sm border-b border-blue-500/20 px-4">
    <div class="h-full flex items-center justify-between">
        <!-- Navegação Principal -->
        <nav class="flex space-x-6">
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
        </nav>

        <!-- Status do Sistema -->
        <div class="flex items-center space-x-6 font-mono text-sm">
            <!-- Tempo do Sistema -->
            <div class="flex items-center space-x-2">
                <span class="text-gray-400">SYS TIME</span>
                <span class="text-blue-400">{formatTime(systemTime)}</span>
            </div>

            <!-- Status da Conexão -->
            <div class="flex items-center space-x-2">
                <span class="text-gray-400">STATUS</span>
                <span class="text-green-400">{pingStatus}</span>
            </div>

            <!-- Força da Conexão -->
            <div class="flex items-center space-x-2">
                <span class="text-gray-400">SIGNAL</span>
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
        </div>
    </div>
</div>

<style>
    .top-bar {
        animation: topBarSlide 0.5s ease-out forwards;
    }

    @keyframes topBarSlide {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

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