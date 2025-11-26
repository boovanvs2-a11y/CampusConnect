import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { Users, Lock, Plus, ChevronDown } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";

type Club = {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  banner?: string;
  joined: boolean;
};

type ClubsCarouselProps = {
  clubs: Club[];
};

export function ClubsCarousel({ clubs }: ClubsCarouselProps) {
  const { toast } = useToast();
  const [joinedClubs, setJoinedClubs] = useState<Set<string>>(
    new Set(clubs.filter((c) => c.joined).map((c) => c.id))
  );
  const [loadingClub, setLoadingClub] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const handleJoin = async (clubId: string, clubName: string) => {
    setLoadingClub(clubId);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setJoinedClubs((prev) => {
      const next = new Set(prev);
      if (next.has(clubId)) {
        next.delete(clubId);
        toast({
          title: "Left Club",
          description: `You have left ${clubName}`,
        });
      } else {
        next.add(clubId);
        toast({
          title: "Joined Club",
          description: `Welcome to ${clubName}!`,
        });
      }
      return next;
    });
    
    setLoadingClub(null);
  };

  const handleCreateClub = () => {
    toast({
      title: "Create Club",
      description: "Only authorized users can create clubs. Contact admin.",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex items-center gap-2">
              <CardTitle className="text-lg">Campus Clubs</CardTitle>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 h-8"
              onClick={handleCreateClub}
              data-testid="button-create-club"
            >
              <Lock className="h-3 w-3" />
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <ScrollArea className="w-full">
              <div className="flex gap-3 pb-3">
                {clubs.map((club) => {
                  const isJoined = joinedClubs.has(club.id);
                  const isLoading = loadingClub === club.id;
                  return (
                    <Card
                      key={club.id}
                      className="flex-shrink-0 w-56 hover-elevate overflow-hidden"
                    >
                      {club.banner && (
                        <div className="h-20 w-full overflow-hidden bg-muted">
                          <img
                            src={club.banner}
                            alt={club.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="p-3 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm truncate">
                              {club.name}
                            </CardTitle>
                            <Badge variant="secondary" className="mt-1 text-[10px]">
                              {club.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 space-y-2">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {club.description}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span data-testid={`text-club-members-${club.id}`}>
                              {club.members}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant={isJoined ? "secondary" : "default"}
                            disabled={isLoading}
                            onClick={() => handleJoin(club.id, club.name)}
                            data-testid={`button-join-club-${club.id}`}
                            className="h-7 text-xs"
                          >
                            {isLoading ? (
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : isJoined ? (
                              "Joined"
                            ) : (
                              "Join"
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
