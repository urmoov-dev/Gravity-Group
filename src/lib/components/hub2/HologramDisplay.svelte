<!-- HologramDisplay.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';

    let container: HTMLElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let hologramRing: THREE.Mesh;

    onMount(() => {
        initHologram();
        animate();

        return () => {
            renderer?.dispose();
            scene?.clear();
        };
    });

    function initHologram() {
        // Configuração básica
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Criação do anel holográfico
        const ringGeometry = new THREE.TorusGeometry(5, 0.2, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        hologramRing = new THREE.Mesh(ringGeometry, ringMaterial);
        scene.add(hologramRing);

        // Adicionar efeitos de luz
        const light = new THREE.PointLight(0x00ffff, 1, 100);
        light.position.set(0, 0, 10);
        scene.add(light);

        // Posicionamento da câmera
        camera.position.z = 15;

        // Handler de redimensionamento
        window.addEventListener('resize', onHologramResize);
    }

    function onHologramResize() {
        if (container) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        // Rotação do anel
        if (hologramRing) {
            hologramRing.rotation.x += 0.01;
            hologramRing.rotation.y += 0.005;
        }

        renderer.render(scene, camera);
    }
</script>

<div class="hologram-container relative w-full h-full">
    <!-- Container Three.js -->
    <div bind:this={container} class="absolute inset-0"></div>

    <!-- Overlay com conteúdo -->
    <div class="absolute inset-0 flex items-center justify-center">
        <div class="hologram-content relative z-10">
            <slot />
        </div>
    </div>

    <!-- Efeitos de projeção -->
    <div class="projection-lines"></div>
</div>

<style>
    .hologram-container {
        perspective: 1000px;
        background: radial-gradient(
            circle at center,
            rgba(0, 255, 255, 0.1) 0%,
            transparent 70%
        );
    }

    .hologram-content {
        animation: hologramFloat 4s ease-in-out infinite;
    }

    .projection-lines {
        position: absolute;
        inset: 0;
        background: 
            repeating-linear-gradient(
                0deg,
                transparent,
                rgba(0, 255, 255, 0.1) 1px,
                transparent 2px
            );
        opacity: 0.5;
        pointer-events: none;
    }

    .projection-lines::before,
    .projection-lines::after {
        content: '';
        position: absolute;
        left: 50%;
        width: 1px;
        height: 100%;
        background: linear-gradient(
            to bottom,
            transparent,
            rgba(0, 255, 255, 0.5),
            transparent
        );
        animation: scanVertical 2s linear infinite;
    }

    .projection-lines::after {
        animation-delay: 1s;
    }

    @keyframes hologramFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    @keyframes scanVertical {
        from { transform: translateY(-100%); }
        to { transform: translateY(100%); }
    }
</style> 