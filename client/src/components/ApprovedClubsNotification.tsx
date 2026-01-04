import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Star, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

type ApprovedClub = {
  id: string;
  name: string;
  status: string;
  approvedBy?: string;
};

export function ApprovedClubsNotification() {
  const { toast } = useToast();
  const [approvedClubs, setApprovedClubs] = useState<ApprovedClub[]>([]);
  const [selectedClub, setSelectedClub] = useState<ApprovedClub | null>(null);
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);
  const [banner, setBanner] = useState("");
  const [rules, setRules] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchApprovedClubs();
  }, []);

  const fetchApprovedClubs = async () => {
    try {
      const res = await apiRequest("GET", "/api/my-clubs/approved");
      const data = await res.json();
      setApprovedClubs(data);
    } catch (error) {
      // Silent fail for approved clubs
    }
  };

  const handleSetupClub = async (club: ApprovedClub) => {
    setSelectedClub(club);
    setIsSetupDialogOpen(true);
  };

  const handlePublishClub = async () => {
    if (!selectedClub) return;

    setIsSubmitting(true);
    try {
      await apiRequest("PATCH", `/api/clubs/${selectedClub.id}/publish`, {
        banner: banner || undefined,
        rules: rules || undefined,
      });

      toast({
        title: "Club Published!",
        description: `${selectedClub.name} is now live and visible to all students.`,
      });

      setIsSetupDialogOpen(false);
      setBanner("");
      setRules("");
      setSelectedClub(null);
      setApprovedClubs(approvedClubs.filter((c) => c.id !== selectedClub.id));
    } catch (error) {
      toast({
        title: "Publication Failed",
        description: "Failed to publish club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (approvedClubs.length === 0) {
    return null;
  }

  return (
    <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-green-700 dark:text-green-400">
          <CheckCircle className="h-5 w-5" />
          Club Approved!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-green-600 dark:text-green-300">
          Your club has been approved by the principal. Complete the setup to publish it.
        </p>

        {approvedClubs.map((club) => (
          <div
            key={club.id}
            className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">{club.name}</p>
                <p className="text-xs text-muted-foreground">Ready to go live</p>
              </div>
            </div>

            <Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={() => handleSetupClub(club)}
                  data-testid={`button-setup-club-${club.id}`}
                >
                  Setup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md" data-testid={`dialog-setup-club-${club.id}`}>
                <DialogHeader>
                  <DialogTitle>Setup Club: {club.name}</DialogTitle>
                  <DialogDescription>
                    Add club details and publish to make it visible to all students.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Club Banner URL</label>
                    <Input
                      placeholder="https://example.com/banner.jpg"
                      value={banner}
                      onChange={(e) => setBanner(e.target.value)}
                      data-testid="input-club-banner"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Optional: Add a banner image for your club
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Club Rules & Guidelines</label>
                    <Textarea
                      placeholder="Share club rules, meeting times, membership requirements, etc..."
                      value={rules}
                      onChange={(e) => setRules(e.target.value)}
                      rows={4}
                      data-testid="textarea-club-rules"
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Club members can chat, share documents, and coordinate activities once published.
                    </p>
                  </div>

                  <Button
                    onClick={handlePublishClub}
                    disabled={isSubmitting}
                    className="w-full"
                    data-testid="button-publish-club"
                  >
                    {isSubmitting ? "Publishing..." : "Publish Club"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
