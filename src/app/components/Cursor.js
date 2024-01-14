// Import necessary Three.js components
'use client';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import styles from '@/app/styles/common.module.css';

const Cursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [speed, setSpeed] = useState(50.0);
    const [spikes, setSpikes] = useState(1.2);
    const [processing, setProcessing] = useState(1.1);

    const bubbleRef = useRef();

    useEffect(() => {
        // Scene & Camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

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

        const animate = () => {
            const time = performance.now() * 0.00001 * speed * Math.pow(processing, 3);

            const positions = bubble.geometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);

                // Update vertex positions based on noise functions
                vertex.normalize().multiplyScalar(1 + 0.3 * Math.sin(vertex.x * spikes) * Math.sin(vertex.y * spikes + time));

                positions[i] = vertex.x;
                positions[i + 1] = vertex.y;
                positions[i + 2] = vertex.z;
            }

            bubble.geometry.attributes.position.needsUpdate = true;
            const mouseX = (position.x / window.innerWidth) * 2 - 1;
            const mouseY = -(position.y / window.innerHeight) * 2 + 1;

            const mouseVector = new THREE.Vector3(mouseX, mouseY, 0);
            mouseVector.unproject(camera);

            bubble.position.set(mouseVector.x, mouseVector.y, 0); 

            renderer.render(scene, camera);

            requestAnimationFrame(animate);
        };


        animate();
        const handleMouseMove = (event) => {
            setPosition({ x: event.clientX, y: event.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);


        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [speed, spikes, processing]); // Re-run when speed, spikes, or processing change

    return null;
};

export default Cursor;