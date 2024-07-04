import { db } from "@/db";
import { Profile, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createProfile(
    userId: string,
    name: string,
    image?: string,
    trx = db
) {
    const [profile] = await trx
        .insert(profiles)
        .values({
            userId,
            image,
            name,
        })
        .onConflictDoNothing()
        .returning();

    return profile;
}

export async function updateProfile(
    userId: string,
    updatedProfile: Partial<Profile>,
    trx = db
) {
    await trx
        .update(profiles)
        .set(updatedProfile)
        .where(eq(profiles.userId, userId));
}

export async function getProfile(userId: string) {
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, userId),
    });

    return profile;
}
