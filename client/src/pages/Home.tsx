import { StudyPortal } from "@/components/StudyPortal";
import { AnnouncementsSection } from "@/components/AnnouncementsSection";
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
  const mockNotes = [
    { id: "1", title: "Linear Algebra - Eigenvalues", subject: "Mathematics", date: "2 days ago" },
    { id: "2", title: "Calculus - Integration", subject: "Mathematics", date: "1 week ago" },
    { id: "3", title: "OOP Concepts", subject: "Computer Science", date: "3 days ago" },
    { id: "4", title: "Data Structures", subject: "Computer Science", date: "5 days ago" },
  ];

  const mockFaculty = [
    { id: "1", name: "Dr. Sarah Johnson", department: "Computer Science", status: "available" as const, email: "sjohnson@rnsit.ac.in", phone: "+91-9876543210" },
    { id: "2", name: "Prof. Michael Chen", department: "Mathematics", status: "busy" as const, email: "mchen@rnsit.ac.in", phone: "+91-9876543211" },
    { id: "3", name: "Dr. Emily Rodriguez", department: "Physics", status: "available" as const, email: "erodriguez@rnsit.ac.in", phone: "+91-9876543212" },
    { id: "4", name: "Prof. David Kim", department: "Engineering", status: "offline" as const, email: "dkim@rnsit.ac.in", phone: "+91-9876543213" },
  ];

  const mockNextClass = {
    course: "Advanced Algorithms",
    time: "2:00 PM - 3:30 PM",
    location: "Block A, Room 305",
  };

  const mockAnnouncements = [
    { id: "1", title: "Winter Break", content: "Campus will be closed from Dec 20 - Jan 5", date: "Today", category: "holiday" as const, author: "Principal", important: true },
    { id: "2", title: "Maintenance Work", content: "WiFi will be down on Dec 18, 9 PM - 12 AM", date: "Yesterday", category: "maintenance" as const, author: "IT Department", important: true },
    { id: "3", title: "Sports Day", content: "Inter-class sports competition on Dec 22", date: "2 days ago", category: "event" as const, author: "Sports Committee", important: false },
    { id: "4", title: "Library Notice", content: "New study materials added to central library", date: "3 days ago", category: "notice" as const, author: "Librarian", important: false },
  ];

  const mockClubs = [
    { id: "1", name: "Tech Innovation", description: "Build projects, attend hackathons.", members: 234, category: "Technology", banner: techClubBanner },
    { id: "2", name: "Campus Athletics", description: "Sports and fitness activities.", members: 512, category: "Sports", banner: sportsClubBanner },
    { id: "3", name: "Debate Society", description: "Critical thinking and public speaking.", members: 156, category: "Academic" },
    { id: "4", name: "Photography Club", description: "Capture moments and exhibitions.", members: 189, category: "Arts" },
  ];

  const mockConnectClubs = [
    { id: "1", name: "IEEE RNSIT Chapter", description: "Official IEEE student branch", members: 342, category: "Technical", admin: "Dr. Priya Sharma", adminInitials: "PS", isOfficial: true, joined: false },
    { id: "2", name: "Google Developer Club", description: "Google technologies & workshops", members: 278, category: "Technical", admin: "Prof. Rajesh Kumar", adminInitials: "RK", isOfficial: true, joined: true },
    { id: "3", name: "Cultural Committee", description: "Organizing campus festivals", members: 156, category: "Cultural", admin: "Dr. Anita Desai", adminInitials: "AD", isOfficial: true, joined: false },
    { id: "4", name: "NSS Unit", description: "National Service Scheme", members: 420, category: "Social", admin: "Prof. Suresh Reddy", adminInitials: "SR", isOfficial: true, joined: false },
  ];

  const mockDiscussions = [
    { id: "1", type: "question" as const, author: "Alex Chen", content: "When is the deadline for the AI project submission?", answers: 5, votes: 12, liked: false },
    { id: "2", type: "poll" as const, author: "Campus Council", content: "What time should the library extend hours during exams?", votes: 89, pollOptions: [{ option: "Until 12 AM", votes: 45 }, { option: "Until 2 AM", votes: 32 }, { option: "24/7", votes: 12 }], voted: false, liked: true },
    { id: "3", type: "question" as const, author: "Maya Patel", content: "Where is the career fair registration desk?", answers: 3, votes: 8, liked: false },
  ];

  const mockPosts = [
    { id: "1", author: "Alex Chen", authorInitials: "AC", content: "Just finished our hackathon project! Can't wait to present.", image: techClubBanner, likes: 42, comments: 8, timeAgo: "2h ago", liked: false },
    { id: "2", author: "Maya Patel", authorInitials: "MP", content: "The campus sunset today was stunning! Loving the library view.", likes: 128, comments: 15, timeAgo: "4h ago", liked: true },
    { id: "3", author: "Jordan Lee", authorInitials: "JL", content: "Great game today! Our team made it to the semifinals.", likes: 89, comments: 12, timeAgo: "6h ago", liked: false },
  ];

  const mockEvents = [
    { id: "1", title: "Campus Tech Hackathon", date: "2025-12-15", time: "9:00 AM - 6:00 PM", location: "Innovation Center", category: "Technology", spotsLeft: 45, registered: false },
    { id: "2", title: "Cultural Festival", date: "2025-12-20", time: "4:00 PM - 10:00 PM", location: "Open Air Theatre", category: "Cultural", spotsLeft: 12, registered: true },
    { id: "3", title: "AI Guest Lecture", date: "2025-12-18", time: "3:00 PM - 5:00 PM", location: "Auditorium B", category: "Academic", spotsLeft: 156, registered: false },
  ];

  const mockLocations = [
    { id: "1", name: "Central Library", type: "library" as const, distance: "150m" },
    { id: "2", name: "Campus Canteen", type: "food" as const, distance: "200m" },
    { id: "3", name: "Block A - CS Dept", type: "building" as const, distance: "300m" },
    { id: "4", name: "Sports Complex", type: "sports" as const, distance: "450m" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <h1 className="text-lg font-bold" data-testid="text-app-title">
              CampusConnect
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <AnnouncementsSection announcements={mockAnnouncements} />
            <StudyPortal notes={mockNotes} faculty={mockFaculty} nextClass={mockNextClass} />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <ClubsCarousel clubs={mockClubs} />
            <ConnectSection clubs={mockConnectClubs} />
            <DiscussSection discussions={mockDiscussions} />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <SocializeSection posts={mockPosts} />
            <CompactEventsList events={mockEvents} />
            <InteractiveMap currentLocation="Innovation Center, Block C" nearbyLocations={mockLocations} />
          </div>
        </div>
      </main>
    </div>
  );
}
