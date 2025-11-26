import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, ExternalLink, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";

type Note = {
  id: string;
  title: string;
  subject: string;
  date: string;
  content?: string;
};

const mockNotes: Note[] = [
  { id: "1", title: "Linear Algebra - Eigenvalues", subject: "Mathematics", date: "2 days ago", content: "Eigenvalues and eigenvectors are fundamental concepts in linear algebra. An eigenvalue is a scalar that is multiplied by an eigenvector when a linear transformation is applied. If A is a matrix and v is a non-zero vector, then λ is an eigenvalue if Av = λv.\n\nKey properties:\n- Eigenvalues determine the behavior of linear transformations\n- Used in stability analysis, vibration analysis, and quantum mechanics\n- Calculated by solving det(A - λI) = 0\n- Eigenvectors are perpendicular to each other in orthogonal matrices" },
  { id: "2", title: "Calculus - Integration", subject: "Mathematics", date: "1 week ago", content: "Integration is the reverse process of differentiation. It allows us to find the area under curves and solve differential equations. Basic integration rules include power rule, exponential rule, and trigonometric rules." },
  { id: "3", title: "OOP Concepts", subject: "Computer Science", date: "3 days ago", content: "Object-Oriented Programming is a paradigm based on objects and classes. Key concepts include encapsulation, inheritance, polymorphism, and abstraction. These principles help create organized, reusable, and maintainable code." },
  { id: "4", title: "Data Structures", subject: "Computer Science", date: "5 days ago", content: "Data structures are specialized formats for organizing and storing data. Common types include arrays, linked lists, trees, graphs, and hash tables. Each has its own advantages and use cases." },
];

const relatedSearchQueries = {
  "Linear Algebra - Eigenvalues": ["eigenvalues eigenvectors", "linear algebra matrix", "characteristic polynomial"],
  "Calculus - Integration": ["integration rules calculus", "definite integral", "antiderivatives"],
  "OOP Concepts": ["object oriented programming", "inheritance polymorphism", "encapsulation"],
  "Data Structures": ["data structures algorithms", "binary trees linked lists", "hash tables"],
};

export default function NoteDetail() {
  const [, setLocation] = useLocation();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);

  useEffect(() => {
    const noteId = new URLSearchParams(window.location.search).get("id");
    if (noteId) {
      const found = mockNotes.find((n) => n.id === noteId);
      if (found) {
        setNote(found);
        // Get related search queries
        const queries = relatedSearchQueries[found.title as keyof typeof relatedSearchQueries] || [];
        setSearchQueries(queries);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="p-4">
        <Button
          variant="outline"
          onClick={() => setLocation("/")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <p className="text-muted-foreground">Note not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back-note"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Note Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle className="text-3xl">{note.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{note.subject}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{note.date}</p>
                </div>
              </CardHeader>

              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {note.content || "No content available for this note."}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Resources Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Related Resources
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Search Google for additional resources related to this topic:
                </p>

                <div className="space-y-2">
                  {searchQueries.map((query, index) => (
                    <a
                      key={index}
                      href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg border hover:bg-primary/5 transition-colors group"
                      data-testid={`link-google-search-${index}`}
                    >
                      <span className="text-sm truncate text-foreground group-hover:text-primary">
                        {query}
                      </span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 ml-2" />
                    </a>
                  ))}
                </div>

                <div className="pt-2 border-t">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      `${note.title} ${note.subject} tutorial`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    data-testid="button-google-search"
                  >
                    <Search className="h-4 w-4" />
                    Search on Google
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="bg-muted/40">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">
                  <strong>Subject:</strong> {note.subject}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Added:</strong> {note.date}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
