import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VideoProject {
  id: string;
  title: string;
  script: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  status: 'draft' | 'processing' | 'completed' | 'published';
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  analytics?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'starter' | 'pro' | 'business' | 'enterprise';
  videosUsed: number;
  videosLimit: number;
}

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'local' | 'custom';

export type ImageProvider = 'openai' | 'stability' | 'replicate' | 'local';
export type TTSProvider = 'openai' | 'elevenlabs' | 'coqui' | 'azure' | 'local';
export type VideoProvider = 'runway' | 'pika' | 'kling' | 'local';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  endpoint?: string;
  temperature: number;
  maxTokens: number;
}

export interface ImageConfig {
  provider: ImageProvider;
  model: string;
  apiKey?: string;
  endpoint?: string;
  quality: 'standard' | 'hd';
  size: '1024x1024' | '1792x1024' | '1024x1792';
}

export interface TTSConfig {
  provider: TTSProvider;
  model: string;
  voice: string;
  apiKey?: string;
  endpoint?: string;
  speed: number;
}

export interface VideoConfig {
  provider: VideoProvider;
  model: string;
  apiKey?: string;
  endpoint?: string;
  duration: number;
  aspectRatio: '16:9' | '9:16' | '1:1';
}

export const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI GPT',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    description: 'GPT-4, GPT-4 Turbo, or GPT-3.5 Turbo',
  },
  anthropic: {
    name: 'Anthropic Claude',
    models: ['claude-3-5-sonnet-20241014', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    description: 'Claude 3.5 Sonnet, Opus, or Haiku',
  },
  google: {
    name: 'Google Gemini',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'],
    description: 'Gemini 1.5 Pro or Flash',
  },
  local: {
    name: 'Local / Self-hosted',
    models: ['llama-3.1-70b', 'llama-3.1-8b', 'mistral-7b', 'custom'],
    description: 'Ollama, LM Studio, or local models',
  },
  custom: {
    name: 'Custom API',
    models: [],
    description: 'Connect to any OpenAI-compatible API',
  },
} as const;

export const IMAGE_PROVIDERS = {
  openai: {
    name: 'DALL-E',
    models: ['dall-e-3', 'dall-e-2'],
    description: 'OpenAI DALL-E 3 or 2',
  },
  stability: {
    name: 'Stable Diffusion',
    models: ['sd3', 'sd-xl', 'sd-1'],
    description: 'Stable Diffusion 3, XL, or 1',
  },
  replicate: {
    name: 'Replicate',
    models: ['flux-pro', 'flux-dev', 'sdxl'],
    description: 'Flux models via Replicate',
  },
  local: {
    name: 'Local / SD WebUI',
    models: ['sd-xl', 'sd-1.5', 'custom'],
    description: 'Stable Diffusion via local WebUI',
  },
} as const;

export const TTS_PROVIDERS = {
  openai: {
    name: 'OpenAI TTS',
    models: ['tts-1', 'tts-1-hd'],
    voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
    description: 'OpenAI Text-to-Speech',
  },
  elevenlabs: {
    name: 'ElevenLabs',
    models: ['eleven_multilingual_v2', 'eleven_monolingual_v1'],
    voices: [],
    description: 'ElevenLabs with voice cloning',
  },
  coqui: {
    name: 'Coqui XTTS',
    models: ['xtts-v2'],
    voices: [],
    description: 'Open-source TTS',
  },
  azure: {
    name: 'Azure TTS',
    models: ['standard', 'neural'],
    voices: [],
    description: 'Azure Speech Services',
  },
  local: {
    name: 'Local TTS',
    models: ['custom'],
    voices: [],
    description: 'Coqui or Piper via local',
  },
} as const;

export const VIDEO_PROVIDERS = {
  runway: {
    name: 'Runway ML',
    models: ['gen-3-alpha', 'gen-2'],
    description: 'Runway Gen-3 or Gen-2',
  },
  pika: {
    name: 'Pika Labs',
    models: ['pika-1.0', 'pika-0.9'],
    description: 'Pika 1.0',
  },
  kling: {
    name: 'Kling AI',
    models: ['kling-1.5', 'kling-1.0'],
    description: 'Kling video generation',
  },
  local: {
    name: 'Local Video',
    models: ['modelscope', 'zeroscope'],
    description: 'Open-source video models',
  },
} as const;

interface AppState {
  user: User | null;
  projects: VideoProject[];
  currentProject: VideoProject | null;
  isAuthenticated: boolean;
  
  // AI Configs
  aiConfig: AIConfig;
  imageConfig: ImageConfig;
  ttsConfig: TTSConfig;
  videoConfig: VideoConfig;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProject: (project: Omit<VideoProject, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateProject: (id: string, data: Partial<VideoProject>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: VideoProject | null) => void;
  updateAIConfig: (config: Partial<AIConfig>) => void;
  updateImageConfig: (config: Partial<ImageConfig>) => void;
  updateTTSConfig: (config: Partial<TTSConfig>) => void;
  updateVideoConfig: (config: Partial<VideoConfig>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      projects: [],
      currentProject: null,
      isAuthenticated: false,
      aiConfig: {
        provider: 'openai',
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 2000,
      },
      imageConfig: {
        provider: 'openai',
        model: 'dall-e-3',
        quality: 'standard',
        size: '1024x1024',
      },
      ttsConfig: {
        provider: 'openai',
        model: 'tts-1',
        voice: 'alloy',
        speed: 1.0,
      },
      videoConfig: {
        provider: 'runway',
        model: 'gen-3-alpha',
        duration: 5,
        aspectRatio: '16:9',
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (email, password) => {
        // Demo login - in production, call API
        if (email && password) {
          const user: User = {
            id: '1',
            name: 'Demo User',
            email,
            plan: 'pro',
            videosUsed: 12,
            videosLimit: 50,
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ user: null, isAuthenticated: false, currentProject: null }),

      addProject: (projectData) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const newProject: VideoProject = {
          ...projectData,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ 
          projects: [...state.projects, newProject],
          currentProject: newProject,
        }));
        return id;
      },

      updateProject: (id, data) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          ),
          currentProject: state.currentProject?.id === id 
            ? { ...state.currentProject, ...data, updatedAt: new Date().toISOString() }
            : state.currentProject,
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }));
      },

      setCurrentProject: (project) => set({ currentProject: project }),
      
      updateAIConfig: (config) => set((state) => ({ 
        aiConfig: { ...state.aiConfig, ...config } 
      })),
      
      updateImageConfig: (config) => set((state) => ({ 
        imageConfig: { ...state.imageConfig, ...config } 
      })),
      
      updateTTSConfig: (config) => set((state) => ({ 
        ttsConfig: { ...state.ttsConfig, ...config } 
      })),
      
      updateVideoConfig: (config) => set((state) => ({ 
        videoConfig: { ...state.videoConfig, ...config } 
      })),
    }),
    {
      name: 'video-saas-storage',
      partialize: (state) => ({ 
        user: state.user, 
        projects: state.projects,
        isAuthenticated: state.isAuthenticated,
        aiConfig: state.aiConfig,
        imageConfig: state.imageConfig,
        ttsConfig: state.ttsConfig,
        videoConfig: state.videoConfig,
      }),
    }
  )
);