import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  ThumbsUp,
  BarChart3,
  Send,
  Plus,
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
  const [question, setQuestion] = useState("");
  const [likedItems, setLikedItems] = useState<Set<string>>(
    new Set(discussions.filter((d) => d.liked).map((d) => d.id))
  );
  const [votedPolls, setVotedPolls] = useState<Record<string, number>>({});

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
    console.log("Toggle like:", id);
  };

  const handleVote = (discussionId: string, optionIndex: number) => {
    setVotedPolls((prev) => ({
      ...prev,
      [discussionId]: optionIndex,
    }));
    console.log("Vote on poll:", discussionId, "option:", optionIndex);
  };

  const handleSubmitQuestion = () => {
    if (question.trim()) {
      console.log("Submit question:", question);
      setQuestion("");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-discussion-accent" />
          <CardTitle className="text-xl">Discuss</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Ask doubts, answer questions, and vote on polls
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitQuestion()}
            data-testid="input-ask-question"
          />
          <Button
            size="icon"
            onClick={handleSubmitQuestion}
            data-testid="button-submit-question"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {discussions.map((item) => {
            const isLiked = likedItems.has(item.id);
            const hasVoted = item.id in votedPolls || item.voted;

            return (
              <div
                key={item.id}
                className="rounded-md border p-4 space-y-3 hover-elevate"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.type === "poll"
                        ? "bg-discussion-accent/20 text-discussion-accent"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {item.type === "poll" ? (
                      <BarChart3 className="h-4 w-4" />
                    ) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{item.author}</span>
                      <Badge
                        variant="secondary"
                        className="text-xs"
                      >
                        {item.type === "poll" ? "Poll" : "Question"}
                      </Badge>
                    </div>
                    <p
                      className="text-sm"
                      data-testid={`text-discussion-content-${item.id}`}
                    >
                      {item.content}
                    </p>
                  </div>
                </div>

                {item.type === "poll" && item.pollOptions && (
                  <div className="space-y-2 ml-11">
                    {item.pollOptions.map((option, index) => {
                      const totalVotes = item.pollOptions!.reduce(
                        (sum, o) => sum + o.votes,
                        0
                      );
                      const percentage =
                        totalVotes > 0
                          ? Math.round((option.votes / totalVotes) * 100)
                          : 0;
                      const isSelected = votedPolls[item.id] === index;

                      return (
                        <button
                          key={index}
                          className={`w-full text-left rounded-md border p-2.5 relative overflow-hidden transition-colors ${
                            hasVoted
                              ? "cursor-default"
                              : "hover-elevate active-elevate-2"
                          } ${isSelected ? "border-primary" : ""}`}
                          onClick={() => !hasVoted && handleVote(item.id, index)}
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
                            <span className="text-sm">{option.option}</span>
                            {hasVoted && (
                              <span className="text-sm text-muted-foreground">
                                {percentage}%
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-4 ml-11">
                  <button
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleLike(item.id)}
                    data-testid={`button-like-discussion-${item.id}`}
                  >
                    <ThumbsUp
                      className={`h-4 w-4 ${isLiked ? "fill-primary text-primary" : ""}`}
                    />
                    <span>
                      {(item.votes || 0) +
                        (isLiked && !item.liked ? 1 : !isLiked && item.liked ? -1 : 0)}
                    </span>
                  </button>
                  {item.type === "question" && (
                    <button
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => console.log("View answers:", item.id)}
                      data-testid={`button-view-answers-${item.id}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{item.answers || 0} answers</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => console.log("Create poll")}
          data-testid="button-create-poll"
        >
          <Plus className="h-4 w-4" />
          Create Poll
        </Button>
      </CardContent>
    </Card>
  );
}
