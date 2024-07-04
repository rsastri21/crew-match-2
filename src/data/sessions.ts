import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteSessionForUser(userId: string, trx = db) {
    await trx.delete(sessions).where(eq(sessions.userId, userId));
}
