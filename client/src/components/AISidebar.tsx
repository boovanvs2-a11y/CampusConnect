import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Sparkles, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AISidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; text: string }>>([
    { type: "ai", text: "Hi! I'm your AI campus assistant. Ask me anything about campus resources, events, or academics!" },
  ]);
  const [input, setInput] = useState("");

  const generateAIResponse = (userQuery: string): string => {
    const query = userQuery.toLowerCase();

    // Club-related queries
    if (query.includes("club") || query.includes("join")) {
      return "Great! You can browse clubs in the Clubs section. To join a student club, click 'Join' and wait for principal approval. After approval, you can publish it to make it visible to other students.";
    }

    // Event-related queries
    if (query.includes("event") || query.includes("happening") || query.includes("schedule")) {
      return "You can find all upcoming events in the Events section on the right. Click on any event to see details, registration options, and join discussions with other attendees!";
    }

    // Study-related queries
    if (query.includes("note") || query.includes("study") || query.includes("course") || query.includes("subject")) {
      return "Check the Study Portal on the left! You can access notes by subject, contact faculty members for help, and see your next class schedule. Click on any note to open detailed resources.";
    }

    // Faculty queries
    if (query.includes("faculty") || query.includes("professor") || query.includes("teacher") || query.includes("contact")) {
      return "The Study Portal lists all faculty with their contact details and availability status. Click on a faculty member to view their full information and get in touch!";
    }

    // Map/Location queries
    if (query.includes("map") || query.includes("location") || query.includes("where") || query.includes("building")) {
      return "Use the Interactive Campus Map to navigate! You can search for specific locations and see ongoing classes and events. Long press locations for more details.";
    }

    // Announcement queries
    if (query.includes("announcement") || query.includes("news") || query.includes("notice")) {
      return "Check the Announcements section for the latest updates. Important announcements are highlighted at the top. Expand to see all notifications!";
    }

    // Calendar/Holiday queries
    if (query.includes("holiday") || query.includes("exam") || query.includes("calendar") || query.includes("when")) {
      return "Click the Calendar button on the left to see holidays (green) and exam dates (red). You can navigate through months to plan your schedule!";
    }

    // Q&A/Discussion queries
    if (query.includes("question") || query.includes("discuss") || query.includes("ask") || query.includes("answer")) {
      return "Head to the Discuss section in the center to ask questions and help others. It's a great way to collaborate with your classmates!";
    }

    // Print service queries
    if (query.includes("print") || query.includes("document")) {
      return "The Print Service allows you to submit documents for printing. They'll be forwarded to ankushrampa@gmail.com for processing.";
    }

    // Default helpful response
    return "I can help with questions about clubs, events, study materials, faculty contacts, campus locations, announcements, and more! What would you like to know?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { type: "user", text: input }]);
    const userQuery = input;
    setInput("");

    // Simulate AI response with intelligent answer
    setTimeout(() => {
      const aiResponse = generateAIResponse(userQuery);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: aiResponse },
      ]);
    }, 500);
  };

  return (
    <div className="relative">
      {/* Expand/Collapse Button - Right side */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        data-testid="button-ai-toggle"
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-accent transition-colors flex-shrink-0"
        title="Toggle AI assistant"
      >
        {isExpanded ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>

      {/* AI Panel - Overlays from right */}
      {isExpanded && (
        <div className="absolute right-12 top-0 animate-in slide-in-from-right transition-all duration-300 w-80 z-50">
          <Card className="backdrop-blur-sm bg-card/95 shadow-lg flex flex-col h-[600px]">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Assistant
              </CardTitle>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto space-y-3 py-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`ai-message-${idx}`}
                >
                  <div
                    className={`max-w-xs p-2.5 rounded-lg text-xs ${
                      msg.type === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Input Area */}
            <div className="border-t border-border p-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="text-xs h-8"
                  data-testid="input-ai-query"
                />
                <Button
                  size="sm"
                  onClick={handleSend}
                  className="h-8 w-8 p-0"
                  data-testid="button-ai-send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
