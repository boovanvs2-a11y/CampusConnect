import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

type GroupSummary = {
  id: string;
  groupName: string;
  members: Array<{
    name: string;
    summary: string;
  }>;
};

const mockGroups: GroupSummary[] = [
  {
    id: "1",
    groupName: "CSE Class Group",
    members: [
      { name: "John", summary: "yapping 💬" },
      { name: "Sarah", summary: "assignment questions 📚" },
      { name: "Mike", summary: "memes 😂" },
    ],
  },
  {
    id: "2",
    groupName: "Hostel Squad",
    members: [
      { name: "Alex", summary: "food pics 🍕" },
      { name: "Priya", summary: "random thoughts 🤔" },
      { name: "David", summary: "late night rambling 😴" },
    ],
  },
  {
    id: "3",
    groupName: "Project Collab",
    members: [
      { name: "Emma", summary: "deadlines stressing 😰" },
      { name: "Rohan", summary: "code help 🔧" },
      { name: "Lisa", summary: "meeting updates 📋" },
    ],
  },
];

export function WhatsAppSummarizer() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="backdrop-blur-sm bg-card/90">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Group Vibes
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            {mockGroups.map((group) => (
              <div key={group.id} className="space-y-2 pb-3 border-b border-border last:border-b-0">
                <p className="text-sm font-semibold text-foreground">{group.groupName}</p>
                <div className="space-y-1">
                  {group.members.map((member, idx) => (
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
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
