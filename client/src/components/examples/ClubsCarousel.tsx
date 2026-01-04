import { ClubsCarousel } from "../ClubsCarousel";
import techClubBanner from "@assets/generated_images/tech_club_banner_image.png";
import sportsClubBanner from "@assets/generated_images/sports_club_banner_image.png";

export default function ClubsCarouselExample() {
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

  return <ClubsCarousel clubs={mockClubs} />;
}
