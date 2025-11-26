import { StudyPortal } from "../StudyPortal";

export default function StudyPortalExample() {
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

  return (
    <div className="h-[800px]">
      <StudyPortal
        notes={mockNotes}
        faculty={mockFaculty}
        nextClass={mockNextClass}
      />
    </div>
  );
}
