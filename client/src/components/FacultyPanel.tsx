import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { PostAnnouncementForm } from "./PostAnnouncementForm";
import { useState } from "react";

export function FacultyPanel() {
  const [announcementCount, setAnnouncementCount] = useState(0);

  const handleAnnouncementPosted = () => {
    setAnnouncementCount(announcementCount + 1);
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Faculty Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <PostAnnouncementForm onAnnouncementPosted={handleAnnouncementPosted} />
      </CardContent>
    </Card>
  );
}
