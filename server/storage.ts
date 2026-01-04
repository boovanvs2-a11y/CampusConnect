import { type User, type InsertUser, type Location, type Announcement, type Club, type StudentProfile, type InsertStudentProfile, type ClubMember, type Event, type EventAttendee, type StudentProject, type Note, type WhatsappGroup, type Post, type InsertPost } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  verifyPassword(username: string, password: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getLocations(): Promise<Location[]>;
  getLocationById(id: string): Promise<Location | undefined>;
  createLocation(location: any): Promise<Location>;
  updateLocation(id: string, location: Partial<any>): Promise<Location | undefined>;
  deleteLocation(id: string): Promise<boolean>;
  searchLocations(query: string): Promise<Location[]>;
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: any): Promise<Announcement>;
  getNotes(): Promise<Note[]>;
  createNote(note: any): Promise<Note>;
  getClubs(onlyApproved?: boolean): Promise<Club[]>;
  getClubById(id: string): Promise<Club | undefined>;
  createClub(club: any): Promise<Club>;
  updateClubStatus(id: string, status: string, approvedBy?: string): Promise<Club | undefined>;
  updateClub(id: string, updates: Partial<Club>): Promise<Club | undefined>;
  getPendingClubs(): Promise<Club[]>;
  getStudentProfile(userId: string): Promise<StudentProfile | undefined>;
  getClubMembers(clubId: string): Promise<ClubMember[]>;
  getClubMessages(clubId: string): Promise<any[]>;
  getWhatsappGroups(): Promise<WhatsappGroup[]>;
  createWhatsappGroup(group: any): Promise<WhatsappGroup>;
  getPosts(): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private locations: Map<string, Location>;
  private announcements: Map<string, Announcement>;
  private notes: Map<string, Note>;
  private clubs: Map<string, Club>;
  private clubMembers: Map<string, ClubMember[]>;
  private clubMessages: Map<string, any[]>;
  private studentProfiles: Map<string, StudentProfile>;
  private whatsappGroups: Map<string, WhatsappGroup>;
  private posts: Map<string, Post>;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.announcements = new Map();
    this.notes = new Map();
    this.clubs = new Map();
    this.clubMembers = new Map();
    this.clubMessages = new Map();
    this.studentProfiles = new Map();
    this.whatsappGroups = new Map();
    this.posts = new Map();
    this.initializeDefaultLocations();
    this.initializeDefaultUsers();
    this.initializeDefaultAnnouncements();
  }

  private initializeDefaultLocations() {
    // Real RNSIT Kengeri Campus Locations
    const defaultLocations: Array<Location & {}> = [
      {
        id: "1",
        name: "Central Library",
        type: "library",
        latitude: 12.9017,
        longitude: 77.5192,
        address: "Main Building, RNSIT Campus",
        phone: "+91-80-2861-1880",
        website: "https://www.rnsit.ac.in",
      },
      {
        id: "2",
        name: "Student Cafeteria",
        type: "food",
        latitude: 12.9025,
        longitude: 77.5195,
        address: "Central Plaza, Near Main Gate",
        phone: "+91-80-2861-1885",
        website: null,
      },
      {
        id: "3",
        name: "Computer Science Department",
        type: "building",
        latitude: 12.9012,
        longitude: 77.5200,
        address: "CSE Block, Academic Building",
        phone: "+91-80-2861-1900",
        website: null,
      },
      {
        id: "4",
        name: "Sports Complex",
        type: "sports",
        latitude: 12.9010,
        longitude: 77.5175,
        address: "Ground & Court Area",
        phone: "+91-80-2861-1920",
        website: null,
      },
      {
        id: "5",
        name: "Main Academic Building",
        type: "building",
        latitude: 12.9022,
        longitude: 77.5188,
        address: "Main Building - Block A",
        phone: "+91-80-2861-1900",
        website: null,
      },
      {
        id: "6",
        name: "Auditorium",
        type: "building",
        latitude: 12.9008,
        longitude: 77.5192,
        address: "Central Auditorium Hall",
        phone: "+91-80-2861-1850",
        website: null,
      },
      {
        id: "7",
        name: "Main Entrance Gate",
        type: "building",
        latitude: 12.9030,
        longitude: 77.5185,
        address: "Uttarahalli-Kengeri Main Road",
        phone: "+91-80-2861-1880",
        website: null,
      },
      {
        id: "8",
        name: "Research & Development Lab",
        type: "building",
        latitude: 12.9015,
        longitude: 77.5170,
        address: "Advanced Research Zone",
        phone: "+91-80-2861-1930",
        website: null,
      },
      {
        id: "9",
        name: "Hostel Complex",
        type: "building",
        latitude: 12.8995,
        longitude: 77.5190,
        address: "Boys and Girls Hostels",
        phone: "+91-80-2861-1950",
        website: null,
      },
      {
        id: "10",
        name: "Engineering Labs",
        type: "building",
        latitude: 12.9020,
        longitude: 77.5205,
        address: "State-of-the-art Lab Facilities",
        phone: "+91-80-2861-1910",
        website: null,
      },
    ];

    defaultLocations.forEach((loc) => {
      this.locations.set(loc.id, loc as Location);
    });
  }

  private initializeDefaultUsers() {
    const demoUsers: User[] = [
      {
        id: "student-demo",
        username: "1RN21CS001",
        password: "student123",
        role: "student",
      },
      {
        id: "student-1",
        username: "1RN25EC014-T",
        password: "idk",
        role: "student",
      },
      {
        id: "student-2",
        username: "1RN25EC208-T",
        password: "idc",
        role: "student",
      },
      {
        id: "lecturer-demo",
        username: "RNSIT0001",
        password: "lecturer123",
        role: "lecturer",
      },
      {
        id: "principal-demo",
        username: "PRINCIPAL001",
        password: "principal123",
        role: "principal",
      },
    ];

    demoUsers.forEach((user) => {
      this.users.set(user.id, user);
    });
  }

  private initializeDefaultAnnouncements() {
    const defaultAnnouncements: Announcement[] = [
      {
        id: randomUUID(),
        title: "Winter Break",
        content: "Campus will be closed from Dec 20 - Jan 5",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        category: "holiday",
        authorId: "principal-demo",
        authorRole: "principal",
      },
      {
        id: randomUUID(),
        title: "Maintenance Work",
        content: "WiFi will be down on Dec 18, 9 PM - 12 AM",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: "maintenance",
        authorId: "principal-demo",
        authorRole: "principal",
      },
      {
        id: randomUUID(),
        title: "Sports Day",
        content: "Inter-class sports competition on Dec 22",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        category: "event",
        authorId: "principal-demo",
        authorRole: "principal",
      },
      {
        id: randomUUID(),
        title: "Library Notice",
        content: "New study materials added to central library",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        category: "notice",
        authorId: "principal-demo",
        authorRole: "principal",
      },
    ];

    defaultAnnouncements.forEach((announcement) => {
      this.announcements.set(announcement.id, announcement);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async verifyPassword(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id } as User;
    this.users.set(id, user);
    return user;
  }

  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocationById(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(insertLocation: any): Promise<Location> {
    const id = randomUUID();
    const location: Location = { ...insertLocation, id } as Location;
    this.locations.set(id, location);
    return location;
  }

  async updateLocation(
    id: string,
    updates: Partial<any>,
  ): Promise<Location | undefined> {
    const location = this.locations.get(id);
    if (!location) return undefined;
    const updated = { ...location, ...updates };
    this.locations.set(id, updated);
    return updated;
  }

  async deleteLocation(id: string): Promise<boolean> {
    return this.locations.delete(id);
  }

  async searchLocations(query: string): Promise<Location[]> {
    const lower = query.toLowerCase();
    return Array.from(this.locations.values()).filter(
      (loc) =>
        loc.name.toLowerCase().includes(lower) ||
        loc.type.toLowerCase().includes(lower) ||
        (loc.address && loc.address.toLowerCase().includes(lower)),
    );
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values());
  }

  async createAnnouncement(announcement: any): Promise<Announcement> {
    const id = randomUUID();
    const newAnnouncement: Announcement = { ...announcement, id } as Announcement;
    this.announcements.set(id, newAnnouncement);
    return newAnnouncement;
  }

  async getClubs(onlyApproved = false): Promise<Club[]> {
    const clubs = Array.from(this.clubs.values());
    return onlyApproved ? clubs.filter((c) => c.status === "approved") : clubs;
  }

  async getClubById(id: string): Promise<Club | undefined> {
    return this.clubs.get(id);
  }

  async createClub(club: any): Promise<Club> {
    const id = randomUUID();
    const newClub: Club = { ...club, id } as Club;
    this.clubs.set(id, newClub);
    return newClub;
  }

  async updateClubStatus(id: string, status: string, approvedBy?: string): Promise<Club | undefined> {
    const club = this.clubs.get(id);
    if (!club) return undefined;
    const updated = { ...club, status, approvedBy: approvedBy || club.approvedBy };
    this.clubs.set(id, updated);
    return updated;
  }

  async updateClub(id: string, updates: Partial<Club>): Promise<Club | undefined> {
    const club = this.clubs.get(id);
    if (!club) return undefined;
    const updated = { ...club, ...updates };
    this.clubs.set(id, updated);
    return updated;
  }

  async getPendingClubs(): Promise<Club[]> {
    return Array.from(this.clubs.values()).filter((c) => c.status === "pending");
  }

  async getStudentProfile(userId: string): Promise<StudentProfile | undefined> {
    return this.studentProfiles.get(userId);
  }

  async getClubMembers(clubId: string): Promise<ClubMember[]> {
    return this.clubMembers.get(clubId) || [];
  }

  async getClubMessages(clubId: string): Promise<any[]> {
    return this.clubMessages.get(clubId) || [];
  }

  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }

  async createNote(note: any): Promise<Note> {
    const id = randomUUID();
    const newNote: Note = { ...note, id } as Note;
    this.notes.set(id, newNote);
    return newNote;
  }

  async getWhatsappGroups(): Promise<WhatsappGroup[]> {
    return Array.from(this.whatsappGroups.values());
  }

  async createWhatsappGroup(group: any): Promise<WhatsappGroup> {
    const id = randomUUID();
    const newGroup: WhatsappGroup = {
      id,
      groupName: group.groupName,
      members: JSON.stringify(group.members),
      createdAt: new Date().toISOString(),
    } as WhatsappGroup;
    this.whatsappGroups.set(id, newGroup);
    return newGroup;
  }

  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async createPost(post: InsertPost): Promise<Post> {
    const id = randomUUID();
    const newPost: Post = {
      id,
      authorId: post.authorId,
      content: post.content,
      image: post.image,
      likes: 0,
      createdAt: new Date().toISOString(),
    } as Post;
    this.posts.set(id, newPost);
    return newPost;
  }
}

export const storage = new MemStorage();
