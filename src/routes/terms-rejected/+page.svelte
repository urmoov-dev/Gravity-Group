<!-- src/routes/terms-rejected/+page.svelte -->
<script lang="ts">
  import { auth } from '$lib/firebase';
  import { onMount } from 'svelte';

  onMount(() => {
    // Fazer logout quando os termos são rejeitados
    auth.signOut();
  });
</script>

<div class="min-h-screen bg-black flex items-center justify-center p-4">
  <div class="max-w-2xl w-full bg-gray-900 rounded-lg shadow-2xl p-8 text-center space-y-6">
    <h1 class="text-3xl font-bold text-red-400">Termos de Serviço Rejeitados</h1>
    
    <p class="text-gray-300 text-lg leading-relaxed">
      Para utilizar a plataforma Gravity Group, é necessário aceitar os Termos de Serviço.
      Sem a aceitação dos termos, não é possível prosseguir com o uso da plataforma.
    </p>

    <p class="text-gray-400">
      Se você mudou de ideia e deseja aceitar os termos, por favor faça login novamente.
    </p>

    <div class="pt-4">
      <a
        href="/login"
        class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
      >
        Voltar para o Login
      </a>
    </div>
  </div>
</div> 