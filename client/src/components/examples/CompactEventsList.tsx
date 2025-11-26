import { CompactEventsList } from "../CompactEventsList";

export default function CompactEventsListExample() {
  const mockEvents = [
    {
      id: "1",
      title: "Campus Tech Hackathon",
      date: "2025-12-15",
      time: "9:00 AM - 6:00 PM",
      location: "Innovation Center",
      category: "Technology",
    },
    {
      id: "2",
      title: "Cultural Festival",
      date: "2025-12-20",
      time: "4:00 PM - 10:00 PM",
      location: "Open Air Theatre",
      category: "Cultural",
    },
    {
      id: "3",
      title: "AI Guest Lecture",
      date: "2025-12-18",
      time: "3:00 PM - 5:00 PM",
      location: "Auditorium B",
      category: "Academic",
    },
    {
      id: "4",
      title: "Sports Meet",
      date: "2025-12-22",
      time: "8:00 AM",
      location: "Sports Complex",
      category: "Sports",
    },
  ];

  return <CompactEventsList events={mockEvents} />;
}
