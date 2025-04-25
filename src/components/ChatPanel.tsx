import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  isUser: boolean;
  content: string;
  timestamp: string;
}

interface ChatPanelProps {
  onSceneUpdate?: (scene: any) => void;
}

const API_ENDPOINT = 'http://167.114.211.191:8000';

const ChatPanel = ({ onSceneUpdate }: ChatPanelProps) => {
  const { toast } = useToast();
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
    
    try {
      // Get previous messages for context (excluding the welcome message)
      const context = messages.length > 1 
        ? messages.slice(1).map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        : [];

      // Make API call to the endpoint
      const response = await fetch(`${API_ENDPOINT}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
          conversation_id: 'default' // You might want to manage conversation IDs
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add the AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        content: data.data.response || '服务器返回了空响应',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      
      // Update scene if response contains scene data
      if (onSceneUpdate && data.data.scene_update) {
        onSceneUpdate(data.data.scene_update);
      }
    } catch (error) {
      console.error('API call failed:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        content: '很抱歉，连接服务器时发生错误。请稍后再试。',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      
      toast({
        title: "连接错误",
        description: "无法连接到场景生成服务器，请检查网络连接。",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
    
    // Reset scene if callback exists
    if (onSceneUpdate) {
      onSceneUpdate(null);
    }
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
