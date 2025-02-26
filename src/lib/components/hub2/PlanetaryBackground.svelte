<!-- PlanetaryBackground.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';

    let container: HTMLDivElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let starField: THREE.Points;
    let planet: THREE.Object3D;
    let atmosphere: THREE.Object3D;
    let rings: THREE.Object3D | null = null;

    // Configurações dos planetas baseadas no nível da conta
    const planetConfigs = {
        moon: {
            color: 0x888888,
            size: 5,
            atmosphereColor: 0x222244,
            atmosphereSize: 5.2,
            emissiveIntensity: 0.1,
            hasRings: false
        },
        mars: {
            color: 0xcc4422,
            size: 6,
            atmosphereColor: 0x441111,
            atmosphereSize: 6.3,
            emissiveIntensity: 0.2,
            hasRings: false
        },
        jupiter: {
            color: 0xddaa88,
            size: 7,
            atmosphereColor: 0x443322,
            atmosphereSize: 7.4,
            emissiveIntensity: 0.3,
            hasRings: false
        },
        saturn: {
            color: 0xddcc99,
            size: 8,
            atmosphereColor: 0x443322,
            atmosphereSize: 8.5,
            emissiveIntensity: 0.4,
            hasRings: true
        }
    };

    // Shader para a atmosfera
    const atmosphereVertexShader = `
        varying vec3 vNormal;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const atmosphereFragmentShader = `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
    `;

    function initScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Configuração da câmera
        camera.position.z = 20;

        // Luz direcional
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);

        // Criação das estrelas
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 25000;
        const starsPositions = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount * 3; i += 3) {
            starsPositions[i] = (Math.random() - 0.5) * 200;
            starsPositions[i + 1] = (Math.random() - 0.5) * 200;
            starsPositions[i + 2] = (Math.random() - 0.5) * 200;
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsPositions, 3));
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        // Criação do planeta
        const planetConfig = planetConfigs.saturn; // Exemplo usando Saturno
        const planetGeometry = new THREE.SphereGeometry(planetConfig.size, 64, 64);
        const planetMaterial = new THREE.MeshPhongMaterial({
            color: planetConfig.color,
            emissive: planetConfig.color,
            emissiveIntensity: planetConfig.emissiveIntensity,
            shininess: 15
        });

        planet = new THREE.Mesh(planetGeometry, planetMaterial);
        scene.add(planet);

        // Criação da atmosfera
        const atmosphereGeometry = new THREE.SphereGeometry(planetConfig.atmosphereSize, 64, 64);
        const atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader,
            uniforms: {
                glowColor: { value: new THREE.Color(planetConfig.atmosphereColor) }
            },
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        // Criação dos anéis (apenas para Saturno)
        if (planetConfig.hasRings) {
            const ringGeometry = new THREE.RingGeometry(12, 16, 64);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: 0xaa9977,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.6
            });

            const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
            ringMesh.rotation.x = Math.PI / 3;
            scene.add(ringMesh);
            rings = ringMesh;
        }

        // Animação
        function animate() {
            requestAnimationFrame(animate);

            // Rotação do planeta
            planet.rotation.y += 0.001;
            atmosphere.rotation.y += 0.001;
            
            // Movimento dos anéis (se existirem)
            if (rings !== null) {
                rings.rotation.z += 0.0005;
            }

            // Movimento suave das estrelas
            starField.rotation.y += 0.0001;

            renderer.render(scene, camera);
        }

        animate();

        // Responsividade
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', onWindowResize);

        // Interatividade com o mouse
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;

        function onMouseMove(event: MouseEvent) {
            mouseX = (event.clientX - window.innerWidth / 2) / 100;
            mouseY = (event.clientY - window.innerHeight / 2) / 100;

            targetRotationX = mouseY * 0.05;
            targetRotationY = mouseX * 0.05;

            planet.rotation.x += (targetRotationX - planet.rotation.x) * 0.05;
            planet.rotation.y += (targetRotationY - planet.rotation.y) * 0.05;

            atmosphere.rotation.x += (targetRotationX - atmosphere.rotation.x) * 0.05;
            atmosphere.rotation.y += (targetRotationY - atmosphere.rotation.y) * 0.05;

            if (rings !== null) {
                rings.rotation.x += (targetRotationX - rings.rotation.x) * 0.05;
                rings.rotation.y += (targetRotationY - rings.rotation.y) * 0.05;
            }
        }

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('mousemove', onMouseMove);
            renderer.dispose();
            scene.clear();
        };
    }

    onMount(() => {
        const cleanup = initScene();
        return cleanup;
    });
</script>

<div class="planetary-background" bind:this={container}>
    <div class="overlay"></div>
</div>

<style>
    .planetary-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        overflow: hidden;
        background: radial-gradient(circle at 50% 50%, #000922 0%, #000 100%);
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0, 20, 40, 0.2), rgba(0, 0, 0, 0.4));
        pointer-events: none;
    }

    :global(canvas) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100% !important;
        height: 100% !important;
    }
</style> 