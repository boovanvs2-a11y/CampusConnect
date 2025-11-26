import { StudyPortal } from "@/components/StudyPortal";
import { ClubsCarousel } from "@/components/ClubsCarousel";
import { ConnectSection } from "@/components/ConnectSection";
import { DiscussSection } from "@/components/DiscussSection";
import { SocializeSection } from "@/components/SocializeSection";
import { CompactEventsList } from "@/components/CompactEventsList";
import { InteractiveMap } from "@/components/InteractiveMap";
import { ThemeToggle } from "@/components/ThemeToggle";
import techClubBanner from "@assets/generated_images/tech_club_banner_image.png";
import sportsClubBanner from "@assets/generated_images/sports_club_banner_image.png";

export default function Home() {
  // todo: remove mock data - Study Portal
  const mockNotes = [
    {
      id: "1",
      title: "Linear Algebra - Eigenvalues",
      subject: "Mathematics",
      date: "2 days ago",
    },
    {
      id: "2",
      title: "Calculus - Integration Techniques",
      subject: "Mathematics",
      date: "1 week ago",
    },
    {
      id: "3",
      title: "Object-Oriented Programming",
      subject: "Computer Science",
      date: "3 days ago",
    },
    {
      id: "4",
      title: "Data Structures - Trees & Graphs",
      subject: "Computer Science",
      date: "5 days ago",
    },
    {
      id: "5",
      title: "Thermodynamics - First Law",
      subject: "Physics",
      date: "1 day ago",
    },
  ];

  const mockFaculty = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      department: "Computer Science",
      status: "available" as const,
      email: "sjohnson@university.edu",
    },
    {
      id: "2",
      name: "Prof. Michael Chen",
      department: "Mathematics",
      status: "busy" as const,
      email: "mchen@university.edu",
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      department: "Physics",
      status: "available" as const,
      email: "erodriguez@university.edu",
    },
    {
      id: "4",
      name: "Prof. David Kim",
      department: "Engineering",
      status: "offline" as const,
      email: "dkim@university.edu",
    },
  ];

  const mockNextClass = {
    course: "Advanced Algorithms",
    time: "2:00 PM - 3:30 PM",
    location: "Block A, Room 305",
  };

  // todo: remove mock data - Clubs
  const mockClubs = [
    {
      id: "1",
      name: "Tech Innovation Club",
      description:
        "Build cutting-edge projects, attend hackathons, and collaborate with fellow tech enthusiasts.",
      members: 234,
      category: "Technology",
      banner: techClubBanner,
      joined: false,
    },
    {
      id: "2",
      name: "Campus Athletics",
      description:
        "Join us for sports, fitness activities, and competitive tournaments throughout the year.",
      members: 512,
      category: "Sports",
      banner: sportsClubBanner,
      joined: true,
    },
    {
      id: "3",
      name: "Debate Society",
      description:
        "Sharpen your critical thinking and public speaking skills through weekly debates and competitions.",
      members: 156,
      category: "Academic",
      joined: false,
    },
    {
      id: "4",
      name: "Photography Club",
      description:
        "Capture moments, learn photography techniques, and showcase your work in campus exhibitions.",
      members: 189,
      category: "Arts",
      joined: false,
    },
    {
      id: "5",
      name: "Entrepreneurship Hub",
      description:
        "Connect with mentors, pitch your startup ideas, and turn your business dreams into reality.",
      members: 298,
      category: "Business",
      joined: true,
    },
  ];

  // todo: remove mock data - Connect (Fests)
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

  // todo: remove mock data - Discuss
  const mockDiscussions = [
    {
      id: "1",
      type: "question" as const,
      author: "Alex Chen",
      content: "When is the deadline for the AI project submission?",
      answers: 5,
      votes: 12,
      liked: false,
    },
    {
      id: "2",
      type: "poll" as const,
      author: "Campus Council",
      content: "What time should the library extend hours during exams?",
      votes: 89,
      pollOptions: [
        { option: "Until 12 AM", votes: 45 },
        { option: "Until 2 AM", votes: 32 },
        { option: "24/7", votes: 12 },
      ],
      voted: false,
      liked: true,
    },
    {
      id: "3",
      type: "question" as const,
      author: "Maya Patel",
      content: "Anyone know where the career fair registration desk is?",
      answers: 3,
      votes: 8,
      liked: false,
    },
  ];

  // todo: remove mock data - Socialize
  const mockPosts = [
    {
      id: "1",
      author: "Alex Chen",
      authorInitials: "AC",
      content:
        "Just finished our hackathon project! Can't wait to present it tomorrow.",
      image: techClubBanner,
      likes: 42,
      comments: 8,
      timeAgo: "2h ago",
      liked: false,
      saved: false,
    },
    {
      id: "2",
      author: "Maya Patel",
      authorInitials: "MP",
      content:
        "The campus sunset today was absolutely stunning. Loving the view from the library!",
      likes: 128,
      comments: 15,
      timeAgo: "4h ago",
      liked: true,
      saved: true,
    },
    {
      id: "3",
      author: "Jordan Lee",
      authorInitials: "JL",
      content: "Great game today! Our team made it to the semifinals.",
      image: sportsClubBanner,
      likes: 89,
      comments: 12,
      timeAgo: "6h ago",
      liked: false,
      saved: false,
    },
  ];

  // todo: remove mock data - Events
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

  // todo: remove mock data - Map locations
  const mockLocations = [
    { id: "1", name: "Central Library", type: "library" as const, distance: "150m" },
    { id: "2", name: "Campus Canteen", type: "food" as const, distance: "200m" },
    { id: "3", name: "Block A - CS Dept", type: "building" as const, distance: "300m" },
    { id: "4", name: "Sports Complex", type: "sports" as const, distance: "450m" },
    { id: "5", name: "Coffee House", type: "food" as const, distance: "180m" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <h1 className="text-xl font-bold" data-testid="text-app-title">
              CampusConnect
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Study Portal */}
          <div className="lg:col-span-3">
            <StudyPortal
              notes={mockNotes}
              faculty={mockFaculty}
              nextClass={mockNextClass}
            />
          </div>

          {/* Center Column - Clubs, Connect, Discuss */}
          <div className="lg:col-span-5 space-y-6">
            <ClubsCarousel clubs={mockClubs} />
            <ConnectSection fests={mockFests} />
            <DiscussSection discussions={mockDiscussions} />
          </div>

          {/* Right Column - Socialize, Events, Map */}
          <div className="lg:col-span-4 space-y-6">
            <SocializeSection posts={mockPosts} />
            <CompactEventsList events={mockEvents} />
            <InteractiveMap
              currentLocation="Innovation Center, Block C"
              nearbyLocations={mockLocations}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
