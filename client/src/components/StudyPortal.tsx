import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Users, Clock, FileText, ExternalLink, GraduationCap, Mail, Phone, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { AddNoteForm } from "./AddNoteForm";

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
  phone: string;
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
  userRole?: string;
};

const statusConfig = {
  available: { color: "hsl(var(--status-available))", label: "Available" },
  busy: { color: "hsl(var(--status-busy))", label: "In Class" },
  offline: { color: "hsl(var(--muted-foreground))", label: "Offline" },
};

export function StudyPortal({ notes, faculty, nextClass, userRole }: StudyPortalProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const isLecturer = userRole === "lecturer";
  
  const notesBySubject = notes.reduce((acc, note) => {
    if (!acc[note.subject]) acc[note.subject] = [];
    acc[note.subject].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  const handleOpenNote = (noteId: string, noteTitle: string) => {
    setLocation(`/note?id=${noteId}`);
  };

  const handleContactFaculty = (member: Faculty) => {
    setLocation(`/faculty?id=${member.id}`);
  };

  const handleOpenERP = () => {
    window.open("https://www.rnsit.ac.in", "_blank");
    toast({
      title: "Opening ERP",
      description: "Redirecting to RNSIT portal...",
    });
  };

  return (
    <>
      <Card className="backdrop-blur-sm bg-card/90">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardHeader className="pb-3">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Study Portal
              </CardTitle>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4">
          <div className="rounded-md border bg-primary/5 p-3">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Next Class</p>
                <p className="text-sm font-semibold truncate" data-testid="text-next-class">
                  {nextClass.course}
                </p>
                <p className="text-xs text-muted-foreground">
                  {nextClass.time} • {nextClass.location}
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-10"
            onClick={handleOpenERP}
            data-testid="link-erp"
          >
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="flex-1 text-left">ERP Portal</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="notes" className="border-b-0">
              <AccordionTrigger className="hover:no-underline py-2" data-testid="button-notes-accordion">
                <div className="flex items-center gap-2 flex-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Notes</span>
                  <Badge variant="default" className="ml-1 text-xs">
                    {notes.length}
                  </Badge>
                </div>
                {isLecturer && (
                  <AddNoteForm>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 mr-2"
                      title="Add note"
                      data-testid="button-add-note"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </AddNoteForm>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 max-h-[180px] overflow-y-auto">
                  {Object.entries(notesBySubject).map(([subject, subjectNotes]) => (
                    <div key={subject} className="space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                        {subject}
                      </p>
                      {subjectNotes.map((note) => (
                        <button
                          key={note.id}
                          className="w-full text-left px-2 py-1.5 rounded-md text-sm hover-elevate active-elevate-2"
                          onClick={() => handleOpenNote(note.id, note.title)}
                          data-testid={`button-note-${note.id}`}
                        >
                          <p className="text-sm truncate">{note.title}</p>
                          <p className="text-xs text-muted-foreground">{note.date}</p>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faculty" className="border-b-0">
              <AccordionTrigger className="hover:no-underline py-2" data-testid="button-faculty-accordion">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Faculty</span>
                  <Badge variant="default" className="ml-1 text-xs">
                    {faculty.filter((f) => f.status === "available").length} online
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-0.5 max-h-[150px] overflow-y-auto">
                  {faculty.map((member) => (
                    <button
                      key={member.id}
                      className="w-full text-left px-2 py-1.5 rounded-md hover-elevate active-elevate-2"
                      onClick={() => handleContactFaculty(member)}
                      data-testid={`button-faculty-${member.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: statusConfig[member.status].color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{member.name}</p>
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
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {selectedFaculty && (
        <Dialog open={!!selectedFaculty} onOpenChange={() => setSelectedFaculty(null)}>
          <DialogContent data-testid="dialog-faculty-details">
            <DialogHeader>
              <DialogTitle>{selectedFaculty.name}</DialogTitle>
              <DialogDescription>
                {selectedFaculty.department}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{selectedFaculty.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">{selectedFaculty.phone}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = `mailto:${selectedFaculty.email}`} data-testid="button-email-faculty">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = `tel:${selectedFaculty.phone}`} data-testid="button-call-faculty">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
