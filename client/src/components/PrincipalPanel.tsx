import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PostAnnouncementForm } from "./PostAnnouncementForm";

type PendingClub = {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  status: string;
  createdAt: string;
};

export function PrincipalPanel() {
  const { toast } = useToast();
  const [pendingClubs, setPendingClubs] = useState<PendingClub[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingClubs();
  }, []);

  const handleAnnouncementPosted = () => {
    // Refresh or just show success - announcements are displayed elsewhere
  };

  const fetchPendingClubs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clubs/pending", {
        credentials: "include",
      });
      if (res.ok) {
        const clubs = await res.json();
        setPendingClubs(clubs);
      }
    } catch (error) {
      console.error("Failed to fetch pending clubs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (clubId: string) => {
    setActionInProgress(clubId);
    try {
      await fetch(`/api/clubs/${clubId}/approve`, {
        method: "PATCH",
        credentials: "include",
      });

      toast({
        title: "Club Approved",
        description: "Student can now complete setup to publish it in Connect.",
      });

      setPendingClubs(pendingClubs.filter((c) => c.id !== clubId));
      queryClient.invalidateQueries({ queryKey: ['/api/clubs'] });
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Failed to approve club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (clubId: string) => {
    setActionInProgress(clubId);
    try {
      await fetch(`/api/clubs/${clubId}/reject`, {
        method: "PATCH",
        credentials: "include",
      });

      toast({
        title: "Club Rejected",
        description: "The club has been rejected and removed from pending list.",
      });

      setPendingClubs(pendingClubs.filter((c) => c.id !== clubId));
      queryClient.invalidateQueries({ queryKey: ['/api/clubs'] });
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: "Failed to reject club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-card/90">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Club Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading pending clubs...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-card/90">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Club Approvals
          </CardTitle>
          {pendingClubs.length > 0 && (
            <Badge variant="destructive">{pendingClubs.length}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingClubs.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No pending club requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingClubs.map((club) => (
              <div
                key={club.id}
                className="p-3 rounded-lg border border-muted-foreground/20 bg-muted/30"
                data-testid={`card-pending-club-${club.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">{club.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {club.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="flex-shrink-0">
                    Pending
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1 h-8"
                    onClick={() => handleApprove(club.id)}
                    disabled={actionInProgress === club.id}
                    data-testid={`button-approve-club-${club.id}`}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8"
                    onClick={() => handleReject(club.id)}
                    disabled={actionInProgress === club.id}
                    data-testid={`button-reject-club-${club.id}`}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
