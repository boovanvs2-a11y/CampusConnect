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
import { Plus, Loader, Send, Sparkles } from "lucide-react";
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
  userRole?: string;
};

export function ClubsCarousel({ userRole = "student" }: ClubsCarouselProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [clubName, setClubName] = useState("");
  const [clubCategory, setClubCategory] = useState("");
  const [clubDesc, setClubDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState<string | null>(null);
  const [setupClubId, setSetupClubId] = useState<string | null>(null);
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


  const handleCreateClub = async () => {
    if (!clubName.trim() || !clubCategory.trim() || !clubDesc.trim()) {
      toast({
        title: "Fill All Fields",
        description: "Please enter club name, category, and description",
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
        description: `${clubName} submitted for approval.`,
      });

      setClubName("");
      setClubCategory("");
      setClubDesc("");
      setIsCreateOpen(false);
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

  const handleSetupClub = async () => {
    if (!clubCategory.trim() || !clubDesc.trim()) {
      toast({
        title: "Fill All Fields",
        description: "Please complete club details",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("PATCH", `/api/clubs/${setupClubId}/setup`, {
        description: clubDesc,
        category: clubCategory,
      });

      toast({
        title: "Setup Complete!",
        description: "Club is ready to submit for approval.",
      });

      setClubCategory("");
      setClubDesc("");
      setIsSetupOpen(false);
      setSetupClubId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/clubs/my-drafts"] });
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSetupDialog = (clubId: string, description: string, category: string) => {
    setSetupClubId(clubId);
    setClubDesc(description || "");
    setClubCategory(category || "");
    setIsSetupOpen(true);
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
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Create Club
            </CardTitle>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
                  Fill in all details and submit for approval.
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
                  Submit Club
                </Button>
                
                {draftClubs.filter((c: any) => c.status !== "approved").length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-xs font-semibold mb-3">Your Pending Submissions</h4>
                    <div className="space-y-2">
                      {draftClubs.filter((c: any) => c.status !== "approved").map((club: any) => (
                        <div
                          key={club.id}
                          className="p-2 rounded border bg-muted/20 text-xs"
                          data-testid={`card-pending-club-inline-${club.id}`}
                        >
                          <p className="font-medium truncate">{club.name}</p>
                          <p className="text-muted-foreground line-clamp-1">{club.description}</p>
                          <p className="text-muted-foreground text-xs mt-1">Awaiting principal review</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">Draft clubs and submit for approval.</p>
        </CardContent>
      </Card>


      {draftClubs.filter((c: any) => c.status === "approved").length > 0 && (
        <Card className="backdrop-blur-sm bg-card/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Approved Clubs</CardTitle>
            <p className="text-xs text-muted-foreground">Your clubs approved by principal</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {draftClubs.filter((c: any) => c.status === "approved").map((club: any) => (
              <div
                key={club.id}
                className="p-3 rounded-lg border bg-muted/30"
                data-testid={`card-approved-club-${club.id}`}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate">{club.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{club.description}</p>
                  <p className="text-xs text-primary font-medium mt-1">✓ Approved by Principal</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
