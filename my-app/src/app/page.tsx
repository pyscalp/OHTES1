import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  Video, 
  Zap, 
  Share2, 
  BarChart3, 
  Clock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Script Generator",
    description: "Generate engaging video scripts from topics or keywords using advanced AI",
  },
  {
    icon: Video,
    title: "Text-to-Video",
    description: "Convert scripts into professional videos with AI avatars and voiceovers",
  },
  {
    icon: Zap,
    title: "Instant Resize",
    description: "Automatically adapt videos for TikTok, YouTube, Instagram, and more",
  },
  {
    icon: Share2,
    title: "Cross-Posting",
    description: "Post to multiple platforms simultaneously with one click",
  },
  {
    icon: Clock,
    title: "Smart Scheduler",
    description: "Schedule posts at optimal times for maximum engagement",
  },
  {
    icon: BarChart3,
    title: "AI Analytics",
    description: "Get insights and predictions to optimize your content strategy",
  },
];

const platforms = [
  { name: "YouTube", icon: "▶", color: "text-red-600" },
  { name: "TikTok", icon: "♪", color: "text-black" },
  { name: "Instagram", icon: "◉", color: "text-pink-600" },
  { name: "Facebook", icon: "f", color: "text-blue-600" },
  { name: "Twitter/X", icon: "𝕏", color: "text-black" },
  { name: "LinkedIn", icon: "in", color: "text-blue-700" },
];

const pricing = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for creators just starting out",
    features: ["10 videos/month", "2 platforms", "30 AI minutes", "5GB storage", "Email support"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "For growing creators and small teams",
    features: ["50 videos/month", "All platforms", "150 AI minutes", "50GB storage", "Priority support", "Team members (3)"],
    popular: true,
  },
  {
    name: "Business",
    price: "$199",
    period: "/month",
    description: "For agencies and large teams",
    features: ["200 videos/month", "All platforms", "500 AI minutes", "200GB storage", "Dedicated support", "Team members (10)", "API access"],
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100 via-white to-white" />
        
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm text-violet-700">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Video Creation</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Create Viral Videos with{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                AI Magic
              </span>
            </h1>
            
            <p className="mb-8 text-lg text-slate-600 sm:text-xl">
              Generate, edit, and distribute professional video content to all social media platforms. 
              From script to posting in minutes, not hours.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  Watch Demo
                </Button>
              </Link>
            </div>
            
            <p className="mt-4 text-sm text-slate-500">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="border-y border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <p className="mb-8 text-center text-sm font-medium text-slate-500">
            SUPPORTED PLATFORMS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-2 text-lg font-semibold text-slate-700"
              >
                <span className={platform.color}>{platform.icon}</span>
                <span>{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to go viral
            </h2>
            <p className="text-lg text-slate-600">
              Powerful AI tools that make video creation effortless
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-slate-200">
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                    <feature.icon className="h-6 w-6 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How it works
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Enter Your Topic</h3>
              <p className="text-slate-400">
                Describe your video idea or provide keywords. Our AI generates a compelling script instantly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">AI Creates Your Video</h3>
              <p className="text-slate-400">
                Our AI generates a professional video with avatar, voiceover, graphics, and music.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Publish Everywhere</h3>
              <p className="text-slate-400">
                One-click posting to all platforms. Schedule for later or post immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-slate-600">
              Choose the plan that fits your needs
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {pricing.map((plan) => (
              <Card 
                key={plan.name}
                className={`relative border-slate-200 ${plan.popular ? 'border-violet-600 shadow-lg shadow-violet-100' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-violet-600" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button 
                      className={`mt-6 w-full ${plan.popular ? '' : 'variant-outline'}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-violet-600 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to create your first viral video?
            </h2>
            <p className="mb-8 text-lg text-violet-100">
              Join thousands of creators already using VidAI
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">VidAI</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 VidAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}