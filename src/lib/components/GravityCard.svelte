<!-- GravityCard.svelte -->
<script lang="ts">
  export let title: string = '';
  export let lightMode: boolean = false;
  export let accentColor: string = '#3b82f6';
  export let hoverEffect: boolean = true;
  export let width: string = 'auto';
  export let height: string = 'auto';
  export let glassMorphism: boolean = true;
  export let borderSize: number = 1;
</script>

<div 
  class="gravity-card relative overflow-hidden transition-all duration-300 p-4"
  class:hover-effect={hoverEffect} 
  class:light-mode={lightMode}
  class:glass-effect={glassMorphism}
  style:width={width}
  style:height={height}
  style:--accent-color={accentColor}
  style:border-width={`${borderSize}px`}
>
  {#if title}
    <div class="card-title">
      {title}
    </div>
  {/if}

  <!-- Scan line effect -->
  <div class="scan-line"></div>
  
  <!-- Animated border glow -->
  <div class="border-glow"></div>
  
  <!-- Content area -->
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .gravity-card {
    --accent-color: #3b82f6;
    border-radius: 0.75rem;
    border-color: color-mix(in srgb, var(--accent-color) 30%, transparent);
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    position: relative;
    isolation: isolate;
    box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.5);
  }
  
  .gravity-card.light-mode {
    background-color: rgba(255, 255, 255, 0.3);
    color: black;
    box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.15);
  }
  
  .gravity-card.glass-effect {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--accent-color);
    position: relative;
  }
  
  .card-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    height: 1px;
    width: 3rem;
    background-color: var(--accent-color);
    opacity: 0.5;
  }
  
  .scan-line {
    position: absolute;
    width: 100%;
    height: 60px;
    background: linear-gradient(
      to bottom,
      transparent,
      color-mix(in srgb, var(--accent-color) 5%, transparent),
      transparent
    );
    bottom: -100%;
    left: 0;
    animation: scan 4s linear infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  .gravity-card:hover .scan-line {
    opacity: 1;
  }
  
  @keyframes scan {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-100vh);
    }
  }
  
  .border-glow {
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      transparent,
      var(--accent-color),
      transparent
    );
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    opacity: 0.3;
    pointer-events: none;
    animation: borderGlow 8s linear infinite;
  }
  
  @keyframes borderGlow {
    0%, 100% {
      opacity: 0.15;
    }
    50% {
      opacity: 0.3;
    }
  }
  
  .content {
    position: relative;
    z-index: 2;
  }
  
  .gravity-card.hover-effect:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.4);
  }
  
  .gravity-card.light-mode.hover-effect:hover {
    box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.15);
  }
</style> 