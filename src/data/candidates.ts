import { db } from "@/db";
import { Candidate, candidates, Role, roles } from "@/db/schema";
import { count, eq, ilike, sql, and, isNull } from "drizzle-orm";

export type CandidateRow = {
    id: number;
    name: string;
    yearsInUW: number;
    quartersInLUX: number;
    status: "acting" | "assigned" | "available";
    interestedProductions: string[];
    interestedRoles: string[];
    roles: Role[];
};

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

export async function batchCreateCandidates(
    candidatesToInsert: Omit<
        Candidate,
        "id" | "createdAt" | "updatedAt" | "userId"
    >[]
) {
    const insertedCandidates = await db
        .insert(candidates)
        .values(candidatesToInsert)
        .onConflictDoUpdate({
            target: candidates.name,
            set: {
                isActing: sql`excluded.is_acting`,
                prioritizeProductions: sql`excluded.prioritize_productions`,
                yearsInUW: sql`excluded.years_in_uw`,
                quartersInLUX: sql`excluded.quarters_in_lux`,
                interestedProductions: sql`excluded.interested_productions`,
                interestedRoles: sql`excluded.interested_roles`,
                updatedAt: new Date(),
            },
        })
        .returning();
    return insertedCandidates;
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

export async function getAllCandidates() {
    const candidates = await db.query.candidates.findMany({
        with: {
            roles: true,
        },
    });
    return candidates;
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

export async function getCandidatesBySimilarName(name: string) {
    const matchingCandidates = await db.query.candidates.findMany({
        where: ilike(
            candidates.name,
            `${name.charAt(0)}%${name.charAt(name.length)}`
        ),
    });
    return matchingCandidates;
}

export async function getAvailableCandidates() {
    const availableCandidates = await db
        .select()
        .from(candidates)
        .leftJoin(roles, eq(candidates.id, roles.candidateId))
        .where(and(eq(candidates.isActing, false), isNull(roles.candidateId)));
    const result = availableCandidates.map((candidate) => candidate.candidates);
    return result;
}

export async function getCandidateCount() {
    return db.select({ count: count() }).from(candidates);
}

export async function deleteCandidate(candidateId: number) {
    await db.delete(candidates).where(eq(candidates.id, candidateId));
}
