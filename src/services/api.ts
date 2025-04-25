
import { ApiResponse, ChatHistoryResponse, ChatMessageResponse, GeneratedScene, HealthResponse, OptimizationResponse } from "@/types/api";

// Original API URL
const ORIGINAL_API_URL = 'http://167.114.211.191:8000';

// Function to handle CORS issue by using a CORS proxy
function createProxiedUrl(endpoint: string): string {
  // In development environment, use an alternative approach
  const isLocalDevelopment = window.location.hostname === 'localhost';
  
  if (isLocalDevelopment) {
    // Use cors-anywhere proxy
    return `https://cors-anywhere.herokuapp.com/${ORIGINAL_API_URL}${endpoint}`;
    
    // Alternatives if the above doesn't work
    // return `https://api.allorigins.win/raw?url=${encodeURIComponent(`${ORIGINAL_API_URL}${endpoint}`)}`;
    // return `https://corsproxy.io/?${encodeURIComponent(`${ORIGINAL_API_URL}${endpoint}`)}`;
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

// Common fetch method with error handling and CORS handling
async function fetchWithCorsHandling(url: string, options: RequestInit = {}): Promise<any> {
  try {
    // Add common headers
    const headers = {
      'Content-Type': 'application/json',
      'Origin': window.location.origin,
      ...options.headers
    };
    
    const response = await fetch(url, {
      ...options,
      headers,
      // Disable CORS mode in development for direct requests
      mode: window.location.hostname === 'localhost' ? 'cors' : 'cors'
    });
    
    return await safeParseJson(response);
  } catch (error) {
    console.error('API请求失败:', error);
    return {
      code: 500,
      message: `请求失败: ${error instanceof Error ? error.message : '未知错误'}`,
      data: null
    };
  }
}

export async function generateScene(description: string, context: any[] = []): Promise<ApiResponse<GeneratedScene>> {
  const url = createProxiedUrl('/api/generate-scene');
  
  return fetchWithCorsHandling(url, {
    method: 'POST',
    body: JSON.stringify({ description, context })
  });
}

export async function optimizeScene(scene: any): Promise<ApiResponse<OptimizationResponse>> {
  const url = createProxiedUrl('/api/scenes/optimize');
  
  return fetchWithCorsHandling(url, {
    method: 'POST',
    body: JSON.stringify({ scene })
  });
}

export async function sendChatMessage(
  conversationId: string, 
  message: string, 
  context: any = {}
): Promise<ApiResponse<ChatMessageResponse>> {
  const url = createProxiedUrl('/api/chat/message');
  
  console.log("尝试发送聊天消息到:", url);
  
  return fetchWithCorsHandling(url, {
    method: 'POST',
    body: JSON.stringify({ conversation_id: conversationId, message, context })
  });
}

export async function getChatHistory(conversationId: string): Promise<ApiResponse<ChatHistoryResponse>> {
  const url = createProxiedUrl(`/api/chat/history/${conversationId}`);
  
  return fetchWithCorsHandling(url, {
    method: 'GET'
  });
}

export async function getSystemHealth(): Promise<ApiResponse<HealthResponse>> {
  const url = createProxiedUrl('/api/health');
  
  console.log("检查系统健康状态:", url);
  
  return fetchWithCorsHandling(url, {
    method: 'GET'
  });
}
