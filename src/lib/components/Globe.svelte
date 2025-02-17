<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let container;
  
  onMount(() => {
    try {
      const scene = new THREE.Scene();
      
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      
      // Remover background do scene para permitir transparência
      scene.background = null;
      
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      // Criar o globo com linhas de latitude e longitude
      const radius = 4;
      const segments = 50;
      const geometry = new THREE.SphereGeometry(radius, segments, segments);
      
      // Material mais brilhante para o globo
      const material = new THREE.MeshPhongMaterial({
        color: 0x4CAF50,
        wireframe: true,
        emissive: 0x4CAF50,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.8
      });
      
      const globe = new THREE.Mesh(geometry, material);

      // Adicionar linhas de grade mais visíveis
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4CAF50,
        transparent: true,
        opacity: 0.3
      });

      // Adicionar meridianos
      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const geometry = new THREE.BufferGeometry();
        const points = [];
        for (let j = 0; j <= 180; j++) {
          const phi = (j / 180) * Math.PI;
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          points.push(new THREE.Vector3(x, y, z));
        }
        geometry.setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        globe.add(line);
      }

      scene.add(globe);

      // Adicionar estrelas mais brilhantes
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.3,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true
      });

      const starsVertices = [];
      for (let i = 0; i < 5000; i++) {
        const spread = 100;
        const x = (Math.random() - 0.5) * spread;
        const y = (Math.random() - 0.5) * spread;
        const z = (Math.random() - 0.5) * spread;
        starsVertices.push(x, y, z);
      }

      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);

      // Posicionar câmera mais próxima
      camera.position.z = 10;

      // Adicionar luzes
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      // Animação
      function animate() {
        requestAnimationFrame(animate);
        
        // Rotação mais suave do globo
        globe.rotation.y += 0.002;
        
        // Rotação das estrelas
        stars.rotation.y += 0.0003;
        
        renderer.render(scene, camera);
      }

      animate();

      // Responsividade
      function handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        container.removeChild(renderer.domElement);
      };
    } catch (error) {
      console.error('Erro ao inicializar Three.js:', error);
    }
  });
</script>

<div bind:this={container} class="fixed top-0 left-0 w-full h-full -z-10"></div>

<style>
  div {
    background: radial-gradient(circle at center, rgba(26, 35, 126, 0.3) 0%, rgba(0, 0, 0, 0.9) 100%);
  }
</style> 