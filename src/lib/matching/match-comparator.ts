import type { Candidate } from "@/db/schema";

export const sortCandidate = (candidateA: Candidate, candidateB: Candidate) => {
    // Compare quarters in LUX
    if (candidateA.quartersInLUX > candidateB.quartersInLUX) {
        return -1;
    } else if (candidateA.quartersInLUX < candidateB.quartersInLUX) {
        return 1;
    }

    // Compare years at UW
    if (candidateA.yearsInUW > candidateB.yearsInUW) {
        return -1;
    } else if (candidateA.yearsInUW < candidateB.yearsInUW) {
        return 1;
    }

    // Compare based on creation date
    if (candidateA.createdAt < candidateB.createdAt) {
        return -1;
    } else if (candidateA.createdAt > candidateB.createdAt) {
        return 1;
    }

    // Lastly, compare according to name
    const nameA = candidateA.name.toLowerCase();
    const nameB = candidateB.name.toLowerCase();

    return nameA.localeCompare(nameB);
};
