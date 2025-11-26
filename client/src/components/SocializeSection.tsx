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

type Post = {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timeAgo: string;
  liked: boolean;
};

type SocializeSectionProps = {
  posts: Post[];
};

export function SocializeSection({ posts }: SocializeSectionProps) {
  const { toast } = useToast();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(
    new Set(posts.filter((p) => p.liked).map((p) => p.id))
  );
  const [newPost, setNewPost] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

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
      toast({
        title: "Post Created",
        description: "Your post is now live!",
      });
      setNewPost("");
      setIsComposerOpen(false);
    }
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
              {posts.map((post) => {
                const isLiked = likedPosts.has(post.id);

                return (
                  <div
                    key={post.id}
                    className="rounded-md border p-2.5 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">
                          {post.authorInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{post.timeAgo}</p>
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
                          {post.likes + (isLiked && !post.liked ? 1 : !isLiked && post.liked ? -1 : 0)}
                        </span>
                      </button>
                      <button
                        className="flex items-center gap-1 text-sm text-muted-foreground"
                        onClick={() => toast({ title: "Comments", description: "Opening comments..." })}
                        data-testid={`button-comment-post-${post.id}`}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs">{post.comments}</span>
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
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
