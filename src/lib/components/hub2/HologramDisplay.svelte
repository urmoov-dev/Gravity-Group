<!-- HologramDisplay.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';

    let container: HTMLDivElement;
    let isActive = false;

    onMount(() => {
        isActive = true;
        return () => {
            isActive = false;
        };
    });
</script>

<div class="hologram-container" class:active={isActive}>
    <!-- Efeito de escaneamento -->
    <div class="scan-effect"></div>
    
    <!-- Efeito de glitch -->
    <div class="glitch-effect"></div>
    
    <!-- Conteúdo -->
    <div class="content">
        <slot />
    </div>
</div>

<style>
    .hologram-container {
        position: relative;
        height: 100%;
        overflow: hidden;
        background: rgba(0, 20, 40, 0.3);
        border-radius: 0.5rem;
        box-shadow: 
            inset 0 0 30px rgba(0, 150, 255, 0.15),
            0 0 20px rgba(0, 150, 255, 0.1);
        opacity: 0;
        transform: scale(0.98);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .hologram-container.active {
        opacity: 1;
        transform: scale(1);
    }

    .content {
        position: relative;
        z-index: 10;
        padding: 1rem;
    }

    .scan-effect {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 150, 255, 0.1) 50%
        );
        background-size: 100% 4px;
        animation: scan 8s linear infinite;
        pointer-events: none;
    }

    .glitch-effect {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 150, 255, 0.2) 45%,
            rgba(0, 150, 255, 0.1) 50%,
            transparent 100%
        );
        opacity: 0;
        animation: glitch 4s infinite;
        pointer-events: none;
    }

    @keyframes scan {
        from { transform: translateY(-100%); }
        to { transform: translateY(100%); }
    }

    @keyframes glitch {
        0% { 
            opacity: 0;
            transform: translateX(-100%);
        }
        50% {
            opacity: 0.5;
        }
        51% {
            opacity: 0;
        }
        100% { 
            opacity: 0;
            transform: translateX(100%);
        }
    }
</style> 