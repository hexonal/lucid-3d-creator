
import { NavLink } from "react-router-dom";
import { Cube } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200 py-4 px-6 md:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cube className="h-8 w-8 text-sceneflow-primary" />
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold gradient-text">SceneFlow</h1>
            <p className="text-xs text-gray-500">AI-驱动的3D场景生成系统</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/" className="text-gray-600 hover:text-sceneflow-primary transition-colors">
            首页
          </NavLink>
          <NavLink to="/gallery" className="text-gray-600 hover:text-sceneflow-primary transition-colors">
            场景库
          </NavLink>
          <NavLink to="/about" className="text-gray-600 hover:text-sceneflow-primary transition-colors">
            关于
          </NavLink>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="hidden md:block px-4 py-1.5 bg-sceneflow-primary text-white rounded-full hover:bg-sceneflow-secondary transition-colors duration-300">
            登录
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
