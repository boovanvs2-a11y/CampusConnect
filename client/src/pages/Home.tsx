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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Monitor, Smartphone, BookOpen, Users, Calendar, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import techClubBanner from "@assets/generated_images/tech_club_banner_image.png";
import sportsClubBanner from "@assets/generated_images/sports_club_banner_image.png";
import { formatDistanceToNow } from "date-fns";

// Class schedule based on RNSIT timetable
const classSchedule: Record<number, Array<{ startTime: string; endTime: string; course: string; location: string }>> = {
  1: [ // Monday
    { startTime: "09:30", endTime: "10:20", course: "Data Structures", location: "Block A, Room 101" },
    { startTime: "10:20", endTime: "11:10", course: "Web Development", location: "Lab 1" },
    { startTime: "11:10", endTime: "12:00", course: "Database Systems", location: "Block B, Room 205" },
    { startTime: "12:00", endTime: "13:00", course: "Computer Networks", location: "Block C, Room 310" },
    { startTime: "14:00", endTime: "14:50", course: "Advanced Algorithms", location: "Block A, Room 305" },
    { startTime: "14:50", endTime: "15:40", course: "Operating Systems", location: "Lab 2" },
    { startTime: "15:40", endTime: "16:30", course: "Machine Learning", location: "Block D, Room 401" },
    { startTime: "16:45", endTime: "17:35", course: "Software Engineering", location: "Block E, Room 502" },
  ],
  2: [ // Tuesday
    { startTime: "09:30", endTime: "10:20", course: "Linear Algebra", location: "Block A, Room 102" },
    { startTime: "10:20", endTime: "11:10", course: "Discrete Mathematics", location: "Block B, Room 206" },
    { startTime: "11:10", endTime: "12:00", course: "Programming Lab", location: "Lab 1" },
    { startTime: "12:00", endTime: "13:00", course: "Web Technologies", location: "Block C, Room 311" },
    { startTime: "14:00", endTime: "14:50", course: "Cloud Computing", location: "Block A, Room 306" },
    { startTime: "14:50", endTime: "15:40", course: "Cybersecurity", location: "Lab 3" },
    { startTime: "15:40", endTime: "16:30", course: "AI Fundamentals", location: "Block D, Room 402" },
    { startTime: "16:45", endTime: "17:35", course: "Project Work", location: "Block E, Room 503" },
  ],
  3: [ // Wednesday
    { startTime: "09:30", endTime: "10:20", course: "Calculus", location: "Block A, Room 103" },
    { startTime: "10:20", endTime: "11:10", course: "Probability Theory", location: "Block B, Room 207" },
    { startTime: "11:10", endTime: "12:00", course: "Database Lab", location: "Lab 2" },
    { startTime: "12:00", endTime: "13:00", course: "Computer Architecture", location: "Block C, Room 312" },
    { startTime: "14:00", endTime: "14:50", course: "Graphics Programming", location: "Block A, Room 307" },
    { startTime: "14:50", endTime: "15:40", course: "Network Lab", location: "Lab 1" },
    { startTime: "15:40", endTime: "16:30", course: "IoT Applications", location: "Block D, Room 403" },
    { startTime: "16:45", endTime: "17:35", course: "Seminar", location: "Block E, Room 504" },
  ],
  4: [ // Thursday
    { startTime: "09:30", endTime: "10:20", course: "Physics", location: "Block A, Room 104" },
    { startTime: "10:20", endTime: "11:10", course: "Chemistry Fundamentals", location: "Block B, Room 208" },
    { startTime: "11:10", endTime: "12:00", course: "Physics Lab", location: "Lab 3" },
    { startTime: "12:00", endTime: "13:00", course: "Advanced Java", location: "Block C, Room 313" },
    { startTime: "14:00", endTime: "14:50", course: "Mobile Development", location: "Block A, Room 308" },
    { startTime: "14:50", endTime: "15:40", course: "Mobile Lab", location: "Lab 4" },
    { startTime: "15:40", endTime: "16:30", course: "Blockchain Basics", location: "Block D, Room 404" },
    { startTime: "16:45", endTime: "17:35", course: "Guest Lecture", location: "Auditorium" },
  ],
  5: [ // Friday
    { startTime: "09:30", endTime: "10:20", course: "Technical Writing", location: "Block A, Room 105" },
    { startTime: "10:20", endTime: "11:10", course: "Communication Skills", location: "Block B, Room 209" },
    { startTime: "11:10", endTime: "12:00", course: "Soft Skills Lab", location: "Lab 1" },
    { startTime: "12:00", endTime: "13:00", course: "Capstone Project", location: "Block C, Room 314" },
    { startTime: "14:00", endTime: "14:50", course: "Internship Prep", location: "Block A, Room 309" },
    { startTime: "14:50", endTime: "15:40", course: "Interview Skills", location: "Lab 5" },
    { startTime: "15:40", endTime: "16:30", course: "Career Guidance", location: "Block D, Room 405" },
    { startTime: "16:45", endTime: "17:35", course: "Tech Talk", location: "Block E, Room 505" },
  ],
};

function getNextClass() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  // No classes on Saturday (6) and Sunday (0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      course: "No Classes Today",
      time: "Weekend",
      location: "Enjoy your break!",
    };
  }

  const todaySchedule = classSchedule[dayOfWeek] || [];
  
  // Find next class
  for (const cls of todaySchedule) {
    if (cls.startTime > currentTime) {
      return {
        course: cls.course,
        time: `${cls.startTime} - ${cls.endTime}`,
        location: cls.location,
      };
    }
  }

  // No more classes today
  return {
    course: "No More Classes",
    time: "Today's classes are over",
    location: "See you tomorrow!",
  };
}

export default function Home() {
  const [user, setUser] = useState<{ id: string; username: string; role: string } | null>(null);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">(() => {
    const saved = localStorage.getItem("campusconnect-view-mode");
    return (saved as "mobile" | "desktop") || "desktop";
  });
  const { data: announcements = [] } = useQuery({
    queryKey: ["/api/announcements"],
  }) as any;
  const { data: fetchedNotes = [] } = useQuery({
    queryKey: ["/api/notes"],
  }) as any;

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

  // Demo notes (default examples)
  const demoNotes = [
    { id: "demo-1", title: "Linear Algebra - Eigenvalues", subject: "Mathematics", date: "2 days ago" },
    { id: "demo-2", title: "Calculus - Integration", subject: "Mathematics", date: "1 week ago" },
    { id: "demo-3", title: "OOP Concepts", subject: "Computer Science", date: "3 days ago" },
    { id: "demo-4", title: "Data Structures", subject: "Computer Science", date: "5 days ago" },
  ];

  // Transform fetched notes to include formatted date
  const apiNotes = (Array.isArray(fetchedNotes) ? fetchedNotes : []).map((note: any) => ({
    ...note,
    date: note.createdAt ? formatDistanceToNow(new Date(note.createdAt), { addSuffix: true }) : "Recently added",
  }));

  // Combine demo notes and API notes
  const notes = [...demoNotes, ...apiNotes];

  const mockFaculty = [
    { id: "1", name: "Dr. Sarah Johnson", department: "Computer Science", status: "available" as const, email: "sjohnson@rnsit.ac.in", phone: "+91-9876543210" },
    { id: "2", name: "Prof. Michael Chen", department: "Mathematics", status: "busy" as const, email: "mchen@rnsit.ac.in", phone: "+91-9876543211" },
    { id: "3", name: "Dr. Emily Rodriguez", department: "Physics", status: "available" as const, email: "erodriguez@rnsit.ac.in", phone: "+91-9876543212" },
    { id: "4", name: "Prof. David Kim", department: "Engineering", status: "offline" as const, email: "dkim@rnsit.ac.in", phone: "+91-9876543213" },
  ];

  const [nextClass, setNextClass] = useState(() => getNextClass());

  // Update next class every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNextClass(getNextClass());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);


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
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-0 sm:h-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <svg className="h-7 w-7 flex-shrink-0" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath id="leftCircle">
                  <circle cx="10" cy="12" r="7" />
                </clipPath>
              </defs>
              
              {/* Left circle - White stroke */}
              <circle cx="10" cy="12" r="7" stroke="white" strokeWidth="1.5" fill="none" />
              
              {/* Right circle - White stroke */}
              <circle cx="22" cy="12" r="7" stroke="white" strokeWidth="1.5" fill="none" />
              
              {/* Intersection fill - Right circle clipped to left circle area */}
              <circle cx="22" cy="12" r="7" fill="white" clipPath="url(#leftCircle)" />
            </svg>
            <h1 className="text-base sm:text-lg font-bold" data-testid="text-app-title">
              CampusConnect
            </h1>
            {user && (
              <span className="text-xs text-muted-foreground ml-2 sm:ml-4 hidden sm:inline">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            )}
          </div>
          <div className="hidden sm:flex flex-1 items-center justify-center">
            {user?.role === "student" && (
              <span className="text-sm font-semibold text-foreground">
                {user.username === "1RN25EC208-T" ? "hi admin" : user.username === "1RN25EC014-T" ? "chirantham" : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-end">
            <ColorPicker />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleViewMode}
              data-testid="button-view-toggle"
              title={`Switch to ${viewMode === "desktop" ? "mobile" : "desktop"} view`}
              className="h-9 w-9"
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
              className="text-xs sm:text-sm h-9 px-2 sm:px-3"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className={`${viewMode === "desktop" ? "container mx-auto" : "w-full"} px-3 sm:px-4 ${viewMode === "desktop" ? "py-4" : "py-2 sm:py-4"}`}>
        {viewMode === "desktop" ? (
          <div className={`grid gap-4 grid-cols-1 lg:grid-cols-12`}>
            {user?.role === "student" && (
              <div className={`lg:col-span-12 space-y-2 sm:space-y-3`}>
                <ApprovedClubsNotification />
                <RejectedClubsNotification />
              </div>
            )}
            
            <div className={`lg:col-span-3 space-y-3 sm:space-y-4`}>
              <div className="relative">
                <div className="absolute -left-12 top-0 z-50">
                  <CalendarSidebar />
                </div>
                <AnnouncementsSection announcements={announcements} userRole={user?.role} />
              </div>
              {user?.role === "principal" && <PrincipalPanel />}
              <StudyPortal notes={notes} faculty={mockFaculty} nextClass={nextClass} userRole={user?.role} />
              <PrintService />
            </div>

            <div className={`lg:col-span-5 space-y-3 sm:space-y-4`}>
              <ClubsCarousel userRole={user?.role || "student"} />
              <ConnectSection />
              <DiscussSection discussions={mockDiscussions} />
              <WhatsAppSummarizer />
            </div>

            <div className={`lg:col-span-4 space-y-3 sm:space-y-4`}>
              <div className="relative">
                <div className="absolute -right-12 top-0 z-50">
                  <AISidebar />
                </div>
                <SocializeSection currentUserId={user?.id} users={{ [user?.id || ""]: { username: user?.username || "You" } }} />
              </div>
              <CompactEventsList events={mockEvents} />
              <InteractiveMap currentLocation="Innovation Center, Block C" ongoingClasses={mockOngoingClasses} ongoingEvents={mockOngoingEvents} />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {user?.role === "student" && (
              <div className="space-y-2">
                <ApprovedClubsNotification />
                <RejectedClubsNotification />
              </div>
            )}
            
            <Tabs defaultValue="study" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4" data-testid="mobile-tabs">
                <TabsTrigger value="study" className="text-xs sm:text-sm gap-1" data-testid="tab-study">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Study</span>
                </TabsTrigger>
                <TabsTrigger value="clubs" className="text-xs sm:text-sm gap-1" data-testid="tab-clubs">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Clubs</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="text-xs sm:text-sm gap-1" data-testid="tab-events">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Events</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="text-xs sm:text-sm gap-1" data-testid="tab-social">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Social</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="study" className="space-y-3 mt-0">
                <AnnouncementsSection announcements={announcements} userRole={user?.role} />
                {user?.role === "principal" && <PrincipalPanel />}
                <StudyPortal notes={notes} faculty={mockFaculty} nextClass={nextClass} userRole={user?.role} />
                <PrintService />
              </TabsContent>

              <TabsContent value="clubs" className="space-y-3 mt-0">
                <ClubsCarousel userRole={user?.role || "student"} />
                <ConnectSection />
              </TabsContent>

              <TabsContent value="events" className="space-y-3 mt-0">
                <CompactEventsList events={mockEvents} />
                <InteractiveMap currentLocation="Innovation Center, Block C" ongoingClasses={mockOngoingClasses} ongoingEvents={mockOngoingEvents} />
              </TabsContent>

              <TabsContent value="social" className="space-y-3 mt-0">
                <SocializeSection currentUserId={user?.id} users={{ [user?.id || ""]: { username: user?.username || "You" } }} />
                <DiscussSection discussions={mockDiscussions} />
                <WhatsAppSummarizer />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
