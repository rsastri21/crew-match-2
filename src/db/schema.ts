import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
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

export const usersRelations = relations(users, ({ one }) => ({
    candidate: one(candidates),
    production: one(productions),
    profile: one(profiles),
}));

export const candidates = pgTable("candidates", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull().unique(),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "set null" })
        .unique(),
    yearsInUW: integer("years_in_uw").notNull().default(0),
    quartersInLUX: integer("quarters_in_lux").notNull().default(0),
    isActing: boolean("is_acting").notNull(),
    prioritizeProductions: boolean("prioritize_productions").notNull(),
    interestedProductions: text("interested_productions").array(),
    interestedRoles: text("interested_roles").array(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "date",
    })
        .notNull()
        .defaultNow(),
});

export const candidatesRelations = relations(candidates, ({ many, one }) => ({
    roles: many(roles),
    user: one(users, {
        fields: [candidates.userId],
        references: [users.id],
    }),
}));

export const productions = pgTable("productions", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .unique(),
    name: varchar("name", { length: 256 }).notNull(),
    genre: text("genre").notNull(),
    logline: text("logline").notNull(),
    logistics: text("logistics").notNull(),
    lookingFor: text("looking_for").notNull(),
    pitchLink: text("pitch_link").notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "date",
    })
        .notNull()
        .defaultNow(),
});

export const productionsRelations = relations(productions, ({ many, one }) => ({
    roles: many(roles),
    user: one(users, {
        fields: [productions.userId],
        references: [users.id],
    }),
}));

export const roles = pgTable("roles", {
    id: serial("id").primaryKey(),
    role: text("role").notNull(),
    production: text("production").notNull(),
    productionId: integer("production_id")
        .notNull()
        .references(() => productions.id, { onDelete: "cascade" }),
    candidateId: integer("candidate_id").references(() => candidates.id, {
        onDelete: "set null",
    }),
});

export const rolesRelations = relations(roles, ({ one }) => ({
    production: one(productions, {
        fields: [roles.productionId],
        references: [productions.id],
    }),
    candidate: one(candidates, {
        fields: [roles.candidateId],
        references: [candidates.id],
    }),
}));

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

export const profilesRelations = relations(profiles, ({ one }) => ({
    user: one(users, {
        fields: [profiles.userId],
        references: [users.id],
    }),
}));

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
export type Session = typeof sessions.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Candidate = typeof candidates.$inferSelect;
export type Production = typeof productions.$inferSelect;
export type UserWithCandidateProfile = User & {
    candidate: Candidate | null;
    production: Production | null;
    profile: Profile | null;
};
export type Role = typeof roles.$inferSelect;
export type RoleWithCandidateName = Role & {
    candidate: {
        name: string;
    } | null;
};
export type ProductionWithRoles = Production & {
    roles: RoleWithCandidateName[];
};
