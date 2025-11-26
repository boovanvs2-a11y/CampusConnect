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
import { useToast } from "@/hooks/use-toast";
import { Lock, Plus } from "lucide-react";
import { useState } from "react";

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
  const isAuthorized = userRole === "lecturer" || userRole === "principal";

  const handleCreateClub = () => {
    if (!isAuthorized) {
      toast({
        title: "Access Denied",
        description: "Only lecturers and principals can create clubs",
        variant: "destructive",
      });
      return;
    }

    if (!clubName.trim() || !clubCategory.trim() || !clubDesc.trim()) {
      toast({
        title: "Fill All Fields",
        description: "Please complete club details",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Club Created",
      description: `${clubName} has been created successfully!`,
    });

    setClubName("");
    setClubCategory("");
    setClubDesc("");
    setIsDialogOpen(false);
  };

  return (
    <Card className="backdrop-blur-sm bg-card/90">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Campus Clubs</CardTitle>
          {isAuthorized ? (
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
                    Only authorized users can create clubs. Fill in the club details below.
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
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      placeholder="e.g., Technology, Sports, Cultural"
                      value={clubCategory}
                      onChange={(e) => setClubCategory(e.target.value)}
                      data-testid="input-club-category"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      placeholder="Brief description of the club"
                      value={clubDesc}
                      onChange={(e) => setClubDesc(e.target.value)}
                      data-testid="input-club-description"
                    />
                  </div>
                  <Button onClick={handleCreateClub} className="w-full" data-testid="button-submit-club">
                    Create Club
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1 rounded-md bg-muted">
              <Lock className="h-3 w-3" />
              Only authorized members
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
