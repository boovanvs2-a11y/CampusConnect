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
  building: { bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-400", ring: "ring-blue-500" },
  food: { bg: "bg-orange-500/15", text: "text-orange-600 dark:text-orange-400", ring: "ring-orange-500" },
  library: { bg: "bg-green-500/15", text: "text-green-600 dark:text-green-400", ring: "ring-green-500" },
  sports: { bg: "bg-purple-500/15", text: "text-purple-600 dark:text-purple-400", ring: "ring-purple-500" },
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

            <div className="relative h-40 rounded-md overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 200">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="400" height="200" fill="url(#grid)" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-wrap gap-3 p-4 justify-center items-center">
                  {nearbyLocations.map((loc) => {
                    const Icon = locationIcons[loc.type];
                    const config = locationColors[loc.type];
                    const isSelected = selectedLocation === loc.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => handleNavigate(loc)}
                        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-all transform ${
                          isSelected 
                            ? `${config.bg} ${config.text} scale-110 ring-2 ${config.ring}` 
                            : `hover:${config.bg} hover:${config.text}`
                        }`}
                        data-testid={`button-map-pin-${loc.id}`}
                      >
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center ${config.bg} ${config.text}`}>
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <span className="text-[10px] font-medium text-center max-w-[50px] leading-tight">{loc.name}</span>
                        <span className="text-[8px] text-muted-foreground">{loc.distance}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-lg"
                onClick={handleCenterLocation}
                data-testid="button-center-location"
              >
                <Locate className="h-4 w-4" />
              </Button>

              <div className="absolute top-2 left-2 flex items-center gap-2 bg-background/95 backdrop-blur rounded-lg px-2.5 py-1.5 border border-primary/20">
                <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-semibold text-foreground" data-testid="text-map-current-location">
                  {currentLocation.split(",")[0]}
                </span>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
