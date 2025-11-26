import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
};

type ClubsCarouselProps = {
  clubs: Club[];
};

export function ClubsCarousel({ clubs }: ClubsCarouselProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clubName, setClubName] = useState("");
  const [clubCategory, setClubCategory] = useState("");
  const [clubDesc, setClubDesc] = useState("");

  const handleCreateClub = () => {
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 h-8"
                  data-testid="button-create-club"
                >
                  <Lock className="h-3 w-3" />
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
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <ScrollArea className="w-full">
              <div className="flex gap-3 pb-3">
                {clubs.map((club) => (
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
