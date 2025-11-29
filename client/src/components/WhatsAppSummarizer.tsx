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
  const [memberName, setMemberName] = useState("");
  const [memberSummary, setMemberSummary] = useState("");
  const [members, setMembers] = useState<Array<{ name: string; summary: string }>>([]);
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

  const handleAddMember = () => {
    if (!memberName.trim() || !memberSummary.trim()) {
      toast({
        title: "Fill Fields",
        description: "Enter member name and what they talk about",
        variant: "destructive",
      });
      return;
    }
    setMembers([...members, { name: memberName, summary: memberSummary }]);
    setMemberName("");
    setMemberSummary("");
  };

  const handleRemoveMember = (idx: number) => {
    setMembers(members.filter((_, i) => i !== idx));
  };

  const handleAddGroup = async () => {
    if (!groupName.trim() || members.length === 0) {
      toast({
        title: "Complete Group Info",
        description: "Enter group name and at least one member",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/whatsapp-groups", {
        groupName,
        members,
      });

      toast({
        title: "Group Added",
        description: "WhatsApp group saved successfully",
      });

      setGroupName("");
      setMembers([]);
      setMemberName("");
      setMemberSummary("");
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
                  <DialogTitle>Add WhatsApp Group</DialogTitle>
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Add Members</label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Member name"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        data-testid="input-member-name"
                      />
                      <Input
                        placeholder="What they talk about (e.g., memes, assignments)"
                        value={memberSummary}
                        onChange={(e) => setMemberSummary(e.target.value)}
                        data-testid="input-member-summary"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddMember}
                        className="w-full"
                        data-testid="button-add-member"
                      >
                        Add Member
                      </Button>
                    </div>
                  </div>

                  {members.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {members.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div className="text-xs">
                            <p className="font-medium">{m.name}</p>
                            <p className="text-muted-foreground">{m.summary}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveMember(idx)}
                            className="text-destructive hover:text-destructive/80"
                            data-testid={`button-remove-member-${idx}`}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={handleAddGroup}
                    disabled={isSubmitting || members.length === 0}
                    className="w-full"
                    data-testid="button-save-group"
                  >
                    Save Group
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
