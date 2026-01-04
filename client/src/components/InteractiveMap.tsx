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
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Location } from "@shared/schema";

type OngoingClass = {
  id: string;
  course: string;
  instructor: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
};

type OngoingEvent = {
  id: string;
  title: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
};

type InteractiveMapProps = {
  currentLocation: string;
  ongoingClasses?: OngoingClass[];
  ongoingEvents?: OngoingEvent[];
};

declare global {
  interface Window {
    L?: any;
  }
}

export function InteractiveMap({ currentLocation, ongoingClasses = [], ongoingEvents = [] }: InteractiveMapProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  // RNSIT Main Gate as user's starting point
  const [userLocation] = useState<[number, number]>([12.9030, 77.5185]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const classMarkersRef = useRef<Map<string, any>>(new Map());
  const eventMarkersRef = useRef<Map<string, any>>(new Map());
  const routeLayerRef = useRef<any>(null);
  const leafletLoadedRef = useRef(false);

  const { data: allLocations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const { data: searchResults = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations/search", searchQuery],
    enabled: searchQuery.length > 0,
  });

  const displayedLocations = searchQuery.length > 0 ? searchResults : allLocations;

  // Haversine formula for accurate distance calculation
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Load leaflet and initialize map
  useEffect(() => {
    if (leafletLoadedRef.current || !mapRef.current) return;

    const loadLeaflet = async () => {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(link);
      }

      if (!window.L) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      const L = window.L;
      if (!L || mapInstanceRef.current) return;

      const map = L.map(mapRef.current).setView([12.9017, 77.5190], 17);
      mapInstanceRef.current = map;
      leafletLoadedRef.current = true;

      // Use Google Maps style tiles for clean street view like GMaps
      L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        attribution: '&copy; Google',
        maxZoom: 19,
      }).addTo(map);

      const userIcon = L.divIcon({
        html: '<div class="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-white border-2 border-white shadow-lg animate-pulse" style="background: hsl(188, 97%, 35%); box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd" /></svg></div>',
        iconSize: [32, 32],
        className: "",
      });
      L.marker(userLocation, { icon: userIcon, title: "You are here" }).addTo(map);
    };

    loadLeaflet();
  }, [userLocation]);

  // Add location markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || displayedLocations.length === 0) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    markersRef.current.forEach((marker: any) => marker.remove());
    markersRef.current.clear();

    displayedLocations.forEach((location) => {
      const getIcon = () => {
        const iconMap: Record<string, string> = {
          building: "🏢",
          food: "🍽️",
          library: "📚",
          sports: "⚽",
        };
        return iconMap[location.type] || "📍";
      };

      const customIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-9 h-9 rounded-full bg-cyan-500 text-white border-2 border-white shadow-lg text-lg cursor-pointer hover:scale-125 transition-transform" style="background: hsl(188, 97%, 35%); box-shadow: 0 4px 12px rgba(0,0,0,0.4);">${getIcon()}</div>`,
        iconSize: [36, 36],
        className: "",
      });

      const marker = L.marker([location.latitude, location.longitude], {
        icon: customIcon,
        title: location.name,
      })
        .addTo(map)
        .on("click", () => navigateToLocation(location));

      markersRef.current.set(location.id, marker);
    });
  }, [displayedLocations]);

  // Add ongoing class markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    classMarkersRef.current.forEach((marker: any) => marker.remove());
    classMarkersRef.current.clear();

    ongoingClasses.forEach((cls) => {
      const classIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 text-white border-2 border-white shadow-lg text-lg" style="background: #3b82f6; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">📚</div>`,
        iconSize: [36, 36],
        className: "",
      });

      const marker = L.marker([cls.latitude, cls.longitude], {
        icon: classIcon,
        title: `Class: ${cls.course}`,
      })
        .addTo(map)
        .bindPopup(`<div class="text-sm"><strong>${cls.course}</strong><br/>${cls.instructor}<br/>${cls.time}</div>`);

      classMarkersRef.current.set(cls.id, marker);
    });
  }, [ongoingClasses]);

  // Add ongoing event markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    eventMarkersRef.current.forEach((marker: any) => marker.remove());
    eventMarkersRef.current.clear();

    ongoingEvents.forEach((event) => {
      const eventIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-9 h-9 rounded-full bg-rose-500 text-white border-2 border-white shadow-lg text-lg" style="background: #f43f5e; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🎉</div>`,
        iconSize: [36, 36],
        className: "",
      });

      const marker = L.marker([event.latitude, event.longitude], {
        icon: eventIcon,
        title: `Event: ${event.title}`,
      })
        .addTo(map)
        .bindPopup(`<div class="text-sm"><strong>${event.title}</strong><br/>${event.time}</div>`);

      eventMarkersRef.current.set(event.id, marker);
    });
  }, [ongoingEvents]);

  const navigateToLocation = (location: Location) => {
    setSelectedLocation(location);
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    // Draw direct path (ideal for small campus)
    const routePoints: [number, number][] = [userLocation, [location.latitude, location.longitude]];
    
    routeLayerRef.current = L.polyline(routePoints, {
      color: "hsl(188, 97%, 35%)",
      weight: 4,
      opacity: 0.85,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    const group = L.featureGroup(routePoints.map((p: [number, number]) => L.marker(p)));
    map.fitBounds(group.getBounds().pad(0.15), { maxZoom: 17 });

    // Calculate distance
    const distance = getDistance(userLocation[0], userLocation[1], location.latitude, location.longitude);
    const meters = Math.round(distance * 1000);
    const walkingTime = Math.ceil((meters / 1000) / 1.4);
    
    toast({
      title: "Route to " + location.name,
      description: `${meters}m • ~${walkingTime} min walk`,
    });
  };

  const clearRoute = () => {
    setSelectedLocation(null);
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([12.9017, 77.5190], 17);
    }
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

            <div
              ref={mapRef}
              className="relative h-64 rounded-md overflow-hidden border-2 border-primary/20 bg-gray-950 z-0"
              data-testid="map-container"
              style={{ minHeight: "16rem", backgroundColor: "#030712" }}
            />

            {selectedLocation && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" data-testid="text-map-current-location">
                      {selectedLocation.name}
                    </p>
                    {selectedLocation.address && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedLocation.address}
                      </p>
                    )}
                    {selectedLocation.phone && (
                      <p className="text-xs text-muted-foreground">
                        {selectedLocation.phone}
                      </p>
                    )}
                    <p className="text-xs text-primary font-medium mt-1.5">
                      {Math.round(getDistance(userLocation[0], userLocation[1], selectedLocation.latitude, selectedLocation.longitude) * 1000)}m away
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={clearRoute}
                    data-testid="button-clear-route"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-1 max-h-48 overflow-y-auto">
              {displayedLocations.length > 0 ? (
                <>
                  <p className="text-xs font-medium text-muted-foreground px-2">
                    {searchQuery.length > 0 ? `${displayedLocations.length} Results` : "Campus Locations"}
                  </p>
                  {displayedLocations.map((location: Location) => {
                    const distanceMeters = Math.round(
                      getDistance(
                        userLocation[0],
                        userLocation[1],
                        location.latitude,
                        location.longitude
                      ) * 1000
                    );
                    return (
                      <button
                        key={location.id}
                        onClick={() => navigateToLocation(location)}
                        className={`w-full text-left p-2 rounded-lg hover-elevate active-elevate-2 transition-all ${
                          selectedLocation?.id === location.id
                            ? "bg-primary/10 border border-primary/30"
                            : "border border-border"
                        }`}
                        data-testid={`button-location-${location.id}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{location.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {location.address || "Campus Location"}
                            </p>
                          </div>
                          <span className="text-xs text-primary font-semibold flex-shrink-0">
                            {distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters / 1000).toFixed(1)}km`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <MapPin className="h-6 w-6 text-muted-foreground/50 mb-1" />
                  <p className="text-xs text-muted-foreground">
                    {searchQuery.length > 0 ? "No locations found" : "Loading campus locations..."}
                  </p>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              <p>RNSIT Campus • Kengeri, Bangalore</p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
