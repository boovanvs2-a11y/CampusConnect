import { ConnectSection } from "../ConnectSection";

export default function ConnectSectionExample() {
  const mockClubs = [
    {
      id: "1",
      name: "IEEE RNSIT Chapter",
      description: "Official IEEE student branch",
      members: 342,
      category: "Technical",
      admin: "Dr. Priya Sharma",
      adminInitials: "PS",
      isOfficial: true,
      joined: false,
    },
    {
      id: "2",
      name: "Google Developer Club",
      description: "Google technologies & workshops",
      members: 278,
      category: "Technical",
      admin: "Prof. Rajesh Kumar",
      adminInitials: "RK",
      isOfficial: true,
      joined: true,
    },
    {
      id: "3",
      name: "Cultural Committee",
      description: "Organizing campus festivals",
      members: 156,
      category: "Cultural",
      admin: "Dr. Anita Desai",
      adminInitials: "AD",
      isOfficial: true,
      joined: false,
    },
  ];

  return <ConnectSection clubs={mockClubs} />;
}
