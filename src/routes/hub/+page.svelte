<script>
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import { animationStartTime } from '$lib/stores/animation';
  import * as THREE from 'three';

  let user = null;
  let container;
  let globeGroup;
  let stars;
  let showProfileModal = false;

  let partnerships = [
    {
      name: 'Dominion',
      logo: 'images/adominion-logo.png',
      description: 'Soluções de investimento global com foco em gestão de patrimônio.',
      highlight: 'Mais de 40 anos de experiência em mercados internacionais',
      url: 'https://dominion-cs.com/pt'
    },
    {
      name: 'Fictor',
      logo: 'images/fictor-logo.jpg',
      description: 'Holding de participações especializada em gestão empresarial.',
      highlight: 'R$ 2Bi em faturamento em 2023',
      url: 'https://fictor.com.br'
    },
    {
      name: 'Hurst',
      logo: 'images/hurst-logo.png',
      description: 'Plataforma líder em ativos alternativos na América Latina.',
      highlight: 'Rendimentos acima de 21.1% ao ano',
      url: 'https://hurst.capital'
    },
    {
      name: 'Ademicon',
      logo: 'images/ademicon-logo.png',
      description: 'Maior administradora independente de consórcio do Brasil.',
      highlight: 'Mais de R$ 120.9Bi em créditos comercializados',
      url: 'https://ademicon.com.br'
    }
  ];

  onMount(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        goto('/login');
        return;
      }
      user = currentUser;
    });

    return () => unsubscribe();
  });

  async function handleLogout() {
    try {
      await auth.signOut();
      goto('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  function toggleProfileModal() {
    showProfileModal = !showProfileModal;
  }

  async function updateProfile(event) {
    // Implementar atualização do perfil
  }
</script>

<div class="min-h-screen bg-black text-white">
  <!-- Navbar com perfil -->
  <nav class="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <span class="text-xl font-bold">Gravity Hub</span>
        </div>
        <div class="flex items-center space-x-6">
          {#if user}
            <button 
              on:click={toggleProfileModal}
              class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                {user.email[0].toUpperCase()}
              </div>
              <span>{user.email}</span>
            </button>
            <button
              on:click={handleLogout}
              class="px-4 py-2 text-sm text-white bg-transparent border border-white/20 rounded-md hover:bg-white/5"
            >
              Sair
            </button>
          {/if}
        </div>
      </div>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Parcerias -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold">Nossas Parcerias</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each partnerships as partner}
          <a 
            href={partner.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            class="group relative aspect-square bg-black/10 backdrop-blur-lg border border-white/5 rounded-xl overflow-hidden"
          >
            <!-- Logo Container -->
            <div class="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <div class="w-3/4 h-3/4 bg-white rounded-2xl flex items-center justify-center p-6 border-8 border-gray-100/90 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:bg-opacity-10 group-hover:border-gray-600/20 group-hover:scale-110">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  class="w-full h-full object-contain transition-all duration-300"
                  loading="lazy"
                  on:error={(e) => e.currentTarget.style.display = 'none'}
                >
              </div>
            </div>

            <!-- Info Container (Revelado no Hover) -->
            <div class="absolute inset-0 p-8 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/70 backdrop-blur-sm">
              <h3 class="text-2xl font-semibold text-center mb-6 text-white">{partner.name}</h3>
              <p class="text-white/90 text-base text-center mb-6">{partner.description}</p>
              <p class="text-blue-400 text-base font-medium text-center">{partner.highlight}</p>
              <div class="absolute bottom-6 left-0 right-0 text-center">
                <span class="text-sm text-white/60">Clique para visitar →</span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </section>
  </main>

  <!-- Modal de Perfil -->
  {#if showProfileModal}
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-black/90 border border-white/10 rounded-lg p-8 max-w-md w-full">
        <h2 class="text-xl font-bold mb-6">Editar Perfil</h2>
        <form on:submit|preventDefault={updateProfile} class="space-y-4">
          <div>
            <label for="displayName" class="block text-sm font-medium text-gray-300">Nome</label>
            <input
              id="displayName"
              type="text"
              class="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-md text-white"
              value={user?.displayName || ''}
            >
          </div>
          <div>
            <label for="userEmail" class="block text-sm font-medium text-gray-300">Email</label>
            <input
              id="userEmail"
              type="email"
              class="w-full px-3 py-2 bg-black/50 border border-white/20 rounded-md text-white"
              value={user?.email}
              disabled
            >
          </div>
          <div class="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              on:click={toggleProfileModal}
              class="px-4 py-2 text-sm text-gray-300 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(body) {
    background: black;
  }

  /* Transições suavizadas */
  .group:hover .group-hover\:opacity-100 {
    transition-delay: 50ms;
  }

  .group:hover .group-hover\:scale-110 {
    transition: all 700ms ease-out;
  }

  .group:hover .group-hover\:bg-opacity-10 {
    transition: all 300ms ease-in-out;
  }

  .group:hover .group-hover\:border-gray-600\/20 {
    transition: all 300ms ease-in-out;
  }
</style> 