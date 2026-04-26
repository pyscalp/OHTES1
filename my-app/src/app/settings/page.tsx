"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, AI_PROVIDERS, IMAGE_PROVIDERS, TTS_PROVIDERS, VIDEO_PROVIDERS, type ImageProvider, type TTSProvider, type VideoProvider } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { 
  CheckCircle2, 
  Sparkles,
  Bot,
  Image,
  Volume2,
  Video
} from "lucide-react";

type TabType = 'script' | 'image' | 'tts' | 'video';

const tabs = [
  { id: 'script', label: 'Script AI', icon: Bot },
  { id: 'image', label: 'Image Gen', icon: Image },
  { id: 'tts', label: 'Voice (TTS)', icon: Volume2 },
  { id: 'video', label: 'Video Gen', icon: Video },
];

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, aiConfig, imageConfig, ttsConfig, videoConfig, updateAIConfig, updateImageConfig, updateTTSConfig, updateVideoConfig } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('script');
  const [saved, setSaved] = useState(false);

  const [scriptProvider, setScriptProvider] = useState(aiConfig.provider);
  const [scriptModel, setScriptModel] = useState(aiConfig.model);
  const [scriptApiKey, setScriptApiKey] = useState(aiConfig.apiKey || "");
  const [scriptTemp, setScriptTemp] = useState(aiConfig.temperature);

  const [imageProvider, setImageProvider] = useState(imageConfig.provider);
  const [imageModel, setImageModel] = useState(imageConfig.model);
  const [imageApiKey, setImageApiKey] = useState(imageConfig.apiKey || "");
  const [imageQuality, setImageQuality] = useState(imageConfig.quality);
  const [imageSize, setImageSize] = useState(imageConfig.size);

  const [ttsProvider, setTtsProvider] = useState(ttsConfig.provider);
  const [ttsModel, setTtsModel] = useState(ttsConfig.model);
  const [ttsVoice, setTtsVoice] = useState(ttsConfig.voice);
  const [ttsApiKey, setTtsApiKey] = useState(ttsConfig.apiKey || "");
  const [ttsSpeed, setTtsSpeed] = useState(ttsConfig.speed);

  const [videoProvider, setVideoProvider] = useState(videoConfig.provider);
  const [videoModel, setVideoModel] = useState(videoConfig.model);
  const [videoApiKey, setVideoApiKey] = useState(videoConfig.apiKey || "");
  const [videoDuration, setVideoDuration] = useState(videoConfig.duration);
  const [videoAspect, setVideoAspect] = useState(videoConfig.aspectRatio);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleSave = () => {
    updateAIConfig({ provider: scriptProvider, model: scriptModel, apiKey: scriptApiKey || undefined, temperature: scriptTemp });
    updateImageConfig({ provider: imageProvider, model: imageModel, apiKey: imageApiKey || undefined, quality: imageQuality, size: imageSize });
    updateTTSConfig({ provider: ttsProvider, model: ttsModel, voice: ttsVoice, apiKey: ttsApiKey || undefined, speed: ttsSpeed });
    updateVideoConfig({ provider: videoProvider, model: videoModel, apiKey: videoApiKey || undefined, duration: videoDuration, aspectRatio: videoAspect });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderProviderSelector = (current: string, setFn: Function, providers: any, setModelFn: Function) => {
    const info = (providers as any)[current];
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {(Object.entries(providers) as [string, any][]).map(([key, prov]) => (
          <button
            key={key}
            onClick={() => {
              setFn(key);
              if (prov.models?.length) setModelFn(prov.models[0]);
            }}
            className={`relative rounded-lg border-2 p-3 text-left transition-all ${
              current === key ? "border-violet-600 bg-violet-50" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            {current === key && <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-violet-600" />}
            <h3 className="font-semibold text-sm">{prov.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{prov.description}</p>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI Settings</h1>
        <p className="mt-1 text-slate-600">Configure all AI providers for your video creation</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'script' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-violet-600" />
              <CardTitle>Script Generation AI</CardTitle>
            </div>
            <CardDescription>Choose AI for generating video scripts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">AI Provider</label>
              {renderProviderSelector(scriptProvider, setScriptProvider, AI_PROVIDERS, setScriptModel)}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select
                  value={scriptModel}
                  onChange={(e) => setScriptModel(e.target.value)}
                  options={(AI_PROVIDERS as any)[scriptProvider]?.models?.map((m: string) => ({ label: m, value: m })) || []}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <Input type="password" placeholder="sk-..." value={scriptApiKey} onChange={(e) => setScriptApiKey(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Temperature: {scriptTemp}</label>
              <input type="range" min="0" max="1" step="0.1" value={scriptTemp} onChange={(e) => setScriptTemp(parseFloat(e.target.value))} className="w-full" />
              <div className="flex justify-between text-xs text-slate-500"><span>Focused</span><span>Balanced</span><span>Creative</span></div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'image' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-violet-600" />
              <CardTitle>Image Generation AI</CardTitle>
            </div>
            <CardDescription>Choose AI for generating thumbnails and images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Image Provider</label>
              {renderProviderSelector(imageProvider, setImageProvider, IMAGE_PROVIDERS, setImageModel)}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select
                  value={imageModel}
                  onChange={(e) => setImageModel(e.target.value)}
                  options={(IMAGE_PROVIDERS as any)[imageProvider]?.models?.map((m: string) => ({ label: m, value: m })) || []}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <Input type="password" placeholder="Enter API key" value={imageApiKey} onChange={(e) => setImageApiKey(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quality</label>
                <Select value={imageQuality} onChange={(e) => setImageQuality(e.target.value as any)} options={[{ label: 'Standard', value: 'standard' }, { label: 'HD', value: 'hd' }]} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <Select value={imageSize} onChange={(e) => setImageSize(e.target.value as any)} options={[{ label: '1024×1024', value: '1024x1024' }, { label: '1792×1024', value: '1792x1024' }, { label: '1024×1792', value: '1024x1792' }]} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'tts' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-violet-600" />
              <CardTitle>Text-to-Speech AI</CardTitle>
            </div>
            <CardDescription>Choose AI for voice-over generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">TTS Provider</label>
              {renderProviderSelector(ttsProvider, setTtsProvider, TTS_PROVIDERS, setTtsModel)}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select
                  value={ttsModel}
                  onChange={(e) => setTtsModel(e.target.value)}
                  options={(TTS_PROVIDERS as any)[ttsProvider]?.models?.map((m: string) => ({ label: m, value: m })) || []}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <Input type="password" placeholder="Enter API key" value={ttsApiKey} onChange={(e) => setTtsApiKey(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice</label>
                <Select
                  value={ttsVoice}
                  onChange={(e) => setTtsVoice(e.target.value)}
                  options={(TTS_PROVIDERS as any)[ttsProvider]?.voices?.map((v: string) => ({ label: v, value: v })) || [{ label: 'Default', value: 'default' }]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Speed: {ttsSpeed}x</label>
                <input type="range" min="0.5" max="2" step="0.1" value={ttsSpeed} onChange={(e) => setTtsSpeed(parseFloat(e.target.value))} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'video' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-violet-600" />
              <CardTitle>Video Generation AI</CardTitle>
            </div>
            <CardDescription>Choose AI for generating video from images/text</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Video Provider</label>
              {renderProviderSelector(videoProvider, setVideoProvider, VIDEO_PROVIDERS, setVideoModel)}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select
                  value={videoModel}
                  onChange={(e) => setVideoModel(e.target.value)}
                  options={(VIDEO_PROVIDERS as any)[videoProvider]?.models?.map((m: string) => ({ label: m, value: m })) || []}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <Input type="password" placeholder="Enter API key" value={videoApiKey} onChange={(e) => setVideoApiKey(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Select value={videoDuration} onChange={(e) => setVideoDuration(parseInt(e.target.value))} options={[{ label: '3 seconds', value: '3' }, { label: '5 seconds', value: '5' }, { label: '10 seconds', value: '10' }, { label: '15 seconds', value: '15' }]} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Aspect Ratio</label>
                <Select value={videoAspect} onChange={(e) => setVideoAspect(e.target.value as any)} options={[{ label: '16:9 (YouTube)', value: '16:9' }, { label: '9:16 (TikTok)', value: '9:16' }, { label: '1:1 (Instagram)', value: '1:1' }]} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        {saved && <span className="flex items-center gap-2 text-green-600"><CheckCircle2 className="h-4 w-4" />All settings saved!</span>}
        <Button onClick={handleSave}><Sparkles className="mr-2 h-4 w-4" />Save All Settings</Button>
      </div>
    </div>
  );
}