// Import necessary Three.js components
'use client';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import styles from '@/app/styles/common.module.css';
import { createNoise2D, createNoise3D } from 'simplex-noise';
import PlayButton from '../components/PlayButton';

const Cursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [speed, setSpeed] = useState(60.0);
    const [spikes, setSpikes] = useState(1);
    const [processing, setProcessing] = useState(1);
    const [isPlaying, setPlaying] = useState(false);
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

        //Audio
        const audioListener = new THREE.AudioListener();
        camera.add(audioListener);
        const audio = new THREE.Audio(audioListener);
        // audio.hasPlaybackControl(true);
        const audioLoader = new THREE.AudioLoader();
        const handlePlayButtonClick = () => {
            if (!audio.isPlaying) {
                audioLoader.load('/music.mp3', function (buffer) {
                    audio.setBuffer(buffer);
                    // audio.play();
                    audio.play();
                    console.log(isPlaying);
                });
            } else {
                audio.pause();
            }
            setPlaying(!isPlaying);
        }
        window.addEventListener('click', handlePlayButtonClick);
        const analyser = new THREE.AudioAnalyser(audio, 32);

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
            const frequency = analyser.getAverageFrequency();
            let scale;

            for (let i = 0; i < positions.length; i += 3) {
                const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);

                // Update vertex positions based on noise functions
                const noiseValue = noise(vertex.x * 0.1, vertex.y * 0.1, time * 0.1) * Math.sin(vertex.x * spikes) * Math.sin(vertex.y * spikes + time);
                scale = audio.isPlaying ? 1 + 0.3 * noiseValue * (frequency/30) : 1 + 0.3 * noiseValue;
                vertex.normalize().multiplyScalar(scale);
                // vertex.normalize().multiplyScalar(1 + 0.3 * Math.sin(vertex.x * spikes) * Math.sin(vertex.y * spikes + time));


                positions[i] = vertex.x;
                positions[i + 1] = vertex.y;
                positions[i + 2] = vertex.z;
            }
            if (audio.isPlaying){
                bubble.scale.set((frequency / 30), (frequency / 30), (frequency / 30));
            } else {
                bubble.scale.set(scale, scale, scale);
            }

            bubble.geometry.attributes.position.needsUpdate = true;

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

            const targetX = mouseX * camera.position.z * fovHalfRadians;
            const targetY = mouseY * camera.position.z * fovHalfRadians / 2;

            // Smoothly interpolate current position to target position
            position.x = THREE.MathUtils.lerp(position.x, targetX, 0.15);
            position.y = THREE.MathUtils.lerp(position.y, targetY, 0.15);

            // position.x = mouseX * camera.position.z * fovHalfRadians ;
            // position.y = mouseY * camera.position.z * fovHalfRadians / 2;
        };
        window.addEventListener('mousemove', handleMouseMove, false);


        // Cleanup
        // return () => {
        //     window.removeEventListener('click', handlePlayButtonClick);
        //     window.removeEventListener('resize', handleResize);
        //     window.removeEventListener('mousemove', handleMouseMove);
        // };
    }, [speed, spikes, processing]); // Re-run when speed, spikes, or processing change

    return (
        <>
            <div ref={bubbleRef} className={styles.webgl}></div>
            {/* <PlayButton onClick={handlePlayButtonClick} /> */}
        </>
    );
};

export default Cursor;