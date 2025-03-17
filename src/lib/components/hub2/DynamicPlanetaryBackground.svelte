<!-- DynamicPlanetaryBackground.svelte -->
<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import * as THREE from 'three';
    import { currentLevel } from '$lib/stores/level';
    import { browser } from '$app/environment';
    import { ASTRONOMICAL_LEVELS } from '$lib/types/profile';
    import type { Mesh, Group } from 'three';

    let container: HTMLDivElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let starField: THREE.Points;
    let celestialBody: Mesh;
    let atmosphere: Mesh;
    let rings: Mesh | null = null;
    let warpField: THREE.Points;
    let isTransitioning = false;
    let previousLevel: number;

    // Configurações dos corpos celestes baseadas no nível
    const celestialConfigs = {
        "Terra": {
            color: 0x4169E1,
            size: 5,
            atmosphereColor: 0x4169E1,
            atmosphereSize: 5.2,
            emissiveIntensity: 0.2,
            hasRings: false,
            glowIntensity: 0.3
        },
        "Lua": {
            color: 0xCCCCCC,
            size: 4.5,
            atmosphereColor: 0x888888,
            atmosphereSize: 4.7,
            emissiveIntensity: 0.1,
            hasRings: false,
            glowIntensity: 0.2
        },
        "Marte": {
            color: 0xFF4500,
            size: 4.8,
            atmosphereColor: 0xFF6347,
            atmosphereSize: 5.0,
            emissiveIntensity: 0.2,
            hasRings: false,
            glowIntensity: 0.3
        },
        "Cinturão de Asteroides": {
            color: 0x8B4513,
            size: 0.5,
            atmosphereColor: 0xDAA520,
            atmosphereSize: 8,
            emissiveIntensity: 0.3,
            hasRings: true,
            glowIntensity: 0.4
        },
        "Júpiter": {
            color: 0xFFA500,
            size: 8,
            atmosphereColor: 0xFFD700,
            atmosphereSize: 8.4,
            emissiveIntensity: 0.4,
            hasRings: true,
            glowIntensity: 0.5
        },
        "Estrela Anã Vermelha": {
            color: 0xFF4500,
            size: 6,
            atmosphereColor: 0xFF6347,
            atmosphereSize: 7,
            emissiveIntensity: 0.8,
            hasRings: false,
            glowIntensity: 1.0
        },
        "Sol": {
            color: 0xFFD700,
            size: 10,
            atmosphereColor: 0xFFA500,
            atmosphereSize: 12,
            emissiveIntensity: 1.0,
            hasRings: false,
            glowIntensity: 1.5
        },
        "Estrela Gigante Azul": {
            color: 0x00BFFF,
            size: 15,
            atmosphereColor: 0x1E90FF,
            atmosphereSize: 18,
            emissiveIntensity: 1.2,
            hasRings: false,
            glowIntensity: 2.0
        }
    };

    // Shader para a atmosfera/aura
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
        uniform float glowIntensity;
        void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0) * glowIntensity;
            gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
    `;

    // Shader para o campo de distorção (warp)
    const warpVertexShader = `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        uniform float warpSpeed;
        
        void main() {
            vColor = color;
            vec3 pos = position;
            float speed = warpSpeed * time;
            
            // Efeito de alongamento baseado na velocidade
            pos.z -= speed * 10.0;
            
            // Ajuste do tamanho baseado na velocidade
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (30.0 / -mvPosition.z) * (1.0 + warpSpeed);
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    const warpFragmentShader = `
        varying vec3 vColor;
        
        void main() {
            float r = distance(gl_PointCoord, vec2(0.5));
            if (r > 0.5) discard;
            
            float alpha = 1.0 - (r * 2.0);
            gl_FragColor = vec4(vColor, alpha);
        }
    `;

    function createCelestialBody(config: any) {
        // Remover objetos existentes
        if (celestialBody) scene.remove(celestialBody);
        if (atmosphere) scene.remove(atmosphere);
        if (rings) scene.remove(rings);

        // Criar novo corpo celeste
        const geometry = new THREE.SphereGeometry(config.size, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: config.color,
            emissive: config.color,
            emissiveIntensity: config.emissiveIntensity,
            shininess: 15
        });

        celestialBody = new THREE.Mesh(geometry, material);
        scene.add(celestialBody);

        // Criar atmosfera/aura
        const atmosphereGeometry = new THREE.SphereGeometry(config.atmosphereSize, 64, 64);
        const atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader,
            uniforms: {
                glowColor: { value: new THREE.Color(config.atmosphereColor) },
                glowIntensity: { value: config.glowIntensity }
            },
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        // Criar anéis se necessário
        if (config.hasRings) {
            const ringGeometry = new THREE.RingGeometry(config.size * 1.5, config.size * 2, 64);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: config.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.6
            });

            rings = new THREE.Mesh(ringGeometry, ringMaterial);
            rings.rotation.x = Math.PI / 3;
            scene.add(rings);
        } else {
            rings = null;
        }
    }

    function createScene() {
        if (!browser) return;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Configuração da câmera
        camera.position.z = 20;

        // Luzes
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);

        // Campo de estrelas
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 25000;
        const starsPositions = new Float32Array(starsCount * 3);
        const starsSizes = new Float32Array(starsCount);
        const starsOpacities = new Float32Array(starsCount);

        for (let i = 0; i < starsCount * 3; i += 3) {
            starsPositions[i] = (Math.random() - 0.5) * 300;
            starsPositions[i + 1] = (Math.random() - 0.5) * 300;
            starsPositions[i + 2] = (Math.random() - 0.5) * 300;
            starsSizes[i/3] = Math.random() * 3 + 1;
            starsOpacities[i/3] = Math.random();
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsPositions, 3));
        starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starsSizes, 1));
        starsGeometry.setAttribute('opacity', new THREE.Float32BufferAttribute(starsOpacities, 1));
        
        const starTexture = new THREE.TextureLoader().load('/star.png');
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 1,
            sizeAttenuation: true,
            map: starTexture,
            alphaTest: 0.1,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        // Criar campo de distorção (warp)
        createWarpField();

        // Criar corpo celeste inicial
        const config = celestialConfigs[$currentLevel.name] || celestialConfigs["Terra"];
        createCelestialBody(config);

        // Animação
        function animate() {
            requestAnimationFrame(animate);

            // Rotação do corpo celeste
            if (celestialBody) celestialBody.rotation.y += 0.001;
            if (atmosphere) atmosphere.rotation.y += 0.001;
            if (rings) rings.rotation.z += 0.0005;

            // Movimento e cintilação das estrelas
            starField.rotation.y += 0.0001;
            const time = Date.now() * 0.001;
            const opacities = starField.geometry.attributes.opacity;
            const sizes = starField.geometry.attributes.size;
            
            for(let i = 0; i < starsCount; i++) {
                opacities.array[i] = 0.5 + Math.sin(time + i * 0.1) * 0.5;
                sizes.array[i] = starsSizes[i] * (0.8 + Math.sin(time + i * 0.1) * 0.2);
            }
            opacities.needsUpdate = true;
            sizes.needsUpdate = true;

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

            if (celestialBody) {
                celestialBody.rotation.x += (targetRotationX - celestialBody.rotation.x) * 0.05;
                celestialBody.rotation.y += (targetRotationY - celestialBody.rotation.y) * 0.05;
            }

            if (atmosphere) {
                atmosphere.rotation.x += (targetRotationX - atmosphere.rotation.x) * 0.05;
                atmosphere.rotation.y += (targetRotationY - atmosphere.rotation.y) * 0.05;
            }

            if (rings) {
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

    function createWarpField() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const sizes = [];

        for (let i = 0; i < 1000; i++) {
            vertices.push(
                Math.random() * 400 - 200,
                Math.random() * 400 - 200,
                Math.random() * 400 - 200
            );

            const color = new THREE.Color();
            color.setHSL(0.6, 0.8, 0.9);
            colors.push(color.r, color.g, color.b);
            
            sizes.push(Math.random() * 2);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                warpSpeed: { value: 0 }
            },
            vertexShader: warpVertexShader,
            fragmentShader: warpFragmentShader,
            transparent: true,
            vertexColors: true
        });

        warpField = new THREE.Points(geometry, material);
        scene.add(warpField);
    }

    async function transitionToLevel(newLevelId: number) {
        if (isTransitioning) return;
        isTransitioning = true;

        const duration = 2000; // 2 segundos
        const startTime = Date.now();
        const newLevel = ASTRONOMICAL_LEVELS.find(level => level.id === newLevelId);
        if (!newLevel) {
            isTransitioning = false;
            return;
        }

        // Configurar animação de warp
        const material = warpField.material as THREE.ShaderMaterial;
        
        // Animar a transição
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Efeito de aceleração não-linear
            const easeInOut = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            // Atualizar velocidade do warp
            material.uniforms.warpSpeed.value = easeInOut;
            material.uniforms.time.value += 0.1;

            // Rotação e escala do corpo celeste atual
            if (celestialBody) {
                celestialBody.rotation.y += 0.05 * easeInOut;
                if (celestialBody instanceof THREE.Mesh) {
                    celestialBody.scale.setScalar(1 - easeInOut * 0.5);
                }
            }

            // Continuar animação se não terminou
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Finalizar transição
                material.uniforms.warpSpeed.value = 0;
                const config = celestialConfigs[newLevel.name];
                if (config) {
                    createCelestialBody(config);
                }
                isTransitioning = false;
            }
        }

        animate();
    }

    // Atualizar o corpo celeste quando o nível mudar
    $: if (scene && $currentLevel) {
        const config = celestialConfigs[$currentLevel.name] || celestialConfigs["Terra"];
        createCelestialBody(config);
    }

    onMount(() => {
        const cleanup = createScene();
        previousLevel = $currentLevel.id;
        window.addEventListener('resize', cleanup);

        return () => {
            window.removeEventListener('resize', cleanup);
            if (renderer) {
                renderer.dispose();
            }
        };
    });

    afterUpdate(() => {
        if (previousLevel !== $currentLevel.id) {
            transitionToLevel($currentLevel.id);
            previousLevel = $currentLevel.id;
        }
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
        background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
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