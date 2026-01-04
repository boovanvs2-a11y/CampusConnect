import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Building2, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";

type Faculty = {
  id: string;
  name: string;
  department: string;
  status: "available" | "busy" | "offline";
  email: string;
  phone: string;
};

const mockFaculty: Faculty[] = [
  { id: "1", name: "Dr. Sarah Johnson", department: "Computer Science", status: "available", email: "sjohnson@rnsit.ac.in", phone: "+91-9876543210" },
  { id: "2", name: "Prof. Michael Chen", department: "Mathematics", status: "busy", email: "mchen@rnsit.ac.in", phone: "+91-9876543211" },
  { id: "3", name: "Dr. Emily Rodriguez", department: "Physics", status: "available", email: "erodriguez@rnsit.ac.in", phone: "+91-9876543212" },
  { id: "4", name: "Prof. David Kim", department: "Engineering", status: "offline", email: "dkim@rnsit.ac.in", phone: "+91-9876543213" },
];

const statusConfig = {
  available: { color: "hsl(var(--status-available))", label: "Available", badge: "success" as const },
  busy: { color: "hsl(var(--status-busy))", label: "In Class", badge: "secondary" as const },
  offline: { color: "hsl(var(--muted-foreground))", label: "Offline", badge: "outline" as const },
};

export default function FacultyDetail() {
  const [, setLocation] = useLocation();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const facultyId = new URLSearchParams(window.location.search).get("id");
    if (facultyId) {
      const found = mockFaculty.find((f) => f.id === facultyId);
      setFaculty(found || null);
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

  if (!faculty) {
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
        <p className="text-muted-foreground">Faculty not found</p>
      </div>
    );
  }

  const statusInfo = statusConfig[faculty.status];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back-faculty"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{faculty.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={statusInfo.badge} className="capitalize">
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: statusInfo.color }}
                    />
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Department Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Department</span>
                </div>
                <p className="text-lg font-semibold ml-7">{faculty.department}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">Current Status</span>
                </div>
                <p className="text-lg font-semibold ml-7 capitalize">{statusInfo.label}</p>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Information
              </h3>

              <div className="space-y-3 ml-7">
                {/* Email */}
                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Official Email</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-base font-medium break-all">{faculty.email}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        window.location.href = `mailto:${faculty.email}`;
                      }}
                      data-testid="button-email-faculty"
                    >
                      Send Email
                    </Button>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-base font-medium">{faculty.phone}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        window.location.href = `tel:${faculty.phone}`;
                      }}
                      data-testid="button-call-faculty"
                    >
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours Section */}
            <div className="border-t pt-6 space-y-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Office Hours & Availability
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {faculty.status === "available" && (
                    <span>Dr. {faculty.name.split(" ").pop()} is currently available for consultation.</span>
                  )}
                  {faculty.status === "busy" && (
                    <span>Dr. {faculty.name.split(" ").pop()} is currently in class. Try emailing or calling during office hours.</span>
                  )}
                  {faculty.status === "offline" && (
                    <span>Dr. {faculty.name.split(" ").pop()} is currently offline. Please reach out via email or phone.</span>
                  )}
                </p>
                <p className="text-muted-foreground mt-2">
                  Office location: {faculty.department} Department, RNSIT Campus
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t pt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1"
                onClick={() => {
                  window.location.href = `mailto:${faculty.email}`;
                }}
                data-testid="button-send-message"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  window.location.href = `tel:${faculty.phone}`;
                }}
                data-testid="button-call-phone"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
