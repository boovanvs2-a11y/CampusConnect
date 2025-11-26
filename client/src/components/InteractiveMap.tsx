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
  Locate,
  ChevronDown,
  Loader,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Location } from "@shared/schema";

type InteractiveMapProps = {
  currentLocation: string;
};

declare global {
  interface Window {
    google: any;
  }
}

export function InteractiveMap({
  currentLocation,
}: InteractiveMapProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["/api/locations"],
  });

  const { data: searchResults = [] } = useQuery({
    queryKey: ["/api/locations/search", searchQuery],
    enabled: searchQuery.length > 0,
  });

  const displayedLocations = searchQuery.length > 0 ? searchResults : locations;

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 16,
      center: { lat: 12.9716, lng: 77.5946 },
      styles: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: "#666666" }],
        },
      ],
    });

    mapInstanceRef.current = map;

    locations.forEach((location: Location) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map,
        title: location.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getMarkerColor(location.type),
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => {
        setSelectedLocation(location);
        map.setCenter({
          lat: location.latitude,
          lng: location.longitude,
        });
      });
    });
  }, [locations]);

  const getMarkerColor = (type: string) => {
    const colors: Record<string, string> = {
      building: "#3b82f6",
      food: "#f97316",
      library: "#22c55e",
      sports: "#a855f7",
    };
    return colors[type] || "#06b6d4";
  };

  const handleNavigate = (location: Location) => {
    setSelectedLocation(location);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({
        lat: location.latitude,
        lng: location.longitude,
      });
    }
    toast({
      title: "Location Selected",
      description: `Navigate to ${location.name}`,
    });
  };

  const handleCenterLocation = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: 12.9716, lng: 77.5946 });
      mapInstanceRef.current.setZoom(16);
    }
    toast({
      title: "Centered",
      description: "Map centered on campus",
    });
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

            <div className="relative h-64 rounded-md overflow-hidden border-2 border-primary/20 bg-background">
              <div
                ref={mapRef}
                className="w-full h-full"
                data-testid="map-container"
              />

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <Loader className="h-6 w-6 text-primary animate-spin" />
                </div>
              )}

              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-lg"
                onClick={handleCenterLocation}
                data-testid="button-center-location"
              >
                <Locate className="h-4 w-4" />
              </Button>

              {selectedLocation && (
                <div className="absolute top-2 left-2 bg-background/95 backdrop-blur rounded-lg px-3 py-2 border border-primary/20 max-w-xs">
                  <p className="text-sm font-semibold text-foreground" data-testid="text-map-current-location">
                    {selectedLocation.name}
                  </p>
                  {selectedLocation.address && (
                    <p className="text-xs text-muted-foreground">
                      {selectedLocation.address}
                    </p>
                  )}
                  {selectedLocation.phone && (
                    <p className="text-xs text-muted-foreground">
                      {selectedLocation.phone}
                    </p>
                  )}
                </div>
              )}
            </div>

            {displayedLocations.length > 0 && (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                <p className="text-xs font-medium text-muted-foreground px-2">
                  {searchQuery.length > 0 ? "Search Results" : "Nearby Locations"}
                </p>
                {displayedLocations.map((location: Location) => (
                  <button
                    key={location.id}
                    onClick={() => handleNavigate(location)}
                    className="w-full text-left px-2 py-1.5 rounded-md hover-elevate active-elevate-2"
                    data-testid={`button-location-${location.id}`}
                  >
                    <p className="text-sm font-medium">{location.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {location.type} • {location.address || "No address"}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
