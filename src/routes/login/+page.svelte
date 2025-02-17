<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { enhance } from '$app/forms';
  import { auth } from '$lib/firebase';
  import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  import { goto } from '$app/navigation';
  
  let loading = false;
  let error = '';

  let container;
  let globeGroup;
  let stars;

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    // Criar um grupo para o globo
    globeGroup = new THREE.Group();
    
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
    for (let i = 0; i < 25000; i++) {
      if (i < 17500) {
        const x = (Math.random() - 0.5) * 80;
        const y = (Math.random() - 0.5) * 80;
        const z = (Math.random() - 0.5) * 80;
        starsVertices.push(x, y, z);
      } else {
        const x = (Math.random() - 0.5) * 150;
        const y = (Math.random() - 0.5) * 150;
        const z = (Math.random() - 0.5) * 150;
        starsVertices.push(x, y, z);
      }
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );

    stars = new THREE.Points(starsGeometry, starsMaterial);
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

  function createAttractionAnimation(originalY, targetY) {
    const duration = 10000;
    const start = performance.now();
    
    function attractionAnimation(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const easing = t => {
        if (t < 0.3) {
          return t * t * t;
        } else if (t < 0.7) {
          const p = (t - 0.3) / 0.4;
          return 0.27 + (p * p * 0.4);
        } else {
          const p = (t - 0.7) / 0.3;
          return 0.67 + (Math.pow(p, 3) * 0.33);
        }
      };

      const currentProgress = easing(progress);
      
      globeGroup.position.y = originalY + (targetY - originalY) * currentProgress;
      globeGroup.rotation.y += 0.003 + (currentProgress * 0.01);
      
      const positions = stars.geometry.attributes.position.array;
      const centerY = globeGroup.position.y;
      
      const intensityMultiplier = progress < 0.3 
        ? 1 + (Math.pow(progress/0.3, 2))
        : progress < 0.7 
          ? 2 + (Math.pow((progress-0.3)/0.4, 2) * 2)
          : 4 + (Math.pow((progress-0.7)/0.3, 2) * 4);
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        const dx = x;
        const dy = y - centerY;
        const dz = z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        const baseForce = Math.min(0.015, 1.5 / (distance + 1));
        const force = baseForce * (
          progress < 0.3 
            ? progress * 0.3
            : progress < 0.7 
              ? 0.3 + ((progress - 0.3) * 0.7)
              : 0.7 + ((progress - 0.7) * 2)
        ) * intensityMultiplier;
        
        const speedMultiplier = progress < 0.3 
          ? 0.02 + (progress * 0.1)
          : progress < 0.7 
            ? 0.05 + ((progress - 0.3) * 0.15)
            : 0.11 + ((progress - 0.7) * 0.25);
        
        positions[i] -= dx * force * speedMultiplier;
        positions[i + 1] -= dy * force * (speedMultiplier * 1.4);
        positions[i + 2] -= dz * force * speedMultiplier;
      }
      
      stars.geometry.attributes.position.needsUpdate = true;

      if (progress < 1) {
        requestAnimationFrame(attractionAnimation);
      }
    }

    return attractionAnimation;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    loading = true;
    error = '';

    // Inicia a animação
    const animation = createAttractionAnimation(globeGroup.position.y, -5);
    requestAnimationFrame(animation);

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        // Redireciona imediatamente após o login bem-sucedido
        goto('/hub');
      }
    } catch (e) {
      error = e.message;
      globeGroup.position.y = -12;
    } finally {
      loading = false;
    }
  }

  async function handleGoogleLogin() {
    loading = true;
    error = '';

    // Inicia a animação
    const animation = createAttractionAnimation(globeGroup.position.y, -5);
    requestAnimationFrame(animation);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // Redireciona imediatamente após o login bem-sucedido
        goto('/hub');
      }
    } catch (e) {
      error = e.message;
      globeGroup.position.y = -16;
    } finally {
      loading = false;
    }
  }
</script>

<div class="relative w-full h-screen bg-black">
  <div bind:this={container} class="absolute inset-0 z-0"></div>
  
  <div class="relative z-10 flex items-center justify-center min-h-screen -mt-20">
    <div class="w-full max-w-md p-8 space-y-6 bg-black/30 backdrop-blur-lg rounded-lg shadow-xl border border-white/10">
      <h2 class="text-3xl font-bold text-center text-white">Login</h2>
      
      {#if error}
        <div class="p-3 text-sm text-red-200 bg-red-900/50 rounded-md">
          {error}
        </div>
      {/if}

      <form class="space-y-4" on:submit={handleSubmit}>
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

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-white/10"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 text-gray-300 bg-black">Ou continue com</span>
        </div>
      </div>

      <button
        on:click={handleGoogleLogin}
        disabled={loading}
        class="w-full px-4 py-2 flex items-center justify-center space-x-2 text-white bg-transparent border border-white/20 rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>Google</span>
      </button>
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
  