<!-- SimplifiedTopBar.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    
    let currentTime = new Date();
    
    onMount(() => {
        const timer = setInterval(() => {
            currentTime = new Date();
        }, 1000);

        return () => clearInterval(timer);
    });

    $: formattedTime = currentTime.toLocaleTimeString('pt-BR');
    $: formattedDate = currentTime.toLocaleDateString('pt-BR');
</script>

<div class="relative z-20">
    <!-- Barra superior com gradiente e blur -->
    <div class="bg-black/40 backdrop-blur-xl border-b border-blue-500/20">
        <!-- Barra superior simplificada -->
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <div class="text-blue-400 font-bold text-xl">Gravity Group</div>
            </div>

            <!-- Data e Hora -->
            <div class="flex items-center space-x-4 text-sm">
                <div class="text-blue-400 font-mono">{formattedTime}</div>
                <div class="text-gray-400">{formattedDate}</div>
            </div>
        </div>
    </div>

    <!-- Linha de gradiente -->
    <div class="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
</div> 