import React, { useRef } from 'react'
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Bounds } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from 'three';

// Improved STL Model component
const STLModel = ({ filePath }) => {
  const geometry = useLoader(STLLoader, filePath);
  const meshRef = useRef();
  
  // Calculate bounding box for proper centering and scaling
  const bbox = new THREE.Box3().setFromObject(new THREE.Mesh(geometry));
  const center = bbox.getCenter(new THREE.Vector3());
  const size = bbox.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2 / maxDim;  // Normalize size
  
  return (
    <mesh
      ref={meshRef}
      scale={scale}
      position={[-center.x * scale, -center.y * scale, -center.z * scale]}
      castShadow 
      receiveShadow
    >
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial 
        color="silver" 
        metalness={0.8} 
        roughness={0.3} 
      />
    </mesh>
  );
};

// // Camera adjustment helper
// const CameraController = () => {
//   const { camera } = useThree();
//   return null;
// };

const CADFileViewer = ({ file }) => {
  console.log(file);
  
  return (
    <div style={{ width: "90vw", height: "90vh", backgroundColor: "#2a2a2a" }}>
      <Canvas 
        shadows 
        camera={{ position: [ 10, 10, 15], fov: 55 }}
        shadowMap={{ type: THREE.PCFSoftShadowMap }} // it makes the shadow softer than defualt one
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[100, 10, 15]} fov={45} />

        {/* Improved lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 10, 7]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.4} />
        
        {/* Environmental hemisphere light for better shading */}
        <hemisphereLight 
          args={['#ddeeff', '#202020', 0.6]} 
        />

        {/* Model */}
        <Bounds fit margin={1.2}>
          <STLModel filePath={file.path} />
        </Bounds>

        {/* Improved controls */}
        <OrbitControls 
          enableDamping={true}
          dampingFactor={0.1}
          rotateSpeed={0.7}
          panSpeed={0.5}
          zoomSpeed={0.8}
          minDistance={1}
          maxDistance={100}
          target={[0, 0, 0]}
        />
        
        {/* Simple ground plane for shadow casting */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
      </Canvas>
    </div>
  )
}

export default CADFileViewer