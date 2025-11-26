import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Calendar } from "lucide-react";
import { useState } from "react";

type CalendarEvent = {
  date: number;
  type: "holiday" | "exam";
};

const CALENDAR_EVENTS: Record<number, CalendarEvent> = {
  10: { date: 10, type: "exam" },
  12: { date: 12, type: "exam" },
  15: { date: 15, type: "exam" },
  18: { date: 18, type: "exam" },
  20: { date: 20, type: "holiday" },
  21: { date: 21, type: "holiday" },
  25: { date: 25, type: "holiday" },
  26: { date: 26, type: "holiday" },
};

export function CalendarSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11)); // December 2025

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getEventType = (day: number) => CALENDAR_EVENTS[day];

  return (
    <div className="relative">
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        data-testid="button-calendar-toggle"
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-accent transition-colors flex-shrink-0"
        title="Toggle calendar"
      >
        {isExpanded ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>

      {/* Calendar Panel - Overlays on top */}
      {isExpanded && (
        <div className="absolute left-12 top-0 animate-in slide-in-from-left transition-all duration-300 w-80 z-50">
          <Card className="backdrop-blur-sm bg-card/95 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {monthName}
                </CardTitle>
                <div className="flex gap-1">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-accent rounded"
                    data-testid="button-prev-month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-accent rounded"
                    data-testid="button-next-month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const event = day ? getEventType(day) : null;
                  const isHoliday = event?.type === "holiday";
                  const isExam = event?.type === "exam";

                  return (
                    <div
                      key={index}
                      className={`aspect-square flex items-center justify-center text-xs rounded-md font-medium ${
                        !day
                          ? "bg-transparent"
                          : isHoliday
                            ? "bg-green-500/20 border border-green-500/30 text-green-700 dark:text-green-400"
                            : isExam
                              ? "bg-red-500/20 border border-red-500/30 text-red-700 dark:text-red-400"
                              : "bg-muted text-foreground hover:bg-accent"
                      }`}
                      data-testid={day ? `calendar-day-${day}` : undefined}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-3 pt-3 border-t border-border space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-2 w-2 rounded bg-green-500" />
                  <span className="text-muted-foreground">Holiday</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-2 w-2 rounded bg-red-500" />
                  <span className="text-muted-foreground">Exam</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
