
import { InfoIcon } from 'lucide-react';

interface SystemStatusProps {
  status: string | null;
}

const SystemStatus = ({ status }: SystemStatusProps) => {
  if (!status) return null;
  
  return (
    <div className="flex items-center mr-4">
      <InfoIcon className="h-4 w-4 mr-1" />
      <span className="text-sm">
        系统状态: 
        <span className={`font-medium ${status === 'healthy' ? 'text-green-500' : 'text-red-500'}`}>
          {status === 'healthy' ? ' 正常' : ' 异常'}
        </span>
      </span>
    </div>
  );
};

export default SystemStatus;
