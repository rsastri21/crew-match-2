import { db } from "@/db";
import { accounts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import crypto from "crypto";
import { hashPassword } from "./utils";

export async function createAccount(
    userId: string,
    password: string,
    trx = db
) {
    const salt = crypto.randomBytes(128).toString("base64");
    const hash = await hashPassword(password, salt);
    const [account] = await trx
        .insert(accounts)
        .values({
            userId,
            accountType: "email",
            password: hash,
            salt,
        })
        .returning();

    return account;
}

export async function getAccountByUserId(userId: string) {
    const account = await db.query.accounts.findFirst({
        where: eq(accounts.userId, userId),
    });

    return account;
}

export async function updatePassword(
    userId: string,
    password: string,
    trx = db
) {
    const salt = crypto.randomBytes(128).toString("base64");
    const hash = await hashPassword(password, salt);
    await trx
        .update(accounts)
        .set({
            password: hash,
            salt,
        })
        .where(
            and(eq(accounts.userId, userId), eq(accounts.accountType, "email"))
        );
}
