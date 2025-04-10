import { db } from "@/db";
import { User, users } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { getAccountByUserId } from "./accounts";
import { hashPassword } from "./utils";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

export type UserRow = {
    id: string;
    name: string;
    pronouns: string;
    email: string;
    image: string;
    verified: boolean;
    role: "production_head" | "user";
    isAdmin: boolean;
};

const ENTROPY_SIZE = 10;

const generateIdFromEntropySize = (size: number): string => {
    const buffer = crypto.getRandomValues(new Uint8Array(size));
    return encodeBase32LowerCaseNoPadding(buffer);
};

export async function deleteUser(userId: string, trx = db) {
    await trx.delete(users).where(eq(users.id, userId));
}

export async function createUser(email: string, role: any, trx = db) {
    const [user] = await trx
        .insert(users)
        .values({
            id: generateIdFromEntropySize(ENTROPY_SIZE),
            email,
            role,
        })
        .returning();
    return user;
}

export async function updateUser(
    userId: string,
    updatedUser: Partial<User>,
    trx = db
) {
    const [user] = await trx
        .update(users)
        .set(updatedUser)
        .where(eq(users.id, userId))
        .returning();
    return user;
}

export async function getUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    return user;
}

export async function getUserById(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    return user;
}

export async function getCompleteUserInfo(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            candidate: true,
            production: true,
            profile: true,
        },
    });

    return user;
}

export async function getAllUserProfiles() {
    const users = await db.query.users.findMany({
        with: {
            profile: true,
        },
    });

    return users;
}

export async function getUserCount() {
    return db.select({ count: count() }).from(users);
}

export async function setEmailVerified(userId: string, trx = db) {
    await trx
        .update(users)
        .set({
            emailVerified: new Date(),
        })
        .where(eq(users.id, userId));
}

export async function verifyPassword(email: string, plainTextPassword: string) {
    const user = await getUserByEmail(email);

    if (!user) {
        return false;
    }

    const account = await getAccountByUserId(user.id);

    if (!account) {
        return false;
    }

    const salt = account.salt;
    const savedPassword = account.password;

    if (!salt || !savedPassword) {
        return false;
    }

    const hash = await hashPassword(plainTextPassword, salt);
    return account.password === hash;
}
