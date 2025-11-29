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
  const { data: draftClubs = [], refetch: refetchDrafts } = useQuery({
    queryKey: ["/api/clubs/my-drafts"],
    queryFn: async () => {
      const res = await fetch("/api/clubs/my-drafts", {
        credentials: "include",
      });
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Refetch draft clubs when dialog opens to see if principal approved any
  useEffect(() => {
    if (isCreateOpen) {
      refetchDrafts();
    }
  }, [isCreateOpen, refetchDrafts]);


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
        title: "Club Submitted!",
        description: `${clubName} submitted for principal approval.`,
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
        description: "Club is now live in Connect.",
      });

      setClubCategory("");
      setClubDesc("");
      setIsSetupOpen(false);
      setSetupClubId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/clubs/my-drafts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] }); // Refresh Connect section
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

                {draftClubs.filter((c: any) => c.status === "pending").length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-semibold mb-2">Pending Approval</h4>
                    <p className="text-xs text-muted-foreground mb-3">Waiting for principal decision</p>
                    <div className="space-y-2">
                      {draftClubs.filter((c: any) => c.status === "pending").map((club: any) => (
                        <div
                          key={club.id}
                          className="p-3 rounded-lg border bg-muted/30"
                          data-testid={`card-pending-club-inline-${club.id}`}
                        >
                          <h4 className="text-sm font-semibold truncate">{club.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{club.description}</p>
                          <p className="text-xs text-amber-600 font-medium mt-1">⏳ Pending</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {draftClubs.filter((c: any) => c.status === "approved").length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-semibold mb-2">Approved - Ready to Setup</h4>
                    <p className="text-xs text-muted-foreground mb-3">Approved by principal, complete setup to go live</p>
                    <div className="space-y-2">
                      {draftClubs.filter((c: any) => c.status === "approved").map((club: any) => (
                        <div
                          key={club.id}
                          className="p-3 rounded-lg border bg-muted/30 flex items-start justify-between gap-2"
                          data-testid={`card-approved-club-inline-${club.id}`}
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold truncate">{club.name}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">{club.description}</p>
                            <p className="text-xs text-primary font-medium mt-1">✓ Approved by Principal</p>
                          </div>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => openSetupDialog(club.id, club.description || "", club.category || "")}
                            disabled={isSubmitting}
                            data-testid={`button-setup-approved-inline-${club.id}`}
                            className="flex-shrink-0"
                          >
                            Setup
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {draftClubs.filter((c: any) => c.status === "rejected").length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-semibold mb-2">Rejected</h4>
                    <p className="text-xs text-muted-foreground mb-3">Principal did not approve these clubs</p>
                    <div className="space-y-2">
                      {draftClubs.filter((c: any) => c.status === "rejected").map((club: any) => (
                        <div
                          key={club.id}
                          className="p-3 rounded-lg border bg-muted/30"
                          data-testid={`card-rejected-club-inline-${club.id}`}
                        >
                          <h4 className="text-sm font-semibold truncate">{club.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{club.description}</p>
                          <p className="text-xs text-destructive font-medium mt-1">✗ Rejected</p>
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
      <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
        <DialogContent data-testid="dialog-setup-club">
          <DialogHeader>
            <DialogTitle>Complete Club Setup</DialogTitle>
            <DialogDescription>
              Finalize your club details to publish it to Connect.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input
                placeholder="e.g., Technology, Sports, Cultural"
                value={clubCategory}
                onChange={(e) => setClubCategory(e.target.value)}
                data-testid="input-club-category-setup"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Brief description of the club"
                value={clubDesc}
                onChange={(e) => setClubDesc(e.target.value)}
                data-testid="input-club-description-setup"
                disabled={isSubmitting}
                className="min-h-20"
              />
            </div>
            <Button
              onClick={handleSetupClub}
              disabled={isSubmitting}
              className="w-full"
              data-testid="button-complete-setup"
            >
              {isSubmitting && <Loader className="h-4 w-4 mr-2 animate-spin" />}
              Go Live in Connect
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
