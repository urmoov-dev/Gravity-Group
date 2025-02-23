<!-- SpaceBackground.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';

    let container: HTMLElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let stars: THREE.Points;
    let nebulae: THREE.Group;

    onMount(() => {
        initScene();
        animate();

        return () => {
            renderer?.dispose();
            scene?.clear();
        };
    });

    function createNebula(color: number, size: number, opacity: number): THREE.Mesh {
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(color) },
                opacity: { value: opacity }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                uniform float opacity;
                varying vec2 vUv;

                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                float noise(vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);
                    
                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));

                    vec2 u = f * f * (3.0 - 2.0 * f);

                    return mix(a, b, u.x) +
                            (c - a)* u.y * (1.0 - u.x) +
                            (d - b) * u.x * u.y;
                }

                float fbm(vec2 st) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    float frequency = 0.0;
                    
                    for (int i = 0; i < 6; i++) {
                        value += amplitude * noise(st);
                        st *= 2.0;
                        amplitude *= 0.5;
                    }
                    return value;
                }

                void main() {
                    vec2 st = vUv * 3.0;
                    float t = time * 0.1;
                    
                    vec2 q = vec2(0.);
                    q.x = fbm(st + vec2(0.0, 0.0) + t);
                    q.y = fbm(st + vec2(1.0, 1.0) - t);

                    vec2 r = vec2(0.);
                    r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + t);
                    r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) - t);

                    float f = fbm(st + r);

                    vec3 finalColor = mix(
                        vec3(0.0),
                        color,
                        clamp(f * 3.0, 0.0, 1.0)
                    );

                    gl_FragColor = vec4(finalColor, f * opacity);
                }
            `
        });

        return new THREE.Mesh(geometry, material);
    }

    function initScene() {
        // Configuração básica
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Criação das estrelas
        const starsGeometry = new THREE.BufferGeometry();
        const starsVertices = [];
        
        for (let i = 0; i < 15000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(starsVertices, 3)
        );

        const starsMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 1.5,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        // Criação das nebulosas
        nebulae = new THREE.Group();

        // Nebulosa azul principal
        const blueNebula = createNebula(0x4169E1, 2000, 0.3);
        blueNebula.position.z = -500;
        blueNebula.rotation.z = Math.PI * 0.2;
        nebulae.add(blueNebula);

        // Nebulosa verde secundária
        const greenNebula = createNebula(0x00FF7F, 1500, 0.2);
        greenNebula.position.z = -400;
        greenNebula.position.x = 300;
        greenNebula.rotation.z = -Math.PI * 0.3;
        nebulae.add(greenNebula);

        // Nebulosa roxa terciária
        const purpleNebula = createNebula(0x9370DB, 1800, 0.25);
        purpleNebula.position.z = -450;
        purpleNebula.position.x = -200;
        purpleNebula.rotation.z = Math.PI * 0.1;
        nebulae.add(purpleNebula);

        scene.add(nebulae);

        // Posicionamento da câmera
        camera.position.z = 1000;

        // Handler de redimensionamento
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        // Animação das estrelas
        stars.rotation.y += 0.0001;
        stars.rotation.z += 0.0001;

        // Animação das nebulosas
        const time = performance.now() * 0.001;
        nebulae.children.forEach((nebula, index) => {
            const material = nebula.material as THREE.ShaderMaterial;
            material.uniforms.time.value = time;
            nebula.rotation.z += 0.0001 * (index + 1);
        });

        renderer.render(scene, camera);
    }
</script>

<div bind:this={container} class="absolute inset-0 -z-10">
    <!-- Three.js será renderizado aqui -->
</div>

<style>
    div {
        pointer-events: none;
    }
</style> 