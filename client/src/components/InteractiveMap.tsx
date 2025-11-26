import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Navigation,
  ChevronDown,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Location } from "@shared/schema";

type InteractiveMapProps = {
  currentLocation: string;
};

export function InteractiveMap({
  currentLocation,
}: InteractiveMapProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const { data: allLocations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const { data: searchResults = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations/search", searchQuery],
    enabled: searchQuery.length > 0,
  });

  const displayedLocations = searchQuery.length > 0 ? searchResults : allLocations;

  const openGoogleMaps = (location: Location) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}&destination_place_id=${location.name}`;
    window.open(url, "_blank");
    toast({
      title: "Opening Google Maps",
      description: `Navigate to ${location.name}`,
    });
  };

  const getLocationIcon = (type: string) => {
    const icons: Record<string, string> = {
      building: "🏢",
      food: "🍽️",
      library: "📚",
      sports: "⚽",
    };
    return icons[type] || "📍";
  };

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <CardTitle className="text-lg flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Campus Map
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
                data-testid="input-interactive-map-search"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {displayedLocations.length > 0 ? (
                <>
                  <p className="text-xs font-medium text-muted-foreground px-2">
                    {searchQuery.length > 0 ? `${displayedLocations.length} Results` : "Nearby Locations"}
                  </p>
                  {displayedLocations.map((location: Location) => (
                    <button
                      key={location.id}
                      onClick={() => openGoogleMaps(location)}
                      className="w-full text-left p-3 rounded-lg border border-primary/20 hover-elevate active-elevate-2 transition-all"
                      data-testid={`button-location-${location.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg flex-shrink-0">
                          {getLocationIcon(location.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{location.name}</p>
                          {location.address && (
                            <p className="text-xs text-muted-foreground truncate">
                              {location.address}
                            </p>
                          )}
                          {location.phone && (
                            <p className="text-xs text-muted-foreground">{location.phone}</p>
                          )}
                          <div className="flex items-center gap-1 mt-1.5">
                            <MapPin className="h-3 w-3 text-primary" />
                            <span className="text-xs text-primary font-medium">
                              Open in Google Maps
                            </span>
                            <ExternalLink className="h-3 w-3 text-primary ml-auto" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery.length > 0 ? "No locations found" : "Loading locations..."}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
              <Navigation className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" data-testid="text-map-current-location">
                  {currentLocation}
                </p>
                <p className="text-xs text-muted-foreground">Your current location</p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
