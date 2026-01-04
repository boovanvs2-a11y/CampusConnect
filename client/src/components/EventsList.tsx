import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
};

type EventsListProps = {
  events: Event[];
};

export function EventsList({ events }: EventsListProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <button
              key={event.id}
              className="w-full text-left rounded-md border bg-card p-4 hover-elevate active-elevate-2"
              onClick={() => console.log("View event:", event.id)}
              data-testid={`button-event-${event.id}`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-md bg-event-accent flex flex-col items-center justify-center text-event-accent-foreground">
                  <p className="text-2xl font-bold leading-none">
                    {new Date(event.date).getDate()}
                  </p>
                  <p className="text-xs uppercase mt-1">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold truncate" data-testid={`text-event-title-${event.id}`}>
                      {event.title}
                    </h3>
                    <Badge variant="outline" className="flex-shrink-0 text-xs">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
