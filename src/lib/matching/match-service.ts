import type { Candidate, ProductionAndRoles, Role } from "@/db/schema";
import { MatchServiceInput } from "./types";
import { sortCandidate } from "./match-comparator";
import { transformProductionsToMatchInput } from "./utils";

export class MatchService {
    private orderedCandidates: Candidate[];
    private productions: MatchServiceInput;
    private honorPreferences: boolean;

    /**
     * Creates an instance of the MatchService to be used for
     * candidate matching to productions with available roles.
     * @param candidates
     * @param productions
     */
    constructor(
        candidates: Candidate[],
        productions: ProductionAndRoles[],
        honorPreferences: boolean = true
    ) {
        const filteredCandidates = candidates.filter(
            (candidate) =>
                !candidate.isActing &&
                candidate.interestedProductions !== null &&
                candidate.interestedRoles !== null
        );
        this.orderedCandidates = filteredCandidates.sort(sortCandidate);
        this.productions = transformProductionsToMatchInput(productions);
        this.honorPreferences = honorPreferences;
    }

    private assignWithProductionBias(candidate: Candidate): Role | undefined {
        const interestedProductions = candidate.interestedProductions ?? [];
        const interestedRoles = candidate.interestedRoles ?? [];

        for (const interestedProduction of interestedProductions) {
            for (const interestedRole of interestedRoles) {
                const roles =
                    this.productions[interestedProduction]?.[interestedRole];

                console.log("REACHED: ", candidate.name);
                console.log("TRYING:", roles);
                if (!roles || roles.length === 0) continue;

                /**
                 * If role is available, return the updated role object
                 * and remove it from the productions object.
                 */
                const role = roles[0];
                const updatedRole: Role = {
                    ...role,
                    candidateId: candidate.id,
                };
                if (roles.length > 1) {
                    // If there are multiple roles with the same name,
                    // assign to the first one and remove it from the array.
                    this.productions[interestedProduction][
                        interestedRole
                    ].shift();
                } else {
                    delete this.productions[interestedProduction][
                        interestedRole
                    ];
                }
                return updatedRole;
            }
        }

        return undefined;
    }

    private assignWithRoleBias(candidate: Candidate): Role | undefined {
        const interestedProductions = candidate.interestedProductions ?? [];
        const interestedRoles = candidate.interestedRoles ?? [];

        for (const interestedRole of interestedRoles) {
            for (const interestedProduction of interestedProductions) {
                const roles =
                    this.productions[interestedProduction]?.[interestedRole];
                console.log("REACHED: ", candidate.name);
                console.log("TRYING:", roles);
                if (!roles || roles.length === 0) continue;

                /**
                 * If role is available, return the updated role object
                 * and remove it from the productions object.
                 */
                const role = roles[0];
                const updatedRole: Role = {
                    ...role,
                    candidateId: candidate.id,
                };
                if (roles.length > 1) {
                    // If there are multiple roles with the same name,
                    // assign to the first one and remove it from the array.
                    this.productions[interestedProduction][
                        interestedRole
                    ].shift();
                } else {
                    delete this.productions[interestedProduction][
                        interestedRole
                    ];
                }
                return updatedRole;
            }
        }

        return undefined;
    }

    public match() {
        /**
         * Define output arrays.
         * Returns the roles to be updated and the candidates that
         * were not matched successfully.
         */
        const candidatesRemaining: Candidate[] = [];
        const updatedRoles: Role[] = [];

        while (this.orderedCandidates.length > 0) {
            // Candidate will not be undefined as shift only executes when length > 0
            const candidate = this.orderedCandidates.shift()!;
            let role: Role | undefined;

            if (candidate.prioritizeProductions) {
                role = this.assignWithProductionBias(candidate);
            } else {
                role = this.assignWithRoleBias(candidate);
            }

            if (!role) {
                candidatesRemaining.push(candidate);
            } else {
                updatedRoles.push(role);
            }
        }

        if (this.honorPreferences) {
            return {
                candidatesRemaining,
                updatedRoles,
            };
        }

        /**
         * Last resort matching.
         * Iterate over remaining roles and match
         * irrespective of preferences.
         */
        const remainingRoles = Object.values(this.productions)?.flatMap(
            (productionRoles) => Object.values(productionRoles)
        );

        if (!remainingRoles || remainingRoles.length === 0) {
            return {
                candidatesRemaining,
                updatedRoles,
            };
        }

        const flattenedRoles = remainingRoles.flat();

        while (candidatesRemaining.length > 0 && flattenedRoles.length > 0) {
            const candidate = candidatesRemaining.shift()!;
            const role = flattenedRoles.shift()!;

            const updatedRole: Role = {
                ...role,
                candidateId: candidate.id,
            };
            updatedRoles.push(updatedRole);
        }

        return {
            candidatesRemaining,
            updatedRoles,
        };
    }
}
