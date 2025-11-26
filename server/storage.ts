import { type User, type InsertUser, type Location, type InsertLocation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  verifyPassword(username: string, password: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getLocations(): Promise<Location[]>;
  getLocationById(id: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: string): Promise<boolean>;
  searchLocations(query: string): Promise<Location[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private locations: Map<string, Location>;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.initializeDefaultLocations();
    this.initializeDefaultUsers();
  }

  private initializeDefaultLocations() {
    // Real RNSIT Kengeri Campus Locations (Bangalore)
    // Main Campus: 12.90179, 77.51838
    // Campus is 170 acres, so locations are spread within reasonable walking distances
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
    // Demo accounts for different roles
    const demoUsers: User[] = [
      {
        id: "student-demo",
        username: "1RN21CS001",
        password: "student123",
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocationById(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = randomUUID();
    const location: Location = { ...insertLocation, id } as Location;
    this.locations.set(id, location);
    return location;
  }

  async updateLocation(
    id: string,
    updates: Partial<InsertLocation>,
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
}

export const storage = new MemStorage();
