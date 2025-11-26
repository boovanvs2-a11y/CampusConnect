import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import campusMapImage from "@assets/generated_images/dark_mode_campus_navigation_map.png";

type NavigationMapProps = {
  currentLocation: string;
  nearbyEvents: Array<{ name: string; distance: string }>;
};

export function NavigationMap({
  currentLocation,
  nearbyEvents,
}: NavigationMapProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Campus Navigation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Where to? (Library, Canteen, Block A...)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              console.log("Search:", e.target.value);
            }}
            className="pl-9"
            data-testid="input-map-search"
          />
        </div>

        <div className="relative rounded-md overflow-hidden bg-muted aspect-video">
          <img
            src={campusMapImage}
            alt="Campus Map"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="rounded-md border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Current Location</p>
              <p className="text-sm font-medium" data-testid="text-current-location">
                {currentLocation}
              </p>
            </div>
          </div>

          {nearbyEvents.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Nearby Live Events
              </p>
              <div className="flex flex-wrap gap-2">
                {nearbyEvents.map((event, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs"
                    data-testid={`badge-nearby-event-${index}`}
                  >
                    {event.name} • {event.distance}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
