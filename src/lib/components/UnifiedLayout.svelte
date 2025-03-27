<!-- UnifiedLayout.svelte -->
<script lang="ts">
  import { TopBar } from '$lib/components/hub2';
  import GravitationalBackground from './GravitationalBackground.svelte';
  import { auth } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import { profile } from '$lib/stores/profile';

  export let activeSection = 'overview';
  export let lightMode = false; // Controla o modo de cor (claro ou escuro)
  export let accentColor = '#3b82f6'; // Cor de destaque (azul padrão)
  
  // Função para fazer logout
  async function handleLogout() {
    try {
      await auth.signOut();
      goto('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
</script>

<!-- Fundo gravitacional -->
<div class="fixed inset-0 transition-colors duration-700" 
     style:background-color={lightMode ? 'white' : 'black'}>
  <GravitationalBackground darkMode={!lightMode} opacity={0.8} />
</div>

<!-- Camada de vidro para o fundo -->
<div class="glass-layer"></div>

<!-- Container principal com layout flexível -->
<div class="relative min-h-screen flex flex-col z-10 text-{lightMode ? 'black' : 'white'}">
  <!-- Barra superior com navegação -->
  <div class="top-bar-wrapper backdrop-blur-lg border-b" 
       style:border-color={`${accentColor}30`}
       style:background-color={lightMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'}>
    
    <div class="container mx-auto px-4 py-2 flex items-center justify-between">
      <!-- Logo e Nome -->
      <div class="flex items-center gap-3">
        <img src="/images/Logo {lightMode ? 'Preto' : 'Branco'} Redondo - Sem Fundo.png" 
             alt="Gravity" class="h-10 w-auto" />
        <span class="text-lg font-bold tracking-wider">Gravity Group</span>
      </div>
      
      <!-- Menu de Navegação -->
      <nav class="flex gap-6">
        <button 
          class="nav-item" 
          class:active={activeSection === 'overview'}
          on:click={() => activeSection = 'overview'}
          style:--accent-color={accentColor}
        >
          <span class="text-lg">📊</span>
          <span>VISÃO GERAL</span>
        </button>
        
        <button 
          class="nav-item" 
          class:active={activeSection === 'portfolio'}
          on:click={() => activeSection = 'portfolio'}
          style:--accent-color={accentColor}
        >
          <span class="text-lg">💼</span>
          <span>PORTFÓLIO</span>
        </button>
        
        <button 
          class="nav-item" 
          class:active={activeSection === 'market'}
          on:click={() => activeSection = 'market'}
          style:--accent-color={accentColor}
        >
          <span class="text-lg">📈</span>
          <span>MERCADO</span>
        </button>
        
        <button 
          class="nav-item" 
          class:active={activeSection === 'analysis'}
          on:click={() => activeSection = 'analysis'}
          style:--accent-color={accentColor}
        >
          <span class="text-lg">🔍</span>
          <span>ANÁLISE</span>
        </button>
        
        <button 
          class="nav-item" 
          class:active={activeSection === 'settings'}
          on:click={() => activeSection = 'settings'}
          style:--accent-color={accentColor}
        >
          <span class="text-lg">⚙️</span>
          <span>AJUSTES</span>
        </button>
      </nav>
      
      <!-- Perfil e Logout -->
      <div class="relative group">
        <button 
          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-{lightMode ? 'black/5' : 'white/10'} transition-all duration-300"
        >
          <span class="text-lg">{$profile?.currentLevel?.icon || '👤'}</span>
          <span class="font-medium">{formatCurrency($profile?.currentAmount || 0)}</span>
          <span class="w-4 h-4">▼</span>
        </button>
        
        <div class="absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style:background-color={lightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'}
             style:border={`1px solid ${accentColor}30`}>
          
          <a href="/profile" class="block w-full px-4 py-2 text-left hover:bg-{lightMode ? 'black/5' : 'white/10'} transition-colors">
            <span>Perfil</span>
          </a>
          
          <button
            on:click={handleLogout}
            class="block w-full px-4 py-2 text-left hover:bg-{lightMode ? 'black/5' : 'white/10'} transition-colors"
          >
            <span>SAIR</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Conteúdo principal -->
  <div class="flex-1 flex flex-col">
    <slot />
  </div>
</div>

<style>
  /* Camada de vidro para efeito de backdrop blur em navegadores que não suportam backdrop-filter */
  .glass-layer {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: radial-gradient(circle at 50% 50%, transparent 20%, rgba(0, 0, 0, 0.02) 100%);
  }
  
  .nav-item {
    --accent-color: #3b82f6;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .nav-item::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    height: 2px;
    width: 0;
    background-color: var(--accent-color);
    transition: all 0.3s ease;
    transform: translateX(-50%);
    opacity: 0;
  }
  
  .nav-item:hover::after {
    width: 80%;
    opacity: 0.7;
  }
  
  .nav-item.active::after {
    width: 100%;
    opacity: 1;
  }
  
  .nav-item:hover {
    transform: translateY(-2px);
  }
  
  .nav-item.active {
    color: var(--accent-color);
  }
</style> 