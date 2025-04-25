
import { SceneData } from "@/types/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SceneCardProps {
  scene: SceneData;
  index: number;
}

const SceneCard = ({ scene, index }: SceneCardProps) => {
  const navigate = useNavigate();
  
  const handleView = () => {
    // For now just show an alert since we don't have actual viewing functionality
    alert(`查看场景: ${scene.name}`);
  };

  return (
    <Card className="overflow-hidden hover:border-sceneflow-primary transition-all duration-300">
      <div className="h-40 bg-gray-100 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          {/* Placeholder for scene thumbnail */}
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200">
            <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
          </div>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">{scene.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500">
          对象数量: {scene.objects.length}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={handleView}
        >
          <Eye className="mr-2 h-4 w-4" />
          查看场景
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SceneCard;
