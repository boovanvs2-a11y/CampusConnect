import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Lock, Plus } from "lucide-react";
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
  const [joinedClubs, setJoinedClubs] = useState<Set<string>>(
    new Set(clubs.filter((c) => c.joined).map((c) => c.id))
  );

  const handleJoin = (clubId: string) => {
    setJoinedClubs((prev) => {
      const next = new Set(prev);
      if (next.has(clubId)) {
        next.delete(clubId);
      } else {
        next.add(clubId);
      }
      return next;
    });
    console.log("Toggle join club:", clubId);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-xl">Campus Clubs</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => console.log("Create club requested")}
            data-testid="button-create-club"
          >
            <Lock className="h-3 w-3" />
            <Plus className="h-3 w-3" />
            Create Club
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {clubs.map((club) => {
              const isJoined = joinedClubs.has(club.id);
              return (
                <Card
                  key={club.id}
                  className="flex-shrink-0 w-80 hover-elevate overflow-hidden"
                >
                  {club.banner && (
                    <div className="h-32 w-full overflow-hidden bg-muted">
                      <img
                        src={club.banner}
                        alt={club.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">
                          {club.name}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className="mt-1.5 text-xs"
                        >
                          {club.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {club.description}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span data-testid={`text-club-members-${club.id}`}>
                          {club.members} members
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant={isJoined ? "secondary" : "default"}
                        onClick={() => handleJoin(club.id)}
                        data-testid={`button-join-club-${club.id}`}
                      >
                        {isJoined ? "Joined" : "Join"}
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
    </Card>
  );
}
