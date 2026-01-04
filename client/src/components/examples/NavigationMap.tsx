import { NavigationMap } from "../NavigationMap";

export default function NavigationMapExample() {
  const mockNearbyEvents = [
    { name: "Tech Talk", distance: "200m" },
    { name: "Career Fair", distance: "350m" },
  ];

  return (
    <NavigationMap
      currentLocation="Central Library, Block C"
      nearbyEvents={mockNearbyEvents}
    />
  );
}
