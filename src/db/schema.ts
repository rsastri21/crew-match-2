import {
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", [
    "google",
    "slack",
    "email",
]);

export const roleEnum = pgEnum("role", ["user", "production_head", "admin"]);

export const users = pgTable("user", {
    id: text("id").primaryKey(),
    email: text("email").unique(),
    emailVerified: timestamp("email_verified", {
        withTimezone: true,
        mode: "date",
    }),
    role: roleEnum("role").notNull().default("user"),
});

export const accounts = pgTable("accounts", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .unique()
        .notNull(),
    accountType: accountTypeEnum("account_type").notNull(),
    googleId: text("google_id").unique(),
    slackId: text("slack_id").unique(),
    password: text("password"),
    salt: text("salt"),
});

export const profiles = pgTable("profiles", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .unique()
        .notNull(),
    name: varchar("name", { length: 256 }),
    imageId: text("image_id"),
    image: text("image"),
    pronouns: varchar("pronouns", { length: 256 }),
});

export const sessions = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export const resetTokens = pgTable("reset_tokens", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .unique()
        .notNull(),
    token: text("token"),
    tokenExpiresAt: timestamp("token_expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export const verifyEmailTokens = pgTable("verify_email_tokens", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .unique()
        .notNull(),
    token: text("token"),
    tokenExpiresAt: timestamp("token_expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
