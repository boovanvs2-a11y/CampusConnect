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
    const defaultLocations: Array<Location & {}> = [
      {
        id: "1",
        name: "Central Library",
        type: "library",
        latitude: 12.9716,
        longitude: 77.5946,
        address: "Main Campus, Block A",
        phone: "+91-80-6625-2000",
        website: "https://www.rnsit.ac.in",
      },
      {
        id: "2",
        name: "Student Canteen",
        type: "food",
        latitude: 12.9717,
        longitude: 77.5947,
        address: "Central Area",
        phone: "+91-80-6625-2001",
        website: null,
      },
      {
        id: "3",
        name: "Computer Science Block",
        type: "building",
        latitude: 12.9715,
        longitude: 77.5945,
        address: "Block C, 3rd Floor",
        phone: "+91-80-6625-2050",
        website: null,
      },
      {
        id: "4",
        name: "Sports Complex",
        type: "sports",
        latitude: 12.9718,
        longitude: 77.5948,
        address: "Sports Field Area",
        phone: "+91-80-6625-2100",
        website: null,
      },
      {
        id: "5",
        name: "Academic Block A",
        type: "building",
        latitude: 12.9714,
        longitude: 77.5944,
        address: "Main Building",
        phone: "+91-80-6625-2200",
        website: null,
      },
      {
        id: "6",
        name: "Open Air Theatre",
        type: "building",
        latitude: 12.9719,
        longitude: 77.5949,
        address: "Central Campus",
        phone: null,
        website: null,
      },
    ];

    defaultLocations.forEach((loc) => {
      this.locations.set(loc.id, loc as Location);
    });
  }

  private initializeDefaultUsers() {
    const demoUser: User = {
      id: "demo-user",
      username: "student",
      password: "password",
    };
    this.users.set("demo-user", demoUser);
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
