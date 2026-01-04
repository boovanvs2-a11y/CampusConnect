import { EventsList } from "../EventsList";

export default function EventsListExample() {
  const mockEvents = [
    {
      id: "1",
      title: "Campus Tech Hackathon 2025",
      date: "2025-12-15",
      time: "9:00 AM - 6:00 PM",
      location: "Innovation Center, Main Campus",
      category: "Technology",
    },
    {
      id: "2",
      title: "Annual Cultural Festival",
      date: "2025-12-20",
      time: "4:00 PM - 10:00 PM",
      location: "Open Air Theatre",
      category: "Cultural",
    },
    {
      id: "3",
      title: "Guest Lecture: AI & Future of Work",
      date: "2025-12-18",
      time: "3:00 PM - 5:00 PM",
      location: "Auditorium Block B",
      category: "Academic",
    },
    {
      id: "4",
      title: "Inter-College Sports Meet",
      date: "2025-12-22",
      time: "8:00 AM - 5:00 PM",
      location: "Sports Complex",
      category: "Sports",
    },
  ];

  return <EventsList events={mockEvents} />;
}
