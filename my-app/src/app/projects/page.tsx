"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore, type VideoProject } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { 
  Plus, 
  Video, 
  Search,
  Filter,
  Clock,
  MoreVertical,
  Play,
  Edit,
  Trash2,
  Share2
} from "lucide-react";
import { format } from "date-fns";

const platformOptions = [
  { label: "All Platforms", value: "all" },
  { label: "YouTube", value: "youtube" },
  { label: "TikTok", value: "tiktok" },
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
  { label: "Twitter", value: "twitter" },
  { label: "LinkedIn", value: "linkedin" },
];

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Published", value: "published" },
];

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, isAuthenticated, deleteProject } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === "all" || project.platform === platformFilter;
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="mt-1 text-slate-600">
            Manage all your video projects
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Video
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              options={platformOptions}
              className="w-40"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              className="w-40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <Link href={`/projects/${project.id}`}>
                <div className="aspect-video w-full bg-slate-100">
                  {project.thumbnailUrl ? (
                    <img 
                      src={project.thumbnailUrl} 
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Video className="h-12 w-12 text-slate-300" />
                    </div>
                  )}
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/projects/${project.id}`}>
                      <h3 className="font-semibold text-slate-900 hover:text-violet-600">
                        {project.title}
                      </h3>
                    </Link>
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <span className="capitalize rounded-full bg-slate-100 px-2 py-0.5">
                        {project.platform}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3 w-3" />
                    {format(new Date(project.updatedAt), "MMM d")}
                  </span>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Video className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No projects found</h3>
            <p className="mt-1 text-slate-600">
              {searchQuery || platformFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first video project to get started"}
            </p>
            {!searchQuery && platformFilter === "all" && statusFilter === "all" && (
              <Link href="/projects/new" className="mt-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Video
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}