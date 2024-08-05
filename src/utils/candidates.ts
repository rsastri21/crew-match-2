import {
    createCandidate,
    getCandidateByName,
    updateCandidate,
} from "@/data/candidates";

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
        await createCandidate(
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
        await updateCandidate(existingCandidate.id, {
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
