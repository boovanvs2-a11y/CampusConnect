import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

type RejectedClub = {
  id: string;
  name: string;
  status: string;
  approvedBy?: string;
};

export function RejectedClubsNotification() {
  const { toast } = useToast();
  const [rejectedClubs, setRejectedClubs] = useState<RejectedClub[]>([]);

  useEffect(() => {
    fetchRejectedClubs();
  }, []);

  const fetchRejectedClubs = async () => {
    try {
      const res = await apiRequest("GET", "/api/my-clubs/rejected");
      const data = await res.json();
      setRejectedClubs(data);
    } catch (error) {
      // Silent fail for rejected clubs
    }
  };

  const handleDismiss = (clubId: string) => {
    setRejectedClubs(rejectedClubs.filter((c) => c.id !== clubId));
    toast({
      title: "Dismissed",
      description: "Notification cleared",
    });
  };

  if (rejectedClubs.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-500/50 bg-red-50 dark:bg-red-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          Club Rejected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-red-600 dark:text-red-300">
          Your club has been rejected by the principal. Please review the guidelines and try creating it again.
        </p>

        {rejectedClubs.map((club) => (
          <div
            key={club.id}
            className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center gap-3 min-w-0">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">{club.name}</p>
                <p className="text-xs text-muted-foreground">Rejected - Review and resubmit</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDismiss(club.id)}
              data-testid={`button-dismiss-rejected-${club.id}`}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
