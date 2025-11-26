import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, MapPin, Clock } from "lucide-react";

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
};

type CompactEventsListProps = {
  events: Event[];
};

export function CompactEventsList({ events }: CompactEventsListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-event-accent" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] -mx-6 px-6">
          <div className="space-y-2">
            {events.map((event) => (
              <button
                key={event.id}
                className="w-full text-left rounded-md border p-3 hover-elevate active-elevate-2"
                onClick={() => console.log("View event:", event.id)}
                data-testid={`button-compact-event-${event.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md bg-event-accent flex flex-col items-center justify-center text-event-accent-foreground">
                    <p className="text-sm font-bold leading-none">
                      {new Date(event.date).getDate()}
                    </p>
                    <p className="text-[10px] uppercase">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="text-sm font-medium truncate"
                        data-testid={`text-compact-event-title-${event.id}`}
                      >
                        {event.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span className="truncate">{event.time}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
