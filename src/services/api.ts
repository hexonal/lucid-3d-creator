
import { ApiResponse, ChatHistoryResponse, ChatMessageResponse, GeneratedScene, HealthResponse, OptimizationResponse } from "@/types/api";

// Original API URL
const ORIGINAL_API_URL = 'http://127.0.0.1:1';

// Function to create API URL
function createApiUrl(endpoint: string): string {
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

// Common fetch method with error handling
async function fetchWithErrorHandling(url: string, options: RequestInit = {}): Promise<any> {
  try {
    // Ensure proper Content-Type header is set
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers,
      // 允许跨域请求
      mode: 'cors',
      credentials: 'omit' // 不发送 cookies
    });
    
    if (!response.ok) {
      console.error('HTTP 错误:', response.status, response.statusText);
      return {
        code: response.status,
        message: `服务器返回错误: ${response.status} ${response.statusText}`,
        data: null
      };
    }

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
  const url = createApiUrl('/api/generate-scene');

  return fetchWithErrorHandling(url, {
    method: 'POST',
    body: JSON.stringify({ description, context })
  });
}

export async function optimizeScene(scene: any): Promise<ApiResponse<OptimizationResponse>> {
  const url = createApiUrl('/api/scenes/optimize');

  return fetchWithErrorHandling(url, {
    method: 'POST',
    body: JSON.stringify({ scene })
  });
}

export async function sendChatMessage(
  conversationId: string,
  message: string,
  context: any = {}
): Promise<ApiResponse<ChatMessageResponse>> {
  const url = createApiUrl('/api/chat/message');

  console.log("尝试发送聊天消息到:", url);

  return fetchWithErrorHandling(url, {
    method: 'POST',
    body: JSON.stringify({ conversation_id: conversationId, message, context })
  });
}

export async function getChatHistory(conversationId: string): Promise<ApiResponse<ChatHistoryResponse>> {
  const url = createApiUrl(`/api/chat/history/${conversationId}`);

  return fetchWithErrorHandling(url, {
    method: 'GET'
  });
}

export async function getSystemHealth(): Promise<ApiResponse<HealthResponse>> {
  const url = createApiUrl('/api/health');

  console.log("检查系统健康状态:", url);

  return fetchWithErrorHandling(url, {
    method: 'GET'
  });
}
