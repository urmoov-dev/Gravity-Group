<script>
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  onMount(() => {
    if (browser) {
      window.location.replace('/login');
    }
  });
</script>

<div class="min-h-screen bg-black flex items-center justify-center">
  <div class="text-white text-center">
    <div class="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
    <p>Redirecionando...</p>
  </div>
</div> 