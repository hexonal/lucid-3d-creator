
import { useState, FormEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-lg shadow-md">
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="描述您想要的场景..."
          className="flex-1 p-2 outline-none text-sm"
          disabled={disabled}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!message.trim() || disabled}
          className="bg-sceneflow-primary text-white rounded-full p-2 hover:bg-sceneflow-secondary transition-colors"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
