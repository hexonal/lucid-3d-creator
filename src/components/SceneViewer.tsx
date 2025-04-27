import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, useGLTF, Preload, Center } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface SceneProps {
  scene?: any;
  isLoading?: boolean;
}

// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    resetView?: () => void;
    zoomIn?: () => void;
    zoomOut?: () => void;
  }
}

// 默认的空白场景组件
const DefaultScene = () => {
  return (
    <Center>
      <group>
        {/* 地板 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </group>
    </Center>
  );
};

// 动态场景组件，根据 scene 属性渲染
const DynamicScene = ({ scene }) => {
  // 如果没有场景数据，渲染空白场景
  if (!scene || !scene.objects || scene.objects.length === 0) {
    return <DefaultScene />;
  }

  // 确保场景数据持久化
  return (
    <Center>
      <group>
        {scene.objects.map((object, index) => (
          <mesh
            key={object.id || index}
            position={[
              object.position?.x || 0,
              object.position?.y || 0,
              object.position?.z || 0
            ]}
            scale={[
              object.scale?.x || 1,
              object.scale?.y || 1,
              object.scale?.z || 1
            ]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={object.material?.color || "#808080"} />
          </mesh>
        ))}
      </group>
    </Center>
  );
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

const LoadingOverlay = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Cap at 90% until actual loading completes
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
      <RefreshCw className="h-10 w-10 text-sceneflow-primary animate-spin mb-4" />
      <h3 className="text-lg font-medium mb-2">场景生成中...</h3>
      <div className="w-64">
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

const SceneViewer = ({ scene, isLoading = false }: SceneProps) => {
  // 保持对当前场景的引用
  const sceneRef = useRef(scene);

  // 当scene变化时更新引用，但只在有新场景时
  useEffect(() => {
    if (scene) {
      sceneRef.current = scene;
    }
  }, [scene]);

  const handleResetView = () => {
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
      {isLoading && <LoadingOverlay />}

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

        {/* 使用sceneRef.current确保始终渲染最新的场景 */}
        <DynamicScene scene={sceneRef.current || scene} />
        <Grid infiniteGrid cellSize={1} sectionSize={3} fadeDistance={50} />
        <Environment preset="city" />
        <OrbitControls />
      </Canvas>

      {/* 保持原有的场景控制按钮 */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button onClick={handleResetView} size="sm" variant="secondary" className="rounded-full p-2">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button onClick={handleZoomIn} size="sm" variant="secondary" className="rounded-full p-2">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button onClick={handleZoomOut} size="sm" variant="secondary" className="rounded-full p-2">
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
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

export default SceneViewer;
