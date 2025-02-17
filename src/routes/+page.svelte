<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { auth } from '$lib/firebase';
  import { goto } from '$app/navigation';

  let loading = true;

  onMount(() => {
    if (browser) {
      // Observa mudanças no estado de autenticação
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          goto('/hub');
        } else {
          goto('/login');
        }
        loading = false;
      });

      return unsubscribe;
    }
  });
</script>

{#if loading}
<div class="min-h-screen bg-black flex items-center justify-center">
  <div class="text-white text-center">
    <div class="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
    <p>Carregando...</p>
  </div>
</div>
{/if}
  