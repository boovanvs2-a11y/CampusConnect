import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  MessageCircle,
  Send,
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

type PostData = {
  id: string;
  authorId: string;
  content: string;
  image?: string;
  likes: number;
  createdAt: string;
};

type SocializeSectionProps = {
  currentUserId?: string;
  users?: { [key: string]: { username: string } };
};

export function SocializeSection({ currentUserId, users = {} }: SocializeSectionProps) {
  const { toast } = useToast();
  const [newPost, setNewPost] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const { data: posts = [] } = useQuery({
    queryKey: ['/api/posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const createPostMutation = useMutation({
    mutationFn: (content: string) => apiRequest("POST", "/api/posts", { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Post Created",
        description: "Your post is now live!",
      });
      setNewPost("");
      setIsComposerOpen(false);
    },
    onError: () => {
      toast({
        title: "Failed",
        description: "Could not create post",
        variant: "destructive",
      });
    }
  });

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const handlePost = () => {
    if (newPost.trim()) {
      createPostMutation.mutate(newPost);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getAuthorInitials = (userId: string) => {
    const user = users[userId];
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-event-accent" />
              Socialize
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            <Collapsible open={isComposerOpen} onOpenChange={setIsComposerOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground h-9"
                  data-testid="button-open-composer"
                >
                  What's happening on campus?
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="space-y-2 rounded-md border p-2">
                  <Input
                    placeholder="Share something..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    data-testid="input-new-post"
                  />
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast({ title: "Coming soon", description: "Photo upload will be available soon" })}
                      data-testid="button-add-image"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handlePost}
                      disabled={!newPost.trim()}
                      data-testid="button-create-post"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {posts.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No posts yet. Be the first to share!</p>
              ) : (
                posts.map((post: PostData) => {
                  const isLiked = likedPosts.has(post.id);
                  const authorName = users[post.authorId]?.username || "Unknown";

                  return (
                    <div
                      key={post.id}
                      className="rounded-md border p-2.5 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs">
                            {getAuthorInitials(post.authorId)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{authorName}</p>
                          <p className="text-xs text-muted-foreground">{getTimeAgo(post.createdAt)}</p>
                        </div>
                      </div>

                      <p className="text-sm line-clamp-2" data-testid={`text-post-content-${post.id}`}>
                        {post.content}
                      </p>

                      {post.image && (
                        <div className="h-24 w-full rounded-md overflow-hidden bg-muted">
                          <img
                            src={post.image}
                            alt="Post"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-1">
                        <button
                          className="flex items-center gap-1 text-sm"
                          onClick={() => handleLike(post.id)}
                          data-testid={`button-like-post-${post.id}`}
                        >
                          <Heart
                            className={`h-4 w-4 ${isLiked ? "fill-event-accent text-event-accent" : "text-muted-foreground"}`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {post.likes + (isLiked ? 1 : 0)}
                          </span>
                        </button>
                        <button
                          className="flex items-center gap-1 text-sm text-muted-foreground"
                          onClick={() => toast({ title: "Comments", description: "Opening comments..." })}
                          data-testid={`button-comment-post-${post.id}`}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-xs">0</span>
                        </button>
                        <button
                          className="text-muted-foreground"
                          onClick={() => toast({ title: "Shared!", description: "Link copied to clipboard" })}
                          data-testid={`button-share-post-${post.id}`}
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
