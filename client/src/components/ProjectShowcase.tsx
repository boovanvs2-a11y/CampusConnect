import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Heart, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

type Project = {
  id: string;
  title: string;
  creator: string;
  description: string;
  thumbnail: string;
  likes: number;
  views: number;
  category: string;
  liked: boolean;
};

type ProjectShowcaseProps = {
  projects: Project[];
};

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [likedProjects, setLikedProjects] = useState<Set<string>>(
    new Set(projects.filter((p) => p.liked).map((p) => p.id))
  );

  const handleLike = (projectId: string) => {
    setLikedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
    console.log("Toggle like project:", projectId);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Trending Projects</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 pb-4">
            {projects.map((project) => {
              const isLiked = likedProjects.has(project.id);
              return (
                <Card
                  key={project.id}
                  className="overflow-hidden hover-elevate cursor-pointer"
                  onClick={() => console.log("View project:", project.id)}
                  data-testid={`card-project-${project.id}`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm truncate">
                          {project.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          by {project.creator}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="flex-shrink-0 text-xs"
                      >
                        {project.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{project.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart
                            className={`h-3.5 w-3.5 ${isLiked ? "fill-event-accent text-event-accent" : ""}`}
                          />
                          <span>{project.likes + (isLiked && !project.liked ? 1 : !isLiked && project.liked ? -1 : 0)}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={isLiked ? "secondary" : "ghost"}
                        className="h-7 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(project.id);
                        }}
                        data-testid={`button-like-project-${project.id}`}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${isLiked ? "fill-event-accent text-event-accent" : ""}`}
                        />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
        <div className="pt-4 border-t mt-4">
          <Button
            className="w-full gap-2"
            onClick={() => console.log("Upload project")}
            data-testid="button-upload-project"
          >
            <Upload className="h-4 w-4" />
            Upload Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
