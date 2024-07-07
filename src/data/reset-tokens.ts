import { db } from "@/db";
import { generateRandomToken } from "./utils";
import { TOKEN_LENGTH, TOKEN_TTL } from "./verify-email";
import { resetTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createPasswordResetToken(userId: string) {
    const token = await generateRandomToken(TOKEN_LENGTH);
    const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

    await db.delete(resetTokens).where(eq(resetTokens.userId, userId));
    await db.insert(resetTokens).values({
        userId,
        token,
        tokenExpiresAt,
    });

    return token;
}

export async function getPasswordResetToken(token: string) {
    const existingToken = await db.query.resetTokens.findFirst({
        where: eq(resetTokens.token, token),
    });

    return existingToken;
}

export async function deletePasswordResetToken(token: string) {
    await db.delete(resetTokens).where(eq(resetTokens.token, token));
}
