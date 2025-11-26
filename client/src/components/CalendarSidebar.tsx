import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Calendar } from "lucide-react";
import { useState } from "react";

type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  type: "holiday" | "exam";
};

const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "1", date: "Dec 25", title: "Christmas Holiday", type: "holiday" },
  { id: "2", date: "Dec 26", title: "Boxing Day", type: "holiday" },
  { id: "3", date: "Jan 26", title: "Republic Day", type: "holiday" },
  { id: "4", date: "Dec 10", title: "Unit Test 1 - Mathematics", type: "exam" },
  { id: "5", date: "Dec 12", title: "Unit Test 1 - CS", type: "exam" },
  { id: "6", date: "Dec 15", title: "Midterm Exams Start", type: "exam" },
  { id: "7", date: "Jan 15", title: "Final Exams Start", type: "exam" },
  { id: "8", date: "Jan 10", title: "New Year Special", type: "holiday" },
];

export function CalendarSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const holidays = CALENDAR_EVENTS.filter((e) => e.type === "holiday");
  const exams = CALENDAR_EVENTS.filter((e) => e.type === "exam");

  return (
    <div className="flex gap-2 w-full">
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        data-testid="button-calendar-toggle"
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-accent transition-colors flex-shrink-0 mt-4"
        title="Toggle calendar"
      >
        {isExpanded ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>

      {/* Calendar Panel */}
      {isExpanded && (
        <div className="animate-in slide-in-from-left transition-all duration-300 flex-1 max-w-sm">
          <Card className="backdrop-blur-sm bg-card/90 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Academic Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto max-h-[500px]">
              {/* Holidays Section */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Holidays
                </h3>
                <div className="space-y-1.5">
                  {holidays.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-2 p-2 rounded-md bg-green-500/10 border border-green-500/20"
                      data-testid={`calendar-holiday-${event.id}`}
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exams Section */}
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Exams
                </h3>
                <div className="space-y-1.5">
                  {exams.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-2 p-2 rounded-md bg-red-500/10 border border-red-500/20"
                      data-testid={`calendar-exam-${event.id}`}
                    >
                      <div className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
