<script>
  import { onMount } from "svelte";

  // Variáveis para controlar a entrada e saída de dados
  let userInput = "";
  let orionResponse = "Pergunte qualquer coisa sobre nossos produtos!";
  let isLoading = false;

  // Função para enviar a pergunta para a API da OpenAI
  async function askOrion() {
    if (userInput.trim() === "") return; // Evitar envio de entrada vazia

    isLoading = true;
    try {
      const response = await fetch('/orion/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      const data = await response.json();
      orionResponse = data.answer;
    } catch (error) {
      orionResponse = "Erro de conexão. Verifique sua internet!";
    } finally {
      isLoading = false;
      userInput = ""; // Limpar campo de entrada
    }
  }
</script>

<div class="bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white min-h-screen flex flex-col">
  <!-- Hero Section -->
  <section class="flex-grow flex flex-col items-center justify-center text-center space-y-6">
    <h1 class="text-5xl font-bold text-green-500">Orion</h1>
    <p class="text-lg text-gray-300">Sua inteligência artificial galáctica está aqui para ajudar!</p>

    <!-- Campo de entrada e botão -->
    <div class="w-full max-w-md space-y-4">
      <input
        type="text"
        bind:value={userInput}
        placeholder="Digite sua pergunta..."
        class="w-full p-3 rounded-lg text-black"
      />
      <button
        on:click={askOrion}
        class="bg-green-500 text-black py-3 px-6 rounded-lg hover:bg-green-600 transition w-full"
        disabled={isLoading}
      >
        {isLoading ? "Consultando Orion..." : "Perguntar"}
      </button>
    </div>

    <!-- Resposta do Orion -->
    <div class="mt-6 bg-gray-700 p-4 rounded-lg w-full max-w-2xl">
      <p class="text-white">{orionResponse}</p>
    </div>
  </section>
</div>

<style>
  .bg-gradient-to-b {
    background: linear-gradient(to bottom, #1e293b, #111827, #000000);
  }
  input {
    border: 2px solid #4ade80;
  }
</style>
