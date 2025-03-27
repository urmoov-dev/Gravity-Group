<!-- GravitationalBackground.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  export let darkMode = false; // Permite alternar entre modo claro (login) e escuro (interface interna)
  export let opacity = 1; // Controla a opacidade para permitir camadas diferentes

  let container: HTMLElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let particleSystem: THREE.Points;
  let animationFrame: number;
  
  // Configurações do sistema de partículas
  const GRID_SIZE = 100;
  const GRID_RESOLUTION = 70;
  const GRID_SPACING = 2.5;
  
  onMount(() => {
    initScene();
    createParticleGrid();
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
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(animationFrame);
    };
  });

  function initScene() {
    // Inicializa a cena, câmera e renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Fundo transparente para permitir sobreposição no CSS
    (renderer as any).setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Posição da câmera alternando conforme o modo
    if (darkMode) {
      camera.position.z = 80;
      camera.position.y = 20;
      (camera as any).lookAt(0, 0, 0);
    } else {
      camera.position.z = 70;
      camera.position.y = 5;
      (camera as any).lookAt(0, 1, 0);
    }
  }

  function createParticleGrid() {
    // Cria um grid plano de partículas
    const vertices = [];
    const colors = [];
    
    // Cria um plano de partículas no padrão de grid
    for (let i = 0; i < GRID_RESOLUTION; i++) {
      for (let j = 0; j < GRID_RESOLUTION; j++) {
        const x = (i / (GRID_RESOLUTION - 1) * GRID_SIZE * GRID_SPACING) - (GRID_SIZE * GRID_SPACING / 2);
        const z = (j / (GRID_RESOLUTION - 1) * GRID_SIZE * GRID_SPACING) - (GRID_SIZE * GRID_SPACING / 2.5);
        
        // Calcula a distância inicial ao centro para definir a altura (y)
        const distance = Math.sqrt(x * x + z * z);
        let y = 0;
        
        vertices.push(x, y, z);
        
        // Define a cor com base no modo (preto ou branco)
        const color = darkMode ? 1 : 0;
        colors.push(color, color, color);
      }
    }
    
    // Cria a geometria e atributos para as partículas
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // Cria uma textura circular para as partículas
    const particleTexture = createCircleTexture(128);
    
    // Material para partículas
    const material = new THREE.PointsMaterial({
      size: darkMode ? 1.5 : 2,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: opacity,
      alphaTest: 0.2,
      sizeAttenuation: true
    });
    
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
  }
  
  // Cria uma textura circular para as partículas
  function createCircleTexture(size = 128) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    
    const context = canvas.getContext('2d');
    if (!context) return new THREE.Texture();
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;
    
    // Limpa o canvas
    context.clearRect(0, 0, size, size);
    
    // Desenha um círculo com bordas nítidas
    context.beginPath();
    context.arc(centerX, centerY, radius * 0.9, 0, 2 * Math.PI, false);
    
    // Gradiente radial
    const color = darkMode ? 'rgba(255, 255, 255, ' : 'rgba(0, 0, 0, ';
    const gradient = context.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius * 0.9
    );
    gradient.addColorStop(0, color + '1)');
    gradient.addColorStop(0.8, color + '0.9)');
    gradient.addColorStop(1, color + '0)');
    
    context.fillStyle = gradient;
    context.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    return texture;
  }
  
  function animate() {
    animationFrame = requestAnimationFrame(animate);
    updateParticlePositions();
    renderer.render(scene, camera);
  }
  
  function updateParticlePositions() {
    if (!particleSystem) return;
    
    const positions = particleSystem.geometry.getAttribute('position');
    const vertices = positions.array;
    
    const time = Date.now() * 0.0002;
    
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];
      
      const distance = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);
      
      // Configuração do movimento das ondas - mais suave no modo escuro
      const frequencyMultiplier = darkMode ? 0.07 : 0.08;
      const gravityFactorSize = darkMode ? 0.9 : 0.8;
      
      const gravityFactor = 1 - Math.min(1, distance / (GRID_SIZE * gravityFactorSize));
      const waveHeight = (
        Math.sin(distance * frequencyMultiplier - time) * 3.5 +
        Math.sin(distance * (frequencyMultiplier * 2) - time * 0.8) * 0.8 +
        Math.sin(angle * 6 + distance * 0.03) * 0.5
      ) * Math.pow(1 - gravityFactor, 0.4);
      
      // Ajusta o efeito gravitacional com base no modo
      const gravitationalPull = Math.pow(gravityFactor, 1.5) * (darkMode ? 10 : 12);
      
      // Aplica a altura final
      vertices[i + 1] = waveHeight - gravitationalPull;
    }
    
    positions.needsUpdate = true;
  }
</script>

<div class="gravitational-background" bind:this={container}></div>

<style>
  .gravitational-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }
</style> 