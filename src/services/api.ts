
import { ApiResponse, ChatHistoryResponse, ChatMessageResponse, GeneratedScene, HealthResponse, OptimizationResponse } from "@/types/api";

const API_BASE_URL = 'http://localhost:8000';

export async function generateScene(description: string, context: any[] = []): Promise<ApiResponse<GeneratedScene>> {
  const response = await fetch(`${API_BASE_URL}/api/generate-scene`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ description, context })
  });
  
  return response.json();
}

export async function optimizeScene(scene: any): Promise<ApiResponse<OptimizationResponse>> {
  const response = await fetch(`${API_BASE_URL}/api/scenes/optimize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ scene })
  });
  
  return response.json();
}

export async function sendChatMessage(
  conversationId: string, 
  message: string, 
  context: any = {}
): Promise<ApiResponse<ChatMessageResponse>> {
  const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ conversation_id: conversationId, message, context })
  });
  
  return response.json();
}

export async function getChatHistory(conversationId: string): Promise<ApiResponse<ChatHistoryResponse>> {
  const response = await fetch(`${API_BASE_URL}/api/chat/history/${conversationId}`);
  return response.json();
}

export async function getSystemHealth(): Promise<ApiResponse<HealthResponse>> {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return response.json();
}
