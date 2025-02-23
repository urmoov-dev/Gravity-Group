<script lang="ts">
	import '../app.css'; // Importação obrigatória para estilo global
	import OrionChat from '$lib/components/OrionChat.svelte';
	import { page } from '$app/stores';
	import { auth } from '$lib/firebase';
	import { signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { clearSessionCookie } from '$lib/session';
	import { user } from '$lib/stores/auth';
  
	const menuItems = [
	  { href: '/hub', label: 'Hub' },
	  { href: '/profile', label: 'Perfil' }
	];
  
	let menuVisible = false;
  
	const toggleMenu = () => {
	  menuVisible = !menuVisible;
	};

	const handleSignOut = async () => {
	  try {
		await signOut(auth);
		clearSessionCookie();
		goto('/login');
	  } catch (error) {
		console.error('Erro ao fazer logout:', error);
	  }
	};

	// Função para navegar entre páginas
	const handleNavigation = (path: string) => {
	  menuVisible = false; // Fecha o menu mobile se estiver aberto
	  goto(path);
	};
</script>
  
<div class="bg-gradient-to-b from-black via-gray-800 to-gray-900 text-white min-h-screen flex flex-col">
	{#if $page.url.pathname !== '/'}
	<!-- Header -->
	<header class="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
	  <div class="container mx-auto flex justify-between items-center px-4 h-16">
		<div class="flex items-center space-x-0">
		  <img 
			src="/images/Logo-Gravity.png"
			alt="Gravity Group Logo" 
			class="h-16 w-auto"
		  />
		  <h1 class="text-3xl font-bold text-white">Gravity Group</h1>
		</div>
		
		<div class="hidden md:flex items-center space-x-6">
		  <!-- Links de navegação -->
		  <nav class="flex space-x-6">
			{#each menuItems as item}
			  <button 
				on:click={() => handleNavigation(item.href)}
				class="hover:text-green-500 transition {$page.url.pathname === item.href ? 'text-green-500' : ''}"
			  >
				{item.label}
			  </button>
			{/each}
		  </nav>

		  <!-- Perfil e botão de sair (apenas se estiver logado) -->
		  {#if $user}
			<div class="flex items-center space-x-4">
			  <a 
				href="/profile" 
				class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
			  >
				<div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
				  {$user.email?.[0].toUpperCase() ?? 'U'}
				</div>
				<span>{$user.email}</span>
			  </a>
			  <button 
				on:click={handleSignOut}
				class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
			  >
				Sair
			  </button>
			</div>
		  {/if}
		</div>

		<!-- Mobile Menu Toggle -->
		<div class="md:hidden">
		  <button 
			id="menu-toggle" 
			on:click={toggleMenu} 
			class="text-green-500 focus:outline-none"
		  >
			☰
		  </button>
		</div>
	  </div>
	</header>
  
	<!-- Mobile Menu -->
	{#if menuVisible}
	  <div id="mobile-menu" class="md:hidden bg-gray-800">
		<nav class="flex flex-col items-start space-y-2 p-4">
		  {#each menuItems as item}
			<button 
			  on:click={() => handleNavigation(item.href)}
			  class="hover:text-green-500 transition {$page.url.pathname === item.href ? 'text-green-500' : ''}"
			>
			  {item.label}
			</button>
		  {/each}
		  
		  <!-- Perfil e botão de sair para mobile -->
		  {#if $user}
			<div class="flex flex-col space-y-2 w-full pt-2 border-t border-gray-700">
			  <a 
				href="/profile"
				class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
			  >
				<div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
				  {$user.email?.[0].toUpperCase() ?? 'U'}
				</div>
				<span>{$user.email}</span>
			  </a>
			  <button 
				on:click={handleSignOut}
				class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors w-full"
			  >
				Sair
			  </button>
			</div>
		  {/if}
		</nav>
	  </div>
	{/if}
	{/if}
  
	<!-- Main Content -->
	<main class="flex-grow">
	  <slot />
	</main>
  
	{#if $page.url.pathname !== '/'}
	<!-- Footer -->
	<footer class="bg-black py-4">
	  <div class="container mx-auto text-center px-4">
		<p class="text-sm text-gray-400">© 2025 Gravity Group - Todos os direitos reservados</p>
	  </div>
	</footer>

	<OrionChat />
	{/if}
</div>
  
<style>
	#menu-toggle {
	  font-size: 1.5rem;
	}
  
	#mobile-menu {
	  transition: max-height 0.3s ease;
	}
</style>
  