import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

type AddNoteFormProps = {
  onNoteAdded?: () => void;
  children?: React.ReactNode;
};

export function AddNoteForm({ onNoteAdded, children }: AddNoteFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = async () => {
    if (!title.trim() || !subject.trim() || !content.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in title, subject, and content",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/notes", {
        title: title.trim(),
        subject: subject.trim(),
        content: content.trim(),
      });

      toast({
        title: "Note Added!",
        description: "Your note has been uploaded for students.",
      });

      setTitle("");
      setSubject("");
      setContent("");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      onNoteAdded?.();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to add note. Only lecturers can upload notes.",
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
          <Button variant="outline" className="w-full gap-2" data-testid="button-add-note">
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-testid="dialog-add-note">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add New Note
          </DialogTitle>
          <DialogDescription>
            Upload study materials and lecture notes for your students
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-note-title"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Subject</label>
            <Input
              placeholder="Subject name (e.g., Mathematics, Computer Science)..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              data-testid="input-note-subject"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea
              placeholder="Write or paste your note content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              data-testid="textarea-note-content"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              data-testid="button-cancel-note"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNote}
              disabled={isSubmitting}
              className="flex-1"
              data-testid="button-submit-note"
            >
              {isSubmitting ? "Uploading..." : "Add Note"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
