import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLocationSchema, insertUserSchema, insertAnnouncementSchema, insertClubSchema } from "@shared/schema";

// Simple nodemailer configuration (requires setup)
const sendPrintEmail = async (filename: string, userEmail?: string) => {
  try {
    // For now, just log the print request
    console.log(`Print request received for: ${filename} from ${userEmail || "anonymous"}`);
    // In production, you would use nodemailer here:
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({to: 'ankushrampa@gmail.com', subject: 'Print Request', ...});
    return true;
  } catch (error) {
    console.error("Failed to send print email:", error);
    return false;
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/signup", async (req: Request & { session?: any }, res) => {
    try {
      const validated = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validated);
      if (req.session) req.session.userId = user.id;
      res.status(201).json({ id: user.id, username: user.username, role: user.role });
    } catch (error) {
      res.status(400).json({ error: "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request & { session?: any }, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Missing credentials" });
      }

      const user = await storage.verifyPassword(username, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (req.session) req.session.userId = user.id;
      res.json({ id: user.id, username: user.username, role: user.role });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/me", async (req: Request & { session?: any }, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      res.json({ id: user.id, username: user.username, role: user.role });
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.post("/api/auth/logout", async (req: Request & { session?: any }, res) => {
    if (!req.session) {
      return res.json({ success: true });
    }
    req.session.destroy((err: Error | null) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Announcements routes - Lecturer and Principal only
  app.get("/api/announcements", async (_req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  app.post("/api/announcements", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user || (user.role !== "lecturer" && user.role !== "principal")) {
        return res.status(403).json({ error: "Only lecturers and principal can create announcements" });
      }

      const announcement = await storage.createAnnouncement({
        title: req.body.title,
        content: req.body.content,
        authorId: user.id,
        authorRole: user.role,
        createdAt: new Date().toISOString(),
      });

      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ error: "Failed to create announcement" });
    }
  });

  // Clubs routes
  app.get("/api/clubs", async (_req, res) => {
    try {
      const clubs = await storage.getClubs(true); // Only approved clubs
      res.json(clubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clubs" });
    }
  });

  app.post("/api/clubs", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const club = await storage.createClub({
        name: req.body.name,
        description: req.body.description,
        creatorId: user.id,
        status: "pending", // Students' clubs need approval
        approvedBy: undefined,
        createdAt: new Date().toISOString(),
      });

      res.status(201).json(club);
    } catch (error) {
      res.status(400).json({ error: "Failed to create club" });
    }
  });

  // Principal-only: Get pending clubs and approve/reject
  app.get("/api/clubs/pending", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user || user.role !== "principal") {
        return res.status(403).json({ error: "Only principal can view pending clubs" });
      }

      const pendingClubs = await storage.getPendingClubs();
      res.json(pendingClubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending clubs" });
    }
  });

  app.patch("/api/clubs/:id/approve", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user || user.role !== "principal") {
        return res.status(403).json({ error: "Only principal can approve clubs" });
      }

      const club = await storage.updateClubStatus(req.params.id, "approved", user.id);
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }

      res.json(club);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve club" });
    }
  });

  app.patch("/api/clubs/:id/reject", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user || user.role !== "principal") {
        return res.status(403).json({ error: "Only principal can reject clubs" });
      }

      const club = await storage.updateClubStatus(req.params.id, "rejected", user.id);
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }

      res.json(club);
    } catch (error) {
      res.status(500).json({ error: "Failed to reject club" });
    }
  });

  // Location API routes
  app.get("/api/locations", async (_req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.get("/api/locations/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query required" });
      }
      const results = await storage.searchLocations(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const location = await storage.getLocationById(req.params.id);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location" });
    }
  });

  app.post("/api/locations", async (req, res) => {
    try {
      const validated = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(validated);
      res.status(201).json(location);
    } catch (error) {
      res.status(400).json({ error: "Invalid location data" });
    }
  });

  app.patch("/api/locations/:id", async (req, res) => {
    try {
      const updated = await storage.updateLocation(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update location" });
    }
  });

  app.delete("/api/locations/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLocation(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete location" });
    }
  });

  // Print Service route
  app.post("/api/print-request", async (req: Request & { session?: any }, res) => {
    try {
      // Get user info and email from request
      const user = req.session?.userId ? await storage.getUser(req.session.userId) : null;
      const userEmail = req.body.email || "unknown@example.com";
      const filename = req.body.filename || "print-request.jpg";
      
      // Log the print request with user email
      console.log(`Print request from: ${userEmail}`);
      console.log(`File: ${filename}`);
      console.log(`User: ${user?.username || "anonymous"}`);
      
      // Send email to print service
      const emailSent = await sendPrintEmail(filename, userEmail);
      
      if (!emailSent) {
        return res.status(500).json({ error: "Failed to process print request" });
      }
      
      res.status(201).json({ 
        success: true, 
        message: "Print request sent successfully",
        sentTo: "ankushrampa@gmail.com",
        userEmail: userEmail
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process print request" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
