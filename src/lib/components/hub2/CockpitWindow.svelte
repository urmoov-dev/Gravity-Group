<!-- CockpitWindow.svelte -->
<script lang="ts">
    export let position: 'left' | 'center' | 'right';

    // Transformações mais pronunciadas baseadas na posição
    const transformStyles = {
        left: 'transform: perspective(2000px) rotateY(55deg) rotateX(-20deg) translateZ(100px) translateX(-50px)',
        center: 'transform: perspective(2000px) rotateX(-30deg) translateZ(150px)',
        right: 'transform: perspective(2000px) rotateY(-55deg) rotateX(-20deg) translateZ(100px) translateX(50px)'
    };

    // Ângulos das bordas mais acentuados
    const borderAngles = {
        left: 'clip-path: polygon(10% 15%, 100% 0%, 100% 85%, 0% 100%)',
        center: 'clip-path: polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)',
        right: 'clip-path: polygon(0% 0%, 90% 15%, 100% 100%, 10% 85%)'
    };
</script>

<div 
    class="window-container relative h-full"
    style="{transformStyles[position]}; {borderAngles[position]}"
>
    <!-- Efeito de vidro com gradiente mais pronunciado -->
    <div class="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-black/50 backdrop-blur-md border border-blue-500/30"></div>
    
    <!-- Overlay metálico -->
    <div class="absolute inset-0 metal-overlay"></div>
    
    <!-- Grade de linhas -->
    <div class="absolute inset-0 grid-lines"></div>
    
    <!-- Borda luminosa -->
    <div class="absolute inset-0 border-2 border-blue-500/40 glow-border"></div>
    
    <!-- Estrutura metálica -->
    <div class="absolute inset-0 metal-frame"></div>
    
    <!-- HUD Elements -->
    <div class="absolute inset-0 p-4">
        <!-- Cabeçalho do painel -->
        <div class="panel-header">
            <div class="flex items-center justify-between">
                <div class="text-blue-400 text-sm font-mono flex items-center">
                    <div class="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                    {position.toUpperCase()} DISPLAY
                </div>
                <div class="text-green-400 text-sm font-mono flex items-center">
                    <span class="mr-2">ONLINE</span>
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
            </div>
            <div class="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mt-2"></div>
        </div>
        
        <!-- Conteúdo principal -->
        <div class="relative h-full mt-4">
            <slot />
        </div>
    </div>
</div>

<style>
    .window-container {
        transform-style: preserve-3d;
        animation: windowStartup 1.8s ease-out forwards;
        transform-origin: center center;
        backface-visibility: hidden;
    }

    .metal-overlay {
        background-image: 
            linear-gradient(45deg, rgba(0,0,0,0.2) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(0,0,0,0.2) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.2) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.2) 75%);
        background-size: 4px 4px;
        opacity: 0.15;
    }

    .grid-lines {
        background-image: 
            linear-gradient(to right, rgba(0, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 255, 0.15) 1px, transparent 1px);
        background-size: 20px 20px;
        mask-image: linear-gradient(to bottom, 
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.9) 100%
        );
    }

    .glow-border {
        box-shadow: 
            inset 0 0 20px rgba(0, 255, 255, 0.4),
            0 0 20px rgba(0, 255, 255, 0.3);
        animation: borderPulse 4s infinite;
    }

    .metal-frame {
        pointer-events: none;
        border: 8px solid rgba(50, 50, 70, 0.5);
        box-shadow: 
            inset 0 0 30px rgba(0, 0, 0, 0.5),
            0 0 10px rgba(0, 255, 255, 0.2);
        background: linear-gradient(
            135deg,
            rgba(50, 50, 70, 0.4) 0%,
            rgba(30, 30, 50, 0.2) 50%,
            rgba(50, 50, 70, 0.4) 100%
        );
    }

    @keyframes borderPulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }

    @keyframes windowStartup {
        0% {
            opacity: 0;
            transform: perspective(2000px) translateZ(-300px) rotateX(-60deg);
        }
        50% {
            opacity: 0.5;
        }
        100% {
            opacity: 1;
            transform: perspective(2000px) translateZ(0) rotateX(0);
        }
    }

    /* Efeito de scanline melhorado */
    .window-container::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            transparent 50%,
            rgba(0, 255, 255, 0.035) 50%
        );
        background-size: 100% 4px;
        animation: scanline 4s linear infinite;
        pointer-events: none;
        opacity: 0.4;
    }

    @keyframes scanline {
        from { transform: translateY(0); }
        to { transform: translateY(100%); }
    }

    .panel-header {
        position: relative;
        padding: 0.75rem;
        background: rgba(0, 30, 60, 0.4);
        border-radius: 0.25rem;
        border: 1px solid rgba(0, 255, 255, 0.2);
        box-shadow: 
            inset 0 0 15px rgba(0, 255, 255, 0.1),
            0 0 5px rgba(0, 255, 255, 0.2);
    }
</style> 