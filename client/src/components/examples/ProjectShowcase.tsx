import { ProjectShowcase } from "../ProjectShowcase";
import aiProjectThumbnail from "@assets/generated_images/ai_project_thumbnail.png";
import appDesignThumbnail from "@assets/generated_images/app_design_project_thumbnail.png";
import roboticsThumbnail from "@assets/generated_images/robotics_project_thumbnail.png";

export default function ProjectShowcaseExample() {
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
    <div className="h-[800px]">
      <ProjectShowcase projects={mockProjects} />
    </div>
  );
}
