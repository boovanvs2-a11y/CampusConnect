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

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { type: "user", text: input }]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "That's a great question! I'm here to help with information about campus events, clubs, schedules, and more." },
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
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
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
