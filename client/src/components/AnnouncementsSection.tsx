import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AlertCircle, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { PostAnnouncementForm } from "./PostAnnouncementForm";

type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
  category: "holiday" | "notice" | "maintenance" | "event";
  author: string;
  important: boolean;
};

type AnnouncementsSectionProps = {
  announcements: Announcement[];
  userRole?: string;
};

const categoryConfig: Record<string, { bg: string; text: string; label: string }> = {
  holiday: { bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-400", label: "Holiday" },
  notice: { bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", label: "Notice" },
  maintenance: { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", label: "Maintenance" },
  event: { bg: "bg-green-500/10", text: "text-green-700 dark:text-green-400", label: "Event" },
};

const getConfig = (category: string) => {
  return categoryConfig[category] || { bg: "bg-slate-500/10", text: "text-slate-700 dark:text-slate-400", label: "Announcement" };
};

export function AnnouncementsSection({ announcements, userRole }: AnnouncementsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const importantAnnouncements = announcements.filter((a) => a.important);
  const regularAnnouncements = announcements.filter((a) => !a.important);
  const isPrincipal = userRole === "principal";

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between w-full">
            <CollapsibleTrigger className="flex items-center gap-2 flex-1">
              <AlertCircle className="h-5 w-5 text-announcement-accent" />
              <CardTitle className="text-lg">Announcements</CardTitle>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ml-auto ${isOpen ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            {isPrincipal && (
              <PostAnnouncementForm>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  title="Add announcement"
                  data-testid="button-add-announcement"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </PostAnnouncementForm>
            )}
          </div>
        </CardHeader>
        {isOpen && (
          <CardHeader className="pt-0 pb-2">
            <p className="text-xs text-muted-foreground text-left">
              {importantAnnouncements.length} important updates
            </p>
          </CardHeader>
        )}
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-2">
            <div className="max-h-[280px] overflow-y-auto space-y-2">
              {importantAnnouncements.map((announcement) => {
                const config = getConfig(announcement.category);
                return (
                  <div
                    key={announcement.id}
                    className={`rounded-md border-l-4 border-announcement-accent p-2.5 ${config.bg}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-sm font-semibold truncate">{announcement.title}</p>
                          <Badge className="text-[10px] h-4 px-1">{config.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{announcement.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {announcement.author} • {announcement.date}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {regularAnnouncements.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Other Updates</p>
                  {regularAnnouncements.map((announcement) => {
                    const config = getConfig(announcement.category);
                    return (
                      <div
                        key={announcement.id}
                        className={`rounded-md p-2 ${config.bg} mb-1.5`}
                      >
                        <p className="text-xs font-medium">{announcement.title}</p>
                        <p className="text-xs text-muted-foreground">{announcement.content}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
