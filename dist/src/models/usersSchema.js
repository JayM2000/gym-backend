"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDetails = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    clerkId: (0, pg_core_1.text)("clerk_id").unique().notNull(),
    name: (0, pg_core_1.text)("name").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
}, (t) => [(0, pg_core_1.uniqueIndex)("clerk_id_idx").on(t.clerkId)]);
exports.userDetails = (0, pg_core_1.pgTable)("userDetails", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    email: (0, pg_core_1.text)("email").unique().notNull(),
    name: (0, pg_core_1.text)("name").notNull(),
    surname: (0, pg_core_1.text)("surname"),
    phoneNumber: (0, pg_core_1.text)("phone").unique(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    password: (0, pg_core_1.text)("password").notNull()
}, (t) => [(0, pg_core_1.uniqueIndex)("mobile_idx").on(t.phoneNumber), (0, pg_core_1.uniqueIndex)("emailId_idx").on(t.email)]);
