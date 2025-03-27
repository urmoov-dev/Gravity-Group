<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';

    let container: HTMLDivElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let gridPoints: THREE.Points;
    let animationFrame: number;

    // Configurações do grid
    const GRID_SIZE = 400;
    const GRID_RESOLUTION = 180;
    const PARTICLE_COUNT = GRID_RESOLUTION * GRID_RESOLUTION;
    const GRID_SPACING = 2.0;

    onMount(() => {
        initScene();
        createGrid();
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
            renderer.dispose();
        };
    });

    function initScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        (renderer as any).setClearColor(0x121215, 1);
        container.appendChild(renderer.domElement);
        
        // Posiciona a câmera
        camera.position.z = 80;
        camera.position.y = 5;
        (camera as any).lookAt(0, 1, 0);
        
        // Ajusta o fog para fade gradual
        (scene as any).fog = new THREE.FogExp2(0x121215, 0.001);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Luz direcional para sombras sutis
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);
    }

    function createGrid() {
        // Cria um grid plano de partículas
        const vertices = [];
        const colors = [];
        
        // Criar um plano de partículas no padrão de grid com maior espaçamento
        for (let i = 0; i < GRID_RESOLUTION; i++) {
            for (let j = 0; j < GRID_RESOLUTION; j++) {
                const x = (i / (GRID_RESOLUTION - 1) * GRID_SIZE * GRID_SPACING) - (GRID_SIZE * GRID_SPACING / 2);
                const z = (j / (GRID_RESOLUTION - 1) * GRID_SIZE * GRID_SPACING) - (GRID_SIZE * GRID_SPACING / 2.5);
                
                // Altura inicial plana
                const y = 0;
                
                vertices.push(x, y, z);
                
                // Cor neutra com gradação baseada na distância
                const distance = Math.sqrt(x * x + z * z);
                const distanceFade = Math.max(0, 1 - (distance / (GRID_SIZE * 1.2)));
                const intensity = 0.15 + (distanceFade * 0.6);
                
                // Cores neutras para o grid (tons de branco/cinza)
                colors.push(intensity, intensity, intensity);
            }
        }
        
        // Cria a geometria e atributos para as partículas
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        // Cria uma textura circular para as partículas
        const particleTexture = createCircleTexture(128);
        
        // Material para as partículas
        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            map: particleTexture,
            transparent: true,
            opacity: 1.0,
            alphaTest: 0.2,
            sizeAttenuation: true,
            fog: true
        });
        
        // Cria o sistema de partículas e o adiciona à cena
        gridPoints = new THREE.Points(geometry, material);
        scene.add(gridPoints);
    }
    
    // Função para criar uma textura circular para as partículas
    function createCircleTexture(size = 128) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        
        const context = canvas.getContext('2d');
        if (!context) return new THREE.Texture();
        
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2;
        
        // Limpa o canvas para garantir transparência
        context.clearRect(0, 0, size, size);
        
        // Desenha um círculo com gradiente
        context.beginPath();
        context.arc(centerX, centerY, radius * 0.9, 0, 2 * Math.PI, false);
        
        // Cria um gradiente radial
        const gradient = context.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius * 0.9
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = gradient;
        context.fill();
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        return texture;
    }
    
    function animate() {
        animationFrame = requestAnimationFrame(animate);
        
        // Animação suave do grid
        animateGrid();
        
        renderer.render(scene, camera);
    }
    
    function animateGrid() {
        if (!gridPoints) return;
        
        const positions = gridPoints.geometry.getAttribute('position');
        const time = Date.now() * 0.0002;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            
            // Cria ondas suaves no grid
            const distance = Math.sqrt(x * x + z * z);
            const amplitude = Math.max(0, 1 - distance / (GRID_SIZE * 0.8)) * 3;
            
            // Usa múltiplas ondas senoidais para criar um padrão mais orgânico
            const wave1 = Math.sin(x * 0.02 + time) * amplitude;
            const wave2 = Math.sin(z * 0.02 + time * 0.8) * amplitude * 0.5;
            
            const y = wave1 + wave2;
            
            positions.setY(i, y);
        }
        
        positions.needsUpdate = true;
    }
</script>

<div class="modern-background" bind:this={container}>
    <div class="overlay"></div>
</div>

<style>
    .modern-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        overflow: hidden;
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, 
                    rgba(18, 18, 21, 0) 0%, 
                    rgba(18, 18, 21, 0.2) 50%, 
                    rgba(10, 10, 15, 0.5) 100%);
        pointer-events: none;
    }
</style> 