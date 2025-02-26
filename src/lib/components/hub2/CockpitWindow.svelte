<!-- CockpitWindow.svelte -->
<script lang="ts">
    export let position: 'left' | 'center' | 'right';

    const positionClasses = {
        left: 'transform-origin-left rotate-y-15',
        center: '',
        right: 'transform-origin-right -rotate-y-15'
    };

    const widthClasses = {
        left: 'w-1/3',
        center: 'w-1/3',
        right: 'w-1/3'
    };
</script>

<div class="window-container {widthClasses[position]} h-full">
    <div class="relative h-full {positionClasses[position]}">
        <!-- Moldura externa -->
        <div class="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 rounded-lg blur"></div>
        
        <!-- Moldura da janela -->
        <div class="absolute inset-0 border-2 border-blue-500/30 rounded-lg">
            <!-- Reflexos nas bordas -->
            <div class="absolute inset-0 rounded-lg overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/10"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-blue-500/10"></div>
            </div>
        </div>
        
        <!-- Linhas de escaneamento -->
        <div class="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <div class="scan-line"></div>
        </div>
        
        <!-- Conteúdo -->
        <div class="relative h-full p-6 bg-black/40 backdrop-blur-xl rounded-lg border border-blue-500/10">
            <slot />
        </div>

        <!-- Reflexo holográfico -->
        <div class="absolute inset-0 rounded-lg pointer-events-none">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
        </div>
    </div>
</div>

<style>
    .window-container {
        transform-style: preserve-3d;
        perspective: 2000px;
    }

    .transform-origin-left {
        transform-origin: left center;
        transform: perspective(2000px) rotateY(15deg) translateZ(50px);
    }

    .transform-origin-right {
        transform-origin: right center;
        transform: perspective(2000px) rotateY(-15deg) translateZ(50px);
    }

    .scan-line {
        position: absolute;
        width: 100%;
        height: 100px;
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(62, 161, 219, 0.1),
            transparent
        );
        animation: scan 3s linear infinite;
    }

    @keyframes scan {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(100%);
        }
    }

    /* Efeito de brilho nas bordas */
    .window-container::after {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(
            45deg,
            transparent,
            rgba(62, 161, 219, 0.1),
            transparent
        );
        border-radius: inherit;
        z-index: -1;
        animation: borderGlow 4s ease-in-out infinite;
    }

    @keyframes borderGlow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.7; }
    }
</style> 