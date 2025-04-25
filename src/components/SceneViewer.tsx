import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, useGLTF, Preload, Center } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { Button } from '@/components/ui/button';
import { RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface SceneProps {
  scene?: any;
}

// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    resetView?: () => void;
    zoomIn?: () => void;
    zoomOut?: () => void;
  }
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

// This component is moved OUTSIDE the Canvas to avoid Circle namespace conflict
const SceneControlButtons = ({ onReset, onZoomIn, onZoomOut }) => {
  return (
    <div className="absolute bottom-4 right-4 flex gap-2">
      <Button onClick={onReset} size="sm" variant="secondary" className="rounded-full p-2">
        <RotateCw className="h-4 w-4" />
      </Button>
      <Button onClick={onZoomIn} size="sm" variant="secondary" className="rounded-full p-2">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button onClick={onZoomOut} size="sm" variant="secondary" className="rounded-full p-2">
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

// THREE.js scene controller - no UI components
const SceneController = () => {
  const { camera } = useThree();
  
  // Expose functions globally for the UI buttons to call
  useEffect(() => {
    // Define the functions on the window object
    window.resetView = () => {
      camera.position.set(5, 5, 5);
      camera.lookAt(0, 0, 0);
    };
    
    window.zoomIn = () => {
      camera.position.lerp(camera.position.clone().multiplyScalar(0.8), 0.5);
    };
    
    window.zoomOut = () => {
      camera.position.lerp(camera.position.clone().multiplyScalar(1.2), 0.5);
    };
    
    // Clean up when component unmounts
    return () => {
      delete window.resetView;
      delete window.zoomIn;
      delete window.zoomOut;
    };
  }, [camera]);
  
  return null; // This component doesn't render anything
};

const SceneViewer = ({ scene }: SceneProps) => {
  const handleResetView = () => {
    // Use optional chaining to safely call the function
    window.resetView?.();
  };
  
  const handleZoomIn = () => {
    window.zoomIn?.();
  };
  
  const handleZoomOut = () => {
    window.zoomOut?.();
  };

  return (
    <div className="scene-viewer-container relative">
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
        <SceneController />
      </Canvas>
      
      {/* UI controls placed outside the Canvas */}
      <SceneControlButtons 
        onReset={handleResetView}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  );
};

export default SceneViewer;
