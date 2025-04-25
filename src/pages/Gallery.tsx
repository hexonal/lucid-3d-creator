import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SceneData } from '@/types/api';
import { getSystemHealth } from '@/services/api';
import SystemStatus from '@/components/gallery/SystemStatus';
import SceneGrid from '@/components/gallery/SceneGrid';
import PaginationControls from '@/components/gallery/PaginationControls';
import GalleryFooter from '@/components/gallery/GalleryFooter';

const MOCK_SCENES: SceneData[] = [
  {
    name: "现代简约客厅",
    objects: [{}, {}, {}], // 假设有3个对象
    lighting: { type: "ambient" },
    camera: { position: [0, 0, 5] }
  },
  {
    name: "日式卧室",
    objects: [{}, {}], // 假设有2个对象
    lighting: { type: "point" },
    camera: { position: [0, 0, 5] }
  },
  {
    name: "北欧风书房",
    objects: [{}, {}, {}, {}], // 假设有4个对象
    lighting: { type: "directional" },
    camera: { position: [0, 0, 5] }
  },
  {
    name: "工业风厨房",
    objects: [{}, {}, {}, {}, {}], // 假设有5个对象
    lighting: { type: "spot" },
    camera: { position: [0, 0, 5] }
  }
];

const Gallery = () => {
  const { toast } = useToast();
  const [scenes, setScenes] = useState<SceneData[]>(MOCK_SCENES);
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const scenesPerPage = 8;

  // Check system health when component mounts
  useEffect(() => {
    const checkSystemHealth = async () => {
      try {
        const response = await getSystemHealth();
        if (response.code === 200 && response.data) {
          setSystemStatus(response.data.status);
        }
      } catch (error) {
        console.error('Error checking system health:', error);
        setSystemStatus('offline');
      }
    };

    checkSystemHealth();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(scenes.length / scenesPerPage);
  const startIndex = (page - 1) * scenesPerPage;
  const visibleScenes = scenes.slice(startIndex, startIndex + scenesPerPage);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // This would be used to fetch actual scenes from the API if connected
  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, we would fetch scenes from the API
      // For now, we'll just simulate a delay and use mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "更新成功",
        description: "场景库已更新",
      });
    } catch (error) {
      console.error('Error refreshing scenes:', error);
      
      toast({
        title: "更新失败",
        description: "无法连接到服务器，请稍后再试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 pt-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">场景库</h1>
            <p className="text-gray-600">浏览和管理您的3D场景</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <SystemStatus status={systemStatus} />
            <Button 
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              刷新
            </Button>
          </div>
        </div>
        
        {scenes.length > 0 ? (
          <>
            <SceneGrid 
              scenes={visibleScenes} 
              startIndex={startIndex}
              isLoading={isLoading}
            />
            
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 mb-4">暂无场景</p>
            <Button variant="default">创建新场景</Button>
          </div>
        )}
      </main>
      
      <GalleryFooter />
    </div>
  );
};

export default Gallery;
