import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessageSquare, Users, Edit2, Save } from "lucide-react";

type Club = {
  id: string;
  name: string;
  description: string;
  banner?: string;
  category: string;
  creatorId: string;
  status: string;
  approvedBy?: string;
  createdAt: string;
};

export default function ClubDetail() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [club, setClub] = useState<Club | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClub, setEditedClub] = useState<Club | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [members, setMembers] = useState<any[]>([]);

  // Get club ID from URL
  const clubId = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    const loadClub = async () => {
      if (!clubId) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch actual club data from API
        const res = await fetch(`/api/clubs?search=${clubId}`, {
          credentials: "include",
        });
        
        if (res.ok) {
          const clubs = await res.json();
          const foundClub = clubs.find((c: Club) => c.id === clubId);
          
          if (foundClub) {
            setClub(foundClub);
            setEditedClub(foundClub);
            setMembers([
              { id: "1", name: "Club Creator", role: "head", joinedAt: foundClub.createdAt },
            ]);
            setMessages([
              `Welcome to ${foundClub.name}!`,
              `Category: ${foundClub.category}`,
            ]);
          } else {
            setClub(null);
          }
        } else {
          setClub(null);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load club details",
          variant: "destructive",
        });
        setClub(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadClub();
  }, [clubId, toast]);

  const handleSave = () => {
    if (editedClub) {
      setClub(editedClub);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Club details updated successfully",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      setMessages([...messages, newMessage]);
      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been posted to the club",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="p-4">
        <Button
          variant="outline"
          onClick={() => setLocation("/")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <p className="text-muted-foreground">Club not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setLocation("/")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Club Info */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl">{club.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{club.category}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  data-testid="button-edit-club"
                >
                  <Edit2 className="h-4 w-4 mr-1.5" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Description</label>
                  {isEditing ? (
                    <Textarea
                      value={editedClub?.description || ""}
                      onChange={(e) =>
                        setEditedClub({
                          ...editedClub!,
                          description: e.target.value,
                        })
                      }
                      className="mt-2 min-h-20"
                      data-testid="input-club-description"
                    />
                  ) : (
                    <p className="mt-2 text-sm text-foreground">{club.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <p className="mt-1 text-sm text-muted-foreground">{club.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    {isEditing ? (
                      <Input
                        value={editedClub?.category || ""}
                        onChange={(e) =>
                          setEditedClub({
                            ...editedClub!,
                            category: e.target.value,
                          })
                        }
                        data-testid="input-club-category"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{club.category}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <Button onClick={handleSave} className="w-full" data-testid="button-save-club">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Club Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4 h-64 overflow-y-auto space-y-2">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className="bg-background p-2 rounded border text-sm"
                      data-testid={`message-${idx}`}
                    >
                      {msg}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    data-testid="input-message"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !newMessage.trim()}
                    data-testid="button-send-message"
                  >
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Members Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Members ({members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="p-2 rounded-lg border hover:bg-muted/50"
                      data-testid={`member-card-${member.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
