import { db } from "@/db";
import { Candidate, candidates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createCandidate(
    name: string,
    userId: string | null,
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

export async function getCandidateAssignments(userId: string) {
    const candidate = await db.query.candidates.findFirst({
        where: eq(candidates.userId, userId),
        with: {
            roles: true,
        },
    });
    return candidate?.roles ?? [];
}

export async function getCandidateByUserId(userId: string) {
    const candidate = await db.query.candidates.findFirst({
        where: eq(candidates.userId, userId),
    });

    return candidate;
}

export async function getCandidateByName(name: string) {
    const candidate = await db.query.candidates.findFirst({
        where: eq(candidates.name, name),
    });

    return candidate;
}

export async function deleteCandidate(candidateId: number) {
    await db.delete(candidates).where(eq(candidates.id, candidateId));
}
