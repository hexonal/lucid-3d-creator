
import { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, useGLTF, Preload, Center } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { Button } from '@/components/ui/button';
import { RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface SceneProps {
  scene?: any;
}

// Basic model component
const SimpleRoom = () => {
  const group = useRef<Group>(null);

  useEffect(() => {
    if (group.current) {
      group.current.rotation.y = Math.PI / 8;
    }
  }, []);

  return (
    <Center>
      <group ref={group}>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#f3f4f6" />
        </mesh>
        
        {/* Wall 1 */}
        <mesh position={[0, 2, -5]}>
          <boxGeometry args={[10, 5, 0.1]} />
          <meshStandardMaterial color="#e5e7eb" />
        </mesh>
        
        {/* Wall 2 */}
        <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[10, 5, 0.1]} />
          <meshStandardMaterial color="#d1d5db" />
        </mesh>
        
        {/* Table */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.5, 0.1, 0.8]} />
          <meshStandardMaterial color="#9b87f5" />
        </mesh>
        
        {/* Table legs */}
        <mesh position={[0.65, 0, 0.25]}>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color="#7E69AB" />
        </mesh>
        <mesh position={[-0.65, 0, 0.25]}>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color="#7E69AB" />
        </mesh>
        <mesh position={[0.65, 0, -0.25]}>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color="#7E69AB" />
        </mesh>
        <mesh position={[-0.65, 0, -0.25]}>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color="#7E69AB" />
        </mesh>
        
        {/* Chair */}
        <mesh position={[0, 0.45, 1.2]}>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
          <meshStandardMaterial color="#6E59A5" />
        </mesh>
        <mesh position={[0, 1, 1.6]}>
          <boxGeometry args={[0.8, 1, 0.1]} />
          <meshStandardMaterial color="#6E59A5" />
        </mesh>
        
        {/* Chair legs */}
        <mesh position={[0.35, 0, 1.5]}>
          <boxGeometry args={[0.05, 0.9, 0.05]} />
          <meshStandardMaterial color="#6E59A5" />
        </mesh>
        <mesh position={[-0.35, 0, 1.5]}>
          <boxGeometry args={[0.05, 0.9, 0.05]} />
          <meshStandardMaterial color="#6E59A5" />
        </mesh>
        <mesh position={[0.35, 0, 0.9]}>
          <boxGeometry args={[0.05, 0.9, 0.05]} />
          <meshStandardMaterial color="#6E59A5" />
        </mesh>
        <mesh position={[-0.35, 0, 0.9]}>
          <boxGeometry args={[0.05, 0.9, 0.05]} />
          <meshStandardMaterial color="#6E59A5" />
        </mesh>
        
        {/* Plant */}
        <mesh position={[3, 0.5, -3]}>
          <cylinderGeometry args={[0.3, 0.4, 1, 16]} />
          <meshStandardMaterial color="#D6BCFA" />
        </mesh>
        
        {/* Plant leaves */}
        <mesh position={[3, 1.1, -3]}>
          <sphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#34D399" />
        </mesh>
      </group>
    </Center>
  );
};

// Camera controller
const CameraController = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return <OrbitControls enableDamping dampingFactor={0.1} enableZoom={true} enablePan={true} args={[camera, gl.domElement]} />;
};

// Scene controls component - renamed for clarity
const SceneControlPanel = () => {
  const { camera, scene } = useThree();
  
  const handleResetView = () => {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  };
  
  const handleZoomIn = () => {
    camera.position.lerp(camera.position.clone().multiplyScalar(0.8), 0.5);
  };
  
  const handleZoomOut = () => {
    camera.position.lerp(camera.position.clone().multiplyScalar(1.2), 0.5);
  };

  return (
    <div className="scene-controls">
      <button onClick={handleResetView} className="scene-control-button">
        <RotateCw className="h-4 w-4" />
      </button>
      <button onClick={handleZoomIn} className="scene-control-button">
        <ZoomIn className="h-4 w-4" />
      </button>
      <button onClick={handleZoomOut} className="scene-control-button">
        <ZoomOut className="h-4 w-4" />
      </button>
    </div>
  );
};

const SceneViewer = ({ scene }: SceneProps) => {
  return (
    <div className="scene-viewer-container">
      <Canvas shadows>
        <CameraController />
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[10, 10, 10]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <SimpleRoom />
        <Grid infiniteGrid cellSize={1} sectionSize={3} fadeDistance={50} />
        <Environment preset="city" />
        <Preload all />
        <SceneControlPanel />
      </Canvas>
    </div>
  );
};

export default SceneViewer;
