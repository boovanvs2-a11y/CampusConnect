import { StudyPortal } from "@/components/StudyPortal";
import { AnnouncementsSection } from "@/components/AnnouncementsSection";
import { PrintService } from "@/components/PrintService";
import { PrincipalPanel } from "@/components/PrincipalPanel";
import { ApprovedClubsNotification } from "@/components/ApprovedClubsNotification";
import { RejectedClubsNotification } from "@/components/RejectedClubsNotification";
import { ClubsCarousel } from "@/components/ClubsCarousel";
import { ConnectSection } from "@/components/ConnectSection";
import { DiscussSection } from "@/components/DiscussSection";
import { SocializeSection } from "@/components/SocializeSection";
import { CompactEventsList } from "@/components/CompactEventsList";
import { InteractiveMap } from "@/components/InteractiveMap";
import { ColorPicker } from "@/components/ColorPicker";
import { CalendarSidebar } from "@/components/CalendarSidebar";
import { AISidebar } from "@/components/AISidebar";
import { WhatsAppSummarizer } from "@/components/WhatsAppSummarizer";
import { Button } from "@/components/ui/button";
import { LogOut, Monitor, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import techClubBanner from "@assets/generated_images/tech_club_banner_image.png";
import sportsClubBanner from "@assets/generated_images/sports_club_banner_image.png";

export default function Home() {
  const [user, setUser] = useState<{ id: string; username: string; role: string } | null>(null);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">(() => {
    const saved = localStorage.getItem("campusconnect-view-mode");
    return (saved as "mobile" | "desktop") || "desktop";
  });
  const { data: announcements = [] } = useQuery({
    queryKey: ["/api/announcements"],
  });

  useEffect(() => {
    const userDataEl = document.getElementById("user-data") as HTMLInputElement;
    const userData = userDataEl?.value ? JSON.parse(userDataEl.value) : null;
    setUser(userData);
  }, []);

  const toggleViewMode = () => {
    const newMode = viewMode === "desktop" ? "mobile" : "desktop";
    setViewMode(newMode);
    localStorage.setItem("campusconnect-view-mode", newMode);
  };

  const handleLogout = () => {
    const logoutBtn = document.getElementById("logout-trigger") as HTMLButtonElement;
    if (logoutBtn) logoutBtn.click();
    window.location.href = "/";
  };

  useEffect(() => {
    const script = document.createElement("script");
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (apiKey) {
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

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

  const mockOngoingClasses = [
    { id: "1", course: "Advanced Algorithms", instructor: "Dr. Sarah Johnson", time: "2:00 PM - 3:30 PM", location: "Block A, Room 305", latitude: 12.9022, longitude: 77.5188 },
    { id: "2", course: "Database Design", instructor: "Prof. Michael Chen", time: "11:00 AM - 12:30 PM", location: "CSE Lab", latitude: 12.9012, longitude: 77.5200 },
  ];

  const mockOngoingEvents = [
    { id: "1", title: "Coding Contest", time: "1:00 PM - 4:00 PM", location: "Auditorium", latitude: 12.9008, longitude: 77.5192 },
    { id: "2", title: "Campus Cleanup", time: "3:30 PM - 5:00 PM", location: "Sports Complex", latitude: 12.9010, longitude: 77.5175 },
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
            {user && (
              <span className="text-xs text-muted-foreground ml-4">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ColorPicker />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleViewMode}
              data-testid="button-view-toggle"
              title={`Switch to ${viewMode === "desktop" ? "mobile" : "desktop"} view`}
            >
              {viewMode === "desktop" ? (
                <Smartphone className="h-4 w-4" />
              ) : (
                <Monitor className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        <div className={`grid gap-4 ${viewMode === "desktop" ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"}`}>
          {user?.role === "student" && (
            <div className={`${viewMode === "desktop" ? "lg:col-span-12" : "col-span-1"} space-y-3`}>
              <ApprovedClubsNotification />
              <RejectedClubsNotification />
            </div>
          )}
          
          <div className={`${viewMode === "desktop" ? "lg:col-span-3" : "col-span-1"} space-y-4`}>
            <div className="relative">
              {viewMode === "desktop" && (
                <div className="absolute -left-12 top-0 z-50">
                  <CalendarSidebar />
                </div>
              )}
              <AnnouncementsSection announcements={announcements} />
            </div>
            {user?.role === "principal" && <PrincipalPanel />}
            <StudyPortal notes={mockNotes} faculty={mockFaculty} nextClass={mockNextClass} />
            <PrintService />
          </div>

          <div className={`${viewMode === "desktop" ? "lg:col-span-5" : "col-span-1"} space-y-4`}>
            <ClubsCarousel clubs={mockClubs} userRole={user?.role || "student"} />
            <ConnectSection clubs={mockConnectClubs} />
            <DiscussSection discussions={mockDiscussions} />
            <WhatsAppSummarizer />
          </div>

          <div className={`${viewMode === "desktop" ? "lg:col-span-4" : "col-span-1"} space-y-4`}>
            <div className="relative">
              {viewMode === "desktop" && (
                <div className="absolute -right-12 top-0 z-50">
                  <AISidebar />
                </div>
              )}
              <SocializeSection posts={mockPosts} />
            </div>
            <CompactEventsList events={mockEvents} />
            <InteractiveMap currentLocation="Innovation Center, Block C" ongoingClasses={mockOngoingClasses} ongoingEvents={mockOngoingEvents} />
          </div>
        </div>
      </main>
    </div>
  );
}
