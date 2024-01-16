// Import necessary Three.js components
'use client';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import styles from '@/app/styles/common.module.css';
import { createNoise2D, createNoise3D } from 'simplex-noise';


const Cursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [speed, setSpeed] = useState(60.0);
    const [spikes, setSpikes] = useState(1);
    const [processing, setProcessing] = useState(1);

    const bubbleRef = useRef(null);

    useEffect(() => {
        // Velocity
        const velocity = new THREE.Vector2(0, 0);
        const dampingFactor = 0.95;
        
        // Scene & Camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setPixelRatio(2);
        renderer.setSize(window.innerWidth, window.innerHeight);
        const container = bubbleRef.current;
        container.appendChild(renderer.domElement);

        // Bubble
        const bubbleGeometry = new THREE.CircleGeometry(20, 128, 6, 6.3);
        const bubbleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color1: { value: new THREE.Color("#FE390C") },
                color2: { value: new THREE.Color("#FACE40") },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                void main() {
                    gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
                }
            `,
        });

        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        scene.add(bubble);

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        const noise = createNoise3D();

        const animate = () => {
            const time = performance.now() * 0.00001 * speed * Math.pow(processing, 3);

            const positions = bubble.geometry.attributes.position.array;
            let scale;

            for (let i = 0; i < positions.length; i += 3) {
                const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);

                // Update vertex positions based on noise functions
                const noiseValue = noise(vertex.x * 0.1, vertex.y * 0.1, time * 0.1) * Math.sin(vertex.x * spikes) * Math.sin(vertex.y * spikes + time);
                scale = 1 + 0.3 * noiseValue;
                vertex.normalize().multiplyScalar(scale);
                // vertex.normalize().multiplyScalar(1 + 0.3 * Math.sin(vertex.x * spikes) * Math.sin(vertex.y * spikes + time));


                positions[i] = vertex.x;
                positions[i + 1] = vertex.y;
                positions[i + 2] = vertex.z;
            }

            bubble.scale.set(scale, scale, scale);

            bubble.geometry.attributes.position.needsUpdate = true;
            // const mouseX = (position.x / window.innerWidth) * 2 - 1;
            // const mouseY = -(position.y / window.innerHeight) * 2 + 1;

            const mouseVector = new THREE.Vector3(position.x, position.y, 0);
            // mouseVector.unproject(camera);

            bubble.position.set(mouseVector.x, mouseVector.y, 0); 

            renderer.render(scene, camera);

            requestAnimationFrame(animate);
        };


        animate();
        const handleMouseMove = (event) => {
            // setPosition({ x: event.clientX, y: event.clientY });
            const mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
            const mouseY = - ( event.clientY / window.innerHeight ) * 2 + 1;
            const fovHalfRadians = Math.tan (Math.PI / 180 * 75 / 2);

            position.x = mouseX * camera.position.z * fovHalfRadians ;
            position.y = mouseY * camera.position.z * fovHalfRadians / 2;

            // const targetX = mouseX * camera.position.z * fovHalfRadians ;
            // const targetY = mouseY * camera.position.z * fovHalfRadians / 2;

            // velocity.x += (targetX - position.x) * 0.05;
            // velocity.y += (targetY - position.y) * 0.05;

            // velocity.x *= dampingFactor;
            // velocity.y *= dampingFactor;
            // position.x += velocity.x;
            // position.y += velocity.y;
        };
        window.addEventListener('mousemove', handleMouseMove, false);


        // Cleanup
        // return () => {
        //     window.removeEventListener('resize', handleResize);
        //     window.removeEventListener('mousemove', handleMouseMove);
        // };
    }, [speed, spikes, processing]); // Re-run when speed, spikes, or processing change

    return (
        <div ref={bubbleRef} className={styles.webgl}></div>
    );
};

export default Cursor;