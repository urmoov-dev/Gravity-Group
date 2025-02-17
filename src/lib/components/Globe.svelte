<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let container;
  
  onMount(() => {
    if (!THREE.WebGLRenderer) {
      console.error('WebGL não está disponível no seu navegador');
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Fundo preto
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Criar o globo com linhas de latitude e longitude
    const radius = 5;
    const segments = 32;
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const material = new THREE.MeshBasicMaterial({
      color: 0x4CAF50,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const globe = new THREE.Mesh(geometry, material);

    // Adicionar linhas de grade (meridianos e paralelos)
    const gridHelper = new THREE.GridHelper(radius * 2, 10);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    globe.add(gridHelper);

    scene.add(globe);

    // Adicionar estrelas mais visíveis
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.2,
      transparent: true,
      opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 3000; i++) {
      const spread = 100;
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread;
      const z = (Math.random() - 0.5) * spread;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Posicionar câmera
    camera.position.z = 15;

    // Luz ambiente para melhor visualização
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Animação
    function animate() {
      requestAnimationFrame(animate);
      
      // Rotação mais suave do globo
      globe.rotation.y += 0.001;
      globe.rotation.x += 0.0005;
      
      // Rotação mais lenta das estrelas
      stars.rotation.y += 0.0002;
      
      renderer.render(scene, camera);
    }

    animate();

    // Responsividade melhorada
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
    };
  });
</script>

<div bind:this={container} class="fixed top-0 left-0 w-full h-full -z-10"></div>

<style>
  div {
    background: radial-gradient(circle at center, #1a237e 0%, #000000 100%);
  }
</style> 