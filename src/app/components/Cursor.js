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

        // Handle mouse move
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        document.addEventListener('mousemove', handleMouseMove);

        // Animation loop
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

            renderer.render(scene, camera);

            requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [speed, spikes, processing]); // Re-run when speed, spikes, or processing change

    return (
        <div>
        
        </div>
    );
};

export default Cursor;


// 'use client';
// import {useState} from 'react';
// import styles from '@/app/styles/common.module.css'

// const Cursor = () => {
//     const [position, setPosition] = useState({ x: 0, y: 0 });

//     const handleMouseMove = (e) => {
//         setPosition({ x: e.clientX, y: e.clientY });
//     };
//     return (
//         <div style={{
//           position: 'absolute',
//           width: '100%',
//           height: '100%',
//           overflow: 'hidden',
//         }}
//         onMouseMove={handleMouseMove}>
//             <div className={styles.jigglyCircle} style={{
//             transform: `translate(${position.x-29}px, ${position.y-27}px)`,
//             }}></div>
//         </div>
//     );
// };

// export default Cursor;