import { StudyPortal } from "@/components/StudyPortal";
import { ClubsCarousel } from "@/components/ClubsCarousel";
import { EventsList } from "@/components/EventsList";
import { NavigationMap } from "@/components/NavigationMap";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { ThemeToggle } from "@/components/ThemeToggle";
import techClubBanner from "@assets/generated_images/tech_club_banner_image.png";
import sportsClubBanner from "@assets/generated_images/sports_club_banner_image.png";
import aiProjectThumbnail from "@assets/generated_images/ai_project_thumbnail.png";
import appDesignThumbnail from "@assets/generated_images/app_design_project_thumbnail.png";
import roboticsThumbnail from "@assets/generated_images/robotics_project_thumbnail.png";

export default function Home() {
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

  const mockNearbyEvents = [
    { name: "Tech Talk", distance: "200m" },
    { name: "Career Fair", distance: "350m" },
  ];

  const mockProjects = [
    {
      id: "1",
      title: "AI Campus Assistant Bot",
      creator: "Alex Chen",
      description:
        "An intelligent chatbot that helps students navigate campus resources and answer common questions using natural language processing.",
      thumbnail: aiProjectThumbnail,
      likes: 142,
      views: 1253,
      category: "AI/ML",
      liked: false,
    },
    {
      id: "2",
      title: "Campus Events Mobile App",
      creator: "Maya Patel",
      description:
        "A beautifully designed mobile app for discovering and managing campus events with personalized recommendations.",
      thumbnail: appDesignThumbnail,
      likes: 98,
      views: 876,
      category: "Mobile",
      liked: true,
    },
    {
      id: "3",
      title: "Autonomous Library Robot",
      creator: "Jordan Lee",
      description:
        "A robotics project that autonomously organizes and retrieves books in the campus library using computer vision and path planning.",
      thumbnail: roboticsThumbnail,
      likes: 203,
      views: 1842,
      category: "Robotics",
      liked: false,
    },
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
          <div className="lg:col-span-3">
            <StudyPortal
              notes={mockNotes}
              faculty={mockFaculty}
              nextClass={mockNextClass}
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <ClubsCarousel clubs={mockClubs} />
            <EventsList events={mockEvents} />
            <NavigationMap
              currentLocation="Central Library, Block C"
              nearbyEvents={mockNearbyEvents}
            />
          </div>

          <div className="lg:col-span-3">
            <ProjectShowcase projects={mockProjects} />
          </div>
        </div>
      </main>
    </div>
  );
}
