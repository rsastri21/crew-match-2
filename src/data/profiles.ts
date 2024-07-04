import { db } from "@/db";
import { Profile, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createProfile(
    userId: string,
    name: string,
    image = `https://api.dicebear.com/9.x/initials/svg?seed=${name}`
) {
    const [profile] = await db
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
    updatedProfile: Partial<Profile>
) {
    await db
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
