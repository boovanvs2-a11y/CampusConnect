import { DiscussSection } from "../DiscussSection";

export default function DiscussSectionExample() {
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

  return <DiscussSection discussions={mockDiscussions} />;
}
