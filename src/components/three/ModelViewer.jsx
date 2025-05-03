// src/components/three/ModelViewer.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

// Example 3D Model component
const Model = ({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const groupRef = useRef();
  const { scene } = useGLTF(url);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <primitive object={scene} />
    </group>
  );
};

const ModelViewer = ({ 
  modelUrl = '/models/default.glb', 
  backgroundColor = '#000000',
  height = '400px',
  autoRotate = true,
  controls = true,
  environment = 'city'
}) => {
  return (
    <div style={{ height, backgroundColor }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Fallback component if model URL is not provided */}
        {!modelUrl ? (
          <mesh>
            <torusKnotGeometry args={[1, 0.3, 128, 32]} />
            <meshStandardMaterial color="#00FFFF" metalness={0.5} roughness={0.2} />
          </mesh>
        ) : (
          <Model url={modelUrl} scale={1} />
        )}
        
        {controls && <OrbitControls autoRotate={autoRotate} autoRotateSpeed={1} />}
        {environment && <Environment preset={environment} />}
      </Canvas>
    </div>
  );
};

export default ModelViewer;