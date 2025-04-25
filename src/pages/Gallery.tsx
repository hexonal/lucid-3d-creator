
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SceneData } from '@/types/api';
import SceneCard from '@/components/SceneCard';
import { generateScene, getSystemHealth } from '@/services/api';
import { InfoIcon } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious,
  PaginationLink
} from '@/components/ui/pagination';

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
            {systemStatus && (
              <div className="flex items-center mr-4">
                <InfoIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  系统状态: 
                  <span className={`font-medium ${systemStatus === 'healthy' ? 'text-green-500' : 'text-red-500'}`}>
                    {systemStatus === 'healthy' ? ' 正常' : ' 异常'}
                  </span>
                </span>
              </div>
            )}
            
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
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="h-60 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : scenes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {visibleScenes.map((scene, index) => (
                <SceneCard key={startIndex + index} scene={scene} index={startIndex + index} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination className="mb-8">
                <PaginationContent>
                  <PaginationItem>
                    <Button 
                      onClick={handlePreviousPage} 
                      disabled={page === 1}
                      variant="outline"
                      size="sm"
                      className="gap-1 pl-2.5"
                    >
                      <span className="flex items-center">
                        <span className="mr-1">←</span> 上一页
                      </span>
                    </Button>
                  </PaginationItem>
                  <PaginationItem className="px-4">
                    第 {page} 页，共 {totalPages} 页
                  </PaginationItem>
                  <PaginationItem>
                    <Button 
                      onClick={handleNextPage} 
                      disabled={page === totalPages}
                      variant="outline"
                      size="sm"
                      className="gap-1 pr-2.5"
                    >
                      <span className="flex items-center">
                        下一页 <span className="ml-1">→</span>
                      </span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500 mb-4">暂无场景</p>
            <Button variant="default">创建新场景</Button>
          </div>
        )}
      </main>
      
      <footer className="bg-sceneflow-dark text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <h3 className="text-xl font-bold mr-2">SceneFlow</h3>
              <span className="text-xs bg-sceneflow-primary px-2 py-0.5 rounded-full">Beta</span>
            </div>
            <p className="text-gray-300 text-sm">AI驱动的3D场景生成系统</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="/about" className="text-gray-300 hover:text-white text-sm">关于我们</a>
            <a href="/privacy" className="text-gray-300 hover:text-white text-sm">隐私政策</a>
            <a href="/terms" className="text-gray-300 hover:text-white text-sm">使用条款</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Gallery;
