import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role").notNull().default("student"), // student, lecturer, principal
});

export const studentProfiles = pgTable("student_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  semester: integer("semester").notNull(),
  branch: text("branch").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: varchar("type").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  address: text("address"),
  phone: text("phone"),
  website: text("website"),
});

export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").notNull(),
  authorRole: varchar("author_role").notNull(), // lecturer or principal
  createdAt: text("created_at").notNull(),
});

export const clubs = pgTable("clubs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  banner: text("banner"),
  category: text("category"),
  creatorId: varchar("creator_id").notNull(),
  status: varchar("status").notNull().default("pending"), // pending, approved, rejected
  approvedBy: varchar("approved_by"),
  isSetup: boolean("is_setup").notNull().default(false),
  createdAt: text("created_at").notNull(),
});

export const clubMembers = pgTable("club_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clubId: varchar("club_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: varchar("role").notNull().default("member"), // member, moderator, head
  joinedAt: text("joined_at").notNull(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  banner: text("banner"),
  date: text("date").notNull(),
  time: text("time"),
  location: text("location"),
  organizerId: varchar("organizer_id").notNull(),
  createdAt: text("created_at").notNull(),
});

export const eventAttendees = pgTable("event_attendees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull(),
  userId: varchar("user_id").notNull(),
  registeredAt: text("registered_at").notNull(),
});

export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subject: text("subject"),
  content: text("content"),
  creatorId: varchar("creator_id").notNull(),
  createdAt: text("created_at").notNull(),
});

export const clubMessages = pgTable("club_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clubId: varchar("club_id").notNull(),
  userId: varchar("user_id").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});

export const studentProjects = pgTable("student_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  createdAt: text("created_at").notNull(),
});

export const printRequests = pgTable("print_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  email: text("email").notNull(),
  filename: text("filename").notNull(),
  createdAt: text("created_at").notNull(),
});

export const whatsappGroups = pgTable("whatsapp_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupName: text("group_name").notNull(),
  members: text("members").notNull(), // JSON stringified array of {name, summary}
  createdAt: text("created_at").notNull(),
});

export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull(),
  content: text("content").notNull(),
  image: text("image"),
  likes: integer("likes").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertStudentProfileSchema = createInsertSchema(studentProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
});

export const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
});

export const insertClubMemberSchema = createInsertSchema(clubMembers).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const insertEventAttendeeSchema = createInsertSchema(eventAttendees).omit({
  id: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
});

export const insertClubMessageSchema = createInsertSchema(clubMessages).omit({
  id: true,
});

export const insertStudentProjectSchema = createInsertSchema(studentProjects).omit({
  id: true,
});

export const insertPrintRequestSchema = createInsertSchema(printRequests).omit({
  id: true,
});

export const insertWhatsappGroupSchema = createInsertSchema(whatsappGroups).omit({
  id: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  likes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type Location = typeof locations.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type Club = typeof clubs.$inferSelect;
export type ClubMember = typeof clubMembers.$inferSelect;
export type Event = typeof events.$inferSelect;
export type EventAttendee = typeof eventAttendees.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type ClubMessage = typeof clubMessages.$inferSelect;
export type StudentProject = typeof studentProjects.$inferSelect;
export type PrintRequest = typeof printRequests.$inferSelect;
export type WhatsappGroup = typeof whatsappGroups.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
