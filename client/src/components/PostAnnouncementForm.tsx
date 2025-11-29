import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Bell, Plus } from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

type PostAnnouncementFormProps = {
  onAnnouncementPosted?: () => void;
  children?: React.ReactNode;
};

export function PostAnnouncementForm({ onAnnouncementPosted, children }: PostAnnouncementFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"holiday" | "notice" | "maintenance" | "event">("notice");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/announcements", {
        title: title.trim(),
        content: content.trim(),
        category,
      });

      toast({
        title: "Announcement Posted!",
        description: "Your announcement has been published to all students.",
      });

      setTitle("");
      setContent("");
      setCategory("notice");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      onAnnouncementPosted?.();
    } catch (error) {
      toast({
        title: "Post Failed",
        description: "Failed to post announcement. Only Principal can create announcements.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full gap-2" data-testid="button-post-announcement">
            <Plus className="h-4 w-4" />
            Post Announcement
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-testid="dialog-post-announcement">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Post New Announcement
          </DialogTitle>
          <DialogDescription>
            Share important updates, notices, and events with all students
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Announcement title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-announcement-title"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={(value: any) => setCategory(value)}>
              <SelectTrigger data-testid="select-announcement-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notice">Notice</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea
              placeholder="Write your announcement content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              data-testid="textarea-announcement-content"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              data-testid="button-cancel-announcement"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              disabled={isSubmitting}
              className="flex-1"
              data-testid="button-submit-announcement"
            >
              {isSubmitting ? "Posting..." : "Post Announcement"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
