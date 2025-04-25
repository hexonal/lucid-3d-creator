
import { ApiResponse, ChatHistoryResponse, ChatMessageResponse, GeneratedScene, HealthResponse, OptimizationResponse } from "@/types/api";

// Original API URL
const ORIGINAL_API_URL = 'http://167.114.211.191:8000';

// Function to handle CORS issue by using a CORS proxy
function createProxiedUrl(endpoint: string): string {
  // In development environment, try to use a CORS proxy
  const isLocalDevelopment = window.location.hostname === 'localhost';
  
  if (isLocalDevelopment) {
    // Direct access to API (if CORS is configured on server)
    return `${ORIGINAL_API_URL}${endpoint}`;
    
    // If direct access fails, you could uncomment one of these:
    // return `https://cors-anywhere.herokuapp.com/${ORIGINAL_API_URL}${endpoint}`;
    // return `https://api.allorigins.win/raw?url=${encodeURIComponent(`${ORIGINAL_API_URL}${endpoint}`)}`;
  }
  
  // In production, use the direct API URL
  return `${ORIGINAL_API_URL}${endpoint}`;
}

// Helper function to check if response is valid JSON
async function safeParseJson(response: Response): Promise<any> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse response as JSON:', text.substring(0, 200) + '...');
    throw new Error('服务器返回了无效的响应格式');
  }
}

export async function generateScene(description: string, context: any[] = []): Promise<ApiResponse<GeneratedScene>> {
  const url = createProxiedUrl('/api/generate-scene');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': window.location.origin
    },
    body: JSON.stringify({ description, context })
  });
  
  return safeParseJson(response);
}

export async function optimizeScene(scene: any): Promise<ApiResponse<OptimizationResponse>> {
  const url = createProxiedUrl('/api/scenes/optimize');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': window.location.origin
    },
    body: JSON.stringify({ scene })
  });
  
  return safeParseJson(response);
}

export async function sendChatMessage(
  conversationId: string, 
  message: string, 
  context: any = {}
): Promise<ApiResponse<ChatMessageResponse>> {
  const url = createProxiedUrl('/api/chat/message');
  
  console.log("尝试发送聊天消息到:", url);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({ conversation_id: conversationId, message, context })
    });
    
    return safeParseJson(response);
  } catch (error) {
    console.error("发送聊天消息失败:", error);
    return {
      code: 500,
      message: "无法连接到服务器，请检查网络连接或稍后再试",
      data: null
    };
  }
}

export async function getChatHistory(conversationId: string): Promise<ApiResponse<ChatHistoryResponse>> {
  const url = createProxiedUrl(`/api/chat/history/${conversationId}`);
  
  const response = await fetch(url, {
    headers: {
      'Origin': window.location.origin
    }
  });
  
  return safeParseJson(response);
}

export async function getSystemHealth(): Promise<ApiResponse<HealthResponse>> {
  const url = createProxiedUrl('/api/health');
  
  console.log("检查系统健康状态:", url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Origin': window.location.origin
      }
    });
    
    return safeParseJson(response);
  } catch (error) {
    console.error("检查系统健康状态失败:", error);
    return {
      code: 500,
      message: "无法连接到服务器，请检查网络连接",
      data: null
    };
  }
}
