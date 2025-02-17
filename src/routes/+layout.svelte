<script lang="ts">
	import '../app.css'; // Importação obrigatória para estilo global
	import OrionChat from '$lib/components/OrionChat.svelte';
	import { page } from '$app/stores';
	import { auth } from '$lib/firebase';
	import { signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';
  
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
		goto('/login');
	  } catch (error) {
		console.error('Erro ao fazer logout:', error);
	  }
	};
</script>
  
<div class="bg-gradient-to-b from-black via-gray-800 to-gray-900 text-white min-h-screen flex flex-col">
	{#if $page.url.pathname !== '/'}
	<!-- Header -->
	<header class="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
	  <div class="container mx-auto flex justify-between items-center px-4 h-16">
		<h1 class="text-3xl font-bold text-green-500">Gravity Group</h1>
		
		<div class="hidden md:flex items-center space-x-6">
		  <!-- Links de navegação -->
		  <nav class="flex space-x-6">
			{#each menuItems as item}
			  <a href={item.href} class="hover:text-green-500 transition">{item.label}</a>
			{/each}
		  </nav>

		  <!-- Perfil e botão de sair (apenas se estiver logado) -->
		  {#if auth.currentUser}
			<div class="flex items-center space-x-4">
			  <a 
				href="/profile" 
				class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
			  >
				{#if auth.currentUser?.email}
				  <div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
					{auth.currentUser.email[0].toUpperCase()}
				  </div>
				  <span>{auth.currentUser.email}</span>
				{/if}
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
			<a href={item.href} class="hover:text-green-500 transition">{item.label}</a>
		  {/each}
		  
		  <!-- Perfil e botão de sair para mobile -->
		  {#if auth.currentUser}
			<div class="flex flex-col space-y-2 w-full pt-2 border-t border-gray-700">
			  <a 
				href="/profile"
				class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
			  >
				{#if auth.currentUser?.email}
				  <div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
					{auth.currentUser.email[0].toUpperCase()}
				  </div>
				  <span>{auth.currentUser.email}</span>
				{/if}
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
  