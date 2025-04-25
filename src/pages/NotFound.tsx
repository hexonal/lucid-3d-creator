
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-gray-50 to-gray-100 p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sceneflow-primary bg-opacity-20 mb-4">
          <AlertCircle className="h-8 w-8 text-sceneflow-primary" />
        </div>
        
        <h1 className="text-4xl font-bold mb-2 gradient-text">404</h1>
        <p className="text-xl text-gray-600 mb-6">页面未找到</p>
        <p className="text-gray-500 mb-8">您尝试访问的页面不存在或已被移除。</p>
        
        <Button 
          asChild 
          className="bg-sceneflow-primary hover:bg-sceneflow-secondary transition-colors"
        >
          <a href="/">返回首页</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
