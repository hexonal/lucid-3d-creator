
import { useState } from 'react';
import Header from '@/components/Header';
import SceneViewer from '@/components/SceneViewer';
import ChatPanel from '@/components/ChatPanel';

const Index = () => {
  const [currentScene, setCurrentScene] = useState<any>(null);
  const [isSceneLoading, setIsSceneLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 pt-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-2">
            <span className="gradient-text">SceneFlow</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI驱动的3D场景生成系统，通过自然语言对话实现场景设计和生成
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Left Panel - Chat */}
          <div className="lg:col-span-2 h-[500px] md:h-[600px]">
            <ChatPanel 
              onSceneUpdate={setCurrentScene} 
              onLoadingChange={setIsSceneLoading}
            />
          </div>
          
          {/* Right Panel - 3D Viewer */}
          <div className="lg:col-span-3 h-[500px] md:h-[600px] bg-white rounded-lg shadow-md overflow-hidden">
            <SceneViewer scene={currentScene} isLoading={isSceneLoading} />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center">主要功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="智能场景生成" 
              description="基于先进AI技术，自动分析用户描述并生成符合要求的3D场景"
              icon="✨" 
            />
            <FeatureCard 
              title="实时3D渲染" 
              description="高质量的实时渲染效果，支持PBR材质和灯光系统"
              icon="🎨" 
            />
            <FeatureCard 
              title="直观交互控制" 
              description="简单易用的场景控制，支持旋转、缩放、平移等操作"
              icon="🖱️" 
            />
          </div>
        </div>
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

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:border-sceneflow-primary transition-colors duration-300">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default Index;
