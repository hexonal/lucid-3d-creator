
const GalleryFooter = () => {
  return (
    <footer className="bg-sceneflow-dark text-white py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-bold mr-2">SceneFlow</h3>
            <span className="text-xs bg-sceneflow-primary px-2 py-0.5 rounded-full">Beta</span>
          </div>
          <p className="text-gray-300 text-sm">AI驱动的3D场景生成系统</p>
        </div>
      </div>
    </footer>
  );
};

export default GalleryFooter;
