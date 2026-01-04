import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, ChevronDown, Ticket, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  spotsLeft?: number;
  registered?: boolean;
};

type CompactEventsListProps = {
  events: Event[];
};

export function CompactEventsList({ events }: CompactEventsListProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(
    new Set(events.filter((e) => e.registered).map((e) => e.id))
  );
  const [loadingEvent, setLoadingEvent] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (eventId: string) => {
    setLocation(`/event?id=${eventId}`);
  };

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setConfirmDialogOpen(true);
  };

  const handleConfirmRegister = async () => {
    if (!selectedEvent) return;
    
    setLoadingEvent(selectedEvent.id);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setRegisteredEvents((prev) => {
      const next = new Set(prev);
      if (next.has(selectedEvent.id)) {
        next.delete(selectedEvent.id);
        toast({
          title: "Registration Cancelled",
          description: `You've cancelled your spot for ${selectedEvent.title}`,
        });
      } else {
        next.add(selectedEvent.id);
        toast({
          title: "Registered Successfully",
          description: `You're registered for ${selectedEvent.title}!`,
        });
      }
      return next;
    });
    
    setLoadingEvent(null);
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent data-testid="dialog-event-register-confirm">
          <DialogHeader>
            <DialogTitle>Confirm Registration</DialogTitle>
            <DialogDescription>
              {selectedEvent && registeredEvents.has(selectedEvent.id)
                ? `Are you sure you want to cancel your registration for ${selectedEvent.title}?`
                : `Are you sure you want to register for ${selectedEvent?.title}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} data-testid="button-cancel-register">
              Cancel
            </Button>
            <Button onClick={handleConfirmRegister} data-testid="button-confirm-register">
              {selectedEvent && registeredEvents.has(selectedEvent.id) ? "Cancel Registration" : "Register"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardHeader className="pb-3">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-event-accent" />
                Upcoming Events
              </CardTitle>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {events.map((event) => {
                  const isRegistered = registeredEvents.has(event.id);
                  const isLoading = loadingEvent === event.id;

                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-2 rounded-md border hover-elevate cursor-pointer"
                      onClick={() => handleEventClick(event.id)}
                      data-testid={`card-event-${event.id}`}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-event-accent flex flex-col items-center justify-center text-event-accent-foreground">
                        <p className="text-sm font-bold leading-none">
                          {new Date(event.date).getDate()}
                        </p>
                        <p className="text-[9px] uppercase">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          data-testid={`text-compact-event-title-${event.id}`}
                        >
                          {event.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="truncate">{event.time}</span>
                          {event.spotsLeft !== undefined && (
                            <>
                              <span>•</span>
                              <span className={event.spotsLeft < 20 ? "text-event-accent" : ""}>
                                {event.spotsLeft} spots
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={isRegistered ? "secondary" : "default"}
                        disabled={isLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegisterClick(event);
                        }}
                        data-testid={`button-register-event-${event.id}`}
                        className="flex-shrink-0"
                      >
                        {isLoading ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : isRegistered ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Going
                          </>
                        ) : (
                          <>
                            <Ticket className="h-3.5 w-3.5 mr-1" />
                            Register
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </>
  );
}
