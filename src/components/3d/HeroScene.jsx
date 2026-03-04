import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PresentationControls, MeshDistortMaterial, Sphere, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const ShieldModel = () => {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const { x, y } = state.mouse;
        if (meshRef.current) {
            // Combine auto-rotation with mouse parallax
            meshRef.current.rotation.y = t * 0.2 + x * 0.5;
            meshRef.current.rotation.x = y * 0.2;
            meshRef.current.position.y = Math.sin(t * 0.5) * 0.1 + y * 0.2;
            meshRef.current.position.x = x * 0.2;
        }
    });

    return (
        <group>
            {/* Main Holographic Shield */}
            <mesh ref={meshRef}>
                <octahedronGeometry args={[2, 0]} />
                <MeshDistortMaterial
                    color="#2563eb"
                    speed={2}
                    distort={0.4}
                    radius={1}
                    transparent
                    opacity={0.6}
                    wireframe
                />
            </mesh>

            {/* Inner Core */}
            <mesh scale={0.8}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={2} />
            </mesh>

            {/* Ambient Glow */}
            <Sphere args={[2.5, 32, 32]}>
                <meshBasicMaterial color="#2563eb" transparent opacity={0.05} side={THREE.BackSide} />
            </Sphere>
        </group>
    );
};

const HeroScene = () => {
    return (
        <div className="canvas-fixed">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                <PresentationControls
                    global
                    config={{ mass: 2, tension: 500 }}
                    snap={{ mass: 4, tension: 1500 }}
                    rotation={[0, 0.3, 0]}
                    polar={[-Math.PI / 3, Math.PI / 3]}
                    azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                >
                    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
                        <ShieldModel />
                    </Float>
                </PresentationControls>
            </Canvas>
        </div>
    );
};

export default HeroScene;
