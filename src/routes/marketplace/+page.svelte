<script>
  // Importações e lógica do componente aqui
</script>

<div class="min-h-screen bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <!-- Header do Marketplace -->
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900">Marketplace</h1>
      <p class="mt-2 text-lg text-gray-600">Descubra produtos e serviços exclusivos</p>
    </header>

    <!-- Filtros e Busca -->
    <div class="mb-8 flex flex-wrap gap-4">
      <input 
        type="search" 
        placeholder="Buscar produtos..." 
        class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      />
      <select class="rounded-lg border border-gray-300 px-4 py-2">
        <option value="">Todas as categorias</option>
        <option value="category1">Categoria 1</option>
        <option value="category2">Categoria 2</option>
      </select>
    </div>

    <!-- Grid de Produtos -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <!-- Card de Produto -->
      {#each Array(8) as _, i}
        <div class="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105">
          <img 
            src="https://via.placeholder.com/300x200" 
            alt="Produto {i + 1}" 
            class="h-48 w-full object-cover"
          />
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900">Produto {i + 1}</h3>
            <p class="mt-1 text-gray-600">Descrição breve do produto...</p>
            <div class="mt-4 flex items-center justify-between">
              <span class="text-xl font-bold text-blue-600">R$ 99,99</span>
              <button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Comprar
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  /* Estilos específicos da página aqui, se necessário */
</style>
  