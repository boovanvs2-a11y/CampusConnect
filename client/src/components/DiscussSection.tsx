import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  ThumbsUp,
  BarChart3,
  Send,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

type Discussion = {
  id: string;
  type: "question" | "poll";
  author: string;
  content: string;
  answers?: number;
  votes?: number;
  pollOptions?: Array<{ option: string; votes: number }>;
  voted?: boolean;
  liked?: boolean;
};

type DiscussSectionProps = {
  discussions: Discussion[];
};

export function DiscussSection({ discussions }: DiscussSectionProps) {
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [likedItems, setLikedItems] = useState<Set<string>>(
    new Set(discussions.filter((d) => d.liked).map((d) => d.id))
  );
  const [votedPolls, setVotedPolls] = useState<Record<string, number>>({});
  const [isOpen, setIsOpen] = useState(true);

  const handleLike = (id: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleVote = (discussionId: string, optionIndex: number, optionName: string) => {
    setVotedPolls((prev) => ({
      ...prev,
      [discussionId]: optionIndex,
    }));
    toast({
      title: "Vote Recorded",
      description: `You voted for "${optionName}"`,
    });
  };

  const handleSubmitQuestion = () => {
    if (question.trim()) {
      toast({
        title: "Question Posted",
        description: "Your question is now visible to everyone",
      });
      setQuestion("");
    }
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-discussion-accent" />
              Discuss
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <p className="text-xs text-muted-foreground text-left">
            Ask doubts, answer questions, vote on polls
          </p>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask a question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitQuestion()}
                className="h-9"
                data-testid="input-ask-question"
              />
              <Button
                size="icon"
                onClick={handleSubmitQuestion}
                disabled={!question.trim()}
                data-testid="button-submit-question"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {discussions.map((item) => {
                const isLiked = likedItems.has(item.id);
                const hasVoted = item.id in votedPolls || item.voted;

                return (
                  <div key={item.id} className="rounded-md border p-2.5 space-y-2">
                    <div className="flex items-start gap-2">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.type === "poll"
                            ? "bg-discussion-accent/20 text-discussion-accent"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {item.type === "poll" ? (
                          <BarChart3 className="h-3 w-3" />
                        ) : (
                          <MessageCircle className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-medium">{item.author}</span>
                          <Badge variant="secondary" className="text-[10px] h-4 px-1">
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-sm" data-testid={`text-discussion-content-${item.id}`}>
                          {item.content}
                        </p>
                      </div>
                    </div>

                    {item.type === "poll" && item.pollOptions && (
                      <div className="space-y-1 ml-8">
                        {item.pollOptions.map((option, index) => {
                          const totalVotes = item.pollOptions!.reduce((sum, o) => sum + o.votes, 0);
                          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                          const isSelected = votedPolls[item.id] === index;

                          return (
                            <button
                              key={index}
                              className={`w-full text-left rounded-md border p-2 relative overflow-hidden text-sm ${
                                hasVoted ? "cursor-default" : "hover-elevate active-elevate-2"
                              } ${isSelected ? "border-primary" : ""}`}
                              onClick={() => !hasVoted && handleVote(item.id, index, option.option)}
                              disabled={hasVoted}
                              data-testid={`button-poll-option-${item.id}-${index}`}
                            >
                              {hasVoted && (
                                <div
                                  className="absolute inset-0 bg-primary/10"
                                  style={{ width: `${percentage}%` }}
                                />
                              )}
                              <div className="relative flex items-center justify-between">
                                <span className="text-xs">{option.option}</span>
                                {hasVoted && (
                                  <span className="text-xs text-muted-foreground">{percentage}%</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center gap-4 ml-8">
                      <button
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => handleLike(item.id)}
                        data-testid={`button-like-discussion-${item.id}`}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? "fill-primary text-primary" : ""}`} />
                        <span>
                          {(item.votes || 0) + (isLiked && !item.liked ? 1 : !isLiked && item.liked ? -1 : 0)}
                        </span>
                      </button>
                      {item.type === "question" && (
                        <button
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => toast({ title: "Answers", description: "Opening answers..." })}
                          data-testid={`button-view-answers-${item.id}`}
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{item.answers || 0} answers</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
