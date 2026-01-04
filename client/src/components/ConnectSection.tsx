import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Users, ChevronDown, Shield, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

type Club = {
  id: string;
  name: string;
  description: string;
  creatorId?: string;
  status?: string;
  createdAt?: string;
};

type ConnectSectionProps = {
  // No props needed - fetches directly from API
};

export function ConnectSection({}: ConnectSectionProps) {
  // Fetch approved clubs created by students and approved by principal
  const { data: clubs = [] } = useQuery({
    queryKey: ['/api/clubs'],
    queryFn: async () => {
      const res = await fetch('/api/clubs');
      if (!res.ok) throw new Error('Failed to fetch clubs');
      return res.json();
    }
  });

  // Transform API clubs to match UI expectations
  const transformedClubs = clubs.map((club: any) => ({
    id: club.id,
    name: club.name,
    description: club.description || '',
    members: 0,
    category: club.category || 'General',
    admin: 'RNSIT Admin', // Approved by principal
    adminInitials: 'RA',
    isOfficial: true, // These are official approved clubs
    joined: false,
  }));
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [joinedClubs, setJoinedClubs] = useState<Set<string>>(
    new Set(transformedClubs.filter((c) => c.joined).map((c) => c.id))
  );
  const [loadingClub, setLoadingClub] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const handleClubClick = (clubId: string) => {
    setLocation(`/club?id=${clubId}`);
  };

  const handleJoinClick = (club: Club) => {
    setSelectedClub(club);
    setConfirmDialogOpen(true);
  };

  const handleConfirmJoin = async () => {
    if (!selectedClub) return;
    
    setLoadingClub(selectedClub.id);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setJoinedClubs((prev) => {
      const next = new Set(prev);
      if (next.has(selectedClub.id)) {
        next.delete(selectedClub.id);
        toast({
          title: "Left Club",
          description: `You have left ${selectedClub.name}`,
        });
      } else {
        next.add(selectedClub.id);
        toast({
          title: "Joined Club",
          description: `Welcome to ${selectedClub.name}!`,
        });
      }
      return next;
    });
    
    setLoadingClub(null);
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent data-testid="dialog-club-confirm">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {selectedClub && joinedClubs.has(selectedClub.id)
                ? `Are you sure you want to leave ${selectedClub.name}?`
                : `Are you sure you want to join ${selectedClub?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} data-testid="button-cancel-connect">
              Cancel
            </Button>
            <Button onClick={handleConfirmJoin} data-testid="button-confirm-connect">
              {selectedClub && joinedClubs.has(selectedClub.id) ? "Leave" : "Join"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardHeader className="pb-3">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Connect
              </CardTitle>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <p className="text-xs text-muted-foreground text-left">
              Join official clubs created by authorized members
            </p>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {transformedClubs.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No approved clubs yet</p>
                ) : (
                transformedClubs.map((club) => {
                  const isJoined = joinedClubs.has(club.id);
                  const isLoading = loadingClub === club.id;

                  return (
                    <div
                      key={club.id}
                      className="flex items-center gap-3 p-2 rounded-md border hover-elevate cursor-pointer"
                      onClick={() => handleClubClick(club.id)}
                      data-testid={`card-club-${club.id}`}
                    >
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {club.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium truncate" data-testid={`text-club-name-${club.id}`}>
                            {club.name}
                          </p>
                          {club.isOfficial && (
                            <Shield className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{club.members} members</span>
                          <span>•</span>
                          <span>by {club.admin}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={isJoined ? "secondary" : "default"}
                        disabled={isLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinClick(club);
                        }}
                        data-testid={`button-join-club-${club.id}`}
                        className="flex-shrink-0"
                      >
                        {isLoading ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : isJoined ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Joined
                          </>
                        ) : (
                          "Join"
                        )}
                      </Button>
                    </div>
                  );
                })
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </>
  );
}
