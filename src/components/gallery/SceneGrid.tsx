
import { SceneData } from '@/types/api';
import SceneCard from '@/components/SceneCard';

interface SceneGridProps {
  scenes: SceneData[];
  startIndex: number;
  isLoading: boolean;
}

const SceneGrid = ({ scenes, startIndex, isLoading }: SceneGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="h-60 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {scenes.map((scene, index) => (
        <SceneCard key={startIndex + index} scene={scene} index={startIndex + index} />
      ))}
    </div>
  );
};

export default SceneGrid;
