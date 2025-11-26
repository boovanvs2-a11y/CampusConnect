import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

type Club = {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  banner?: string;
};

type ClubsCarouselProps = {
  clubs: Club[];
  userRole?: string;
};

export function ClubsCarousel({ clubs, userRole = "student" }: ClubsCarouselProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clubName, setClubName] = useState("");
  const [clubCategory, setClubCategory] = useState("");
  const [clubDesc, setClubDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateClub = async () => {
    if (!clubName.trim() || !clubCategory.trim() || !clubDesc.trim()) {
      toast({
        title: "Fill All Fields",
        description: "Please complete club details",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/clubs", {
        name: clubName,
        description: clubDesc,
        category: clubCategory,
      });

      toast({
        title: "Club Created!",
        description: `${clubName} submitted for approval. Principal will review soon.`,
      });

      setClubName("");
      setClubCategory("");
      setClubDesc("");
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-card/90">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Campus Clubs</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 h-8"
                data-testid="button-create-club"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-create-club">
              <DialogHeader>
                <DialogTitle>Create New Club</DialogTitle>
                <DialogDescription>
                  Submit a new club for approval. Principal will review and publish if approved.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Club Name</label>
                  <Input
                    placeholder="e.g., Tech Innovation Club"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    data-testid="input-club-name"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    placeholder="e.g., Technology, Sports, Cultural"
                    value={clubCategory}
                    onChange={(e) => setClubCategory(e.target.value)}
                    data-testid="input-club-category"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Brief description of the club"
                    value={clubDesc}
                    onChange={(e) => setClubDesc(e.target.value)}
                    data-testid="input-club-description"
                    disabled={isSubmitting}
                    className="min-h-20"
                  />
                </div>
                <Button
                  onClick={handleCreateClub}
                  disabled={isSubmitting}
                  className="w-full"
                  data-testid="button-submit-club"
                >
                  {isSubmitting && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                  Submit for Approval
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
    </Card>
  );
}
