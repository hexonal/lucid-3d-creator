
import { type ReactNode } from 'react';
import { Cube, User } from 'lucide-react';

interface ChatMessageProps {
  isUser: boolean;
  content: string;
  timestamp?: string;
}

const ChatMessage = ({ isUser, content, timestamp }: ChatMessageProps) => {
  const renderAvatar = (): ReactNode => {
    if (isUser) {
      return (
        <div className="w-8 h-8 rounded-full bg-sceneflow-tertiary flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-sceneflow-primary flex items-center justify-center">
        <Cube className="w-5 h-5 text-white" />
      </div>
    );
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-start' : 'justify-start'} mb-4`}>
      {renderAvatar()}
      <div className={`max-w-[80%] ${isUser ? 'bg-white' : 'bg-sceneflow-light bg-opacity-30'} rounded-lg px-4 py-2 shadow-sm`}>
        <p className="text-sm">{content}</p>
        {timestamp && (
          <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
