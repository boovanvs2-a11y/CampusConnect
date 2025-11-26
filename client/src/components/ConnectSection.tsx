import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Users, Clock, Ticket } from "lucide-react";
import { useState } from "react";

type Fest = {
  id: string;
  name: string;
  date: string;
  time: string;
  spotsLeft: number;
  totalSpots: number;
  category: string;
  registered: boolean;
};

type ConnectSectionProps = {
  fests: Fest[];
};

export function ConnectSection({ fests }: ConnectSectionProps) {
  const [registeredFests, setRegisteredFests] = useState<Set<string>>(
    new Set(fests.filter((f) => f.registered).map((f) => f.id))
  );

  const handleRegister = (festId: string) => {
    setRegisteredFests((prev) => {
      const next = new Set(prev);
      if (next.has(festId)) {
        next.delete(festId);
      } else {
        next.add(festId);
      }
      return next;
    });
    console.log("Toggle registration:", festId);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-event-accent" />
          <CardTitle className="text-xl">Connect</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Register for upcoming fests and events
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fests.map((fest) => {
            const isRegistered = registeredFests.has(fest.id);
            const spotsPercentage = (fest.spotsLeft / fest.totalSpots) * 100;
            const isAlmostFull = spotsPercentage < 20;

            return (
              <div
                key={fest.id}
                className="rounded-md border p-4 hover-elevate"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3
                        className="font-semibold truncate"
                        data-testid={`text-fest-name-${fest.id}`}
                      >
                        {fest.name}
                      </h3>
                      <Badge variant="outline" className="flex-shrink-0 text-xs">
                        {fest.category}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {new Date(fest.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          • {fest.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        <span className={isAlmostFull ? "text-event-accent font-medium" : ""}>
                          {fest.spotsLeft} spots left
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isRegistered ? "secondary" : "default"}
                    className="flex-shrink-0 gap-1.5"
                    onClick={() => handleRegister(fest.id)}
                    data-testid={`button-register-fest-${fest.id}`}
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    {isRegistered ? "Registered" : "Register"}
                  </Button>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${100 - spotsPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
