import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Plus, Loader, Share2 } from "lucide-react";
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
import { queryClient } from "@/lib/queryClient";

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
  const [chatText, setChatText] = useState("");
  const [analyzedMembers, setAnalyzedMembers] = useState<Array<{ name: string; summary: string }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const { data: groups = [] } = useQuery({
    queryKey: ['/api/whatsapp-groups'],
    queryFn: async () => {
      const res = await fetch('/api/whatsapp-groups', { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const handleAnalyzeChat = async () => {
    if (!groupName.trim() || !chatText.trim()) {
      toast({
        title: "Missing Info",
        description: "Enter group name and paste chat text",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Premium Feature",
      description: "Upgrade to premium to analyze WhatsApp chats with AI",
      variant: "destructive",
    });
  };

  const handleSaveGroup = async () => {
    if (analyzedMembers.length === 0) {
      toast({
        title: "No Members",
        description: "Please analyze the chat first",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await apiRequest("POST", "/api/whatsapp-groups", {
        groupName,
        members: analyzedMembers,
      });

      toast({
        title: "Group Added",
        description: "WhatsApp group saved successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['/api/whatsapp-groups'] });
      
      setGroupName("");
      setChatText("");
      setAnalyzedMembers([]);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed",
        description: "Could not save group",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMember = (idx: number) => {
    setAnalyzedMembers(analyzedMembers.filter((_, i) => i !== idx));
  };

  return (
    <Card className="backdrop-blur-sm bg-card/90">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Group Sumarise
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 h-8"
              data-testid="button-add-whatsapp"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-add-whatsapp" className="max-w-md">
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

                  {analyzedMembers.length === 0 ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Paste Chat Text</label>
                        <Textarea
                          placeholder="Paste your WhatsApp chat here..."
                          value={chatText}
                          onChange={(e) => setChatText(e.target.value)}
                          className="min-h-32"
                          data-testid="textarea-chat-text"
                        />
                      </div>
                      <Button
                        onClick={handleAnalyzeChat}
                        disabled={isAnalyzing || !groupName.trim() || !chatText.trim()}
                        className="w-full"
                        data-testid="button-analyze-chat"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Analyze Chat"
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Found Members ({analyzedMembers.length})</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {analyzedMembers.map((member, idx) => (
                            <div key={idx} className="flex items-start justify-between p-2 bg-muted rounded-md gap-2">
                              <div className="text-xs flex-1">
                                <p className="font-medium text-foreground">{member.name}</p>
                                <p className="text-muted-foreground text-xs">{member.summary}</p>
                              </div>
                              <button
                                onClick={() => handleRemoveMember(idx)}
                                className="text-destructive hover:text-destructive/80 flex-shrink-0"
                                data-testid={`button-remove-member-${idx}`}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setAnalyzedMembers([]);
                            setChatText("");
                          }}
                          variant="outline"
                          className="flex-1"
                          data-testid="button-analyze-again"
                        >
                          Analyze Again
                        </Button>
                        <Button
                          onClick={handleSaveGroup}
                          disabled={isSaving}
                          className="flex-1"
                          data-testid="button-save-group"
                        >
                          {isSaving ? (
                            <>
                              <Loader className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Group"
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {groups.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No groups yet. Click + to paste a WhatsApp chat.
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
    </Card>
  );
}
