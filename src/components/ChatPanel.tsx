
import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface Message {
  id: string;
  isUser: boolean;
  content: string;
  timestamp: string;
}

interface ChatPanelProps {
  onSceneUpdate?: (scene: any) => void;
}

const ChatPanel = ({ onSceneUpdate }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      isUser: false,
      content: '欢迎使用SceneFlow! 请描述您想要生成的3D场景，例如："创建一个现代简约风格的客厅，有一张灰色沙发和落地窗。"',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    // Add the user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      isUser: true,
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsProcessing(true);
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        content: `正在生成场景: "${message}"... 这可能需要几秒钟时间.`,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      
      // Simulate scene generation
      if (onSceneUpdate) {
        // In a real app, we would generate a scene based on the message
        onSceneUpdate({});
      }
      
      setIsProcessing(false);
    }, 1500);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'reset',
        isUser: false,
        content: '对话已重置。请描述您想要生成的3D场景。',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">场景对话</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleResetChat}
          className="text-gray-500 hover:text-sceneflow-primary"
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          重置
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 chat-messages-container">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            isUser={message.isUser}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <ChatInput onSendMessage={handleSendMessage} disabled={isProcessing} />
        {isProcessing && (
          <p className="text-xs text-gray-500 mt-2 text-center">AI 正在处理您的请求...</p>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
