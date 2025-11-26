import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
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
  saved: boolean;
};

type SocializeSectionProps = {
  posts: Post[];
};

export function SocializeSection({ posts }: SocializeSectionProps) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(
    new Set(posts.filter((p) => p.liked).map((p) => p.id))
  );
  const [savedPosts, setSavedPosts] = useState<Set<string>>(
    new Set(posts.filter((p) => p.saved).map((p) => p.id))
  );
  const [newPost, setNewPost] = useState("");

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
    console.log("Toggle like post:", postId);
  };

  const handleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
    console.log("Toggle save post:", postId);
  };

  const handlePost = () => {
    if (newPost.trim()) {
      console.log("Create post:", newPost);
      setNewPost("");
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Heart className="h-5 w-5 text-event-accent" />
          Socialize
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 space-y-4">
        <div className="rounded-md border p-3 space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">You</AvatarFallback>
            </Avatar>
            <Input
              placeholder="What's happening on campus?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="flex-1"
              data-testid="input-new-post"
            />
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => console.log("Add image")}
              data-testid="button-add-image"
            >
              <ImageIcon className="h-4 w-4" />
              Photo
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

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 pb-4">
            {posts.map((post) => {
              const isLiked = likedPosts.has(post.id);
              const isSaved = savedPosts.has(post.id);

              return (
                <div
                  key={post.id}
                  className="rounded-md border overflow-hidden"
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {post.authorInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{post.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {post.timeAgo}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => console.log("Post menu:", post.id)}
                        data-testid={`button-post-menu-${post.id}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p
                      className="text-sm mb-3"
                      data-testid={`text-post-content-${post.id}`}
                    >
                      {post.content}
                    </p>
                  </div>

                  {post.image && (
                    <div className="aspect-square w-full overflow-hidden bg-muted">
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-1.5 text-sm"
                        onClick={() => handleLike(post.id)}
                        data-testid={`button-like-post-${post.id}`}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isLiked ? "fill-event-accent text-event-accent" : ""
                          }`}
                        />
                        <span className="text-muted-foreground">
                          {post.likes +
                            (isLiked && !post.liked
                              ? 1
                              : !isLiked && post.liked
                                ? -1
                                : 0)}
                        </span>
                      </button>
                      <button
                        className="flex items-center gap-1.5 text-sm text-muted-foreground"
                        onClick={() => console.log("Comment on post:", post.id)}
                        data-testid={`button-comment-post-${post.id}`}
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>{post.comments}</span>
                      </button>
                      <button
                        className="text-muted-foreground"
                        onClick={() => console.log("Share post:", post.id)}
                        data-testid={`button-share-post-${post.id}`}
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleSave(post.id)}
                      data-testid={`button-save-post-${post.id}`}
                    >
                      <Bookmark
                        className={`h-5 w-5 ${
                          isSaved ? "fill-foreground" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
