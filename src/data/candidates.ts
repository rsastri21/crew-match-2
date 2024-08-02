import { db } from "@/db";
import { Candidate, candidates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createCandidate(
    name: string,
    userId: string,
    isActing: boolean,
    prioritizeProductions: boolean,
    yearsInUW?: number,
    quartersInLUX?: number,
    interestedProductions?: string[],
    interestedRoles?: string[]
) {
    const [candidate] = await db
        .insert(candidates)
        .values({
            name,
            userId,
            isActing,
            prioritizeProductions,
            yearsInUW,
            quartersInLUX,
            interestedProductions,
            interestedRoles,
        })
        .returning();
    return candidate;
}

export async function updateCandidate(
    candidateId: number,
    updatedCandidate: Partial<Candidate>
) {
    const [candidate] = await db
        .update(candidates)
        .set(updatedCandidate)
        .where(eq(candidates.id, candidateId))
        .returning();
    return candidate;
}

export async function deleteCandidate(candidateId: number) {
    await db.delete(candidates).where(eq(candidates.id, candidateId));
}
