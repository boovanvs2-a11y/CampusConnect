import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

export function ClubsCarousel({ clubs: mockClubs, userRole = "student" }: ClubsCarouselProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clubName, setClubName] = useState("");
  const [clubCategory, setClubCategory] = useState("");
  const [clubDesc, setClubDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState<string | null>(null);
  const [joinConfirmOpen, setJoinConfirmOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [joinedClubs, setJoinedClubs] = useState<Set<string>>(new Set());

  // Fetch approved clubs from backend
  const { data: approvedClubs = [] } = useQuery({
    queryKey: ["/api/clubs"],
  }) as any;

  // Fetch user's draft clubs
  const { data: draftClubs = [] } = useQuery({
    queryKey: ["/api/clubs/my-drafts"],
    queryFn: async () => {
      const res = await fetch("/api/clubs/my-drafts", {
        credentials: "include",
      });
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Combine real approved clubs with mock clubs for display
  const displayClubs = approvedClubs && approvedClubs.length > 0 ? approvedClubs : mockClubs;

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
        description: `${clubName} saved as draft. Set it up and submit for approval.`,
      });

      setClubName("");
      setClubCategory("");
      setClubDesc("");
      setIsDialogOpen(false);
      // Refresh draft clubs list
      queryClient.invalidateQueries({ queryKey: ["/api/clubs/my-drafts"] });
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

  const handleSubmitForApproval = async (clubId: string) => {
    setSubmitInProgress(clubId);
    try {
      await apiRequest("PATCH", `/api/clubs/${clubId}/submit`, {});
      toast({
        title: "Submitted!",
        description: "Club submitted for principal approval.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/clubs/my-drafts"] });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitInProgress(null);
    }
  };

  const handleJoinConfirm = (club: Club) => {
    setSelectedClub(club);
    setJoinConfirmOpen(true);
  };

  const handleConfirmJoin = () => {
    if (!selectedClub) return;
    
    const newJoined = new Set(joinedClubs);
    const isJoining = !newJoined.has(selectedClub.id);
    
    if (isJoining) {
      newJoined.add(selectedClub.id);
      toast({
        title: "Joined Successfully",
        description: `You've joined ${selectedClub.name}!`,
      });
    } else {
      newJoined.delete(selectedClub.id);
      toast({
        title: "Left Club",
        description: `You've left ${selectedClub.name}`,
      });
    }
    
    setJoinedClubs(newJoined);
    setJoinConfirmOpen(false);
  };

  const handleViewClub = (club: Club) => {
    setLocation(`/club?id=${club.id}`);
  };

  return (
    <>
      <Dialog open={joinConfirmOpen} onOpenChange={setJoinConfirmOpen}>
        <DialogContent data-testid="dialog-join-confirm">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {selectedClub && joinedClubs.has(selectedClub.id)
                ? `Are you sure you want to leave ${selectedClub.name}?`
                : `Are you sure you want to join ${selectedClub?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setJoinConfirmOpen(false)} data-testid="button-cancel-join">
              Cancel
            </Button>
            <Button onClick={handleConfirmJoin} data-testid="button-confirm-join">
              {selectedClub && joinedClubs.has(selectedClub.id) ? "Leave" : "Join"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  Create a draft club to set up. You can submit it for approval after setup is complete.
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
                  Create Draft
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {displayClubs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No clubs yet. Create one to get started!</p>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {displayClubs.map((club: any) => (
                <div
                  key={club.id}
                  className="p-3 rounded-lg border hover-elevate cursor-pointer bg-muted/30"
                  onClick={() => handleViewClub(club)}
                  data-testid={`card-club-list-${club.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate">{club.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{club.description}</p>
                      <span className="text-xs text-muted-foreground">{club.category || "General"}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinConfirm(club);
                      }}
                      disabled={joinedClubs.has(club.id)}
                      data-testid={`button-join-${club.id}`}
                      className="flex-shrink-0"
                    >
                      {joinedClubs.has(club.id) ? "Joined" : "Join"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {draftClubs.length > 0 && (
        <Card className="backdrop-blur-sm bg-card/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">My Drafts</CardTitle>
            <p className="text-xs text-muted-foreground">Clubs waiting to be submitted for approval</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {draftClubs.map((club: any) => (
              <div
                key={club.id}
                className="p-3 rounded-lg border bg-muted/30 flex items-start justify-between gap-2"
                data-testid={`card-draft-club-${club.id}`}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate">{club.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{club.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleSubmitForApproval(club.id)}
                  disabled={submitInProgress === club.id}
                  data-testid={`button-submit-draft-${club.id}`}
                  className="flex-shrink-0"
                >
                  {submitInProgress === club.id ? (
                    <Loader className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3 w-3 mr-1" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
