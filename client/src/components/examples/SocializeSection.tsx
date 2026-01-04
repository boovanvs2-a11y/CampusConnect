import { SocializeSection } from "../SocializeSection";
import techClubBanner from "@assets/generated_images/tech_club_banner_image.png";

export default function SocializeSectionExample() {
  const mockPosts = [
    {
      id: "1",
      author: "Alex Chen",
      authorInitials: "AC",
      content: "Just finished our hackathon project! Can't wait to present.",
      image: techClubBanner,
      likes: 42,
      comments: 8,
      timeAgo: "2h ago",
      liked: false,
    },
    {
      id: "2",
      author: "Maya Patel",
      authorInitials: "MP",
      content: "The campus sunset today was stunning! Loving the library view.",
      likes: 128,
      comments: 15,
      timeAgo: "4h ago",
      liked: true,
    },
    {
      id: "3",
      author: "Jordan Lee",
      authorInitials: "JL",
      content: "Great game today! Our team made it to the semifinals.",
      likes: 89,
      comments: 12,
      timeAgo: "6h ago",
      liked: false,
    },
  ];

  return <SocializeSection posts={mockPosts} />;
}
