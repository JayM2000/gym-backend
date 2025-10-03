import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);

export const userDetails = pgTable(
  "userDetails",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").unique().notNull(),
    name: text("name").notNull(),
    surname: text("surname"),
    phoneNumber: text("phone").unique(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    password: text("password").notNull()
  },
  (t) => [uniqueIndex("mobile_idx").on(t.phoneNumber), uniqueIndex("emailId_idx").on(t.email)]
);

export const trainersTable = pgTable(
  "trainers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    image: text("image").notNull(),
    specialization: text("specialization").notNull(),
    experience: text("experience").notNull(),
    bio: text("bio").notNull()
  }
);

