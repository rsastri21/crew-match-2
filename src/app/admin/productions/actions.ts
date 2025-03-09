"use server";

import { batchUpdateRoles } from "@/data/roles";
import { MatchService } from "@/lib/matching/match-service";
import { authenticatedAction } from "@/lib/safe-action";
import { getCandidatesForMatching } from "@/utils/candidates";
import { AdminError } from "@/utils/errors";
import { getProductionsForMatching } from "@/utils/productions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const matchSchema = z.object({
    honorPreferences: z.boolean(),
});

export const matchAction = authenticatedAction
    .createServerAction()
    .input(matchSchema)
    .handler(async ({ input, ctx }) => {
        const user = ctx.user;

        // User must be an admin to perform matching
        if (!user.isAdmin) {
            throw new AdminError();
        }

        /**
         * Get candidates and productions for matching.
         * Both methods will throw errors if there are none
         * available so we can fail early.
         */
        const [candidates, productions] = await Promise.all([
            getCandidatesForMatching(),
            getProductionsForMatching(),
        ]);

        const matchService = new MatchService(
            candidates,
            productions,
            input.honorPreferences
        );

        const { candidatesRemaining, updatedRoles } = matchService.match();

        if (!updatedRoles.length) {
            return {
                candidatesLeft: candidatesRemaining.length,
                candidatesAssigned: updatedRoles.length,
            };
        }

        const roles = await batchUpdateRoles(updatedRoles);
        revalidatePath("/");
        return {
            candidatesLeft: candidatesRemaining.length,
            candidatesAssigned: roles.length,
        };
    });
