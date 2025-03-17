import type { CandidateRow } from "@/data/candidates";
import {
    createCandidate,
    getCandidateByName,
    getCandidatesBySimilarName,
    updateCandidate,
    batchCreateCandidates,
    getAvailableCandidates,
} from "@/data/candidates";
import { Candidate, Role } from "@/db/schema";
import { cache } from "react";

export async function quickRegisterCandidate(
    name: string,
    userId: string | null,
    isActing: boolean,
    prioritizeProductions: boolean
) {
    const existingCandidate = await getCandidateByName(name);

    if (existingCandidate) {
        throw new Error(
            "Candidate already exists. Select from the table instead."
        );
    }

    return await createCandidate(name, userId, isActing, prioritizeProductions);
}

export async function registerCandidate(
    name: string,
    userId: string | null,
    isActing: boolean,
    prioritizeProductions: boolean,
    interestedRoles?: string[],
    interestedProductions?: string[],
    yearsInUW?: number,
    quartersInLUX?: number
) {
    const existingCandidate = await getCandidateByName(name);

    if (!existingCandidate) {
        return await createCandidate(
            name,
            userId,
            isActing,
            prioritizeProductions,
            yearsInUW,
            quartersInLUX,
            interestedProductions,
            interestedRoles
        );
    } else {
        return await updateCandidate(existingCandidate.id, {
            name,
            userId,
            isActing,
            prioritizeProductions,
            yearsInUW,
            quartersInLUX,
            interestedProductions,
            interestedRoles,
            updatedAt: new Date(),
        });
    }
}

export function transformCandidatesToRowModel(
    candidates: (Candidate & { roles: Role[] })[]
): CandidateRow[] {
    const transformedCandidates: CandidateRow[] = [];

    for (const candidate of candidates) {
        const status = candidate.isActing
            ? "acting"
            : candidate.roles.length > 0
            ? "assigned"
            : "available";
        transformedCandidates.push({
            id: candidate.id,
            name: candidate.name,
            yearsInUW: candidate.yearsInUW,
            quartersInLUX: candidate.quartersInLUX,
            status,
            interestedProductions: candidate.interestedProductions ?? [],
            interestedRoles: candidate.interestedRoles ?? [],
            roles: candidate.roles,
        });
    }

    return transformedCandidates;
}

export async function batchInsertCandidates(
    candidates: Omit<Candidate, "id" | "createdAt" | "updatedAt" | "userId">[]
) {
    const insertedCandidates = await batchCreateCandidates(candidates);
    return insertedCandidates.length;
}

export const getCandidatesWithSimilarName = cache(async (name: string) => {
    if (name.length < 2) {
        return [];
    }
    return await getCandidatesBySimilarName(name);
});

function initMemo(word1: string, word2: string) {
    return new Array(word1.length)
        .fill(undefined)
        .map(() => new Array(word2.length).fill(-1));
}

function minDistance(
    word1: string,
    word2: string,
    i = 0,
    j = 0,
    memo = initMemo(word1, word2)
) {
    const isBaseCase1 = word1.length * word2.length === 0;
    if (isBaseCase1) return word1.length + word2.length;

    const isBaseCase2 = word1.length === i;
    if (isBaseCase2) return word2.length - j;

    const isBaseCase3 = word2.length === j;
    if (isBaseCase3) return word1.length - i;

    const hasSeen = memo[i][j] !== -1;
    if (hasSeen) return memo[i][j];

    return dfs(word1, word2, i, j, memo);
}

function dfs(
    word1: string,
    word2: string,
    i: number,
    j: number,
    memo: any[][]
) {
    if (word1[i] === word2[j]) {
        memo[i][j] = minDistance(word1, word2, i + 1, j + 1, memo);
        return memo[i][j];
    }
    const insert = minDistance(word1, word2, i, j + 1, memo);
    const _delete = minDistance(word1, word2, i + 1, j, memo);
    const replace = minDistance(word1, word2, i + 1, j + 1, memo);

    memo[i][j] = 1 + Math.min(insert, _delete, replace);
    return memo[i][j];
}

export const getCandidatesWithEditDistance = cache(
    (name: string, distance: number, candidates: Candidate[]) => {
        return candidates.filter(
            (candidate) => minDistance(name, candidate.name) <= distance
        );
    }
);

export const getCandidatesForMatching = async () => {
    const candidates = await getAvailableCandidates();

    if (!candidates.length) {
        throw new Error("No candidates available to match.");
    }

    return candidates;
};
