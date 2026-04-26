"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sparkles, Loader2, Video, Zap, ArrowRight } from "lucide-react";

const platformOptions = [
  { label: "YouTube", value: "youtube" },
  { label: "TikTok", value: "tiktok" },
  { label: "Instagram Reels", value: "instagram" },
  { label: "Facebook", value: "facebook" },
  { label: "Twitter/X", value: "twitter" },
  { label: "LinkedIn", value: "linkedin" },
];

const voiceOptions = [
  { label: "Professional Male", value: "professional_male" },
  { label: "Professional Female", value: "professional_female" },
  { label: "Casual Male", value: "casual_male" },
  { label: "Casual Female", value: "casual_female" },
  { label: "Enthusiastic", value: "enthusiastic" },
];

const styleOptions = [
  { label: "Modern & Dynamic", value: "modern" },
  { label: "Corporate & Professional", value: "corporate" },
  { label: "Casual & Fun", value: "casual" },
  { label: "Educational", value: "educational" },
  { label: "Entertainment", value: "entertainment" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const { isAuthenticated, addProject } = useAppStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [voice, setVoice] = useState("professional_male");
  const [style, setStyle] = useState("modern");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleGenerateScript = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const generatedScript = `🎬 ${topic}

[OPENING]
Hey everyone! Welcome back. Today we're diving into ${topic}.

[MAIN CONTENT]
Let me break this down into key points:

First, why ${topic} matters so much in today's world. Whether you're a beginner or experienced, understanding this will change how you approach your work.

The first key thing you need to know is that success comes from taking consistent action.

Now, here's the practical part:

Step 1: Start with understanding your goals
Step 2: Break it down into manageable pieces  
Step 3: Take action and iterate

[CLOSING]
If you found this helpful, like and subscribe! Hit that notification bell.

Until next time, keep creating! 🎥`;
      setScript(generatedScript);
      setStep(2);
    } catch (error) {
      console.error("Failed to generate script:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVideo = async () => {
    if (!script.trim()) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const projectId = addProject({
        title: topic,
        script,
        platform: platform as any,
        status: "processing",
      });
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error("Failed to create video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${step >= s ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-400"}`}>
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-600" />
              <CardTitle>AI Script Generator</CardTitle>
            </div>
            <CardDescription>Enter your video topic and our AI will generate a professional script</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">What&apos;s your video about?</label>
              <Input placeholder="e.g., How to create amazing videos with AI" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            <Button onClick={handleGenerateScript} disabled={!topic.trim() || loading} className="w-full">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Script with AI</>}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-violet-600" />
              <CardTitle>Review Your Script</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <textarea className="min-h-[300px] w-full rounded-md border border-slate-300 p-4 font-mono text-sm" value={script} onChange={(e) => setScript(e.target.value)} />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={!script.trim()} className="flex-1">Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-violet-600" />
              <CardTitle>Video Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Platform</label>
                <Select value={platform} onChange={(e) => setPlatform(e.target.value)} options={platformOptions} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice Style</label>
                <Select value={voice} onChange={(e) => setVoice(e.target.value)} options={voiceOptions} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Visual Style</label>
                <Select value={style} onChange={(e) => setStyle(e.target.value)} options={styleOptions} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleCreateVideo} disabled={loading} className="flex-1">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : <><Video className="mr-2 h-4 w-4" />Create Video</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}