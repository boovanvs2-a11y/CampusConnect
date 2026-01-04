import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessageSquare, Clock, MapPin, FileText, Download } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerId: string;
  createdAt: string;
};

type Document = {
  id: string;
  name: string;
  type: "form" | "document" | "important";
  url: string;
};

export default function EventDetail() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [attendees, setAttendees] = useState(0);

  const eventId = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        setIsLoading(false);
        return;
      }

      try {
        // Mock event data
        const mockEvent: Event = {
          id: eventId,
          title: "Annual Tech Summit 2024",
          description:
            "Join us for a day of inspiring talks, networking, and hands-on workshops. Learn from industry experts about AI, Web3, and Cloud technologies.",
          date: "2024-12-15",
          time: "9:00 AM - 5:00 PM",
          location: "Auditorium, Block A",
          organizerId: "lecturer-demo",
          createdAt: new Date().toISOString(),
        };

        const mockMessages = [
          { id: "1", user: "John Doe", text: "Looking forward to this event!", time: "10:30 AM" },
          { id: "2", user: "You", text: "Same! Are you attending the AI workshop?", time: "10:35 AM" },
          { id: "3", user: "Jane Smith", text: "Registration link: https://forms.google.com/...", time: "11:00 AM" },
        ];

        const mockDocuments: Document[] = [
          { id: "1", name: "Agenda & Schedule", type: "important", url: "#" },
          { id: "2", name: "Registration Form", type: "form", url: "https://forms.google.com" },
          { id: "3", name: "Workshop Materials", type: "document", url: "#" },
          { id: "4", name: "Speaker Bios", type: "important", url: "#" },
        ];

        setEvent(mockEvent);
        setMessages(mockMessages);
        setDocuments(mockDocuments);
        setAttendees(142);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventId, toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const newMsg = {
        id: Date.now().toString(),
        user: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages([...messages, newMsg]);
      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been posted to the event",
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

  if (!event) {
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
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  const importantDocs = documents.filter((d) => d.type === "important");
  const otherDocs = documents.filter((d) => d.type !== "important");

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">{event.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>{attendees}</strong> people registered
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Chat Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Event Discussion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4 h-64 overflow-y-auto space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-background p-3 rounded border text-sm"
                      data-testid={`message-${msg.id}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-foreground">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-foreground">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Share event updates, forms, or documents..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    data-testid="input-event-message"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !newMessage.trim()}
                    data-testid="button-send-event-message"
                  >
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Important Documents */}
          <div className="space-y-4">
            {/* Important Documents */}
            {importantDocs.length > 0 && (
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Important Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {importantDocs.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg border hover:bg-primary/10 transition-colors group cursor-pointer"
                      data-testid={`doc-${doc.id}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium truncate text-foreground">
                          {doc.name}
                        </span>
                      </div>
                      <Download className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 flex-shrink-0" />
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* All Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Event Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors group cursor-pointer"
                    data-testid={`resource-${doc.id}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{doc.type}</p>
                      </div>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 flex-shrink-0" />
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
