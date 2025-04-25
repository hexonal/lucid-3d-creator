
import { ApiResponse, ChatHistoryResponse, ChatMessageResponse, GeneratedScene, HealthResponse, OptimizationResponse } from "@/types/api";

// Original API URL
const ORIGINAL_API_URL = 'http://167.114.211.191:8000';

// Function to handle CORS issue by using a CORS proxy
function createProxiedUrl(endpoint: string): string {
  // In development environment, try to use a CORS proxy
  const isLocalDevelopment = window.location.hostname === 'localhost';
  
  if (isLocalDevelopment) {
    // Option 1: Using a CORS Anywhere proxy (if available)
    // return `https://cors-anywhere.herokuapp.com/${ORIGINAL_API_URL}${endpoint}`;
    
    // Option 2: Using allOrigins as a fallback
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(`${ORIGINAL_API_URL}${endpoint}`)}`;
  }
  
  // In production, use the direct API URL
  return `${ORIGINAL_API_URL}${endpoint}`;
}

export async function generateScene(description: string, context: any[] = []): Promise<ApiResponse<GeneratedScene>> {
  const url = createProxiedUrl('/api/generate-scene');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ description, context })
  });
  
  return response.json();
}

export async function optimizeScene(scene: any): Promise<ApiResponse<OptimizationResponse>> {
  const url = createProxiedUrl('/api/scenes/optimize');
  
  const response = await fetch(url, {
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
  const url = createProxiedUrl('/api/chat/message');
  
  console.log("Attempting to send chat message to:", url);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ conversation_id: conversationId, message, context })
  });
  
  return response.json();
}

export async function getChatHistory(conversationId: string): Promise<ApiResponse<ChatHistoryResponse>> {
  const url = createProxiedUrl(`/api/chat/history/${conversationId}`);
  
  const response = await fetch(url);
  return response.json();
}

export async function getSystemHealth(): Promise<ApiResponse<HealthResponse>> {
  const url = createProxiedUrl('/api/health');
  
  console.log("Checking system health at:", url);
  
  const response = await fetch(url);
  return response.json();
}
