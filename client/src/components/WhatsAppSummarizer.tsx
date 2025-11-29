import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type GroupSummary = {
  id: string;
  groupName: string;
  members: Array<{
    name: string;
    summary: string;
  }>;
};

export function WhatsAppSummarizer() {
  const [isOpen, setIsOpen] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupData, setGroupData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: groups = [] } = useQuery({
    queryKey: ['/api/whatsapp-groups'],
    queryFn: async () => {
      const res = await fetch('/api/whatsapp-groups', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const handleAddGroup = async () => {
    if (!groupName.trim() || !groupData.trim()) {
      toast({
        title: "Fill All Fields",
        description: "Enter group name and chat data",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/whatsapp-groups", {
        groupName,
        groupData,
      });

      toast({
        title: "Group Added",
        description: "WhatsApp group data saved successfully",
      });

      setGroupName("");
      setGroupData("");
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed",
        description: "Could not add group",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-card/90">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between w-full">
            <CollapsibleTrigger className="flex items-center gap-2 flex-1">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">Group Vibes</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ml-auto ${isOpen ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8">
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="dialog-add-whatsapp">
                <DialogHeader>
                  <DialogTitle>Link WhatsApp Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Group Name</label>
                    <Input
                      placeholder="e.g., CSE Class Group"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      data-testid="input-group-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Chat Export (paste here)</label>
                    <Textarea
                      placeholder="Paste exported WhatsApp chat or paste summary of messages"
                      value={groupData}
                      onChange={(e) => setGroupData(e.target.value)}
                      data-testid="input-group-data"
                      className="min-h-24"
                    />
                  </div>
                  <Button
                    onClick={handleAddGroup}
                    disabled={isSubmitting}
                    className="w-full"
                    data-testid="button-add-group"
                  >
                    Add Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            {groups.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No groups yet. Click + to add a WhatsApp group.
              </p>
            ) : (
              groups.map((group: GroupSummary) => (
                <div key={group.id} className="space-y-2 pb-3 border-b border-border last:border-b-0">
                  <p className="text-sm font-semibold text-foreground">{group.groupName}</p>
                  <div className="space-y-1">
                    {group.members.map((member: any, idx: number) => (
                      <p
                        key={idx}
                        className="text-xs text-muted-foreground"
                        data-testid={`whatsapp-summary-${group.id}-${idx}`}
                      >
                        <span className="font-medium text-foreground">{member.name}:</span> {member.summary}
                      </p>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
