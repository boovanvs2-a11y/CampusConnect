import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Navigation,
  Locate,
  ChevronUp,
  Building,
  Coffee,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import campusMapImage from "@assets/generated_images/dark_mode_campus_navigation_map.png";

type Location = {
  id: string;
  name: string;
  type: "building" | "food" | "library" | "sports";
  distance: string;
};

type InteractiveMapProps = {
  currentLocation: string;
  nearbyLocations: Location[];
};

const locationIcons = {
  building: Building,
  food: Coffee,
  library: BookOpen,
  sports: MapPin,
};

export function InteractiveMap({
  currentLocation,
  nearbyLocations,
}: InteractiveMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredLocations = searchQuery
    ? nearbyLocations.filter((loc) =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nearbyLocations;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Campus Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div className="h-[280px] w-full overflow-hidden">
            <img
              src={campusMapImage}
              alt="Campus Map"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-3 left-3 right-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Where to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/95 backdrop-blur shadow-lg border-0"
                data-testid="input-interactive-map-search"
              />
            </div>
          </div>

          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-24 right-3 rounded-full shadow-lg"
            onClick={() => console.log("Center on location")}
            data-testid="button-center-location"
          >
            <Locate className="h-4 w-4" />
          </Button>

          <div
            className={`absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur rounded-t-xl shadow-lg transition-all ${
              isExpanded ? "h-[200px]" : "h-[80px]"
            }`}
          >
            <button
              className="w-full flex items-center justify-center py-2"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid="button-expand-map-panel"
            >
              <ChevronUp
                className={`h-5 w-5 text-muted-foreground transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                <p className="text-sm font-medium" data-testid="text-map-current-location">
                  {currentLocation}
                </p>
              </div>

              {isExpanded && (
                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  {filteredLocations.map((location) => {
                    const Icon = locationIcons[location.type];
                    return (
                      <button
                        key={location.id}
                        className="w-full flex items-center gap-3 p-2 rounded-md hover-elevate active-elevate-2"
                        onClick={() => console.log("Navigate to:", location.id)}
                        data-testid={`button-location-${location.id}`}
                      >
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium truncate">
                            {location.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {location.distance}
                          </p>
                        </div>
                        <Navigation className="h-4 w-4 text-primary" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
