<script>
	import '../app.css'; // Importação obrigatória para estilo global
  
	let links = [
	  { name: "Home", href: "/" },
	  { name: "Login", href: "/login" },
	  { name: "Orion", href: "/orion" },
	  { name: "Marketplace", href: "/marketplace" },
	  { name: "Contato", href: "/contato" },
	];
  
	let menuVisible = false;
  
	const toggleMenu = () => {
	  menuVisible = !menuVisible;
	};
  </script>
  
  <div class="bg-gradient-to-b from-black via-gray-800 to-gray-900 text-white min-h-screen flex flex-col">
	<!-- Header -->
	<header class="bg-black py-4 shadow-lg">
	  <div class="container mx-auto flex justify-between items-center px-4">
		<h1 class="text-3xl font-bold text-green-500">Gravity Group</h1>
		<nav class="hidden md:flex space-x-6">
		  {#each links as link}
			<a href={link.href} class="hover:text-green-500 transition">{link.name}</a>
		  {/each}
		</nav>
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
		  {#each links as link}
			<a href={link.href} class="hover:text-green-500 transition">{link.name}</a>
		  {/each}
		</nav>
	  </div>
	{/if}
  
	<!-- Main Content -->
	<main class="flex-grow">
	  <slot />
	</main>
  
	<!-- Footer -->
	<footer class="bg-black py-4">
	  <div class="container mx-auto text-center px-4">
		<p class="text-sm text-gray-400">© 2025 Gravity Group - Todos os direitos reservados</p>
	  </div>
	</footer>
  </div>
  
  <style>
	#menu-toggle {
	  font-size: 1.5rem;
	}
  
	#mobile-menu {
	  transition: max-height 0.3s ease;
	}
  </style>
  