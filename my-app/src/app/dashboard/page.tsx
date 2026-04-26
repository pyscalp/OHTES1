"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Video, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const { user, projects, isAuthenticated } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const recentProjects = projects.slice(0, 5);
  const totalViews = projects.reduce((acc, p) => acc + (p.analytics?.views || 0), 0);
  const totalLikes = projects.reduce((acc, p) => acc + (p.analytics?.likes || 0), 0);
  const totalComments = projects.reduce((acc, p) => acc + (p.analytics?.comments || 0), 0);

  const stats = [
    {
      label: "Total Videos",
      value: projects.length,
      icon: Video,
      color: "text-violet-600",
      bgColor: "bg-violet-100",
    },
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Total Likes",
      value: totalLikes.toLocaleString(),
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      label: "Comments",
      value: totalComments.toLocaleString(),
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="mt-1 text-slate-600">
            Here&apos;s what&apos;s happening with your video content
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Video
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Plan</CardTitle>
          <CardDescription>Manage your subscription and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-2xl font-bold capitalize text-slate-900">{user.plan} Plan</p>
              <p className="text-sm text-slate-600">
                {user.videosUsed} of {user.videosLimit} videos used this month
              </p>
            </div>
            <div className="w-full md:w-64">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div 
                  className="h-full rounded-full bg-violet-600 transition-all"
                  style={{ width: `${(user.videosUsed / user.videosLimit) * 100}%` }}
                />
              </div>
            </div>
            <Button variant="outline">Upgrade Plan</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:border-violet-300">
          <Link href="/projects/new">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                <Sparkles className="h-6 w-6 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">AI Script Generator</p>
                <p className="text-sm text-slate-600">Create script from topic</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:border-violet-300">
          <Link href="/projects">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">Video Projects</p>
                <p className="text-sm text-slate-600">Manage all projects</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:border-violet-300">
          <Link href="/analytics">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">Analytics</p>
                <p className="text-sm text-slate-600">View performance</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Projects</CardTitle>
            <CardDescription>Your latest video projects</CardDescription>
          </div>
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100">
                    {project.thumbnailUrl ? (
                      <img 
                        src={project.thumbnailUrl} 
                        alt={project.title}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <Video className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{project.title}</p>
                    <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                      <span className="capitalize">{project.platform}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(project.updatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      project.status === "published" 
                        ? "bg-green-100 text-green-700"
                        : project.status === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : project.status === "processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Video className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No projects yet</h3>
              <p className="mt-1 text-slate-600">Create your first video project to get started</p>
              <Link href="/projects/new" className="mt-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Video
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}