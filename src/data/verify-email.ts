import { generateRandomToken } from "@/data/utils";
import { db } from "@/db";
import { verifyEmailTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export const TOKEN_LENGTH = 32;
export const TOKEN_TTL = 1000 * 60 * 5; // 5 minutes

export async function createVerifyEmailToken(userId: string) {
    const token = await generateRandomToken(TOKEN_LENGTH);
    const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

    await db
        .insert(verifyEmailTokens)
        .values({
            userId,
            token,
            tokenExpiresAt,
        })
        .onConflictDoUpdate({
            target: verifyEmailTokens.id,
            set: {
                token,
                tokenExpiresAt,
            },
        });

    return token;
}

export async function getVerifyEmailToken(token: string) {
    const existingToken = await db.query.verifyEmailTokens.findFirst({
        where: eq(verifyEmailTokens.token, token),
    });

    return existingToken;
}

export async function deleteVerifyEmailToken(token: string, trx = db) {
    await trx
        .delete(verifyEmailTokens)
        .where(eq(verifyEmailTokens.token, token));
}
