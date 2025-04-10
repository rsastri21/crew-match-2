import type { ProductionAndRoles, Role } from "@/db/schema";
import { MatchServiceInput } from "./types";

export const transformProductionsToMatchInput = (
    productions: ProductionAndRoles[]
): MatchServiceInput => {
    const matchInput: MatchServiceInput = {};

    for (const production of productions) {
        matchInput[production.name] = {};

        production.roles.forEach((role: Role) => {
            if (matchInput[production.name][role.role]) {
                matchInput[production.name][role.role] = [
                    ...matchInput[production.name][role.role],
                    role,
                ];
            } else {
                matchInput[production.name][role.role] = [role];
            }
        });
    }

    return matchInput;
};
