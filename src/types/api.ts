
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

export interface SceneData {
  name: string;
  objects: any[];
  lighting: Record<string, any>;
  camera: Record<string, any>;
}

export interface GeneratedScene {
  scene: SceneData;
}

export interface OptimizationSuggestion {
  type: string;
  content: string;
}

export interface OptimizationResponse {
  suggestions: OptimizationSuggestion[];
}

export interface ChatMessageResponse {
  response: string;
  scene_update?: any;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatHistoryResponse {
  history: ChatHistoryMessage[];
}

export interface HealthResponse {
  status: string;
  version: string;
}
