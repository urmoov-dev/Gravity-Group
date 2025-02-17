<script>
  import { fade, fly } from 'svelte/transition';
  
  export let isOpen = false;
  
  function toggleChat() {
    isOpen = !isOpen;
  }
</script>

<div class="fixed bottom-4 right-4 z-50">
  <!-- Botão do Orion -->
  <button
    on:click={toggleChat}
    class="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110"
  >
    {#if !isOpen}
      <span class="text-3xl">🤖</span>
    {:else}
      <span class="text-3xl">×</span>
    {/if}
  </button>

  <!-- Janela do chat -->
  {#if isOpen}
    <div
      transition:fly={{ y: 50, duration: 200 }}
      class="absolute bottom-20 right-0 w-96 h-[600px] bg-black/95 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl overflow-hidden"
    >
      <div class="flex flex-col h-full">
        <!-- Cabeçalho -->
        <div class="p-4 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">🤖</span>
            <div>
              <h3 class="font-semibold text-white">Orion</h3>
              <p class="text-sm text-gray-400">Assistente Virtual</p>
            </div>
          </div>
        </div>

        <!-- Área de mensagens -->
        <div class="flex-1 overflow-y-auto p-4">
          <!-- Aqui vai o conteúdo do chat -->
        </div>

        <!-- Input de mensagem -->
        <div class="p-4 border-t border-white/10">
          <div class="flex space-x-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              class="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
            <button class="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div> 