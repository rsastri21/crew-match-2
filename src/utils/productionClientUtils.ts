import { RoleWithCandidateName } from "@/db/schema";

export function getAmountFilled(roles: RoleWithCandidateName[]): {
    filled: number;
    total: number;
} {
    const total = roles.length;
    let filled: number = 0;

    for (const role of roles) {
        if (role.candidateId) {
            filled += 1;
        }
    }

    return { filled, total };
}
