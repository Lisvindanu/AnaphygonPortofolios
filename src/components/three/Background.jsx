// src/components/three/Background.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ count = 5000 }) {
  const points = useRef();
  
  // Generate random points in a sphere
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);
  
  useFrame((state) => {
    const { clock } = state;
    points.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    points.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.1;
  });
  
  return (
    <Points ref={points} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00FFFF"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default Background;