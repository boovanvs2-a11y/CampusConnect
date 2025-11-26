import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, FileText } from "lucide-react";

type Note = {
  id: string;
  title: string;
  subject: string;
  date: string;
};

type Faculty = {
  id: string;
  name: string;
  department: string;
  status: "available" | "busy" | "offline";
  email: string;
};

type Schedule = {
  course: string;
  time: string;
  location: string;
};

type StudyPortalProps = {
  notes: Note[];
  faculty: Faculty[];
  nextClass: Schedule;
};

const statusConfig = {
  available: { color: "hsl(var(--status-available))", label: "Available" },
  busy: { color: "hsl(var(--status-busy))", label: "In Class" },
  offline: { color: "hsl(var(--muted-foreground))", label: "Offline" },
};

export function StudyPortal({ notes, faculty, nextClass }: StudyPortalProps) {
  const notesBySubject = notes.reduce((acc, note) => {
    if (!acc[note.subject]) acc[note.subject] = [];
    acc[note.subject].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  return (
    <Card className="h-full backdrop-blur-sm bg-card/90">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Study Portal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md border bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                Next Class
              </p>
              <p className="text-lg font-semibold truncate" data-testid="text-next-class">
                {nextClass.course}
              </p>
              <p className="text-sm text-muted-foreground">
                {nextClass.time} • {nextClass.location}
              </p>
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="notes">
            <AccordionTrigger className="hover:no-underline" data-testid="button-notes-accordion">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                My Notes
                <Badge variant="secondary" className="ml-2">
                  {notes.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {Object.entries(notesBySubject).map(([subject, subjectNotes]) => (
                  <div key={subject} className="space-y-1">
                    <p className="text-sm font-medium text-foreground px-2">
                      {subject}
                    </p>
                    {subjectNotes.map((note) => (
                      <button
                        key={note.id}
                        className="w-full text-left px-2 py-2 rounded-md text-sm hover-elevate active-elevate-2"
                        onClick={() => console.log("Open note:", note.id)}
                        data-testid={`button-note-${note.id}`}
                      >
                        <p className="font-medium truncate">{note.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {note.date}
                        </p>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faculty">
            <AccordionTrigger className="hover:no-underline" data-testid="button-faculty-accordion">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Faculty Contacts
                <Badge variant="secondary" className="ml-2">
                  {faculty.filter((f) => f.status === "available").length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1 pt-2">
                {faculty.map((member) => (
                  <button
                    key={member.id}
                    className="w-full text-left px-2 py-2 rounded-md hover-elevate active-elevate-2"
                    onClick={() => console.log("Contact faculty:", member.id)}
                    data-testid={`button-faculty-${member.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: statusConfig[member.status].color,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.department}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
