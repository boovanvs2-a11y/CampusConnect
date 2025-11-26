import { ConnectSection } from "../ConnectSection";

export default function ConnectSectionExample() {
  const mockFests = [
    {
      id: "1",
      name: "Tech Fest 2025",
      date: "2025-12-15",
      time: "9:00 AM",
      spotsLeft: 45,
      totalSpots: 200,
      category: "Technology",
      registered: false,
    },
    {
      id: "2",
      name: "Cultural Night",
      date: "2025-12-20",
      time: "6:00 PM",
      spotsLeft: 12,
      totalSpots: 100,
      category: "Cultural",
      registered: true,
    },
    {
      id: "3",
      name: "Sports Day",
      date: "2025-12-22",
      time: "8:00 AM",
      spotsLeft: 156,
      totalSpots: 300,
      category: "Sports",
      registered: false,
    },
  ];

  return <ConnectSection fests={mockFests} />;
}
