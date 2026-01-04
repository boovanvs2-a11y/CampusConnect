import { InteractiveMap } from "../InteractiveMap";

export default function InteractiveMapExample() {
  const mockLocations = [
    { id: "1", name: "Central Library", type: "library" as const, distance: "150m" },
    { id: "2", name: "Campus Canteen", type: "food" as const, distance: "200m" },
    { id: "3", name: "Block A - CS Dept", type: "building" as const, distance: "300m" },
    { id: "4", name: "Sports Complex", type: "sports" as const, distance: "450m" },
  ];

  return (
    <InteractiveMap
      currentLocation="Innovation Center, Block C"
      nearbyLocations={mockLocations}
    />
  );
}
