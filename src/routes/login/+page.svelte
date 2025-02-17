<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { enhance } from '$app/forms';
  
  let loading = false;
  let error = '';

  let container;

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    // Criar um grupo para o globo
    const globeGroup = new THREE.Group();
    
    // Criação do globo
    const radius = 16;
    const segments = 32;
    
    // Material para as linhas
    const material = new THREE.LineBasicMaterial({ 
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.6
    });

    // Criação dos meridianos
    for (let i = 0; i < segments; i++) {
      const phi = (i / segments) * Math.PI * 2;
      const points = [];
      
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI;
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.cos(theta);
        const z = radius * Math.sin(theta) * Math.sin(phi);
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const meridian = new THREE.BufferGeometry().setFromPoints(points);
      globeGroup.add(new THREE.Line(meridian, material));
    }

    // Criação dos paralelos
    for (let i = 0; i < segments/2; i++) {
      const theta = (i / (segments/2)) * Math.PI;
      const points = [];
      
      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * Math.PI * 2;
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.cos(theta);
        const z = radius * Math.sin(theta) * Math.sin(phi);
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const parallel = new THREE.BufferGeometry().setFromPoints(points);
      globeGroup.add(new THREE.Line(parallel, material));
    }

    // Posicionar o globo bem mais abaixo
    globeGroup.position.y = -16;

    // Adicionar o grupo do globo à cena
    scene.add(globeGroup);

    // Adicionar mais estrelas
    const starsGeometry = new THREE.BufferGeometry();
    const starTexture = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      
      return new THREE.CanvasTexture(canvas);
    })();

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      map: starTexture,
      alphaTest: 0.5,
      sizeAttenuation: true
    });

    const starsVertices = [];
    for (let i = 0; i < 15000; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 30;

    // Animação
    function animate() {
      requestAnimationFrame(animate);
      globeGroup.rotation.y += 0.0003;
      stars.rotation.y += 0.00005;
      renderer.render(scene, camera);
    }

    animate();

    // Responsividade
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
    };
  });

  function handleSubmit() {
    loading = true;
    error = '';
  }
</script>

<div class="relative w-full h-screen bg-black">
  <!-- Container do globo -->
  <div bind:this={container} class="absolute inset-0 z-0"></div>
  
  <!-- Container do formulário -->
  <div class="relative z-10 flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-8 space-y-6 bg-black/30 backdrop-blur-lg rounded-lg shadow-xl border border-white/10">
      <h2 class="text-3xl font-bold text-center text-white">Login</h2>
      <form class="space-y-4" method="POST" use:enhance={() => handleSubmit}>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-200">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            class="w-full px-3 py-2 mt-1 text-white bg-black/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-200">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            class="w-full px-3 py-2 mt-1 text-white bg-black/50 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="********"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          class="w-full px-4 py-2 text-black bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors"
        >
          {#if loading}
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            Entrando...
          {:else}
            Entrar
          {/if}
        </button>
      </form>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    overflow: hidden;
    background: black;
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
</style>
  