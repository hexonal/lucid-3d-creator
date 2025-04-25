
import { NavLink } from "react-router-dom";
import { Box } from "lucide-react";
import { ROUTES } from "@/routes/routes";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200 py-4 px-6 md:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Box className="h-8 w-8 text-sceneflow-primary" />
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold gradient-text">SceneFlow</h1>
            <p className="text-xs text-gray-500">AI-驱动的3D场景生成系统</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to={ROUTES.HOME} className="text-gray-600 hover:text-sceneflow-primary transition-colors">
            首页
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;

