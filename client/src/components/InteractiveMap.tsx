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
  MapPin,
  Navigation,
  Locate,
  ChevronDown,
  Building,
  Coffee,
  BookOpen,
  Dumbbell,
} from "lucide-react";
import { useState } from "react";

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
  sports: Dumbbell,
};

const locationColors = {
  building: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  food: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
  library: "bg-green-500/20 text-green-600 dark:text-green-400",
  sports: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
};

export function InteractiveMap({
  currentLocation,
  nearbyLocations,
}: InteractiveMapProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const filteredLocations = searchQuery
    ? nearbyLocations.filter((loc) =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nearbyLocations;

  const handleNavigate = (location: Location) => {
    setSelectedLocation(location.id);
    toast({
      title: "Navigation Started",
      description: `Directions to ${location.name} (${location.distance})`,
    });
  };

  const handleCenterLocation = () => {
    toast({
      title: "Location Updated",
      description: `You are at ${currentLocation}`,
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
                placeholder="Where to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
                data-testid="input-interactive-map-search"
              />
            </div>

            <div className="relative h-32 rounded-md overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-2 p-3">
                  {nearbyLocations.slice(0, 4).map((loc) => {
                    const Icon = locationIcons[loc.type];
                    const isSelected = selectedLocation === loc.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => handleNavigate(loc)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all ${
                          isSelected ? "bg-primary/20 scale-110" : "hover-elevate"
                        }`}
                        data-testid={`button-map-pin-${loc.id}`}
                      >
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${locationColors[loc.type]}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] text-center truncate w-full">{loc.name.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-2 right-2 h-7 w-7 rounded-full shadow-md"
                onClick={handleCenterLocation}
                data-testid="button-center-location"
              >
                <Locate className="h-3.5 w-3.5" />
              </Button>

              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-background/90 backdrop-blur rounded-full px-2 py-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-medium" data-testid="text-map-current-location">
                  {currentLocation.split(",")[0]}
                </span>
              </div>
            </div>

            <div className="space-y-1 max-h-[120px] overflow-y-auto">
              {filteredLocations.map((location) => {
                const Icon = locationIcons[location.type];
                const isSelected = selectedLocation === location.id;
                return (
                  <button
                    key={location.id}
                    className={`w-full flex items-center gap-2 p-2 rounded-md hover-elevate active-elevate-2 ${
                      isSelected ? "bg-primary/10" : ""
                    }`}
                    onClick={() => handleNavigate(location)}
                    data-testid={`button-location-${location.id}`}
                  >
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${locationColors[location.type]}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm truncate">{location.name}</p>
                      <p className="text-xs text-muted-foreground">{location.distance}</p>
                    </div>
                    <Navigation className="h-4 w-4 text-primary flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
