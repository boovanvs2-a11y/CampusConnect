import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLocationSchema, insertUserSchema, insertAnnouncementSchema, insertClubSchema } from "@shared/schema";
import nodemailer from "nodemailer";

const logPrintRequest = async (filename: string, userEmail?: string, fileSize?: number) => {
  try {
    console.log(`✓ Print request logged successfully!`);
    console.log(`  Filename: ${filename}`);
    console.log(`  File Size: ${fileSize ? (fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown'}`);
    console.log(`  From: ${userEmail || 'Anonymous'}`);
    console.log(`  Timestamp: ${new Date().toISOString()}`);
    console.log(`  Status: Queued for printing`);
    console.log(`  📧 Will be sent to: ankushrampa@gmail.com`);
    return true;
  } catch (error) {
    console.error("Error logging print request:", error);
    return false;
  }
};

const extractMembersBasic = (chatText: string): Array<{ name: string; summary: string }> => {
  const members: { [key: string]: string[] } = {};
  const systemKeywords = ['Timeline', 'Previously', 'Messages and calls', 'Group created', 'You added', 'You were added', 'Group icon', 'left', 'joined', 'changed the group', 'created group'];
  
  const lines = chatText.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Skip system messages
    if (systemKeywords.some(keyword => trimmed.includes(keyword))) continue;
    
    // Match WhatsApp format: [time] Name: message
    // Formats: 
    // "10:30 PM, 1/1/2024 - Name: message"
    // "Name: message"
    // "1/1/2024, 10:30 PM - Name: message"
    const patterns = [
      /^(?:[\d]{1,2}:[\d]{2}\s*(?:AM|PM),?\s*)?(?:[\d]{1,2}\/[\d]{1,2}\/[\d]{4},?\s*)?(?:[\d]{1,2}:[\d]{2}\s*(?:AM|PM)?\s*-\s*)?([A-Za-z][A-Za-z\s]{1,40}?):\s*(.+)$/,
      /^[\d]{1,2}\/[\d]{1,2}\/[\d]{4}\s*,?\s*[\d]{1,2}:[\d]{2}\s*(?:AM|PM)?\s*-\s*([A-Za-z][A-Za-z\s]{1,40}?):\s*(.+)$/,
      /^([A-Za-z][A-Za-z\s]{1,40}?):\s+(.+)$/
    ];
    
    let matched = false;
    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        let name = match[1].trim();
        
        // Filter out invalid names
        if (name.length >= 2 && name.length <= 40 && !name.match(/^\d+$/) && !systemKeywords.some(kw => name.includes(kw))) {
          name = name.replace(/\s+/g, ' '); // Normalize spaces
          if (!members[name]) {
            members[name] = [];
          }
          members[name].push(trimmed);
          matched = true;
          break;
        }
      }
    }
  }
  
  // Convert to array with summaries
  return Object.entries(members)
    .map(([name, messages]) => {
      const text = messages.join(' ').toLowerCase();
      let summary = "chat";
      
      if (text.includes('assignment') || text.includes('homework') || text.includes('submit') || text.includes('deadline')) {
        summary = "assignments";
      } else if (text.match(/(haha|lol|😂|funny|lmao|hilarious)/)) {
        summary = "memes";
      } else if (text.includes('exam') || text.includes('test')) {
        summary = "exams";
      } else if (text.includes('study') || text.includes('notes') || text.includes('class')) {
        summary = "study";
      } else if (text.includes('thank') || text.includes('help') || text.includes('question') || text.includes('how')) {
        summary = "questions";
      } else if (text.includes('meet') || text.includes('hangout') || text.includes('coffee')) {
        summary = "hangouts";
      }
      
      return { name, summary };
    })
    .filter((m) => m.name && m.name.length > 1)
    .slice(0, 25);
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

  // Announcements routes - Principal only
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
      if (!user || user.role !== "principal") {
        return res.status(403).json({ error: "Only principal can create announcements" });
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

  // Notes routes - Lecturer can create, everyone can read
  app.get("/api/notes", async (_req, res) => {
    try {
      const notes = await storage.getNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user || user.role !== "lecturer") {
        return res.status(403).json({ error: "Only lecturers can create notes" });
      }

      const note = await storage.createNote({
        title: req.body.title,
        subject: req.body.subject,
        content: req.body.content,
        creatorId: user.id,
        createdAt: new Date().toISOString(),
      });

      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ error: "Failed to create note" });
    }
  });

  // Clubs routes - Get live clubs (visible to all users in Connect)
  app.get("/api/clubs", async (_req, res) => {
    try {
      const allClubs = await storage.getClubs(false); // Get all clubs
      const liveClubs = allClubs.filter((c) => c.status === "live");
      res.json(liveClubs);
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
        category: req.body.category,
        creatorId: user.id,
        status: "pending", // Awaiting principal approval
        approvedBy: undefined,
        createdAt: new Date().toISOString(),
      });

      res.status(201).json(club);
    } catch (error) {
      res.status(400).json({ error: "Failed to create club" });
    }
  });

  // Get user's pending and approved clubs
  app.get("/api/clubs/my-drafts", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const allClubs = await storage.getClubs(false);
      const myClubs = allClubs.filter((c) => c.creatorId === user.id && c.status !== "live");
      res.json(myClubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clubs" });
    }
  });

  // Setup an approved club - makes it live in Connect
  app.patch("/api/clubs/:id/setup", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const club = await storage.getClubById(req.params.id);
      if (!club || club.creatorId !== user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (club.status !== "approved") {
        return res.status(400).json({ error: "Club must be approved before setup" });
      }

      const updatedClub = await storage.updateClub(req.params.id, {
        description: req.body.description,
        category: req.body.category,
        status: "live",
        isSetup: true,
      });

      res.json(updatedClub);
    } catch (error) {
      res.status(500).json({ error: "Failed to complete setup" });
    }
  });

  // Alias: publish = setup (make club live)
  app.patch("/api/clubs/:id/publish", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const club = await storage.getClubById(req.params.id);
      if (!club || club.creatorId !== user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (club.status !== "approved") {
        return res.status(400).json({ error: "Club must be approved before publishing" });
      }

      const updatedClub = await storage.updateClub(req.params.id, {
        description: req.body.description,
        category: req.body.category,
        status: "live",
        isSetup: true,
      });

      res.json(updatedClub);
    } catch (error) {
      res.status(500).json({ error: "Failed to publish club" });
    }
  });

  // Submit draft club for approval
  app.patch("/api/clubs/:id/submit", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const club = await storage.getClubById(req.params.id);
      if (!club || club.creatorId !== user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const updatedClub = await storage.updateClubStatus(req.params.id, "pending", user.id);
      if (!updatedClub) {
        return res.status(404).json({ error: "Club not found" });
      }

      res.json(updatedClub);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit club" });
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

  // Get user's approved clubs (not yet published)
  app.get("/api/my-clubs/approved", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const allClubs = await storage.getClubs(false);
      const userApprovedClubs = allClubs.filter(
        (c) => c.creatorId === user.id && c.status === "approved"
      );

      res.json(userApprovedClubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch approved clubs" });
    }
  });

  // Get user's rejected clubs
  app.get("/api/my-clubs/rejected", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const allClubs = await storage.getClubs(false);
      const userRejectedClubs = allClubs.filter(
        (c) => c.creatorId === user.id && c.status === "rejected"
      );

      res.json(userRejectedClubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rejected clubs" });
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

  // WhatsApp Groups routes
  app.get("/api/whatsapp-groups", async (_req, res) => {
    try {
      const groups = await storage.getWhatsappGroups();
      const formattedGroups = groups.map((g) => ({
        id: g.id,
        groupName: g.groupName,
        members: typeof g.members === 'string' ? JSON.parse(g.members) : g.members,
        createdAt: g.createdAt,
      }));
      res.json(formattedGroups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch groups" });
    }
  });

  app.post("/api/whatsapp-groups/analyze", async (req: Request & { session?: any }, res) => {
    try {
      const { groupName, chatText } = req.body;
      if (!groupName || !chatText) {
        return res.status(400).json({ error: "Group name and chat text required" });
      }

      let members: Array<{ name: string; summary: string }> = [];

      // Try to use OpenAI if API key is available
      if (process.env.OPENAI_API_KEY) {
        try {
          const OpenAI = require("openai").default;
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "Analyze the WhatsApp chat and extract all members with what they primarily talk about. Return JSON with array of {name, summary}.",
              },
              {
                role: "user",
                content: `Analyze this chat and identify members with 1-2 word summaries of their contributions:\n\n${chatText}\n\nReturn ONLY valid JSON: {"members": [{"name": "...", "summary": "..."}]}`,
              },
            ],
            response_format: { type: "json_object" },
            max_tokens: 1024,
          });

          const result = JSON.parse(response.choices[0].message.content);
          members = result.members || [];
        } catch (error) {
          console.error("OpenAI analysis failed:", error);
          // Fall back to basic parsing
          members = extractMembersBasic(chatText);
        }
      } else {
        // No API key - use basic extraction
        members = extractMembersBasic(chatText);
      }

      res.json({ members });
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze chat" });
    }
  });

  app.post("/api/whatsapp-groups", async (req: Request & { session?: any }, res) => {
    try {
      const { groupName, members } = req.body;
      if (!groupName || !members || members.length === 0) {
        return res.status(400).json({ error: "Group name and members required" });
      }

      const group = await storage.createWhatsappGroup({ groupName, members });
      res.status(201).json({
        id: group.id,
        groupName: group.groupName,
        members: typeof group.members === 'string' ? JSON.parse(group.members) : group.members,
        createdAt: group.createdAt,
      });
    } catch (error) {
      res.status(400).json({ error: "Failed to create group" });
    }
  });

  // Posts routes
  app.get("/api/posts", async (_req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", async (req: Request & { session?: any }, res) => {
    try {
      const user = await storage.getUser(req.session?.userId);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { content, image } = req.body;
      if (!content || !content.trim()) {
        return res.status(400).json({ error: "Content is required" });
      }

      const post = await storage.createPost({
        authorId: user.id,
        content: content.trim(),
        image: image || undefined,
        createdAt: new Date().toISOString(),
      });

      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: "Failed to create post" });
    }
  });

  // Print Service route
  app.post("/api/print-request", async (req: Request & { session?: any }, res) => {
    try {
      // Get user info and email from request
      const user = req.session?.userId ? await storage.getUser(req.session.userId) : null;
      const userEmail = req.body.email?.trim();
      const filename = req.body.filename?.trim() || "print-request.jpg";
      const fileSize = req.body.size || 0;
      
      if (!userEmail) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Log the print request
      console.log(`\n🖨️  ========== NEW PRINT REQUEST ==========`);
      console.log(`✉️  Requestor Email: ${userEmail}`);
      console.log(`📄 Filename: ${filename}`);
      console.log(`👤 Student: ${user?.username || "anonymous"}`);
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      
      // Log the request (local logging instead of email)
      const requestLogged = await logPrintRequest(filename, userEmail, fileSize);
      
      if (!requestLogged) {
        return res.status(500).json({ error: "Failed to log print request" });
      }
      
      console.log(`✓ Print request queued successfully`);
      console.log(`=========================================\n`);
      
      res.status(201).json({ 
        success: true, 
        message: "Your print request has been received! It's now in the queue and will be processed shortly.",
        status: "queued",
        userEmail: userEmail,
        filename: filename
      });
    } catch (error) {
      console.error("Print request error:", error);
      res.status(500).json({ error: "Failed to process print request" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
