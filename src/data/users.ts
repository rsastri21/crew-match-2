import { db } from "@/db";
import { User, accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { getAccountByUserId } from "./accounts";
import { hashPassword } from "./utils";

const MAGIC_LINK_TOKEN_TTL = 1000 * 60 * 5; // 5 min
const ENTROPY_SIZE = 10;

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
            profile: true,
        },
    });

    return user;
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
