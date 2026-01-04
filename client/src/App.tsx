import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LoginModal } from "@/components/LoginModal";
import Home from "@/pages/Home";
import ClubDetail from "@/pages/ClubDetail";
import EventDetail from "@/pages/EventDetail";
import FacultyDetail from "@/pages/FacultyDetail";
import NoteDetail from "@/pages/NoteDetail";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/club" component={ClubDetail} />
      <Route path="/event" component={EventDetail} />
      <Route path="/faculty" component={FacultyDetail} />
      <Route path="/note" component={NoteDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; username: string; role: string } | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">CampusConnect</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoginModal
        open={!isLoggedIn}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setIsLoggedIn(true);
        }}
      />
      {isLoggedIn && user && <Router />}
      {isLoggedIn && <input type="hidden" id="user-data" value={JSON.stringify(user)} />}
      {isLoggedIn && <button id="logout-trigger" onClick={handleLogout} style={{ display: 'none' }} />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
